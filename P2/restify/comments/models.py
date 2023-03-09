from django.db import models
from django.contrib.contenttypes.models import ContentType

# Create your models here.
class PropertyComment(models.Model):
    # the comment 
    text = models.TextField()
    # the property that the comment is created for 
    property = models.ForeignKey('properties.Property', on_delete=models.CASCADE)
    # if null then this is a comment 
    # if set then this is a reply 
    parent_comment = models.ForeignKey('PropertyComment', null=True, blank=True, on_delete=models.CASCADE)

    
class UserComment(models.Model):
    # the user that the comment is directed to 
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name="host_comment")
    # the host that created the comment
    host = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name="user_comment")
    # the comment 
    text = models.TextField()
    
    
