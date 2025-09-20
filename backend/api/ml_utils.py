import os
import pickle
import uuid
import numpy as np
from PIL import Image
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class CropQualityPredictor:
    """Clean crop quality predictor loader with deterministic fallback.

    The model path used is `<BASE_DIR>/ml/quality_check/model/crop_quality_model.pkl` by default.
    You can override it using the `CROP_QUALITY_MODEL_PATH` environment variable.
    """

    def __init__(self):
        self.model = None
        self.model_available = False
        self.model_path = self._get_model_path()
        self._warned = False
        self.load_model()

    def _get_model_path(self):
        env = os.environ.get('CROP_QUALITY_MODEL_PATH')
        if env:
            env = os.path.expandvars(os.path.expanduser(env))
            if os.path.exists(env):
                return env

        candidate = os.path.join(settings.BASE_DIR, 'ml', 'quality_check', 'model', 'crop_quality_model.pkl')
        if os.path.exists(candidate):
            return candidate

        # Also check legacy locations
        legacy = os.path.join(settings.BASE_DIR, 'ml_models', 'crop_quality_model.pkl')
        if os.path.exists(legacy):
            return legacy

        return None

    def load_model(self):
        if self.model_path:
            try:
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                self.model_available = True
                logger.info(f"Loaded crop quality model from: {self.model_path}")
            except Exception as e:
                self.model = None
                self.model_available = False
                logger.error(f"Failed to load crop quality model at {self.model_path}: {e}")
        else:
            if not self._warned:
                logger.warning(
                    "No trained crop_quality_model.pkl found at ml/quality_check/model. "
                    "Set CROP_QUALITY_MODEL_PATH to override. Using deterministic fallback."
                )
                self._warned = True

    def preprocess(self, image_path, size=(200, 200)):
        img = Image.open(image_path).convert('RGB')
        img = img.resize(size)
        arr = np.asarray(img).astype('float32') / 255.0
        arr = np.expand_dims(arr, axis=0)
        return arr

    def predict_quality(self, image_path):
        try:
            if self.model_available and self.model is not None:
                x = self.preprocess(image_path)
                pred = self.model.predict(x)
                val = float(np.asarray(pred).ravel()[0])
                score = max(0.0, min(1.0, val))
                label = 'good' if score >= 0.5 else 'bad'
                confidence = min(1.0, max(0.0, abs(score - 0.5) * 2.0))
                return {'quality_label': label, 'quality_score': score, 'confidence': confidence}

            return self._fallback(image_path)
        except Exception as e:
            logger.exception(f"Prediction error: {e}")
            return self._fallback(image_path)

    def _fallback(self, image_path):
        try:
            img = Image.open(image_path).convert('L')
            arr = np.asarray(img).astype('float32') / 255.0
            mean_b = float(np.mean(arr))
            score = 0.35 + (mean_b * 0.6)
            score = max(0.0, min(1.0, score))
            label = 'good' if score >= 0.5 else 'bad'
            confidence = 0.6 + (abs(mean_b - 0.5) * 0.8)
            confidence = max(0.0, min(1.0, confidence))
            return {'quality_label': label, 'quality_score': score, 'confidence': confidence}
        except Exception as e:
            logger.error(f"Fallback failed for {image_path}: {e}")
            return {'quality_label': 'bad', 'quality_score': 0.35, 'confidence': 0.6}


# global predictor instance
predictor = CropQualityPredictor()
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
            r'D:\sih-2025\backend\ml_models\crop_quality_model.pkl'
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
            r'D:\sih-2025\backend\ml_models\crop_quality_model.pkl'
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



