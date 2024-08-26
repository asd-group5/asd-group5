from .models import CustomUserObject
from rest_framework import serializers
from django.contrib.auth import authenticate

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserObject
        # Define the fields from the model that should be included in the serialization
        fields = ("id", "username", "email")


class RegistrationSerializer(serializers.ModelSerializer):
    # Define a field for password1 (write-only means it won't be included in the output data)
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUserObject
        fields = ("id", "username", "email", "password1", "password2") # Specify that the password field should be write-only (not included in the output data)
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, my_data):
        password1 = my_data['password1']
        password2 = my_data['password2']

        # Check if password1 and password2 are the same
        if password1 != password2:
            raise serializers.ValidationError("Passwords are not identical!") # Error Message

        # Check if the password length is less than 8 characters
        if len(password1) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters!") # Error Message
        
        return my_data
    
    # Define a method to create a new user instance
    def create(self, validated_data):

        validated_data.pop("password2") # Delete second password (since 2 [identical] passwords created when registering)

        # Adds customer object (so all the customer fields filled out) to update the model/database
        # validated_data gets added to the second field where data is used for updating the model, with password added in the first parameter to be hashed
        return CustomUserObject.objects.create_user(password=validated_data.pop("password1"), **validated_data) # password removed from validated_data before validated_data is stored


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email1 = data.get('email')
        password1 = data.get('password')
        user = authenticate(email=email1, password=password1) # compares passed in field data with model and checks if such user exists
        if user is None:
            raise serializers.ValidationError("Incorrect Credentials")
        else:
            return user
