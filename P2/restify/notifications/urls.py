from django.urls import path
from . import views

# /notifications/ [get]: List bot user and host notifications for a user
# /notifications/ [post]: create a user or host notification for a user

# /notifications/<notification_id> [get]: return the notification and delete it 


app_name="notifications"
urlpatterns = [ 
    path('', views.AllNotifications.as_view(), name='all_notifications'),
    path('<int:notification_id>/', views.ReadNotification.as_view(), name='read_notification'),
]