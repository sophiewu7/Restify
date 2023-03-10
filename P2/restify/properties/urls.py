from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView


from . import views

app_name="properties"
urlpatterns = [
    path('create/', views.PropertyListCreateView.as_view()),
    path('list/', views.PropertyListView.as_view()),
    path('<int:id>/edit/',views.PropertyUpdateView.as_view()),
    path('<int:id>/delete/',views.PropertyDestroyView.as_view()),
    path('<int:id>/detail/',views.PropertyDetailView.as_view()),

    path('<int:id>/availability/create/', views.AvailListCreateView.as_view()),
    path('<int:id>/availability/list/', views.AvailabilityListView.as_view()),
    path('availability/<int:id>/delete/', views.AvailabilityDestroyView.as_view()),

    path('search/', views.PropertySearchView.as_view()),

]