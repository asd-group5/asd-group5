from django.urls import path
from .views import OrderProcess, PopulateOrder, ViewOrders

from . import views

urlpatterns = [
    path("process/", OrderProcess.as_view(), name="process order"),
    path("process/<int:orderID>/", PopulateOrder.as_view(), name="populate order"),
    path("view/", ViewOrders.as_view(), name="view orders")
]