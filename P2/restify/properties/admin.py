from django.contrib import admin
from .models import Property, Availability

# Register your models here.
admin.site.register(Property)
admin.site.register(Availability)
#admin.site.register(Price)