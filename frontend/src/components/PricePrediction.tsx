import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { pricePredictionApi, PricePredictionResult, PricePredictionRequest } from "@/services/pricePredictionApi";
import { 
  Calculator, 
  TrendingUp, 
  MapPin, 
  Package, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Info,
  DollarSign,
  BarChart3
} from "lucide-react";

interface PricePredictionProps {
  onPredictionComplete?: (result: PricePredictionResult) => void;
}

export const PricePrediction = ({ onPredictionComplete }: PricePredictionProps) => {
  const [formData, setFormData] = useState({
    crop_name: "",
    quantity_kg: "",
    location: ""
  });
  
  const [predictionResult, setPredictionResult] = useState<PricePredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [cropTypes, setCropTypes] = useState<string[]>([]);
  const [cropTypesLoading, setCropTypesLoading] = useState(false);
  const [cropTypesError, setCropTypesError] = useState<string>("");

  useEffect(() => {
    setCropTypesLoading(true);
    pricePredictionApi.getCropTypes()
      .then((types) => {
        setCropTypes(types);
        setCropTypesError("");
      })
      .catch((err) => {
        setCropTypesError("Failed to load crop types");
        setCropTypes([]);
      })
      .finally(() => setCropTypesLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.crop_name || !formData.quantity_kg || !formData.location) {
      toast.error("Please fill in all fields");
      return;
    }

    const quantity = parseFloat(formData.quantity_kg);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setIsLoading(true);
    
    try {
      const request: PricePredictionRequest = {
        crop_name: formData.crop_name,
        quantity_kg: quantity,
        location: formData.location
      };

      const result = await pricePredictionApi.predictPrice(request);
      setPredictionResult(result);
      onPredictionComplete?.(result);
      
      toast.success(`Price prediction completed! Market price: ₹${result.market_price.price_per_kg}/kg`);
    } catch (error: any) {
      console.error('Price prediction failed:', error);
      toast.error(`Price prediction failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Price Prediction Form */}
      {!predictionResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Crop Price Prediction
            </CardTitle>
            <CardDescription>
              Get market price predictions and profit analysis for your crops
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="crop_name">Crop Name</Label>
                  <Select 
                    value={formData.crop_name} 
                    onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, crop_name: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map(crop => (
                        <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity_kg">Quantity (kg)</Label>
                  <Input
                    id="quantity_kg"
                    type="number"
                    placeholder="100"
                    value={formData.quantity_kg}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity_kg: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State, Country"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Predicting Price...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Predict Price
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Prediction Results */}
      {predictionResult && (
        <div className="space-y-4">
          {/* Market Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Market Price Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(predictionResult.market_price.price_per_kg)}
                  </div>
                  <p className="text-sm text-muted-foreground">Per kg</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(predictionResult.market_price.total_price)}
                  </div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {predictionResult.market_trends.data_points}
                  </div>
                  <p className="text-sm text-muted-foreground">Data Points</p>
                </div>
              </div>
              {predictionResult.weather_summary && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Weather Impact:</span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    {predictionResult.weather_summary}
                  </p>
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setPredictionResult(null)}>
                  New Prediction
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Tiers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Supply Chain Pricing
              </CardTitle>
              <CardDescription>
                Price breakdown across the supply chain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Farmer to Distributor */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-600">Farmer → Distributor</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {formatPercentage(predictionResult.pricing_tiers.farmer_to_distributor.margin_percentage || 0)} margin
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Price/kg:</span>
                      <div className="font-semibold">
                        {formatCurrency(predictionResult.pricing_tiers.farmer_to_distributor.price_per_kg)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total:</span>
                      <div className="font-semibold">
                        {formatCurrency(predictionResult.pricing_tiers.farmer_to_distributor.total_price)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Profit:</span>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(predictionResult.pricing_tiers.farmer_to_distributor.profit)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Distributor to Retailer */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-blue-600">Distributor → Retailer</h4>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {formatPercentage(predictionResult.pricing_tiers.distributor_to_retailer.markup_percentage || 0)} markup
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Price/kg:</span>
                      <div className="font-semibold">
                        {formatCurrency(predictionResult.pricing_tiers.distributor_to_retailer.price_per_kg)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total:</span>
                      <div className="font-semibold">
                        {formatCurrency(predictionResult.pricing_tiers.distributor_to_retailer.total_price)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Profit:</span>
                      <div className="font-semibold text-blue-600">
                        {formatCurrency(predictionResult.pricing_tiers.distributor_to_retailer.profit)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Retailer to Customer */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-purple-600">Retailer → Customer</h4>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {formatPercentage(predictionResult.pricing_tiers.retailer_to_customer.markup_percentage || 0)} markup
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Price/kg:</span>
                      <div className="font-semibold">
                        {formatCurrency(predictionResult.pricing_tiers.retailer_to_customer.price_per_kg)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total:</span>
                      <div className="font-semibold">
                        {formatCurrency(predictionResult.pricing_tiers.retailer_to_customer.total_price)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Profit:</span>
                      <div className="font-semibold text-purple-600">
                        {formatCurrency(predictionResult.pricing_tiers.retailer_to_customer.profit)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Pricing Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Optimal Profit Margin</div>
                    <div className="text-lg font-semibold text-green-600">
                      {formatPercentage(predictionResult.recommendations.optimal_profit_margin)}
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Optimal Distributor Markup</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {formatPercentage(predictionResult.recommendations.optimal_distributor_markup)}
                    </div>
                  </div>
                </div>
                
                {predictionResult.recommendations.notes.length > 0 && (
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-700 mb-2">
                      <Info className="h-4 w-4" />
                      <span className="font-medium">Notes:</span>
                    </div>
                    <ul className="text-sm text-yellow-600 space-y-1">
                      {predictionResult.recommendations.notes.map((note, index) => (
                        <li key={index}>• {note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Market Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">25th Percentile</div>
                  <div className="font-semibold">
                    {formatCurrency(predictionResult.market_trends.price_range.p25)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Median</div>
                  <div className="font-semibold">
                    {formatCurrency(predictionResult.market_trends.price_range.median)}
                  </div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">75th Percentile</div>
                  <div className="font-semibold">
                    {formatCurrency(predictionResult.market_trends.price_range.p75)}
                  </div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-muted-foreground">Recent Median</div>
                  <div className="font-semibold text-blue-600">
                    {predictionResult.market_trends.price_range.recent_median ? 
                      formatCurrency(predictionResult.market_trends.price_range.recent_median) : 
                      'N/A'
                    }
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">Data Period</div>
                <div className="font-semibold">
                  {predictionResult.market_trends.date_range.from} to {predictionResult.market_trends.date_range.to}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Model Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Model Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Estimator:</span>
                  <div className="font-semibold">{predictionResult.model_info.estimator}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Assumptions:</span>
                  <div className="text-sm">{predictionResult.model_info.assumptions}</div>
                </div>
                {predictionResult.model_info.warnings.length > 0 && (
                  <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm">
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Warning:</span>
                    </div>
                    <div>Dataset contains unrealistic values. Interpret with care.</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
