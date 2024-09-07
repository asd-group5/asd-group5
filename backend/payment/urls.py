# payment/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('process/', views.ProcessPaymentView.as_view(), name='process_payment'),
    path('save-method/', views.SavePaymentMethodView.as_view(), name='save_payment_method'),
]
