from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import os
import uuid
from django.conf import settings
from .models import UserProfile, Product, SupplyChainItem, Transaction, CropQualityPrediction
from .serializers import (
    UserProfileSerializer, UserSerializer, ProductSerializer, 
    SupplyChainItemSerializer, TransactionSerializer, 
    CropQualityPredictionSerializer, CropQualityPredictionCreateSerializer
)
from .ml_utils import predictor
import logging
import sys
import os
from django.conf import settings
from collections import OrderedDict
import pandas as pd

# Add the ml directory to the Python path
ml_path = os.path.join(settings.BASE_DIR, 'ml')
if ml_path not in sys.path:
    sys.path.append(ml_path)

# Import the price prediction functions
try:
    from predict_price import (
        estimate_price_from_csv, 
        geocode_location_and_state, 
        fetch_current_weather, 
        build_weather_snapshot, 
        load_dataset, 
        compute_trend_stats,
        get_pricing_recommendations,
        empty_weather_snapshot
    )
    PRICE_PREDICTION_AVAILABLE = True
except ImportError as e:
    logger.warning(f"Price prediction module not available: {e}")
    PRICE_PREDICTION_AVAILABLE = False

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
            'price-prediction': '/api/predict-price/',
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


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def predict_crop_quality(request):
    """Endpoint for crop quality prediction.

    Accepts anonymous uploads. If the request is authenticated, the result is
    saved to the DB; otherwise the image is processed and a transient result
    is returned (no DB write). The response includes `model_available` so
    the frontend can detect whether the trained model produced the result.
    """
    if 'image' not in request.FILES:
        return Response({'error': 'No image file provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        img_file = request.FILES['image']
        # Save to a temporary file path to run prediction
        temp_name = f"tmp_pred_{uuid.uuid4().hex}.jpg"
        temp_path = os.path.join(settings.MEDIA_ROOT, 'tmp', temp_name)
        os.makedirs(os.path.dirname(temp_path), exist_ok=True)
        with open(temp_path, 'wb') as f:
            for chunk in img_file.chunks():
                f.write(chunk)

        prediction_result = predictor.predict_quality(temp_path)
        model_available = getattr(predictor, 'model_available', False)

        # If authenticated, persist the prediction in DB
        if request.user and request.user.is_authenticated:
            pred_obj = CropQualityPrediction.objects.create(user=request.user, image=f'tmp/{temp_name}')
            pred_obj.predicted_quality = prediction_result['quality_label']
            pred_obj.quality_score = prediction_result['quality_score']
            pred_obj.prediction_confidence = prediction_result['confidence']
            pred_obj.save()
            serializer = CropQualityPredictionSerializer(pred_obj, context={'request': request})
            data = serializer.data
            data['model_available'] = model_available
            return Response(data, status=status.HTTP_201_CREATED)

        # Unauthenticated: return transient result with model_available flag
        data = {
            'predicted_quality': prediction_result['quality_label'],
            'quality_score': prediction_result['quality_score'],
            'prediction_confidence': prediction_result['confidence'],
            'model_available': model_available,
        }
        return Response(data, status=status.HTTP_200_OK)

    except Exception as e:
        logger.exception(f"Error in crop quality prediction: {e}")
        return Response({'error': 'Failed to process image prediction'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_predictions(request):
    """Get all predictions for the authenticated user"""
    predictions = CropQualityPrediction.objects.filter(user=request.user)
    serializer = CropQualityPredictionSerializer(predictions, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def predict_crop_price(request):
    """Endpoint for crop price prediction.
    
    Accepts crop name, quantity, and location to predict market price.
    """
    if not PRICE_PREDICTION_AVAILABLE:
        return Response({
            'error': 'Price prediction service is not available'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
    # Validate required fields
    required_fields = ['crop_name', 'quantity_kg', 'location']
    for field in required_fields:
        if field not in request.data:
            return Response({
                'error': f'Missing required field: {field}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        crop_name = request.data['crop_name'].strip()
        quantity_kg = float(request.data['quantity_kg'])
        location = request.data['location'].strip()
        
        if quantity_kg <= 0:
            return Response({
                'error': 'Quantity must be a positive number'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        logger.info(f"Price prediction request: {crop_name}, {quantity_kg}kg, {location}")
        
        # Get location coordinates and weather data
        try:
            lat, lon, loc_name, country, state = geocode_location_and_state(location)
            weather_json = fetch_current_weather(lat, lon)
            weather_snapshot = build_weather_snapshot(loc_name, country, lat, lon, weather_json)
        except Exception as e:
            logger.warning(f"Weather data unavailable for {location}: {e}")
            # Use empty weather snapshot as fallback
            weather_snapshot = empty_weather_snapshot()
            lat, lon, loc_name, country, state = 0.0, 0.0, location, None, None
        
        # Load dataset and compute trends
        csv_path = os.path.join(settings.BASE_DIR, 'csv', 'agridata_csv_202110311352.csv')
        df = load_dataset(csv_path)
        trend = compute_trend_stats(df, crop_name, state if country == "India" else None)
        
        # If no data found for the state, try without state filter
        if not trend or trend.get("rows", 0) == 0:
            trend = compute_trend_stats(df, crop_name, None)
        
        # Estimate price
        estimate = estimate_price_from_csv(
            crop_name, 
            quantity_kg, 
            f"{loc_name}, {country}" if country else loc_name, 
            weather_snapshot, 
            trend
        )
        
        # Get pricing recommendations
        recommendations = get_pricing_recommendations(crop_name, estimate['price_per_kg'])
        
        # Calculate profit margins
        profit_margin = 10.0  # Default 10%
        distributor_markup = 30.0  # Default 30%
        retailer_markup = 20.0  # Default 20%
        
        price_per_kg = estimate['price_per_kg']
        farmer_to_dist = price_per_kg * (1 + profit_margin / 100)
        dist_to_retailer = farmer_to_dist * (1 + distributor_markup / 100)
        retailer_to_customer = dist_to_retailer * (1 + retailer_markup / 100)
        
        farmer_total_revenue = farmer_to_dist * quantity_kg
        farmer_profit = (farmer_to_dist - price_per_kg) * quantity_kg
        distributor_total_revenue = dist_to_retailer * quantity_kg
        distributor_profit = (dist_to_retailer - farmer_to_dist) * quantity_kg
        retailer_total_revenue = retailer_to_customer * quantity_kg
        retailer_profit = (retailer_to_customer - dist_to_retailer) * quantity_kg
        
        response_data = {
            'crop_name': crop_name,
            'quantity_kg': quantity_kg,
            'location': location,
            'weather_summary': weather_snapshot.description if weather_snapshot.description else None,
            'market_price': {
                'price_per_kg': price_per_kg,
                'total_price': estimate['total_price'],
                'currency': 'INR'
            },
            'pricing_tiers': {
                'farmer_to_distributor': {
                    'price_per_kg': round(farmer_to_dist, 2),
                    'total_price': round(farmer_total_revenue, 2),
                    'profit': round(farmer_profit, 2),
                    'margin_percentage': profit_margin
                },
                'distributor_to_retailer': {
                    'price_per_kg': round(dist_to_retailer, 2),
                    'total_price': round(distributor_total_revenue, 2),
                    'profit': round(distributor_profit, 2),
                    'markup_percentage': distributor_markup
                },
                'retailer_to_customer': {
                    'price_per_kg': round(retailer_to_customer, 2),
                    'total_price': round(retailer_total_revenue, 2),
                    'profit': round(retailer_profit, 2),
                    'markup_percentage': retailer_markup
                }
            },
            'recommendations': recommendations,
            'market_trends': {
                'data_points': trend.get('rows', 0),
                'date_range': {
                    'from': trend.get('date_min'),
                    'to': trend.get('date_max')
                },
                'price_range': {
                    'p25': trend.get('perkg_p25_all'),
                    'median': trend.get('perkg_median_all'),
                    'p75': trend.get('perkg_p75_all'),
                    'recent_median': trend.get('perkg_median_12m')
                }
            },
            'model_info': {
                'estimator': 'local-csv-estimator',
                'assumptions': estimate.get('assumptions', ''),
                'warnings': ['warn_unrealistic'] if trend.get('warn_unrealistic') else []
            }
        }
        
        logger.info(f"Price prediction completed for {crop_name}: ₹{price_per_kg}/kg")
        return Response(response_data, status=status.HTTP_200_OK)
        
    except ValueError as e:
        return Response({
            'error': f'Invalid input: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Error in price prediction: {str(e)}")
        return Response({
            'error': 'Failed to predict price. Please try again.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_unique_crop_types(request):
    """Return unique crop types from the dataset for dropdown population."""
    try:
        csv_path = os.path.join(settings.BASE_DIR, 'csv', 'agridata_csv_202110311352.csv')
        df = pd.read_csv(csv_path, usecols=["commodity_name"])
        crop_types = list(OrderedDict.fromkeys(df["commodity_name"].dropna().astype(str).str.strip().unique()))
        return Response({"crop_types": crop_types})
    except Exception as e:
        logger.error(f"Failed to fetch crop types: {e}")
        return Response({"error": "Failed to fetch crop types"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)