import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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
  Sparkles
} from "lucide-react";

export const FarmerDashboard = () => {
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
  const [blockchainHash, setBlockchainHash] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const cropTypes = [
    "Tomatoes", "Potatoes", "Carrots", "Lettuce", "Spinach", 
    "Apples", "Oranges", "Bananas", "Rice", "Wheat", "Corn"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const runQualityCheck = async () => {
    if (images.length === 0) {
      toast.error("Please upload at least one image first");
      return;
    }

    setIsProcessing(true);
    
    // Simulate AI quality analysis
    setTimeout(() => {
      const score = Math.floor(Math.random() * 20) + 80; // 80-99%
      const hash = "0x" + Math.random().toString(16).substr(2, 10);
      const qr = `https://agritrace.app/verify/${hash}`;
      
      setQualityScore(score);
      setBlockchainHash(hash);
      setQrCode(qr);
      setIsProcessing(false);
      
      toast.success(`Quality analysis complete! Score: ${score}%`);
    }, 3000);
  };

  const handleVoiceAssistant = () => {
    // Simulate voice assistant
    const message = "Hello farmer! To register your produce, please fill in the crop type, quantity, and upload clear images of your harvest. The system will then run a quality check using AI analysis.";
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
    
    toast.info("Voice assistant activated");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualityScore) {
      toast.error("Please run quality check first");
      return;
    }
    toast.success("Produce registered successfully on blockchain!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            Farmer Dashboard
          </h1>
          <p className="text-muted-foreground">Register your produce and get blockchain verification</p>
        </div>
        
        <Button
          onClick={handleVoiceAssistant}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Volume2 className="h-4 w-4" />
          Voice Assistant
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produce Registration
            </CardTitle>
            <CardDescription>
              Enter details about your harvest for blockchain registration
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cropType">Crop Type</Label>
                  <Select value={formData.cropType} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, cropType: value }))
                  }>
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
                  <Label htmlFor="variety">Variety</Label>
                  <Input
                    id="variety"
                    placeholder="e.g., Cherry, Roma"
                    value={formData.variety}
                    onChange={(e) => setFormData(prev => ({ ...prev, variety: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="100"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, unit: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="lbs">Pounds</SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Farm Location
                </Label>
                <Input
                  id="location"
                  placeholder="Farm address or coordinates"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="harvestDate" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Harvest Date
                </Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, harvestDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Additional Notes</Label>
                <Textarea
                  id="description"
                  placeholder="Organic certification, special handling, etc."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label>Produce Images</Label>
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
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Run Quality Check
                  </>
                )}
              </Button>
              
              <Button
                type="submit"
                disabled={!qualityScore}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Register on Blockchain
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Results Panel */}
        <Card>
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
                  <Badge variant="secondary" className="mt-2 bg-success/20 text-success">
                    Premium Grade
                  </Badge>
                </div>

                {/* Blockchain Hash */}
                <div className="space-y-2">
                  <Label>Blockchain Transaction Hash</Label>
                  <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
                    {blockchainHash}
                  </div>
                </div>

                {/* QR Code */}
                <div className="text-center">
                  <Label className="flex items-center gap-1 justify-center mb-3">
                    <QrCode className="h-4 w-4" />
                    QR Code for Tracking
                  </Label>
                  <div className="p-4 bg-background border border-border rounded-lg inline-block">
                    <div className="w-32 h-32 bg-foreground/10 rounded flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-foreground/50" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Scan to track your produce
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Upload images and run quality check to see results
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};