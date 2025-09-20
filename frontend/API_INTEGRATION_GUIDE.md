# API Integration Guide

This guide explains how the frontend integrates with the Django backend for crop quality prediction.

## Environment Configuration

Create a `.env` file in the frontend directory with the following content:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Web3 Configuration (if needed)
VITE_WEB3_RPC_URL=your_rpc_url_here
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

## How It Works

### 1. API Service (`src/services/cropPredictionApi.ts`)
- Handles all communication with the Django backend
- Provides methods for crop quality prediction
- Includes error handling and authentication
- Supports both real ML predictions and fallback mode

### 2. Farmer Dashboard Integration
- Automatically checks API availability on load
- Uses real ML predictions when API is available
- Falls back to mock predictions if API is unavailable
- Shows detailed prediction results including confidence scores

### 3. Prediction Flow
1. User uploads crop images
2. Clicks "Quality Check" button
3. Frontend sends image to Django backend
4. Backend processes image with ML model
5. Returns prediction results (quality, score, confidence)
6. Frontend displays results with blockchain integration

## API Endpoints Used

- `POST /api/predict-crop/` - Upload image and get prediction
- `GET /api/my-predictions/` - Get user's prediction history
- `GET /api/health/` - Check API availability

## Error Handling

The system includes comprehensive error handling:
- API unavailable: Falls back to mock predictions
- Network errors: Shows user-friendly error messages
- Authentication errors: Prompts user to log in
- Invalid images: Validates file types before upload

## Testing

1. Start the Django backend: `cd backend && python manage.py runserver`
2. Start the frontend: `cd frontend && npm run dev`
3. Upload a crop image and test the quality prediction
4. Check the browser console for any errors

## Features

- ✅ Real-time ML prediction integration
- ✅ Fallback mode for offline/API unavailable scenarios
- ✅ Detailed prediction results with confidence scores
- ✅ Error handling and user feedback
- ✅ API status monitoring
- ✅ Image validation and upload

This guide explains how the frontend integrates with the Django backend for crop quality prediction.

## Environment Configuration

Create a `.env` file in the frontend directory with the following content:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Web3 Configuration (if needed)
VITE_WEB3_RPC_URL=your_rpc_url_here
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

## How It Works

### 1. API Service (`src/services/cropPredictionApi.ts`)
- Handles all communication with the Django backend
- Provides methods for crop quality prediction
- Includes error handling and authentication
- Supports both real ML predictions and fallback mode

### 2. Farmer Dashboard Integration
- Automatically checks API availability on load
- Uses real ML predictions when API is available
- Falls back to mock predictions if API is unavailable
- Shows detailed prediction results including confidence scores

### 3. Prediction Flow
1. User uploads crop images
2. Clicks "Quality Check" button
3. Frontend sends image to Django backend
4. Backend processes image with ML model
5. Returns prediction results (quality, score, confidence)
6. Frontend displays results with blockchain integration

## API Endpoints Used

- `POST /api/predict-crop/` - Upload image and get prediction
- `GET /api/my-predictions/` - Get user's prediction history
- `GET /api/health/` - Check API availability

## Error Handling

The system includes comprehensive error handling:
- API unavailable: Falls back to mock predictions
- Network errors: Shows user-friendly error messages
- Authentication errors: Prompts user to log in
- Invalid images: Validates file types before upload

## Testing

1. Start the Django backend: `cd backend && python manage.py runserver`
2. Start the frontend: `cd frontend && npm run dev`
3. Upload a crop image and test the quality prediction
4. Check the browser console for any errors

## Features

- ✅ Real-time ML prediction integration
- ✅ Fallback mode for offline/API unavailable scenarios
- ✅ Detailed prediction results with confidence scores
- ✅ Error handling and user feedback
- ✅ API status monitoring
- ✅ Image validation and upload

This guide explains how the frontend integrates with the Django backend for crop quality prediction.

## Environment Configuration

Create a `.env` file in the frontend directory with the following content:

```env
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Web3 Configuration (if needed)
VITE_WEB3_RPC_URL=your_rpc_url_here
VITE_CONTRACT_ADDRESS=your_contract_address_here
```

## How It Works

### 1. API Service (`src/services/cropPredictionApi.ts`)
- Handles all communication with the Django backend
- Provides methods for crop quality prediction
- Includes error handling and authentication
- Supports both real ML predictions and fallback mode

### 2. Farmer Dashboard Integration
- Automatically checks API availability on load
- Uses real ML predictions when API is available
- Falls back to mock predictions if API is unavailable
- Shows detailed prediction results including confidence scores

### 3. Prediction Flow
1. User uploads crop images
2. Clicks "Quality Check" button
3. Frontend sends image to Django backend
4. Backend processes image with ML model
5. Returns prediction results (quality, score, confidence)
6. Frontend displays results with blockchain integration

## API Endpoints Used

- `POST /api/predict-crop/` - Upload image and get prediction
- `GET /api/my-predictions/` - Get user's prediction history
- `GET /api/health/` - Check API availability

## Error Handling

The system includes comprehensive error handling:
- API unavailable: Falls back to mock predictions
- Network errors: Shows user-friendly error messages
- Authentication errors: Prompts user to log in
- Invalid images: Validates file types before upload

## Testing

1. Start the Django backend: `cd backend && python manage.py runserver`
2. Start the frontend: `cd frontend && npm run dev`
3. Upload a crop image and test the quality prediction
4. Check the browser console for any errors

## Features

- ✅ Real-time ML prediction integration
- ✅ Fallback mode for offline/API unavailable scenarios
- ✅ Detailed prediction results with confidence scores
- ✅ Error handling and user feedback
- ✅ API status monitoring
- ✅ Image validation and upload



