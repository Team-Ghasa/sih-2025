from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import UserProfile, Product, SupplyChainItem, Transaction, CropQualityPrediction
from .serializers import (
    UserProfileSerializer, UserSerializer, ProductSerializer, 
    SupplyChainItemSerializer, TransactionSerializer, 
    CropQualityPredictionSerializer, CropQualityPredictionCreateSerializer
)
from .ml_utils import predictor
import logging

logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'status': 'healthy',
        'message': 'Django backend is running successfully!'
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def api_info(request):
    """API information endpoint"""
    return Response({
        'name': 'SIH 2025 Backend API',
        'version': '1.0.0',
        'description': 'Backend API for SIH 2025 project',
        'endpoints': {
            'health': '/api/health/',
            'info': '/api/info/',
            'admin': '/admin/',
            'crop-prediction': '/api/crop-prediction/',
        }
    })


class CropQualityPredictionViewSet(ModelViewSet):
    """ViewSet for crop quality prediction"""
    queryset = CropQualityPrediction.objects.all()
    serializer_class = CropQualityPredictionSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CropQualityPredictionCreateSerializer
        return CropQualityPredictionSerializer
    
    def perform_create(self, serializer):
        """Create a new crop quality prediction"""
        try:
            # Save the instance first to get the image path
            instance = serializer.save(user=self.request.user)
            
            # Make prediction using the ML model
            prediction_result = predictor.predict_quality(instance.image.path)
            
            # Update the instance with prediction results
            instance.predicted_quality = prediction_result['quality_label']
            instance.quality_score = prediction_result['quality_score']
            instance.prediction_confidence = prediction_result['confidence']
            instance.save()
            
            logger.info(f"Prediction completed for user {self.request.user.username}: {prediction_result}")
            
        except Exception as e:
            logger.error(f"Error in crop quality prediction: {str(e)}")
            # If prediction fails, set default values
            instance.predicted_quality = 'bad'
            instance.quality_score = 0.0
            instance.prediction_confidence = 0.0
            instance.save()
            raise
    
    def list(self, request, *args, **kwargs):
        """List predictions for the authenticated user"""
        queryset = self.queryset.filter(user=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_crop_quality(request):
    """Simple endpoint for crop quality prediction"""
    if 'image' not in request.FILES:
        return Response(
            {'error': 'No image file provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Create the prediction instance
        prediction = CropQualityPrediction.objects.create(
            user=request.user,
            image=request.FILES['image']
        )
        
        # Make prediction
        prediction_result = predictor.predict_quality(prediction.image.path)
        
        # Update with prediction results
        prediction.predicted_quality = prediction_result['quality_label']
        prediction.quality_score = prediction_result['quality_score']
        prediction.prediction_confidence = prediction_result['confidence']
        prediction.save()
        
        # Return the result
        serializer = CropQualityPredictionSerializer(prediction, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        logger.error(f"Error in crop quality prediction: {str(e)}")
        return Response(
            {'error': 'Failed to process image prediction'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_predictions(request):
    """Get all predictions for the authenticated user"""
    predictions = CropQualityPrediction.objects.filter(user=request.user)
    serializer = CropQualityPredictionSerializer(predictions, many=True, context={'request': request})
    return Response(serializer.data)