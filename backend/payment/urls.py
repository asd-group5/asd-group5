from django.urls import path
from . import views

urlpatterns = [
    path("process/", views.PaymentProcessView.as_view(), name="process"),
    path("methods/", views.PaymentMethodListView.as_view(), name="method_list"),
    path("methods/add/", views.PaymentMethodAddView.as_view(), name="method_add"),
    path(
        "methods/edit/<int:pk>/",
        views.PaymentMethodEditView.as_view(),
        name="method_edit",
    ),
    path(
        "methods/delete/<int:pk>/",
        views.PaymentMethodDeleteView.as_view(),
        name="method_delete",
    ),
    path("history/", views.PaymentHistoryView.as_view(), name="history"),
    path(
        "details/<str:payment_id>/", views.PaymentDetailsView.as_view(), name="details"
    ),
]
