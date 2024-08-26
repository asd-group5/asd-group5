from django.contrib import admin
from .models import CustomUserObject
from .forms import CustomerUserChangeForm, CustomUserCreationForm
from django.contrib.auth.admin import UserAdmin, Group

# Register your models here.
@admin.register(CustomUserObject)
class CustomAdminUser(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomerUserChangeForm
    model = CustomUserObject
    
    admin.site.unregister(Group) # Removes Group Panel/Model

    list_display = ('email', 'username', 'is_staff', 'date_joined') # decides what you can see in the users table


    add_fieldsets = ( # fields available when creating new user
        (None, {
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )

    fieldsets = ( # fields available when editing existing user
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

