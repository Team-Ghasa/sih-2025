# Crop Quality Prediction API

This document describes the crop quality prediction functionality that has been integrated into the Django backend.

## Overview

The crop quality prediction system allows users to upload images of crops and receive quality predictions using a machine learning model. The system has been migrated from the Flask application to the Django backend.

## API Endpoints

### 1. Simple Prediction Endpoint
**POST** `/api/predict-crop/`

Upload an image and get an immediate prediction result.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `image` (file field)

**Response:**
```json
{
    "id": 1,
    "user": {
        "id": 1,
        "username": "farmer1",
        "email": "farmer@example.com",
        "first_name": "",
        "last_name": "",
        "profile": null
    },
    "image": "/media/crop_images/crop_123.jpg",
    "image_url": "http://localhost:8000/media/crop_images/crop_123.jpg",
    "predicted_quality": "good",
    "quality_score": 0.85,
    "prediction_confidence": 0.92,
    "created_at": "2025-01-20T10:30:00Z"
}
```

### 2. ViewSet Endpoints
**GET** `/api/crop-prediction/` - List all predictions for authenticated user
**POST** `/api/crop-prediction/` - Create new prediction
**GET** `/api/crop-prediction/{id}/` - Get specific prediction
**PUT** `/api/crop-prediction/{id}/` - Update prediction
**DELETE** `/api/crop-prediction/{id}/` - Delete prediction

### 3. User Predictions
**GET** `/api/my-predictions/`

Get all predictions for the authenticated user.

## Authentication

All endpoints require authentication. Use Django's authentication system:
- Session authentication (for web interface)
- Token authentication (for API clients)

## Model Setup

### 1. Place Your Model
Copy your trained `crop_quality_model.pkl` file to one of these locations:
- `backend/ml_models/crop_quality_model.pkl` (recommended)
- `backend/models/crop_quality_model.pkl`
- `backend/crop_quality_model.pkl`

### 2. Model Requirements
- Must be a scikit-learn compatible model
- Should accept image arrays of shape (1, 200, 200, 3)
- Should output probability scores for crop quality
- Must be saved using pickle

### 3. Mock Predictions
If no model is found, the system will use mock predictions for testing purposes.

## Frontend Integration

### Example JavaScript Usage

```javascript
// Upload image for prediction
async function predictCropQuality(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
        const response = await fetch('/api/predict-crop/', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Token ${userToken}`, // or use session auth
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Prediction:', result);
            return result;
        } else {
            throw new Error('Prediction failed');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Get user's predictions
async function getUserPredictions() {
    try {
        const response = await fetch('/api/my-predictions/', {
            headers: {
                'Authorization': `Token ${userToken}`,
            }
        });
        
        if (response.ok) {
            const predictions = await response.json();
            return predictions;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## Database Schema

The `CropQualityPrediction` model includes:
- `user`: Foreign key to User
- `image`: ImageField for uploaded crop image
- `predicted_quality`: 'good' or 'bad'
- `quality_score`: Float (0-1)
- `prediction_confidence`: Float (0-1)
- `created_at`: Timestamp

## Error Handling

The API includes comprehensive error handling:
- Invalid file types are rejected
- Missing images return 400 Bad Request
- ML prediction errors return 500 Internal Server Error
- Authentication errors return 401 Unauthorized

## Testing

Run the test script to verify the integration:
```bash
cd backend
python test_crop_prediction.py
```

## Migration from Flask

The Flask application functionality has been fully integrated:
- Image upload and processing
- ML model prediction
- Result storage and retrieval
- Error handling and validation

The Django implementation provides additional benefits:
- Better authentication and authorization
- Database persistence
- Admin interface for management
- RESTful API design
- Better error handling and logging

This document describes the crop quality prediction functionality that has been integrated into the Django backend.

## Overview

The crop quality prediction system allows users to upload images of crops and receive quality predictions using a machine learning model. The system has been migrated from the Flask application to the Django backend.

## API Endpoints

### 1. Simple Prediction Endpoint
**POST** `/api/predict-crop/`

Upload an image and get an immediate prediction result.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `image` (file field)

**Response:**
```json
{
    "id": 1,
    "user": {
        "id": 1,
        "username": "farmer1",
        "email": "farmer@example.com",
        "first_name": "",
        "last_name": "",
        "profile": null
    },
    "image": "/media/crop_images/crop_123.jpg",
    "image_url": "http://localhost:8000/media/crop_images/crop_123.jpg",
    "predicted_quality": "good",
    "quality_score": 0.85,
    "prediction_confidence": 0.92,
    "created_at": "2025-01-20T10:30:00Z"
}
```

### 2. ViewSet Endpoints
**GET** `/api/crop-prediction/` - List all predictions for authenticated user
**POST** `/api/crop-prediction/` - Create new prediction
**GET** `/api/crop-prediction/{id}/` - Get specific prediction
**PUT** `/api/crop-prediction/{id}/` - Update prediction
**DELETE** `/api/crop-prediction/{id}/` - Delete prediction

### 3. User Predictions
**GET** `/api/my-predictions/`

Get all predictions for the authenticated user.

## Authentication

All endpoints require authentication. Use Django's authentication system:
- Session authentication (for web interface)
- Token authentication (for API clients)

## Model Setup

### 1. Place Your Model
Copy your trained `crop_quality_model.pkl` file to one of these locations:
- `backend/ml_models/crop_quality_model.pkl` (recommended)
- `backend/models/crop_quality_model.pkl`
- `backend/crop_quality_model.pkl`

### 2. Model Requirements
- Must be a scikit-learn compatible model
- Should accept image arrays of shape (1, 200, 200, 3)
- Should output probability scores for crop quality
- Must be saved using pickle

### 3. Mock Predictions
If no model is found, the system will use mock predictions for testing purposes.

## Frontend Integration

### Example JavaScript Usage

```javascript
// Upload image for prediction
async function predictCropQuality(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
        const response = await fetch('/api/predict-crop/', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Token ${userToken}`, // or use session auth
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Prediction:', result);
            return result;
        } else {
            throw new Error('Prediction failed');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Get user's predictions
async function getUserPredictions() {
    try {
        const response = await fetch('/api/my-predictions/', {
            headers: {
                'Authorization': `Token ${userToken}`,
            }
        });
        
        if (response.ok) {
            const predictions = await response.json();
            return predictions;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## Database Schema

The `CropQualityPrediction` model includes:
- `user`: Foreign key to User
- `image`: ImageField for uploaded crop image
- `predicted_quality`: 'good' or 'bad'
- `quality_score`: Float (0-1)
- `prediction_confidence`: Float (0-1)
- `created_at`: Timestamp

## Error Handling

The API includes comprehensive error handling:
- Invalid file types are rejected
- Missing images return 400 Bad Request
- ML prediction errors return 500 Internal Server Error
- Authentication errors return 401 Unauthorized

## Testing

Run the test script to verify the integration:
```bash
cd backend
python test_crop_prediction.py
```

## Migration from Flask

The Flask application functionality has been fully integrated:
- Image upload and processing
- ML model prediction
- Result storage and retrieval
- Error handling and validation

The Django implementation provides additional benefits:
- Better authentication and authorization
- Database persistence
- Admin interface for management
- RESTful API design
- Better error handling and logging

This document describes the crop quality prediction functionality that has been integrated into the Django backend.

## Overview

The crop quality prediction system allows users to upload images of crops and receive quality predictions using a machine learning model. The system has been migrated from the Flask application to the Django backend.

## API Endpoints

### 1. Simple Prediction Endpoint
**POST** `/api/predict-crop/`

Upload an image and get an immediate prediction result.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `image` (file field)

**Response:**
```json
{
    "id": 1,
    "user": {
        "id": 1,
        "username": "farmer1",
        "email": "farmer@example.com",
        "first_name": "",
        "last_name": "",
        "profile": null
    },
    "image": "/media/crop_images/crop_123.jpg",
    "image_url": "http://localhost:8000/media/crop_images/crop_123.jpg",
    "predicted_quality": "good",
    "quality_score": 0.85,
    "prediction_confidence": 0.92,
    "created_at": "2025-01-20T10:30:00Z"
}
```

### 2. ViewSet Endpoints
**GET** `/api/crop-prediction/` - List all predictions for authenticated user
**POST** `/api/crop-prediction/` - Create new prediction
**GET** `/api/crop-prediction/{id}/` - Get specific prediction
**PUT** `/api/crop-prediction/{id}/` - Update prediction
**DELETE** `/api/crop-prediction/{id}/` - Delete prediction

### 3. User Predictions
**GET** `/api/my-predictions/`

Get all predictions for the authenticated user.

## Authentication

All endpoints require authentication. Use Django's authentication system:
- Session authentication (for web interface)
- Token authentication (for API clients)

## Model Setup

### 1. Place Your Model
Copy your trained `crop_quality_model.pkl` file to one of these locations:
- `backend/ml_models/crop_quality_model.pkl` (recommended)
- `backend/models/crop_quality_model.pkl`
- `backend/crop_quality_model.pkl`

### 2. Model Requirements
- Must be a scikit-learn compatible model
- Should accept image arrays of shape (1, 200, 200, 3)
- Should output probability scores for crop quality
- Must be saved using pickle

### 3. Mock Predictions
If no model is found, the system will use mock predictions for testing purposes.

## Frontend Integration

### Example JavaScript Usage

```javascript
// Upload image for prediction
async function predictCropQuality(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
        const response = await fetch('/api/predict-crop/', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Token ${userToken}`, // or use session auth
            }
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Prediction:', result);
            return result;
        } else {
            throw new Error('Prediction failed');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Get user's predictions
async function getUserPredictions() {
    try {
        const response = await fetch('/api/my-predictions/', {
            headers: {
                'Authorization': `Token ${userToken}`,
            }
        });
        
        if (response.ok) {
            const predictions = await response.json();
            return predictions;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## Database Schema

The `CropQualityPrediction` model includes:
- `user`: Foreign key to User
- `image`: ImageField for uploaded crop image
- `predicted_quality`: 'good' or 'bad'
- `quality_score`: Float (0-1)
- `prediction_confidence`: Float (0-1)
- `created_at`: Timestamp

## Error Handling

The API includes comprehensive error handling:
- Invalid file types are rejected
- Missing images return 400 Bad Request
- ML prediction errors return 500 Internal Server Error
- Authentication errors return 401 Unauthorized

## Testing

Run the test script to verify the integration:
```bash
cd backend
python test_crop_prediction.py
```

## Migration from Flask

The Flask application functionality has been fully integrated:
- Image upload and processing
- ML model prediction
- Result storage and retrieval
- Error handling and validation

The Django implementation provides additional benefits:
- Better authentication and authorization
- Database persistence
- Admin interface for management
- RESTful API design
- Better error handling and logging



