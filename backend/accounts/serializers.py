from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

class SignupSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True, validators=[validate_password])
    re_password=serializers.CharField(write_only=True)
    location=serializers.CharField(write_only=True)

    class Meta:
        model= User
        fields=['first_name', 'last_name', 'username', 'email', 'password', 're_password', 'location']

    def create(self, validated_data):
        #re_password isnt neccesary in validation

        validated_data.pop('re_password')

        user= User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']

        )

        return user