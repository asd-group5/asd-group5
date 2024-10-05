from django.urls import path

from . import views

urlpatterns = [
    path("methods/", views.PaymentMethodListView.as_view(), name="payment_method_list"),
    path(
        "methods/add/", views.PaymentMethodAddView.as_view(), name="payment_method_add"
    ),
    path("process/", views.PaymentProcessView.as_view(), name="payment_process"),
    path("history/", views.PaymentHistoryView.as_view(), name="payment_history"),
]
