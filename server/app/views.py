from django.shortcuts import render,redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timezone
from config.config import *
from .serializers import *
from .utils.helper import *
from .services.datacube import *
from .services.sendEmail import *

jwt_utils = JWTUtils()
@method_decorator(csrf_exempt, name='dispatch')
class healthCheck(APIView):
    def get(self, request):
        now = datetime.now(timezone.utc).isoformat()
        return Response({
            "success":True,
            "status": "UP",
            "version": "1.0.0",
            "timestamp": now,
            "server_time": now,
            "message":"API server is UP"
        }, status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name='dispatch')
class UserManagement(APIView):
    def post(self, request):
        type = request.GET.get('type')
        if type == 'signin':
            return self.signin(request)
        elif type == 'signup':
            return self.signup(request)
        else:
            return self.handle_error(request)
        
    def get(self, request):
        type = request.GET.get('type')
        if type == 'self_identification':
            return self.self_identification(request)
        else:
            return self.handle_error(request)
        
    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def signin(self, request):
        workspace_name = request.data.get("workspace_name")
        user_id = request.data.get("user_id")
        password = request.data.get("password")

        serializer = UserAuthSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "errors": serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)
        
        client_admin_login_response = dowell_login(workspace_name, user_id, password)

        if not client_admin_login_response.get("success") or client_admin_login_response.get("response") == 0:
            return Response({
                "success": False,
                "message": client_admin_login_response.get("message", "Authentication failed")
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        data = client_admin_login_response.get("response", {})
        database = f"{data['userinfo']['owner_id']}_dowell_flight_tracker"
        user_collection = f"{data['userinfo']['owner_id']}_users"

        existing_user_response = json.loads(datacube_data_retrieval(
            api_key,
            database,
            user_collection,
            {
                "workspace_name": workspace_name,
                "user_id": user_id,
            },
            0, 0, False))
        
        existing_user = existing_user_response.get('data', [])

        if not existing_user:
            url = generate_url(data["userinfo"]["owner_id"], user_id)
            qrcode_image = generate_qr_code(url=url, portfolio_name=user_id)

            file_name = generate_file_name(prefix='qrcode', extension='png')

            qrcode_image_url = None

            try:
                if config["SAVE_QRCODE"]:
                    qrcode_image_url = upload_qr_code_image(qrcode_image, file_name)
                    if not qrcode_image_url:
                        qrcode_image_url = None
                else:
                    save_folder = "qrcodes"
                    os.makedirs(save_folder, exist_ok=True)
                    file_path = os.path.join(save_folder, file_name)
                    qrcode_image.save(file_path)
                    qrcode_image_url = None
                
                if qrcode_image_url and qrcode_image_url.startswith("http://"):
                    qrcode_image_url = qrcode_image_url.replace("http://", "https://")

            except Exception as err:
                qrcode_image_url = None

            user_data = {
                "workspace_name": workspace_name,
                "user_id": user_id,
                "email": "",
                "profile_image": "",
                "workspace_id": data["userinfo"]["owner_id"],
                "workspace_owner_name": data["userinfo"]["owner_name"],
                "customer_id": data["portfolio_info"]["portfolio_name"],
                "member_type": data["portfolio_info"]["member_type"],
                "data_type": data["portfolio_info"]["data_type"],
                "password": password,
                "latitude": None,
                "longitude": None,
                "is_active": True,
                "is_notification_active": False,
                "notification_duration": "one_day",
                "product_url": url,
                "qrcode_image_url": qrcode_image_url,
                "proximity": 25,
                "created_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                "records": [{"record": "1", "type": "overall"}]
            }

            user_data_response = json.loads(datacube_data_insertion(
                api_key,
                database,
                user_collection,
                user_data
            ))

            if not user_data_response.get("success"):
                return Response({
                    "success": False,
                    "message": "Failed to create user"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            data = {
                "_id": user_data_response["data"]["inserted_id"],
                "workspace_name": workspace_name,
                "user_id": user_id,
                "email": "",
                "workspace_id": data["userinfo"]["owner_id"],
                "workspace_owner_name": data["userinfo"]["owner_name"],
                "customer_id": data["portfolio_info"]["portfolio_name"],
                "is_active": True,
            }

            message = "User created successfully"
        else:
            existing_user_data = existing_user[0]
            data = {
                "_id": existing_user_data["_id"],
                "workspace_name": existing_user_data["workspace_name"],
                "user_id": existing_user_data['user_id'],
                "email": existing_user_data["email"],
                "workspace_id": existing_user_data["workspace_id"],
                "workspace_owner_name": existing_user_data["workspace_owner_name"],
                "customer_id": existing_user_data["customer_id"],
                "is_active": existing_user_data["is_active"],
            }

            message = "User authenticated successfully"

        token = jwt_utils.generate_jwt_tokens(data)
        return Response({
            "success": True,
            "message": message,
            "access_token": token["access_token"],
            "refresh_token": token["refresh_token"],
            "response": data
        })
    
    def signup(self, request):
        user_id = request.data.get("user_id")
        email = request.data.get("email")
        latitude = request.data.get("latitude")
        longitude = request.data.get("longitude")
        workspace_name= request.data.get("workspace_name")

        serializer = UserSignUpSerializer(data={
            "email": email,
            "user_id": user_id,
            "latitude": latitude,
            "longitude": longitude,
            "workspace_name": workspace_name
        })

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "errors": serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)
        
        response = get_portfolio_details(workspace_name, user_id)

        if not response["success"]:
            return Response({
                "success": False,
                "message": response["message"]
            }, status=status.HTTP_404_NOT_FOUND)
        

        user_data_response = json.loads(datacube_data_retrieval(
            api_key, 
            f"{response['response'][0]['userinfo']['owner_id']}_dowell_flight_tracker", 
            f"{response['response'][0]['userinfo']['owner_id']}_users", 
            {
                "user_id": user_id
            },
            1,
            0,
            False
        ))

        if not user_data_response["data"]:
            return Response({
                "success": False,
                "message": "Please enter valid user ID"
            }, status=status.HTTP_404_NOT_FOUND)
        
        existing_email = user_data_response["data"][0]["email"]

        if existing_email == "":
            user_update = json.loads(datacube_data_update(
                api_key,
                f"{response['response'][0]['userinfo']['owner_id']}_dowell_flight_tracker",
                f"{response['response'][0]['userinfo']['owner_id']}_users",
                {"_id": user_data_response["data"][0]["_id"]},
                {
                    "email": email,
                    "latitude": latitude,
                    "longitude": longitude,
                }
            ))

            if not user_update["success"]:
                return Response({
                    "success": False,
                    "message": "Failed to update email"
                }, status=status.HTTP_400_BAD_REQUEST)

            print("here i am updating...")
            # Manually update the email in local data
            existing_email = email

        # Check if email exists and doesn't match
        if existing_email != email:
            print("here i am email didn't match...")
            return Response({
                "success": False,
                "message": "This account is registered with another user. If you want to claim this account, contact us at dowell@dowellresearch.sg"
            }, status=status.HTTP_400_BAD_REQUEST)

        # If email matches, proceed to send the email
        print("here i am same email...")

        try:
            data_response = json.loads(datacube_data_retrieval(
                api_key,
                f"{response['response'][0]['userinfo']['owner_id']}_dowell_flight_tracker",
                f"{response['response'][0]['userinfo']['owner_id']}_users",
                {"user_id": user_id},
                1,
                0,
                False
            ))

            if not data_response["data"]:
                return Response({
                    "success": False,
                    "message": "Something went wrong, please contact us at dowell@dowellresearch.sg"
                }, status=status.HTTP_404_NOT_FOUND)

            portfolio_details = data_response["data"][0]
            customer_id = portfolio_details["customer_id"]
            product_id = workspace_name
            password = portfolio_details["password"]

            # Send email with user details
            response_send_email = json.loads(send_email(
                toname=email,
                toemail=email,
                customer_id=customer_id,
                product_id=product_id,
                user_id=user_id,
                password=password,
                help_link="https://youtube.com/shorts/FmqMJJf7ei0?feature=share",
                direct_login_link=f"{config['FRONTEND_URL']}/?workspace_name={product_id}&user_id={user_id}&password={password}"
            ))

            if not response_send_email["success"]:
                return Response({
                    "success": False,
                    "message": "Failed to send email, please try again"
                }, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                "success": True,
                "message": "Email sent successfully"
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "success": False,
                "message": "Something went wrong with your registration process, please contact us at dowell@dowellresearch.sg"
            }, status=status.HTTP_400_BAD_REQUEST)

    @login_required
    def self_identification(self, request):
        document_id = request.GET.get('document_id')
        workspace_id = request.GET.get('workspace_id')

        if not document_id or not workspace_id:
            return Response({
                "success": False,
                "message": "Missing user_id or workspace_id"
            }, status=status.HTTP_400_BAD_REQUEST)
        response = json.loads(datacube_data_retrieval(
            api_key,
            f"{workspace_id}_dowell_flight_tracker",
            f"{workspace_id}_users",
            {
                "_id": document_id
            },
            1,
            0,
            False
        ))

        if not response["data"]:
            return Response({
                "success": False,
                "message": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            "success": True,
            "message": "User found",
            "response": response["data"][0]
        },status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name='dispatch')
class flight_data(APIView):

    def post(self, request):
        type_request = request.GET.get('type')

        if type_request == "get_airport_by_lat_long":
            return self.get_airport_by_lat_long(request)
        elif type_request == "get_flights_arrival_departure":
            return self.get_flights_arrival_departure(request)
        elif type_request == "check_proximity":
            return self.check_proximity(request)
        else:
            return self.handle_error(request)
    def get(self, request):
        type_request = request.GET.get('type')

        if type_request == "get_airports":
            return self.get_airports(request)
        elif type_request == "get_airlines":
            return self.get_airlines(request)
        else:
            return self.handle_error(request)

     
    def get_airports(self, request):
        res = get_fligts_data('airports',config["FLIGHT_SERVICE_APP_ID"],config["FLIGHT_SERVICE_APP_KEY"])

        if not res['success']:
            return Response({
                "success": False,
                "message": res['message']
            }, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "success": True,
            "message": "All Airports list retrieved successfully",
            "response": res['response']['airports']  
        })
    
    def get_airlines(self, request):
        res = get_fligts_data('airlines',config["FLIGHT_SERVICE_APP_ID"],config["FLIGHT_SERVICE_APP_KEY"])

        if not res['success']:
            return Response({
                "success": False,
                "message": res['message']
            }, status=status.HTTP_400_BAD_REQUEST)

        print(len(res['response']['airlines']))
        return Response({
            "success": True,
            "message": "All Airports list retrieved successfully",
            "response": res['response']['airlines']  
        })

    def get_airport_by_lat_long(self, request):
        latitude = request.data.get('latitude')
        longitude = request.data.get('longitude')
        radiusMiles = request.data.get('radiusMiles')

        if not all([latitude, longitude,radiusMiles]):
            return Response({
                "success": False,
                "message": "Please provide both latitude and longitude"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        res = get_airports_data_by_lat_long(latitude, longitude, radiusMiles, config["FLIGHT_SERVICE_APP_ID"],config["FLIGHT_SERVICE_APP_KEY"])

        if not res['success']:
            return Response({
                "success": False,
                "message": res['message']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            "success": True,
            "message": "All Airports list retrieved successfully",
            "response": res['response']['airports']
        })
    
    def get_flights_arrival_departure(self, request):
        airport_code = request.data.get('airport_code')
        year = request.data.get('year')
        month = request.data.get('month')
        day = request.data.get('day')
        hourOfDay = request.data.get('hourOfDay')
        maxFlights = request.data.get('maxFlights')
        typeOfStatus = request.data.get('typeOfStatus')

        if not all([airport_code, year, month, day, hourOfDay, maxFlights,typeOfStatus]):
            return Response({
                "success": False,
                "message": "Please provide all required parameters"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        res = get_flights_arrival_departure_by_airport(airport_code,typeOfStatus, year, month, day, hourOfDay, maxFlights, config["FLIGHT_SERVICE_APP_ID"],config["FLIGHT_SERVICE_APP_KEY"])

        if not res['success']:
            return Response({
                "success": False,
                "message": res['message']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            "success": True,
            "message": "All Airports list retrieved successfully",
            "response": res['response']['flightStatuses']
        })

   
    def check_proximity(self, request):
        user_id = request.data.get('user_id')
        workspace_id = request.data.get('workspace_id')
        location_list = request.data.get("location_list")

        serializer = CheckProximitySerializer(data={
            "user_id": user_id,
            "workspace_id": workspace_id,
            "location_list": location_list
        })
        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Posting wrong data to API",
                "errors": serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user_data = json.loads(datacube_data_retrieval(
            api_key,
            f"{workspace_id}_dowell_flight_tracker",
            f"{workspace_id}_users",
            {
                "user_id": user_id,
                "workspace_id": workspace_id
            },
            1,
            0,
            False
        ))

        if not user_data["data"]:
            return Response({
                "success": False,
                "message": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)
        
        data = user_data.get("data", [])

        print("data:", data)

        if not data[0].get("latitude") or not data[0].get("longitude"):
            return Response({
                "success": False,
                "message": "Please contact the administrator. Sorry for the inconvenience caused."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        reference_point = [data[0]["latitude"], data[0]["longitude"]]
        api_response = check_airport_proximity(data[0].get("proximity"), reference_point, location_list)

        if api_response.get("success") == "true":
            distance_data = api_response["results"].get("distance_data", [])

            if distance_data[0]["within_distance"]:

                return Response({
                    "success": True,
                    "message": "You are in the following proximity",
                    "response": distance_data[0]["distance"]
                })
            else:
                return Response({
                    "success": False,
                    "message": "You are not in the specified proximity",
                    "response": distance_data[0]["distance"]
                }, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({
                "success": False,
                "message": "You are not in the specified proximity",
                "response": api_response
            }, status=status.HTTP_401_UNAUTHORIZED)

                    

    def handle_error(self, request): 
        return Response({
            "success": False,
            "message": "Invalid request type"
        }, status=status.HTTP_400_BAD_REQUEST)