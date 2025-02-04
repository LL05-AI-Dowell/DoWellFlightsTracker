from rest_framework import serializers


class UserAuthSerializer(serializers.Serializer):
    workspace_name = serializers.CharField()
    user_id = serializers.CharField()
    password = serializers.CharField()

class UserSignUpSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    email = serializers.EmailField()
    latitude = serializers.DecimalField(max_digits=10, decimal_places=7)
    longitude = serializers.DecimalField(max_digits=10, decimal_places=7)
    workspace_name = serializers.CharField()

class CheckProximitySerializer(serializers.Serializer):
    user_id = serializers.CharField()
    workspace_id = serializers.CharField()
    location_list = serializers.ListField()

class SaveUserSearchSerializer(serializers.Serializer):
    workspace_id = serializers.CharField()
    user_id = serializers.CharField()
    public_id = serializers.CharField()