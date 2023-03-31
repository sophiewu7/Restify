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

    path('<int:id>/price/create/', views.PriceListCreateView.as_view()),
    path('<int:id>/price/list/', views.PriceListView.as_view()),
    path('price/<int:id>/delete/', views.PriceDestroyView.as_view()),

    path('search/', views.PropertySearchView.as_view()),

]