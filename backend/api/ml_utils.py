import os
import pickle
import numpy as np
from PIL import Image
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class CropQualityPredictor:
    """Crop quality prediction using trained ML model"""
    
    def __init__(self):
        self.model = None
        self.model_path = self._get_model_path()
        self.load_model()
    
    def _get_model_path(self):
        """Get the path to the trained model"""
        # Try to find the model in common locations
        possible_paths = [
            os.path.join(settings.BASE_DIR, 'ml_models', 'crop_quality_model.pkl'),
            os.path.join(settings.BASE_DIR, 'models', 'crop_quality_model.pkl'),
            os.path.join(settings.BASE_DIR, 'crop_quality_model.pkl'),
            # Fallback to the original path from Flask app
            r'C:\Users\HARIHARAN K\Desktop\Crop-Quality-prediction-System-Using-CNN\source_code\crop_quality_model.pkl'
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                return path
        
        # If no model found, return None
        logger.warning("No trained model found. Please place crop_quality_model.pkl in the models directory.")
        return None
    
    def load_model(self):
        """Load the trained model"""
        if self.model_path and os.path.exists(self.model_path):
            try:
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                logger.info(f"Model loaded successfully from {self.model_path}")
            except Exception as e:
                logger.error(f"Error loading model: {str(e)}")
                self.model = None
        else:
            logger.warning("Model file not found. Using mock predictions.")
            self.model = None
    
    def preprocess_image(self, image_path):
        """Preprocess image for model prediction"""
        try:
            # Open and convert image to RGB
            image = Image.open(image_path).convert('RGB')
            
            # Resize to match model input (200x200)
            image = image.resize((200, 200))
            
            # Convert to numpy array and normalize
            image_array = np.array(image) / 255.0
            
            # Add batch dimension
            image_array = np.expand_dims(image_array, axis=0)
            
            return image_array
        except Exception as e:
            logger.error(f"Error preprocessing image: {str(e)}")
            raise
    
    def predict_quality(self, image_path):
        """Predict crop quality from image"""
        try:
            if self.model is None:
                # Return mock prediction if model is not available
                return self._mock_prediction()
            
            # Preprocess the image
            processed_image = self.preprocess_image(image_path)
            
            # Make prediction
            prediction = self.model.predict(processed_image)
            
            # Extract quality score (assuming model outputs probability for "Good")
            quality_score = float(prediction[0][0])
            
            # Determine quality label based on threshold
            quality_label = "good" if quality_score > 0.4 else "bad"
            
            # Calculate confidence (distance from threshold)
            confidence = abs(quality_score - 0.4) * 2.5  # Scale to 0-1
            confidence = min(confidence, 1.0)
            
            return {
                'quality_label': quality_label,
                'quality_score': quality_score,
                'confidence': confidence
            }
            
        except Exception as e:
            logger.error(f"Error making prediction: {str(e)}")
            return self._mock_prediction()
    
    def _mock_prediction(self):
        """Return mock prediction when model is not available"""
        import random
        quality_score = random.uniform(0.3, 0.8)
        quality_label = "good" if quality_score > 0.4 else "bad"
        confidence = random.uniform(0.6, 0.9)
        
        return {
            'quality_label': quality_label,
            'quality_score': quality_score,
            'confidence': confidence
        }

# Global instance
predictor = CropQualityPredictor()
