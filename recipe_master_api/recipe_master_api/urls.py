from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('apps.users.urls')),
    path('v1/', include('apps.main.urls')),
]
