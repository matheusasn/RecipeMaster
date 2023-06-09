from django.urls import path
from .views import RegisterView, SIgnView, LogoutView, NewPasswordView
from rest_framework_simplejwt import views as jwt_views


app_name = 'users'

urlpatterns = [
    path('token-refresh', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('signup', RegisterView.as_view(), name='register'),
    path('signin', SIgnView.as_view(), name='login'),
    path('logout', LogoutView.as_view(), name='logout'),
    path('newpassword', NewPasswordView.as_view(), name='newpassword'),
]
