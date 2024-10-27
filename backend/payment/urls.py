from django.urls import path

from . import views

urlpatterns = [
    # Payment Methods
    path("methods/", views.PaymentMethodListView.as_view(), name="payment_method_list"),
    path(
        "methods/add/", views.PaymentMethodAddView.as_view(), name="payment_method_add"
    ),
    path(
        "methods/<int:pk>/",
        views.PaymentMethodDetailView.as_view(),
        name="payment_method_detail",
    ),
    path(
        "methods/<int:pk>/set-default/",
        views.PaymentMethodSetDefaultView.as_view(),
        name="payment_method_set_default",
    ),
    # Payments
    path("process/", views.PaymentProcessView.as_view(), name="payment_process"),
    path("history/", views.PaymentHistoryView.as_view(), name="payment_history"),
    path("<int:pk>/", views.PaymentDetailView.as_view(), name="payment_detail"),
    path("validate/", views.PaymentValidateView.as_view(), name="payment_validate"),
]
