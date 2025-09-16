import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Shield, 
  Scan, 
  TrendingUp,
  CheckCircle,
  Globe,
  Smartphone
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const features = [
    {
      icon: Shield,
      title: "Blockchain Verified",
      description: "Immutable record of every step"
    },
    {
      icon: Scan,
      title: "QR Code Tracking",
      description: "Instant verification & history"
    },
    {
      icon: TrendingUp,
      title: "Quality Analytics", 
      description: "AI-powered freshness scoring"
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "Meet international standards"
    }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Leaf className="h-3 w-3 mr-1" />
                Revolutionizing Agriculture
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Farm to Fork,
                </span>
                <br />
                <span className="text-foreground">Fully Verified</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Complete supply chain transparency through blockchain technology, 
                IoT monitoring, and AI-powered quality verification. 
                Building trust from seed to plate.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Scan className="h-5 w-5 mr-2" />
                Scan QR Code
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={onGetStarted}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Leaf className="h-5 w-5 mr-2" />
                Register Produce
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">99.9% Uptime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Blockchain Secured</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-success" />
                <span className="text-sm font-medium">Mobile Friendly</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="AgriTrace Platform Dashboard"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Cards */}
            <Card className="absolute -bottom-4 -left-4 p-4 bg-card/95 backdrop-blur-md border border-border shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">Quality Score</p>
                  <p className="text-success font-bold">98%</p>
                </div>
              </div>
            </Card>

            <Card className="absolute -top-4 -right-4 p-4 bg-card/95 backdrop-blur-md border border-border shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Blockchain</p>
                  <p className="text-primary font-bold">Verified</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm">
              <div className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};