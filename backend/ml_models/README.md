# ML Models Directory

This directory contains the machine learning models used for crop quality prediction.

## Setup Instructions

1. **Place your trained model**: Copy your `crop_quality_model.pkl` file to this directory.

2. **Model Requirements**: The model should be a scikit-learn compatible model that:
   - Accepts image arrays of shape (1, 200, 200, 3)
   - Returns predictions in the format expected by the prediction logic
   - Is saved using pickle

3. **Alternative Model Paths**: The system will look for the model in these locations:
   - `backend/ml_models/crop_quality_model.pkl` (recommended)
   - `backend/models/crop_quality_model.pkl`
   - `backend/crop_quality_model.pkl`
   - Original Flask app path (fallback)

## Testing

If no model is found, the system will use mock predictions for testing purposes.

## Model Format

The model should be trained to predict crop quality from images and should output:
- A probability score for "good" quality (0-1 range)
- The system uses a threshold of 0.4 to classify as "good" or "bad"

This directory contains the machine learning models used for crop quality prediction.

## Setup Instructions

1. **Place your trained model**: Copy your `crop_quality_model.pkl` file to this directory.

2. **Model Requirements**: The model should be a scikit-learn compatible model that:
   - Accepts image arrays of shape (1, 200, 200, 3)
   - Returns predictions in the format expected by the prediction logic
   - Is saved using pickle

3. **Alternative Model Paths**: The system will look for the model in these locations:
   - `backend/ml_models/crop_quality_model.pkl` (recommended)
   - `backend/models/crop_quality_model.pkl`
   - `backend/crop_quality_model.pkl`
   - Original Flask app path (fallback)

## Testing

If no model is found, the system will use mock predictions for testing purposes.

## Model Format

The model should be trained to predict crop quality from images and should output:
- A probability score for "good" quality (0-1 range)
- The system uses a threshold of 0.4 to classify as "good" or "bad"

This directory contains the machine learning models used for crop quality prediction.

## Setup Instructions

1. **Place your trained model**: Copy your `crop_quality_model.pkl` file to this directory.

2. **Model Requirements**: The model should be a scikit-learn compatible model that:
   - Accepts image arrays of shape (1, 200, 200, 3)
   - Returns predictions in the format expected by the prediction logic
   - Is saved using pickle

3. **Alternative Model Paths**: The system will look for the model in these locations:
   - `backend/ml_models/crop_quality_model.pkl` (recommended)
   - `backend/models/crop_quality_model.pkl`
   - `backend/crop_quality_model.pkl`
   - Original Flask app path (fallback)

## Testing

If no model is found, the system will use mock predictions for testing purposes.

## Model Format

The model should be trained to predict crop quality from images and should output:
- A probability score for "good" quality (0-1 range)
- The system uses a threshold of 0.4 to classify as "good" or "bad"



