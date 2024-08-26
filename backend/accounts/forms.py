from django.contrib.auth.forms import UserCreationForm, UserChangeForm

# UserCreationForm - Form for creating users
# UserChangeForm - Form for editing existing user info

from .models import CustomUserObject

# Custom form for creating users, using CustomerUser model
class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta): 
        model = CustomUserObject  # Specifies the model to use
        fields = ("email", "username")  # Fields to include in the form

# Custom form for updating user information in admin
class CustomerUserChangeForm(UserChangeForm):
    class Meta:  
        model = CustomUserObject  
        fields = ("email","username", "is_active", "is_staff", "is_superuser",)  
