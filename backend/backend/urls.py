"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include("accounts.urls")),
    path('api/address/', include('address.urls')),
    path('api/payment/', include('payment.urls')),
    path('api/custom/', include("custom.urls")),
    path('api/order/', include("orders.urls"))
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

admin.site.index_title = "Restaurant"

admin.site.site_header = "Restaurant Staff Access"

admin.site.site_title = "Restaurant Administrator Access"

admin.site.login_template = 'accounts/admin/login.html'
