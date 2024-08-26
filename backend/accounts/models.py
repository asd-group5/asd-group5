from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUserObject(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self) -> str:
        return self.email

