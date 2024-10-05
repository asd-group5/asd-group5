from django.urls import path

from . import views

urlpatterns = [
    path("methods/", views.PaymentMethodListView.as_view(), name="payment_method_list"),
    path(
        "methods/add/", views.PaymentMethodAddView.as_view(), name="payment_method_add"
    ),
<<<<<<< HEAD
    path("process/", views.PaymentProcessView.as_view(), name="payment_process"),
    path("history/", views.PaymentHistoryView.as_view(), name="payment_history"),
=======
    path(
        "methods/delete/<int:pk>/",
        views.PaymentMethodDeleteView.as_view(),
        name="method_delete",
    ),
    path("history/", views.PaymentHistoryView.as_view(), name="history"),
    path(
        "details/<str:payment_id>/", views.PaymentDetailsView.as_view(), name="details"
    ),
>>>>>>> e50e1a2c2315d7a2d12740ef557bf8437b754de7
]
