from django.urls import path
from . import views

# /notifications/ [get]: List both user and host notifications for a user
# /notifications/ [post]: create a user or host notification for a user
# CHOICES = (
#     ("NEW", "Host: New Reservation"),
#     ("HCANCLE", "Host: Reservation Cancled"),
#     ("APPROVED", "User: Approved Reservation" ),
#     ("UCANCLE", "User: Requst Cancled")
# )
# POST {"type": <CHOICES>, "user_id": <pk of user>, "property_id": <pk of property>}
# /notifications/<notification_id> [get]: return the notification and delete it 

app_name="notifications"
urlpatterns = [ 
    path('', views.AllNotifications.as_view(), name='all_notifications'),
    path('<int:notification_id>/', views.ReadNotification.as_view(), name='read_notification'),
]