from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .serializers import SignupSerializer ,LoginSerializer
from rest_framework.views import APIView




# Create your views here.
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer=SignupSerializer(data=request.data)
    if serializer.is_valid():
        user=serializer.save()

        #generating token
        refresh=RefreshToken.for_user(user)
        access_token=str(refresh.access_token)

        return Response(
            {
                'user':{
                    'username':user.username,
                    'email':user.email,
                    'first_name':user.first_name,
                    'last_name':user.last_name,
                },
                'refresh':str(refresh),
                'access':access_token

            },
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([AllowAny])
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({"message": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
    except TokenError:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
    except KeyError:
        return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
    


