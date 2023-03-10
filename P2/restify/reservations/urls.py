from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView


from . import views

app_name="reservations"
urlpatterns = [
    path('property/<int:id>/book/', views.ReservationCreateView.as_view()),
    path('guest/list/', views.ReservationGuestListView.as_view()),
    path('host/list/', views.ReservationHostListView.as_view()),
]