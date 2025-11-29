from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

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
    

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            raise serializers.ValidationError({"detail": "Must include 'username' and 'password'."})

        request = self.context.get("request")
        user = authenticate(request=request, username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid username or password")

        if not getattr(user, "is_active", True):
            raise serializers.ValidationError("User account is disabled.")

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
            "id": user.id,
        }
