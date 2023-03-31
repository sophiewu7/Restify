from django.contrib import admin
from .models import Property, Pricetag

# Register your models here.
admin.site.register(Property)
admin.site.register(Pricetag)
#admin.site.register(Price)