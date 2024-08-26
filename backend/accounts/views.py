from django.shortcuts import render
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status

# Create your views here

class RegistrationAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer
    
    # creates refresh token for user to use after registering
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data) # uses the serializier_class to create a serializer instance
        serializer.is_valid(raise_exception=True) # checks if data is valid based on validation functions in serializers
        token = RefreshToken.for_user(serializer.save()) # creates a user which generates a JWT refresh token
        userRegistrationInfo = serializer.data # retrieves the validated and serialized data

        # adds new key for authentication: JWT token
        userRegistrationInfo["tokens"] = {"refresh":str(token), #  refresh token
                          "access": str(token.access_token)} # new access token generated from refresh token
        
        return Response(userRegistrationInfo, status=status.HTTP_201_CREATED)
# same as UserRegistration but for login

class LoginAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class= LoginSerializer

    # creates refresh token for user to use after registering
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data # grabs authenticated user
        serializer = CustomUserSerializer(user) # serialises data
        token = RefreshToken.for_user(user)
        data = serializer.data
        data["tokens"] = {"refresh":str(token), "access":str(token.access_token)}

        return Response(data, status=status.HTTP_200_OK)
    
class LogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data["refresh"] # grab refresh token from data
            refreshTokenObject = RefreshToken(refresh_token) # make the refreshTokenObject using the string value
            refreshTokenObject.blacklist() # blacklist it to remove authentication
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class InfoAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer

    def get_object(self):
        return self.request.user