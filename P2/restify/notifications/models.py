from django.db import models

HOST_CHOICES = (
    ("NEW", "Host: New Reservation"),
    ("HCANCLE", "Host: Reservation Cancled"),
    ("APPROVED", "User: Approved Reservation" ),
    ("UCANCLE", "User: Requst Cancled")
)

class Notification(models.Model):
    type = models.CharField(max_length=200, choices=HOST_CHOICES, db_column="type")
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name="notifications",  db_column="user", null=True, blank=True)
    property = models.ForeignKey('properties.Property', on_delete=models.CASCADE,  db_column="notification")
    