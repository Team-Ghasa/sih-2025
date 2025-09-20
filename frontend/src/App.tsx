import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { FarmerDashboard } from "./components/FarmerDashboard";
import { ConsumerScanner } from "./components/ConsumerScanner";
import { DistributorDashboard } from "./components/DistributorDashboard";
import { RetailerDashboard } from "./components/RetailerDashboard";
import { LoginForm } from "./components/LoginForm";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { TranslationProvider } from "./contexts/TranslationContext";
import { Web3Provider } from "./contexts/Web3Context";
import { GoogleTranslate, GoogleTranslateStyles } from "./components/GoogleTranslate";
import { SimpleGoogleTranslate } from "./components/SimpleGoogleTranslate";

const queryClient = new QueryClient();

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const { user } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case "farmer":
        return <FarmerDashboard />;
      case "consumer":
        return <ConsumerScanner />;
      case "distributor":
        if (user?.role === 'distributor') {
          return <DistributorDashboard />;
        } else {
          return <LoginForm onSuccess={() => setCurrentPage("distributor")} />;
        }
      case "retailer":
        if (user?.role === 'retailer') {
          return <RetailerDashboard />;
        } else {
          return <LoginForm onSuccess={() => setCurrentPage("retailer")} />;
        }
      default:
        return <HeroSection onGetStarted={() => setCurrentPage("farmer")} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GoogleTranslateStyles />
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} user={user} />
      {renderPage()}
      
      {/* Floating Translate Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <SimpleGoogleTranslate className="bg-card/90 backdrop-blur-md border border-border rounded-lg shadow-lg p-2" />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <Web3Provider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </TooltipProvider>
          </AuthProvider>
        </Web3Provider>
      </TranslationProvider>
    </QueryClientProvider>
  );
};

export default App;
