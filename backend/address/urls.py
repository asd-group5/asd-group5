# address/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.AddAddressView.as_view(), name='add_address'),
    path('edit/<int:address_id>/', views.EditAddressView.as_view(), name='edit_address'),
    path('delete/<int:address_id>/', views.DeleteAddressView.as_view(), name='delete_address'),
    path('list/', views.ListAddressesView.as_view(), name='list_addresses'),
    path('set-default/<int:address_id>/', views.SetDefaultAddressView.as_view(), name='set_default_address'),
]
