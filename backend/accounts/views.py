from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SignupSerializer


# Create your views here.
@api_view(['POST'])
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

