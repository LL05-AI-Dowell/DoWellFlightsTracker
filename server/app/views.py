from django.shortcuts import render,redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timezone

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