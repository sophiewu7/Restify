from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView


from . import views

app_name="accounts"
urlpatterns = [ 
    path('signup/', views.SignUpAPIView.as_view(), name='signup'),
    path('login/', views.LoginAPIView.as_view(), name="login"),
    path('logout/', views.LogoutAPIView.as_view(), name="logout"),
    path('changepassword/', views.ChangePasswordAPIView.as_view(), name='change_password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
