from django.urls import path
from .views import *

urlpatterns = [
    path("", healthCheck.as_view()),
    path("auth/", UserManagement.as_view()),
    path('flights/', flight_data.as_view()),
]