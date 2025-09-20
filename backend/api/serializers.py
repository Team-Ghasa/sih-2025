from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Product, SupplyChainItem, Transaction, CropQualityPrediction


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user_type', 'phone_number', 'address', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'category', 'unit', 'created_at', 'updated_at']


class SupplyChainItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    farmer = UserSerializer(read_only=True)
    current_holder = UserSerializer(read_only=True)
    
    class Meta:
        model = SupplyChainItem
        fields = ['id', 'product', 'farmer', 'current_holder', 'quantity', 'status', 'location', 'created_at', 'updated_at']


class TransactionSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    supply_chain_item = SupplyChainItemSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'from_user', 'to_user', 'supply_chain_item', 'transaction_type', 'amount', 'quantity', 'created_at']


class CropQualityPredictionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CropQualityPrediction
        fields = ['id', 'user', 'image', 'image_url', 'predicted_quality', 'quality_score', 'prediction_confidence', 'created_at']
        read_only_fields = ['predicted_quality', 'quality_score', 'prediction_confidence']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CropQualityPredictionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropQualityPrediction
        fields = ['image']
    
    def create(self, validated_data):
        # The prediction logic will be handled in the view
        return super().create(validated_data)
from django.contrib.auth.models import User
from .models import UserProfile, Product, SupplyChainItem, Transaction, CropQualityPrediction


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user_type', 'phone_number', 'address', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'category', 'unit', 'created_at', 'updated_at']


class SupplyChainItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    farmer = UserSerializer(read_only=True)
    current_holder = UserSerializer(read_only=True)
    
    class Meta:
        model = SupplyChainItem
        fields = ['id', 'product', 'farmer', 'current_holder', 'quantity', 'status', 'location', 'created_at', 'updated_at']


class TransactionSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    supply_chain_item = SupplyChainItemSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'from_user', 'to_user', 'supply_chain_item', 'transaction_type', 'amount', 'quantity', 'created_at']


class CropQualityPredictionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CropQualityPrediction
        fields = ['id', 'user', 'image', 'image_url', 'predicted_quality', 'quality_score', 'prediction_confidence', 'created_at']
        read_only_fields = ['predicted_quality', 'quality_score', 'prediction_confidence']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CropQualityPredictionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropQualityPrediction
        fields = ['image']
    
    def create(self, validated_data):
        # The prediction logic will be handled in the view
        return super().create(validated_data)
from django.contrib.auth.models import User
from .models import UserProfile, Product, SupplyChainItem, Transaction, CropQualityPrediction


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['user_type', 'phone_number', 'address', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'profile']


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'category', 'unit', 'created_at', 'updated_at']


class SupplyChainItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    farmer = UserSerializer(read_only=True)
    current_holder = UserSerializer(read_only=True)
    
    class Meta:
        model = SupplyChainItem
        fields = ['id', 'product', 'farmer', 'current_holder', 'quantity', 'status', 'location', 'created_at', 'updated_at']


class TransactionSerializer(serializers.ModelSerializer):
    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)
    supply_chain_item = SupplyChainItemSerializer(read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'from_user', 'to_user', 'supply_chain_item', 'transaction_type', 'amount', 'quantity', 'created_at']


class CropQualityPredictionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CropQualityPrediction
        fields = ['id', 'user', 'image', 'image_url', 'predicted_quality', 'quality_score', 'prediction_confidence', 'created_at']
        read_only_fields = ['predicted_quality', 'quality_score', 'prediction_confidence']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CropQualityPredictionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CropQualityPrediction
        fields = ['image']
    
    def create(self, validated_data):
        # The prediction logic will be handled in the view
        return super().create(validated_data)



