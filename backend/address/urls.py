from django.urls import path
from . import views

urlpatterns = [
    path("", views.AddressListView.as_view(), name="list"),
    path("add/", views.AddressAddView.as_view(), name="add"),
    path("edit/<int:pk>/", views.AddressUpdateView.as_view(), name="edit"),
    path("delete/<int:pk>/", views.AddressDeleteView.as_view(), name="delete"),
    path(
        "set-default/<int:pk>/",
        views.AddressSetDefaultView.as_view(),
        name="set_default",
    ),
    path("validate/", views.AddressValidateView.as_view(), name="validate"),
    path("search/", views.AddressSearchView.as_view(), name="search"),
]
