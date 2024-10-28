from django.urls import path

from . import views

urlpatterns = [
    path("process/", views.OrderProcess.as_view(), name="process order"),
    path("process/<int:orderID>/", views.PopulateOrder.as_view(), name="populate order"),
    path("view/", views.ViewOrders.as_view(), name="view orders"),
    path("view/<int:orderID>/", views.ViewOrderDetail.as_view(), name="view order details")
]