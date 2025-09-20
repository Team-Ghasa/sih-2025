from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'crop-prediction', views.CropQualityPredictionViewSet, basename='crop-prediction')

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('info/', views.api_info, name='api_info'),
    path('predict-crop/', views.predict_crop_quality, name='predict_crop_quality'),
    path('predict-price/', views.predict_crop_price, name='predict_crop_price'),
    path('my-predictions/', views.get_user_predictions, name='get_user_predictions'),
    path('crop-types/', views.get_unique_crop_types, name='get_unique_crop_types'),
    path('', include(router.urls)),
]
