import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  Factory, 
  Truck, 
  Store, 
  User, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SupplyChainStep {
  id: string;
  title: string;
  icon: any;
  status: "completed" | "current" | "pending" | "anomaly";
  location: string;
  timestamp?: string;
  details: string;
  temperature?: number;
  humidity?: number;
}

const mockSteps: SupplyChainStep[] = [
  {
    id: "harvest",
    title: "Harvest",
    icon: Leaf,
    status: "completed",
    location: "Rodriguez Organic Farm, CA",
    timestamp: "2024-01-15T08:00:00Z",
    details: "Harvested at optimal ripeness, 96% quality score",
    temperature: 22,
    humidity: 65
  },
  {
    id: "processing",
    title: "Processing",
    icon: Factory,
    status: "completed",
    location: "FreshPack Processing Center",
    timestamp: "2024-01-15T14:30:00Z",
    details: "Cleaned, sorted, and packaged under FDA standards",
    temperature: 4,
    humidity: 85
  },
  {
    id: "transport",
    title: "Transport",
    icon: Truck,
    status: "current",
    location: "Highway 101, CA → Seattle, WA",
    timestamp: "2024-01-16T06:00:00Z",
    details: "Refrigerated transport, IoT monitoring active",
    temperature: 3,
    humidity: 82
  },
  {
    id: "retail",
    title: "Retail",
    icon: Store,
    status: "pending",
    location: "GreenMart Store #142",
    details: "Expected arrival in 6 hours"
  },
  {
    id: "consumer",
    title: "Consumer",
    icon: User,
    status: "pending",
    location: "Point of Purchase",
    details: "Ready for final verification"
  }
];

export const InteractiveSupplyChain = () => {
  const [selectedStep, setSelectedStep] = useState<string>("transport");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStepClick = (stepId: string) => {
    if (stepId === selectedStep) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedStep(stepId);
      setIsAnimating(false);
    }, 200);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "current":
        return <Clock className="h-5 w-5 text-primary animate-pulse" />;
      case "anomaly":
        return <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStepStyles = (status: string, isSelected: boolean) => {
    const baseClasses = "relative transition-all duration-300 cursor-pointer";
    
    if (isSelected) {
      return cn(baseClasses, "scale-110 z-10");
    }

    switch (status) {
      case "completed":
        return cn(baseClasses, "hover:scale-105");
      case "current":
        return cn(baseClasses, "animate-pulse-glow hover:scale-105");
      case "anomaly":
        return cn(baseClasses, "hover:scale-105");
      default:
        return cn(baseClasses, "opacity-70 hover:opacity-100 hover:scale-105");
    }
  };

  const selectedStepData = mockSteps.find(step => step.id === selectedStep);

  return (
    <div className="w-full space-y-8">
      {/* Interactive Supply Chain Visualization */}
      <div className="relative">
        <h3 className="text-2xl font-bold font-space text-center mb-8">
          Live Supply Chain Tracking
        </h3>
        
        {/* Steps Chain */}
        <div className="flex items-center justify-between relative px-4 py-8">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0">
            <div 
              className="h-full bg-gradient-to-r from-success via-primary to-muted transition-all duration-1000"
              style={{ width: "60%" }}
            />
          </div>

          {mockSteps.map((step, index) => {
            const Icon = step.icon;
            const isSelected = selectedStep === step.id;
            
            return (
              <div key={step.id} className="relative z-10">
                {/* Step Circle */}
                <div
                  className={getStepStyles(step.status, isSelected)}
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300",
                    step.status === "completed" 
                      ? "bg-success border-success text-success-foreground shadow-lg" 
                      : step.status === "current"
                      ? "bg-primary border-primary text-primary-foreground shadow-xl glow-primary"
                      : step.status === "anomaly"
                      ? "bg-destructive border-destructive text-destructive-foreground shadow-lg"
                      : "bg-background border-muted-foreground text-muted-foreground",
                    isSelected && "ring-4 ring-primary/30"
                  )}>
                    <Icon className="h-7 w-7" />
                  </div>
                </div>

                {/* Step Label */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center min-w-max">
                  <p className={cn(
                    "text-sm font-medium transition-colors",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </p>
                  <div className="mt-1">
                    {getStatusIcon(step.status)}
                  </div>
                </div>

                {/* Connector Arrow */}
                {index < mockSteps.length - 1 && (
                  <ArrowRight className="absolute top-6 -right-8 h-4 w-4 text-muted-foreground z-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Details */}
      {selectedStepData && (
        <Card className={cn(
          "transition-all duration-300 border-2",
          isAnimating ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100",
          selectedStepData.status === "current" ? "border-primary/50 bg-primary/5" : "border-border"
        )}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "p-3 rounded-lg",
                  selectedStepData.status === "completed" ? "bg-success/10" :
                  selectedStepData.status === "current" ? "bg-primary/10" :
                  selectedStepData.status === "anomaly" ? "bg-destructive/10" : "bg-muted"
                )}>
                  <selectedStepData.icon className={cn(
                    "h-6 w-6",
                    selectedStepData.status === "completed" ? "text-success" :
                    selectedStepData.status === "current" ? "text-primary" :
                    selectedStepData.status === "anomaly" ? "text-destructive" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold font-space">{selectedStepData.title}</h4>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedStepData.location}
                  </p>
                </div>
              </div>
              
              <Badge 
                variant={selectedStepData.status === "current" ? "default" : "secondary"}
                className={cn(
                  selectedStepData.status === "completed" && "bg-success text-success-foreground",
                  selectedStepData.status === "anomaly" && "bg-destructive text-destructive-foreground"
                )}
              >
                {selectedStepData.status === "current" && "Live"}
                {selectedStepData.status === "completed" && "Completed"}
                {selectedStepData.status === "pending" && "Pending"}
                {selectedStepData.status === "anomaly" && "Alert"}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{selectedStepData.details}</p>
                
                {selectedStepData.timestamp && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(selectedStepData.timestamp).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Environmental Data */}
              {(selectedStepData.temperature !== undefined || selectedStepData.humidity !== undefined) && (
                <div className="space-y-3">
                  <h5 className="font-medium text-sm">Environmental Conditions</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedStepData.temperature !== undefined && (
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold">{selectedStepData.temperature}°C</div>
                        <div className="text-xs text-muted-foreground">Temperature</div>
                      </div>
                    )}
                    {selectedStepData.humidity !== undefined && (
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold">{selectedStepData.humidity}%</div>
                        <div className="text-xs text-muted-foreground">Humidity</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Real-time Updates Simulation */}
            {selectedStepData.status === "current" && (
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Live Updates</span>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    View IoT Data
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  GPS: 37.7749°N, 122.4194°W • Speed: 65 mph • ETA: 6h 23m
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};