from django.db import models
from django.contrib.contenttypes.models import ContentType

# Create your models here.
class PropertyComment(models.Model):
    # the comment 
    text = models.TextField( db_column="text")
    # the property that the comment is created for 
    property = models.ForeignKey('properties.Property', on_delete=models.CASCADE,  db_column="property")
    # if null then this is a comment 
    # if set then this is a reply 
    # the parent comment will use 'comment_reply' to refer to this.model
    parent_comment = models.ForeignKey('PropertyComment', null=True, blank=True, on_delete=models.CASCADE, related_name="comment_reply",  db_column="parent_comment")
    user = models.ForeignKey('accounts.User', on_delete=models.SET_NULL, related_name="property_comments",  db_column="user", null=True, blank=True)

    
class UserComment(models.Model):
    # the user that the comment is directed to 
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name="host_comment",  db_column="user")
    # the host that created the comment
    host = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name="user_comment",  db_column="host")
    # the comment 
    text = models.TextField( db_column="text")
    
    
