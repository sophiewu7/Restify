from django.db import models
from accounts.models import User
from properties.models import Property
# Create your models here.

class Reservation(models.Model):
    reserve_guest = models.ForeignKey(User, on_delete=models.CASCADE)
    reserve_host = models.IntegerField(blank=False, null=False)
    reserve_property = models.ForeignKey(Property, on_delete=models.CASCADE)
    check_in = models.DateField(blank=False, null=False)
    check_out = models.DateField(blank=False, null=False)
    last_modified = models.DateTimeField(auto_now=True)


    PENDING = 'pending'
    DENIED = 'denied'
    APPROVED = 'approved'
    CANCELED = 'canceled'
    TERMINATED = 'terminated'
    COMPLETED = 'completed'
    EXPIRED = 'expired'
    PENDING_CANCELED = 'pending_canceled'


    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (DENIED, 'Denied'),
        (APPROVED, 'Approved'),
        (CANCELED, 'Canceled'),
        (TERMINATED, 'Terminated'),
        (COMPLETED, 'Completed'),
        (EXPIRED, 'Expired'),
        (PENDING_CANCELED, 'Pending_Canceled')
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=PENDING,
    )