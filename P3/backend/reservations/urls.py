from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView


from . import views

app_name="reservations"
urlpatterns = [
    path('property/<int:id>/book/', views.ReservationCreateView.as_view()),
    path('guest/list/', views.ReservationGuestListView.as_view()),
    path('host/list/', views.ReservationHostListView.as_view()),
    path('all/list/', views.ReservationAllListView.as_view()),
    path('status/<int:id>/', views.ReservationUpdateView.as_view()),
    path('guest/<int:id>/', views.ReservationGuestUpdateView.as_view()),
    path('host/<int:id>/', views.ReservationHostUpdateView.as_view()),
    path('hostguest/<int:id>/', views.ReservationHostUpdateView.as_view()),
    path('completed/list/', views.ReservationCompletedListView.as_view()),
    path('approved/list/', views.ReservationApproveListView.as_view()),
    path('denied/list/', views.ReservationDenyListView.as_view()),
    path('pending/list/', views.ReservationPendingListView.as_view()),
    path('expired/list/', views.ReservationExpiredListView.as_view()),
    path('terminated/list/', views.ReservationTerminatedListView.as_view()),
    path('canceled/list/', views.ReservationCancelListView.as_view()),
    path('pendingcanceled/list/', views.ReservationPendingcancelListView.as_view()),
]