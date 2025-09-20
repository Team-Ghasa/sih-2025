from django.db import models
from django.contrib.auth.models import User
from django.core.validators import FileExtensionValidator


class UserProfile(models.Model):
    """Extended user profile for different user types"""
    USER_TYPES = [
        ('farmer', 'Farmer'),
        ('distributor', 'Distributor'),
        ('retailer', 'Retailer'),
        ('consumer', 'Consumer'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    user_type = models.CharField(max_length=20, choices=USER_TYPES)
    phone_number = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.get_user_type_display()}"


class Product(models.Model):
    """Product model for agricultural products"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=100)
    unit = models.CharField(max_length=50)  # kg, pieces, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name


class SupplyChainItem(models.Model):
    """Supply chain tracking item"""
    STATUS_CHOICES = [
        ('planted', 'Planted'),
        ('harvested', 'Harvested'),
        ('packaged', 'Packaged'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('sold', 'Sold'),
    ]
    
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    farmer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='farmer_items')
    current_holder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='current_items')
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planted')
    location = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.product.name} - {self.status}"


class Transaction(models.Model):
    """Transaction between supply chain participants"""
    TRANSACTION_TYPES = [
        ('sale', 'Sale'),
        ('transfer', 'Transfer'),
        ('purchase', 'Purchase'),
    ]
    
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_transactions')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_transactions')
    supply_chain_item = models.ForeignKey(SupplyChainItem, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.transaction_type} - {self.supply_chain_item.product.name}"


class CropQualityPrediction(models.Model):
    """Model for storing crop quality predictions"""
    QUALITY_CHOICES = [
        ('good', 'Good'),
        ('bad', 'Bad'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crop_predictions')
    image = models.ImageField(
        upload_to='crop_images/',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])],
        help_text='Upload an image of the crop for quality prediction'
    )
    predicted_quality = models.CharField(max_length=10, choices=QUALITY_CHOICES)
    quality_score = models.FloatField(help_text='Quality score from 0 to 1')
    prediction_confidence = models.FloatField(help_text='Model confidence in prediction')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.predicted_quality} ({self.quality_score:.2f})"
        return f"{self.transaction_type} - {self.supply_chain_item.product.name}"


class CropQualityPrediction(models.Model):
    """Model for storing crop quality predictions"""
    QUALITY_CHOICES = [
        ('good', 'Good'),
        ('bad', 'Bad'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crop_predictions')
    image = models.ImageField(
        upload_to='crop_images/',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])],
        help_text='Upload an image of the crop for quality prediction'
    )
    predicted_quality = models.CharField(max_length=10, choices=QUALITY_CHOICES)
    quality_score = models.FloatField(help_text='Quality score from 0 to 1')
    prediction_confidence = models.FloatField(help_text='Model confidence in prediction')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.predicted_quality} ({self.quality_score:.2f})"
        return f"{self.transaction_type} - {self.supply_chain_item.product.name}"


class CropQualityPrediction(models.Model):
    """Model for storing crop quality predictions"""
    QUALITY_CHOICES = [
        ('good', 'Good'),
        ('bad', 'Bad'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='crop_predictions')
    image = models.ImageField(
        upload_to='crop_images/',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])],
        help_text='Upload an image of the crop for quality prediction'
    )
    predicted_quality = models.CharField(max_length=10, choices=QUALITY_CHOICES)
    quality_score = models.FloatField(help_text='Quality score from 0 to 1')
    prediction_confidence = models.FloatField(help_text='Model confidence in prediction')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.predicted_quality} ({self.quality_score:.2f})"