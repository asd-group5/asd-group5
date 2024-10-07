from django.urls import path

from . import views

urlpatterns = [
    path("", views.AddressListView.as_view(), name="list"),
    path("<int:pk>/", views.AddressDetailView.as_view(), name="detail"),
    path(
        "set-default/<int:pk>/",
        views.AddressSetDefaultView.as_view(),
        name="set_default",
    ),
    path("validate/", views.AddressValidateView.as_view(), name="validate"),
    path("search/", views.AddressSearchView.as_view(), name="search"),
]
