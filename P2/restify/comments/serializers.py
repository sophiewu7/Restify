from rest_framework import serializers
from .models import PropertyComment, UserComment


# class PropertyComment(models.Model):
#     # the comment 
#     text = models.TextField()
#     # the property that the comment is created for 
#     property = models.ForeignKey('Property')
#     # if null then this is a comment 
#     # if set then this is a reply 
#     parent_comment = models.ForeignKey('Comment', null=True, blank=True)

    
# class UserComment(models.Model):
#     # the user that the comment is directed to 
#     user = models.ForeignKey(User)
#     # the host that created the comment
#     host = models.ForeignKey(User)
#     # the comment 
#     text = models.TextField()
    
    
class PropertyCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyComment
        fields = ["text", "property", "parent_comment", "user"]
        extra_kwargs = {
                        'property': {'required': False, 'allow_null': True},
                        'parent_comment': {'required': False, 'allow_null': True},
                        'user': {'required': False, 'allow_null': True}
                        }

class UserCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserComment
        fields = ["text", "host", "user"]
        