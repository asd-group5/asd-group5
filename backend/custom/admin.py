from django.contrib import admin
from .models import Option, MenuItem


# Register your models here.
customModels = [Option, MenuItem]

admin.site.register(customModels)