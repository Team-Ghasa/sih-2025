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
import { InteractiveSupplyChain } from "./InteractiveSupplyChain";
import { AnimatedBackground } from "./AnimatedBackground";

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
    <section className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 animate-slide-up">
                <Leaf className="h-3 w-3 mr-1 animate-float" />
                Revolutionizing Agriculture
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold font-space leading-tight animate-slide-up">
                <span className="text-green-500 from-primary via-secondary to-accent bg-clip-text text-transparent shimmer">
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
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 glow-primary font-medium"
              >
                <Scan className="h-5 w-5 mr-2 animate-pulse" />
                Scan QR Code
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={onGetStarted}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:scale-105 font-medium"
              >
                <Leaf className="h-5 w-5 mr-2 animate-float" />
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

          {/* Right Content - Interactive Demo */}
          <div className="relative animate-grow">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border/20 bg-gradient-to-br from-card to-muted/20">
              <div className="p-6">
                <InteractiveSupplyChain />
              </div>
            </div>

            {/* Floating Cards */}
            <Card className="absolute -bottom-6 -left-6 p-4 bg-card/95 backdrop-blur-md border border-success/20 shadow-xl floating-card blockchain-verified">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-success/10 rounded-lg animate-pulse-glow">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">Quality Score</p>
                  <p className="text-success font-bold text-lg">98%</p>
                  <div className="w-16 h-1 bg-success/20 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="absolute -top-6 -right-6 p-4 bg-card/95 backdrop-blur-md border border-primary/20 shadow-xl floating-card" style={{ animationDelay: '1s' }}>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg animate-pulse-glow">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Blockchain</p>
                  <p className="text-primary font-bold text-lg">Verified</p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group p-6 hover:shadow-2xl transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transform hover:-translate-y-2 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl w-fit group-hover:animate-pulse-glow transition-all duration-300">
                  <feature.icon className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-semibold font-space text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Progress indicator */}
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 delay-200"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};