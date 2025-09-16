import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Leaf, 
  Menu, 
  X, 
  Scan, 
  Truck, 
  ShoppingCart, 
  Users,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Navigation = ({ currentPage, onPageChange }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("EN");

  const navItems = [
    { id: "home", label: "Home", icon: Leaf },
    { id: "farmer", label: "Farmer", icon: Users },
    { id: "distributor", label: "Distributor", icon: Truck },
    { id: "retailer", label: "Retailer", icon: ShoppingCart },
    { id: "consumer", label: "Consumer", icon: Scan },
  ];

  const languages = ["EN", "ES", "FR", "HI"];

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AgriTrace
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={currentPage === id ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(id)}
                className={cn(
                  "flex items-center space-x-2 transition-all duration-200",
                  currentPage === id && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Button>
            ))}
          </div>

          {/* Language Selector & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {languages.map((lang) => (
                <Button
                  key={lang}
                  size="sm"
                  variant={language === lang ? "default" : "ghost"}
                  onClick={() => setLanguage(lang)}
                  className="h-7 px-2 text-xs"
                >
                  {lang}
                </Button>
              ))}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <Button
                  key={id}
                  variant={currentPage === id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    onPageChange(id);
                    setIsMenuOpen(false);
                  }}
                  className="w-full justify-start space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};