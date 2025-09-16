import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Scan,
  Camera,
  MapPin,
  Calendar,
  Truck,
  Store,
  Shield,
  CheckCircle,
  AlertTriangle,
  Leaf,
  Star,
  Clock,
  TrendingUp,
  User,
  Package
} from "lucide-react";

interface ProduceData {
  id: string;
  cropType: string;
  variety: string;
  farmer: {
    name: string;
    location: string;
    certification: string;
  };
  harvest: {
    date: string;
    quality: number;
  };
  journey: Array<{
    stage: string;
    location: string;
    timestamp: string;
    status: "completed" | "in-transit" | "anomaly";
  }>;
  blockchain: {
    verified: boolean;
    hash: string;
  };
  freshness: {
    score: number;
    prediction: string;
  };
  insights: string[];
}

export const ConsumerScanner = () => {
  const [qrInput, setQrInput] = useState("");
  const [produceData, setProduceData] = useState<ProduceData | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Mock data for demonstration
  const mockProduceData: ProduceData = {
    id: "AGT-TOM-2024-001234",
    cropType: "Tomatoes",
    variety: "Cherry Roma",
    farmer: {
      name: "Maria Rodriguez",
      location: "Salinas Valley, CA",
      certification: "USDA Organic Certified"
    },
    harvest: {
      date: "2024-01-15",
      quality: 96
    },
    journey: [
      {
        stage: "Harvest",
        location: "Rodriguez Organic Farm, CA",
        timestamp: "2024-01-15T08:00:00Z",
        status: "completed"
      },
      {
        stage: "Processing",
        location: "Central Valley Packaging, CA",
        timestamp: "2024-01-15T14:30:00Z",
        status: "completed"
      },
      {
        stage: "Distribution",
        location: "FreshCo Logistics Hub, CA",
        timestamp: "2024-01-16T06:00:00Z",
        status: "completed"
      },
      {
        stage: "Retail",
        location: "GreenMart Store #142",
        timestamp: "2024-01-17T09:15:00Z",
        status: "completed"
      }
    ],
    blockchain: {
      verified: true,
      hash: "0xb7d8f9a2c3e4"
    },
    freshness: {
      score: 89,
      prediction: "Best consumed within 3 days"
    },
    insights: [
      "This produce is fresher than 85% of current stock",
      "Grown using sustainable farming practices",
      "No anomalies detected during transport",
      "Premium organic quality grade"
    ]
  };

  const handleScan = () => {
    if (!qrInput.trim()) {
      toast.error("Please enter a QR code or batch ID");
      return;
    }

    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      setProduceData(mockProduceData);
      setIsScanning(false);
      toast.success("Product verified successfully!");
    }, 2000);
  };

  const handleCameraScan = () => {
    toast.info("Camera scanner would open here");
    // In a real app, this would open the device camera
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "in-transit":
        return <Clock className="h-4 w-4 text-warning" />;
      case "anomaly":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success/10 border-success/20 text-success";
      case "in-transit":
        return "bg-warning/10 border-warning/20 text-warning";
      case "anomaly":
        return "bg-destructive/10 border-destructive/20 text-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <Scan className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Product Scanner</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Scan QR codes to instantly verify product origin, quality, and journey from farm to shelf
        </p>
      </div>

      {/* Scanner Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Scan Product</CardTitle>
          <CardDescription>
            Use your camera or enter the QR code manually
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter QR code or batch ID (e.g., AGT-TOM-2024-001234)"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleCameraScan} variant="outline" size="icon">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            onClick={handleScan} 
            disabled={isScanning}
            className="w-full"
            size="lg"
          >
            {isScanning ? (
              <>
                <Scan className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Scan className="h-4 w-4 mr-2" />
                Scan Product
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Product Results */}
      {produceData && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Product Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {produceData.cropType}
                </span>
                {produceData.blockchain.verified && (
                  <Badge className="bg-success/10 text-success border-success/20">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {produceData.variety} • ID: {produceData.id}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Farmer Info */}
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <User className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{produceData.farmer.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {produceData.farmer.location}
                  </p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {produceData.farmer.certification}
                  </Badge>
                </div>
              </div>

              {/* Quality & Freshness */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-success/5 border border-success/20 rounded-lg">
                  <div className="text-2xl font-bold text-success">{produceData.harvest.quality}%</div>
                  <p className="text-xs text-muted-foreground">Quality Score</p>
                </div>
                <div className="text-center p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{produceData.freshness.score}%</div>
                  <p className="text-xs text-muted-foreground">Freshness</p>
                </div>
              </div>

              {/* Harvest Date */}
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Harvested: {new Date(produceData.harvest.date).toLocaleDateString()}</span>
              </div>

              {/* Blockchain Hash */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Blockchain Hash</p>
                <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                  {produceData.blockchain.hash}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Journey Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Supply Chain Journey
              </CardTitle>
              <CardDescription>
                Track the complete path from farm to store
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {produceData.journey.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full border ${getStatusColor(step.status)}`}>
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{step.stage}</p>
                      <p className="text-xs text-muted-foreground">{step.location}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(step.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Smart Insights */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Smart Insights
              </CardTitle>
              <CardDescription>
                AI-powered analysis and recommendations
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Star className="h-4 w-4 text-accent" />
                    Product Highlights
                  </h4>
                  <ul className="space-y-1">
                    {produceData.insights.map((insight, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-success mt-0.5 shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Freshness Prediction
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {produceData.freshness.prediction}
                  </p>
                  
                  <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm font-medium text-primary">
                      🌱 Eco-Friendly Choice
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This product has a minimal carbon footprint and supports sustainable farming
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};