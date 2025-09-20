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
  Globe,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, User as AuthUser } from "@/contexts/AuthContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { GoogleTranslate, GoogleTranslateStyles } from "./GoogleTranslate";
import { SimpleGoogleTranslate } from "./SimpleGoogleTranslate";

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  user?: AuthUser | null;
}

export const Navigation = ({ currentPage, onPageChange, user }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const { isConnected, account, connectWallet, disconnectWallet } = useWeb3();

  const navItems = [
    { id: "home", label: t('nav.home'), icon: Leaf },
    { id: "farmer", label: t('nav.farmer'), icon: Users },
    { id: "distributor", label: t('nav.distributor'), icon: Truck },
    { id: "retailer", label: t('nav.retailer'), icon: ShoppingCart },
    { id: "consumer", label: t('nav.consumer'), icon: Scan },
  ];

  const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'hi', label: 'HI', name: 'Hindi' },
    { code: 'or', label: 'OR', name: 'Odia' }
  ];

  return (
    <>
      <GoogleTranslateStyles />
      <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative bg-gradient-to-br from-primary to-secondary p-2 sm:p-2.5 rounded-xl shadow-lg animate-pulse-glow">
              <Leaf className="h-5 w-5 sm:h-7 sm:w-7 text-primary-foreground" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl opacity-20 animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold font-space bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                AgriTrace
              </span>
              <span className="text-xs text-muted-foreground font-medium tracking-wider hidden sm:block">
                FARM TO FORK
              </span>
            </div>
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

          {/* User Profile & Language Selector & Mobile Menu */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Web3 Connection */}
            <div className="flex items-center space-x-1">
              {isConnected ? (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={disconnectWallet}
                    className="text-xs px-2 py-1"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={connectWallet}
                  className="text-xs px-2 py-1"
                >
                  Connect Wallet
                </Button>
              )}
            </div>

            {/* User Profile */}
            {user ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="flex items-center space-x-1 sm:space-x-2 bg-muted rounded-lg px-2 sm:px-3 py-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-medium truncate max-w-20 sm:max-w-none">{user.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    onPageChange("home");
                  }}
                  className="flex items-center gap-1 p-1 sm:p-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('nav.logout')}</span>
                </Button>
              </div>
            ) : null}

            {/* Google Translate Widget */}
            <SimpleGoogleTranslate className="hidden sm:flex" />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1 sm:p-2"
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
              
              {/* Mobile Google Translate */}
              <div className="border-t border-border pt-2 mt-2">
                <div className="px-2 py-1">
                  <SimpleGoogleTranslate className="w-full" />
                </div>
              </div>
              
              {/* Mobile Login/Logout Section */}
              <div className="border-t border-border pt-2 mt-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-2 py-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        logout();
                        onPageChange("home");
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t('nav.logout')}</span>
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};