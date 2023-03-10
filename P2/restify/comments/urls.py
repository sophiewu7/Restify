from django.urls import path
from . import views

# /comments/property/<property_id>/ [get]: List all comments of a property.
# /comments/property/<property_id>/ [post]: For a user to add a new comment on a property that he or she just stayed at.
# /comments/property/<property_id>/<comment_id>/ [get]: To view a property comments.
# /comments/property/<property_id>/<comment_id>/ [post]: To reply a property comments.
# /comments/user/<user_id>/ [get]: To view comments on a user
# /comments/user/<user_id>/ [post]: For host to add a comment on a user

app_name="comments"
urlpatterns = [ 
    path('property/<int:property_id>/', views.PropertyComments.as_view(), name='property_comment'),
    path('property/<int:property_id>/<int:comment_id>/', views.PropertyReply.as_view(), name='property_reply'),
    path('user/<int:user_id>/', views.UserComment.as_view(), name='user_comment'),
]