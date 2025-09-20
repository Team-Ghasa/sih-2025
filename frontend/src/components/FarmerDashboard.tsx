import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/TranslationContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { WEB3_CONFIG } from "@/config/web3Config";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { PricePrediction } from "@/components/PricePrediction";
import { cropPredictionApi, CropPredictionResult } from "@/services/cropPredictionApi";
import { PricePredictionResult } from "@/services/pricePredictionApi";
import { pricePredictionApi } from "@/services/pricePredictionApi";
import { 
  Upload, 
  Camera, 
  MapPin, 
  Calendar,
  Leaf,
  Package,
  CheckCircle,
  QrCode,
  Volume2,
  Sparkles,
  Navigation,
  Loader2,
  TrendingUp
} from "lucide-react";

export const FarmerDashboard = () => {
  const { t } = useTranslation();
  const { 
    isConnected, 
    account, 
    connectWallet, 
    registerUser, 
    registerProduct, 
    isLoading: web3Loading,
    error: web3Error 
  } = useWeb3();
  const [formData, setFormData] = useState({
    cropType: "",
    variety: "",
    quantity: "",
    unit: "kg",
    location: "",
    harvestDate: "",
    description: ""
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [predictionResult, setPredictionResult] = useState<CropPredictionResult | null>(null);
  const [blockchainHash, setBlockchainHash] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string>("");
  const [productId, setProductId] = useState<number | null>(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [pricePredictionResult, setPricePredictionResult] = useState<PricePredictionResult | null>(null);
  const [cropTypes, setCropTypes] = useState<string[]>([]);
  const [cropTypesLoading, setCropTypesLoading] = useState(false);
  const [cropTypesError, setCropTypesError] = useState<string>("");

  // Fetch crop types from backend on mount
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

  // Auto-request location permission on component mount
  useEffect(() => {
    // Check if location is already set
    if (formData.location) return;
    
    // Check if geolocation is supported
    if (!navigator.geolocation) return;
    
    // Request permission silently (this will show browser permission dialog)
    navigator.geolocation.getCurrentPosition(
      () => {
        // Permission granted, but don't auto-fill location
        // User can click "Get Location" button when ready
      },
      () => {
        // Permission denied, silently fail
      },
      { timeout: 1000 }
    );
  }, []);

  // Check API availability on component mount
  useEffect(() => {
    const checkApi = async () => {
      try {
        const isAvailable = await cropPredictionApi.checkApiHealth();
        setApiAvailable(isAvailable);
        if (!isAvailable) {
          toast.warning("Crop prediction API is not available. Using fallback mode.");
        }
      } catch (error) {
        setApiAvailable(false);
        toast.warning("Crop prediction API is not available. Using fallback mode.");
      }
    };
    
    checkApi();
  }, []);

  const getCropVariants = (cropType: string) => {
    const variants: { [key: string]: string[] } = {
      "Rice/Paddy": ["Basmati", "Non-Basmati", "Aromatic", "Short Grain", "Long Grain"],
      "Koraput Kalajeera Rice": ["Traditional", "Organic", "Premium Grade"],
      "Millets (Ragi)": ["Red Ragi", "White Ragi", "Brown Ragi"],
      "Millets (Bajra)": ["Pearl Millet", "Hybrid", "Traditional"],
      "Millets (Jowar)": ["Sweet Sorghum", "Grain Sorghum", "Forage Sorghum"],
      "Moong (Green Gram)": ["Green Moong", "Yellow Moong", "Black Moong"],
      "Tomato": ["Cherry", "Roma", "Beefsteak", "Plum", "Grape"],
      "Potato": ["Russet", "Red", "Yukon Gold", "Fingerling", "Sweet Potato"],
      "Brinjal (Eggplant)": ["Purple", "White", "Green", "Striped"],
      "Nayagarh Kanteimundi Brinjal": ["Traditional", "Organic", "Premium"],
      "Mango": ["Alphonso", "Dasheri", "Langra", "Chausa", "Totapuri"],
      "Banana": ["Cavendish", "Red Banana", "Plantain", "Lady Finger"],
      "Kandhamal Haladi (Turmeric)": ["Traditional", "Organic", "Premium Grade", "Powder"],
      "Ganjam Kewda Flower": ["Fresh", "Dried", "Premium Grade"],
      "Kewda Oil": ["Pure", "Concentrated", "Aromatic"],
      "Kewda Attar": ["Traditional", "Premium", "Concentrated"],
      "Cotton": ["BT Cotton", "Desi Cotton", "Hybrid"],
      "Sugarcane": ["Co 86032", "Co 8371", "Co 0238", "Traditional"],
      "Mustard": ["Yellow Mustard", "Brown Mustard", "Black Mustard"],
      "Sesame": ["White Sesame", "Black Sesame", "Brown Sesame"]
    };
    
    return variants[cropType] || ["Traditional", "Hybrid", "Organic", "Premium"];
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const runQualityCheck = async () => {
    if (images.length === 0) {
      toast.error(t('message.upload_images_first'));
      return;
    }

    setIsProcessing(true);
    
    try {
      // Use the first uploaded image for prediction
      const imageFile = images[0];
      
      if (apiAvailable) {
        // Use real ML prediction API
        const result = await cropPredictionApi.predictCropQuality(imageFile);
        
        // Convert quality score to percentage (0-1 to 0-100)
        const scorePercentage = Math.round(result.quality_score * 100);
        
        setPredictionResult(result);
        setQualityScore(scorePercentage);
        
        // Generate blockchain hash and QR code
        const hash = "0x" + Math.random().toString(16).substr(2, 10);
        const qr = `https://agritrace.app/verify/${result.id}`;
        
        setBlockchainHash(hash);
        setQrCode(qr);
        
        toast.success(
          `Quality check complete! Predicted: ${result.predicted_quality} (${scorePercentage}% confidence: ${Math.round(result.prediction_confidence * 100)}%)`
        );
      } else {
        // Fallback to mock prediction if API is not available
        const score = Math.floor(Math.random() * 20) + 80; // 80-99%
        const hash = "0x" + Math.random().toString(16).substr(2, 10);
        const qr = `https://agritrace.app/verify/${hash}`;
        
        setQualityScore(score);
        setBlockchainHash(hash);
        setQrCode(qr);
        
        toast.success(t('message.quality_check_complete').replace('{score}', score.toString()) + ' (Mock prediction)');
      }
    } catch (error: any) {
      console.error('Quality check failed:', error);
      
      // Fallback to mock prediction on error
      const score = Math.floor(Math.random() * 20) + 80; // 80-99%
      const hash = "0x" + Math.random().toString(16).substr(2, 10);
      const qr = `https://agritrace.app/verify/${hash}`;
      
      setQualityScore(score);
      setBlockchainHash(hash);
      setQrCode(qr);
      
      toast.warning(`API error, using fallback prediction: ${score}%`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceAssistant = () => {
    // Simulate voice assistant
    const message = "Hello farmer! To register your produce, please fill in the crop type, quantity, and upload clear images of your harvest. The system will then run a quality check using AI analysis.";
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
    
    toast.info(t('message.voice_assistant_activated'));
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t('message.geolocation_not_supported'));
      toast.error(t('message.geolocation_not_supported'));
      return;
    }

    setIsGettingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get address
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await response.json();
          
          let locationString = "";
          if (data.city) locationString += data.city;
          if (data.principalSubdivision) locationString += `, ${data.principalSubdivision}`;
          if (data.countryName) locationString += `, ${data.countryName}`;
          
          // Fallback if reverse geocoding fails
          if (!locationString) {
            locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          }
          
          setFormData(prev => ({ ...prev, location: locationString }));
          setIsGettingLocation(false);
          toast.success(t('message.location_detected'));
        } catch (error) {
          // Fallback to coordinates if reverse geocoding fails
          const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          setFormData(prev => ({ ...prev, location: locationString }));
          setIsGettingLocation(false);
          toast.success(t('message.location_coordinates'));
        }
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = t('message.location_unavailable');
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = t('message.location_denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = t('message.location_unavailable');
            break;
          case error.TIMEOUT:
            errorMessage = t('message.location_timeout');
            break;
        }
        
        setLocationError(errorMessage);
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const registerUserOnBlockchain = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    try {
      await registerUser(
        "John Farmer", // You can make this dynamic
        WEB3_CONFIG.USER_ROLES.FARMER,
        formData.location || "Chennai, India",
        "+91-9876543210" // You can make this dynamic
      );
      setIsUserRegistered(true);
      toast.success("User registered on blockchain successfully!");
    } catch (error: any) {
      toast.error(`Failed to register user: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!isUserRegistered) {
      toast.error("Please register as a user on blockchain first");
      return;
    }

    if (!qualityScore) {
      toast.error(t('message.run_quality_check_first'));
      return;
    }

    if (!formData.cropType || !formData.variety || !formData.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);
    try {
      // Generate a simple hash for the image (in real app, you'd upload to IPFS)
      const imageHash = `QmHash${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      // Register product on blockchain
      const newProductId = await registerProduct(
        formData.cropType,
        formData.variety,
        formData.quantity,
        formData.unit,
        Math.floor(new Date(formData.harvestDate).getTime() / 1000),
        qualityScore,
        formData.description,
        imageHash
      );

      setProductId(newProductId);
      setBlockchainHash(`0x${Math.random().toString(16).substr(2, 10)}`);
      setQrCode(`https://agritrace.app/verify/${newProductId}`);
      
      toast.success(`Product registered on blockchain! Product ID: ${newProductId}`);
    } catch (error: any) {
      toast.error(`Failed to register product: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full p-4 space-y-4">
      {/* Price Prediction Result at the Top */}
      {pricePredictionResult && (
        <div className="w-full mb-4 border rounded-lg p-4 bg-blue-50">
          <div className="font-semibold flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5" />
            Price Prediction Results
          </div>
          <div className="space-y-1 text-sm">
            <div><span className="font-medium">Crop:</span> {pricePredictionResult.crop_name}</div>
            <div><span className="font-medium">Market Price:</span> ₹{pricePredictionResult.market_price.price_per_kg}/kg</div>
            <div><span className="font-medium">Total Value:</span> ₹{pricePredictionResult.market_price.total_price}</div>
            <div><span className="font-medium">Farmer Revenue:</span> ₹{pricePredictionResult.pricing_tiers.farmer_to_distributor.total_price}</div>
            <div><span className="font-medium">Farmer Profit:</span> ₹{pricePredictionResult.pricing_tiers.farmer_to_distributor.profit}</div>
          </div>
        </div>
      )}
      {/* System Status */}
      <div className="w-full flex flex-col md:flex-row gap-2">
        {/* Blockchain Connection Status */}
        <div className="flex-1 p-2 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <div>
                <h3 className="font-semibold">
                  {isConnected ? 'Blockchain Connected' : 'Blockchain Disconnected'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? `Wallet: ${account?.slice(0, 6)}...${account?.slice(-4)}` : 'Connect your wallet to register products on blockchain'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {!isConnected ? (
                <Button onClick={connectWallet} size="sm">
                  Connect Wallet
                </Button>
              ) : !isUserRegistered ? (
                <Button onClick={registerUserOnBlockchain} size="sm" disabled={web3Loading}>
                  {web3Loading ? 'Registering...' : 'Register as Farmer'}
                </Button>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Registered
                </Badge>
              )}
            </div>
          </div>
          {web3Error && (
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              {web3Error}
            </div>
          )}
        </div>

        {/* ML API Status */}
        <div className="flex-1 p-2 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                apiAvailable === null ? 'bg-yellow-500' : 
                apiAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}></div>
              <div>
                <h3 className="font-semibold">
                  {apiAvailable === null ? 'Checking ML API...' : 
                   apiAvailable ? 'ML Prediction API Active' : 'ML API Unavailable'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {apiAvailable === null ? 'Verifying connection to prediction service' :
                   apiAvailable ? 'Real-time crop quality analysis available' : 
                   'Using fallback prediction mode'}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {apiAvailable ? 'AI Active' : 'Fallback'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              {t('farmer.title')}
            </h1>
            <p className="text-muted-foreground">{t('farmer.subtitle')}</p>
            {formData.cropType && (formData.cropType.includes("Koraput") || formData.cropType.includes("Kandhamal") || formData.cropType.includes("Nayagarh") || formData.cropType.includes("Ganjam")) && (
              <div className="mt-2">
                <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                  <Sparkles className="h-3 w-3" />
                  {t('farmer.gi_tagged')}
                </Badge>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleVoiceAssistant}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Volume2 className="h-4 w-4" />
            {t('farmer.voice_assistant')}
          </Button>
        </div>

        {/* Price Prediction Section */}
        {/* Remove any remaining Crop Price Prediction form UI and <PricePrediction /> component rendering. */}

        <div className="w-full space-y-4">
          {/* Registration Form */}
          <div className="w-full border rounded-lg p-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t('farmer.register_produce')}
              </CardTitle>
              <CardDescription>
                Enter details about your harvest for blockchain registration
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cropType">{t('farmer.crop_type')}</Label>
                    <Select value={formData.cropType} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, cropType: value, variety: "" }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        {cropTypes.map(crop => (
                          <SelectItem key={crop} value={crop}>
                            <div className="flex items-center gap-2">
                              {crop.includes("Koraput") || crop.includes("Kandhamal") || crop.includes("Nayagarh") || crop.includes("Ganjam") ? (
                                <Badge variant="secondary" className="text-xs">GI Tagged</Badge>
                              ) : null}
                              {crop}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="variety">{t('farmer.variety')}</Label>
                    <Select 
                      value={formData.variety} 
                      onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, variety: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select variety" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCropVariants(formData.cropType).map(variant => (
                          <SelectItem key={variant} value={variant}>{variant}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">{t('farmer.quantity')}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="100"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unit">{t('farmer.unit')}</Label>
                    <Select value={formData.unit} onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, unit: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">{t('unit.kg')}</SelectItem>
                        <SelectItem value="quintal">{t('unit.quintal')}</SelectItem>
                        <SelectItem value="ton">{t('unit.ton')}</SelectItem>
                        <SelectItem value="piece">{t('unit.piece')}</SelectItem>
                        <SelectItem value="bag">{t('unit.bag')}</SelectItem>
                        <SelectItem value="liter">{t('unit.liter')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {t('farmer.location')}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="Farm address or coordinates"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      disabled={isGettingLocation}
                      className="flex items-center gap-2"
                    >
                      {isGettingLocation ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Navigation className="h-4 w-4" />
                      )}
                      {isGettingLocation ? t('farmer.getting_location') : t('farmer.get_location')}
                    </Button>
                  </div>
                  {locationError && (
                    <p className="text-sm text-red-500 mt-1">{locationError}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="harvestDate" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {t('farmer.harvest_date')}
                  </Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, harvestDate: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t('farmer.description')}</Label>
                  <Textarea
                    id="description"
                    placeholder="Organic certification, special handling, etc."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label>{t('farmer.upload_images')}</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload images or drag and drop
                      </p>
                    </label>
                  </div>
                  
                  {images.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {images.map((image, index) => (
                        <Badge key={index} variant="secondary">
                          {image.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2">
                <Button
                  type="button"
                  onClick={runQualityCheck}
                  disabled={isProcessing || images.length === 0}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {t('farmer.quality_check')}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    // Predict price using formData
                    if (!formData.cropType || !formData.quantity || !formData.location) {
                      toast.error('Please fill crop type, quantity, and location for price prediction');
                      return;
                    }
                    try {
                      const result = await pricePredictionApi.predictPrice({
                        crop_name: formData.cropType,
                        quantity_kg: parseFloat(formData.quantity),
                        location: formData.location,
                      });
                      setPricePredictionResult(result);
                      toast.success(`Price prediction completed! Market price: ₹${result.market_price.price_per_kg}/kg`);
                    } catch (error: any) {
                      toast.error(`Price prediction failed: ${error.message}`);
                    }
                  }}
                  disabled={!formData.cropType || !formData.quantity || !formData.location}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Predict
                </Button>
                <Button
                  type="submit"
                  disabled={!qualityScore || !isConnected || !isUserRegistered || web3Loading}
                  className="flex items-center gap-2"
                >
                  {web3Loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Registering on Blockchain...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {isConnected && isUserRegistered ? 'Register on Blockchain' : 'Connect Wallet First'}
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </div>

          {/* Results Panel */}
          <div className="w-full border rounded-lg p-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Quality & Verification
              </CardTitle>
              <CardDescription>
                AI analysis results and blockchain verification
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {qualityScore ? (
                <>
                  {/* Quality Score */}
                  <div className="text-center p-6 bg-success/10 rounded-lg border border-success/20">
                    <div className="text-4xl font-bold text-success mb-2">{qualityScore}%</div>
                    <p className="text-sm font-medium">Quality Score</p>
                    <div className="flex flex-col gap-2 mt-3">
                      <Badge variant="secondary" className="bg-success/20 text-success">
                        {predictionResult ? 
                          (predictionResult.predicted_quality === 'good' ? 'Good Quality' : 'Poor Quality') : 
                          'Premium Grade'
                        }
                      </Badge>
                      {predictionResult && (
                        <div className="text-xs text-muted-foreground">
                          <div>Confidence: {Math.round(predictionResult.prediction_confidence * 100)}%</div>
                          <div>ML Model: {apiAvailable ? 'Active' : 'Fallback'}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Blockchain Information */}
                  {productId && (
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Blockchain Registered
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Product ID:</span> {productId}
                          </div>
                          <div>
                            <span className="font-medium">Blockchain Hash:</span>
                            <div className="p-2 bg-muted rounded font-mono text-xs break-all mt-1">
                              {blockchainHash}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Status:</span> 
                            <Badge variant="secondary" className="ml-2">Immutable Record</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* QR Code Generator */}
                  {productId && (
                    <div className="text-center">
                      <Label className="flex items-center gap-1 justify-center mb-3">
                        <QrCode className="h-4 w-4" />
                        QR Code for Tracking
                      </Label>
                      <QRCodeGenerator
                        productId={productId}
                        productData={{
                          cropType: formData.cropType,
                          variety: formData.variety,
                          farmerName: "John Farmer", // You can make this dynamic
                          farmerLocation: formData.location,
                          harvestDate: formData.harvestDate,
                          qualityScore: qualityScore,
                          description: formData.description,
                          blockchainHash: blockchainHash
                        }}
                        onGenerated={(qrString) => {
                          console.log('QR Code generated:', qrString);
                          toast.success('QR code generated successfully!');
                        }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Upload images and run quality check to see results
                  </p>
                  {!isConnected && (
                    <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-700 text-sm">
                      Connect your wallet to register products on blockchain
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
};