from django.db import models

CHOICES = (
    ("NEW", "Host: New Reservation"),
    ("HCANCLE", "Host: Reservation Canceled"),
    ("APPROVED", "User: Approved Reservation" ),
    ("UCANCLE", "User: Requst Canceled")
)

class Notification(models.Model):
    type = models.CharField(max_length=200, choices=CHOICES, db_column="type")
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name="notifications",  db_column="user")
    property = models.ForeignKey('properties.Property', on_delete=models.CASCADE,  db_column="notification")
    