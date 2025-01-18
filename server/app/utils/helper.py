import requests
import jwt
import os
from datetime import datetime, timedelta
from typing import Dict, Optional
from functools import wraps
from django.http import JsonResponse
import requests
import time
import qrcode
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
from itertools import chain
import json
from functools import partial
from datetime import datetime, timedelta
from config.config import *

def dowell_login(workspace_name, user_id, password):
    url = 'https://100093.pythonanywhere.com/api/portfoliologin'
    
    payload = {
        'portfolio': user_id,
        'password': password,
        'workspace_name': workspace_name,
        "username": "true",
    }

    try:
        response = requests.post(url, json=payload)
        response_data = response.json()

        return {
            "success": True,
            "message": "Authentication result",
            "response": response_data
        }

    except requests.exceptions.RequestException as req_err:
        return {
            "success": False,
            "message": f"Request failed: {req_err}"
        }

def get_portfolio_details(workspace_name, portfolio_id):
    url = 'https://100093.pythonanywhere.com/api/portfoliodetails'
    payload = {
        'workspace_name': workspace_name,
        'portfolio_id': portfolio_id
    }
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status() 
        return {
            "success": True,
            "message": "Portfolio details retrieved successfully",
            "response": response.json()["response"]
        }
    except requests.exceptions.HTTPError as http_err:
        return {
            "success": False,
            "message": f"Server responded with status code {response.status_code}: {http_err}"
        }
    except requests.exceptions.RequestException as req_err:
        return {
            "success": False,
            "message": f"Request failed: {req_err}"
        }
    except ValueError as json_err:
        return {
            "success": False,
            "message": f"Error parsing JSON response: {json_err}"
        }
    
def generate_qr_code(url, portfolio_name):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )

    qr.add_data(url)
    qr.make(fit=True)
    
    img = qr.make_image(fill='black', back_color='white').convert('RGB')
    
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype('/usr/share/fonts/ttf/dejavu/DejaVuSans-Bold.ttf', 24)
    except IOError:
        font = ImageFont.load_default()

    def draw_bottom_centered_text(draw, text, font, img, additional_offset=10):
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        width, height = img.size
        
        x = (width - text_width) / 2
        y = height - text_height - 20 + additional_offset  
        
        draw.text((x, y), text, font=font, fill='black')

    draw_bottom_centered_text(draw, portfolio_name, font, img)

    return img


def upload_qr_code_image(img, file_name):
    url = 'https://dowellfileuploader.uxlivinglab.online/uploadfiles/upload-qrcode-to-drive/'
    with BytesIO() as buffer:
        img.save(buffer, format='PNG')
        buffer.seek(0)
        files = {
            'file': (file_name, buffer, 'image/png')
        }
        try:
            response = requests.post(url, files=files)
            response.raise_for_status() 
            file_url = response.json().get('file_url')
            return file_url
        except requests.exceptions.HTTPError as http_err:
            print(f'Server responded with non-success status: {http_err.response.status_code}')
        except requests.exceptions.RequestException as req_err:
            print(f'Error making request: {req_err}')
        except Exception as err:
            print(f'Unexpected error: {err}')
        return None


def generate_url(workspace_id, user_id):
    url = f"{config['FRONTEND_URL']}/dowellflighttracker/?workspace_id={workspace_id}&user_id={user_id}"
    return url

def generate_file_name(prefix='qrcode', extension='png'):
    timestamp = int(time.time() * 1000)
    filename = f'{prefix}_{timestamp}.{extension}'
    return filename

def get_fligts_data(mode,app_id, app_key, use_headers=False):
    url = f'https://api.flightstats.com/flex/{mode}/rest/v1/json/active'
    headers = {}
    params = {}

    if use_headers:
        headers = {
            'appId': app_id,
            'appKey': app_key,
            'Content-Type': 'application/json'
        }
    else:
        params = {
            'appId': app_id,
            'appKey': app_key
        }

    try:
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 200:
            return {
                "success": True,
                "message": "All airports retrieved successfully",
                "response": response.json()
            }
        else:
            return {
                "success": False,
                "message": f"Request failed with status code: {response.status_code}"
            }
    except requests.RequestException as e:
        return {
            "success": False,
            "message":f"Request Exception: {e}"
        }


def get_airports_data_by_lat_long(latitude, longitude,radiusMiles, app_id, app_key, use_headers=False):
    url = f'https://api.flightstats.com/flex/airports/rest/v1/json/withinRadius/{longitude}/{latitude}/{radiusMiles}'

    params = {
        'appId': app_id,
        'appKey': app_key
    }
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return {
                "success": True,
                "message": "All airports retrieved based on lat and long successfully",
                "response": response.json()
            }
        else:
            return {
                "success": False,
                "message": f"Request failed with status code: {response.status_code}"
            }
    except requests.RequestException as e:
        return {
            "success": False,
            "message":f"Request Exception: {e}"
        }

def get_flights_arrival_departure_by_airport(airport_code,type, year,month,day,hourOfDay,maxFlights, app_id, app_key, use_headers=False):
    url = f"https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/{airport_code}/{type}/{year}/{month}/{day}/{hourOfDay}/?utc=false&numHours=1&maxFlights={maxFlights}"

    print(url)

    params = {
        'appId': app_id,
        'appKey': app_key
    }
    try:
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            return {
                "success": True,
                "message": "Data Recived successfully",
                "response": response.json()
            }
        else:
            return {
                "success": False,
                "message": f"Request failed with status code: {response.status_code}"
            }
    except requests.RequestException as e:
        return {
            "success": False,
            "message":f"Request Exception: {e}"
        }

def check_airport_proximity(radius,reference_point,location_list):
    url = "https://100070.pythonanywhere.com/check-distance/"

    payload = {
    "radius": radius,
    "unit": "kilometers",
    "reference_point":reference_point,
    "locations": [location_list]
    }

    try:
        response = requests.post(url=url, json=payload)    
        return response.json()
        
    except requests.RequestException as e:
        return {
            "success": False,
            "message":f"Request Exception: {e}"
        }

class JWTUtils:
    def __init__(self):
        self.secret_key = config['JWT_SECRET_KEY']
        self.algorithm = config['JWT_ALGORITHM']
        self.expiry_delta = config['JWT_EXPIRATION_DELTA']
        self.refresh_expiry_delta = config['JWT_REFRESH_EXPIRATION_DELTA']

    def generate_jwt_tokens(self, data: Dict[str, any]) -> Dict[str, str]:
        
        access_payload = {
            '_id': data["_id"],
            "workspace_name":data["workspace_name"],
            'user_id': data["user_id"],
            'email': data["email"],
            'workspace_id': data["workspace_id"],
            'workspace_owner_name': data["workspace_owner_name"],
            'customer_id': data["customer_id"],
            'is_active': data["is_active"],
            'exp': datetime.utcnow() + self.refresh_expiry_delta
        }
        access_token = jwt.encode(access_payload, self.secret_key, algorithm=self.algorithm)

        refresh_payload = {
            '_id': data["_id"],
            "workspace_name":data["workspace_name"],
            'user_id': data["user_id"],
            'email': data["email"],
            'workspace_id': data["workspace_id"],
            'workspace_owner_name': data["workspace_owner_name"],
            'customer_id': data["customer_id"],
            'is_active': data["is_active"],
            'exp': datetime.utcnow() + self.refresh_expiry_delta
        }
        refresh_token = jwt.encode(refresh_payload, self.secret_key, algorithm=self.algorithm)

        return {
            'access_token': access_token,
            'refresh_token': refresh_token
        }

    def decode_jwt_token(self, token: str) -> Optional[Dict[str, any]]:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
        
def login_required(view_func):
    @wraps(view_func)
    def _wrapped_view(view, request, *args, **kwargs):
        token = request.COOKIES.get('access_token') or request.headers.get('Authorization', '').replace('Bearer ', '')

        if not token:
            return JsonResponse({
                "success": False,
                "message": "Please login to access the resource"
            }, status=401)

        try:
            decoded_jwt_payload = jwt.decode(token, config["JWT_SECRET_KEY"], algorithms=[config["JWT_ALGORITHM"]])
            print(decoded_jwt_payload)

            if not decoded_jwt_payload["_id"]:
                return JsonResponse({
                    "success": False,
                    "message": "User not found"
                }, status=401)
            return view_func(view, request, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return JsonResponse({
                "success": False,
                "message": "Token has expired"
            }, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({
                "success": False,
                "message": "Invalid token"
            }, status=401)

    return _wrapped_view
    
