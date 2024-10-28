from django.contrib import admin
from .models import Order, OrderItem

# Register your models here.
customModels = [Order, OrderItem]

admin.site.register(customModels)