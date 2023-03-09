from django.contrib import admin
from .models import PropertyComment, UserComment

# Register your models here.
admin.site.register(PropertyComment)
admin.site.register(UserComment)