from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status as drf_status
import importlib.util
import os

# Import the local estimator by file path so the app runs whether or not the
# top-level `backend` package is importable in the current PYTHONPATH.
this_dir = os.path.dirname(__file__)
predict_path = os.path.normpath(os.path.join(this_dir, '..', 'ml', 'predict_price.py'))
spec = importlib.util.spec_from_file_location('predict_price', predict_path)
predict_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(predict_mod)

load_dataset = predict_mod.load_dataset
compute_trend_stats = predict_mod.compute_trend_stats
empty_weather_snapshot = predict_mod.empty_weather_snapshot
estimate_price_from_csv = predict_mod.estimate_price_from_csv
DATASET_CSV_PATH = getattr(predict_mod, 'DATASET_CSV_PATH', None)


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
        }
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def predict_price(request):
    """Estimate price for a crop.

    Expected JSON body: {"crop": "rice", "kilograms": 10, "location": "Bengaluru, IN", "offline": true}
    If `offline` is true, the endpoint will avoid external geocoding/weather API calls
    and use dataset-only estimation.
    """
    data = request.data
    crop = data.get('crop')
    kilograms = data.get('kilograms')
    location = data.get('location') or ''
    offline = bool(data.get('offline', True))

    if not crop or kilograms is None:
        return JsonResponse({'error': 'Missing crop or kilograms in request'}, status=drf_status.HTTP_400_BAD_REQUEST)

    try:
        kilograms = float(kilograms)
    except Exception:
        return JsonResponse({'error': 'Invalid kilograms value'}, status=drf_status.HTTP_400_BAD_REQUEST)

    # Load local dataset and compute trend (offline mode)
    df = load_dataset(DATASET_CSV_PATH)
    trend = compute_trend_stats(df, crop, None)
    ws = empty_weather_snapshot()
    estimate = estimate_price_from_csv(crop, kilograms, location, ws, trend)
    return JsonResponse(estimate, status=drf_status.HTTP_200_OK)