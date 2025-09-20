from django.contrib import admin
from .models import UserProfile, Product, SupplyChainItem, Transaction, CropQualityPrediction


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'user_type', 'phone_number', 'created_at']
    list_filter = ['user_type', 'created_at']
    search_fields = ['user__username', 'user__email', 'phone_number']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'unit', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'description']


@admin.register(SupplyChainItem)
class SupplyChainItemAdmin(admin.ModelAdmin):
    list_display = ['product', 'farmer', 'current_holder', 'status', 'quantity', 'location']
    list_filter = ['status', 'created_at']
    search_fields = ['product__name', 'farmer__username', 'current_holder__username']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_type', 'from_user', 'to_user', 'amount', 'quantity', 'created_at']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['from_user__username', 'to_user__username']


@admin.register(CropQualityPrediction)
class CropQualityPredictionAdmin(admin.ModelAdmin):
    list_display = ['user', 'predicted_quality', 'quality_score', 'prediction_confidence', 'created_at']
    list_filter = ['predicted_quality', 'created_at']
    search_fields = ['user__username']
    readonly_fields = ['predicted_quality', 'quality_score', 'prediction_confidence', 'created_at']
