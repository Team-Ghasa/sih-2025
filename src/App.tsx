import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { FarmerDashboard } from "./components/FarmerDashboard";
import { ConsumerScanner } from "./components/ConsumerScanner";

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "farmer":
        return <FarmerDashboard />;
      case "consumer":
        return <ConsumerScanner />;
      case "distributor":
        return <div className="p-6 text-center text-muted-foreground">Distributor Dashboard - Coming Soon</div>;
      case "retailer":
        return <div className="p-6 text-center text-muted-foreground">Retailer Dashboard - Coming Soon</div>;
      default:
        return <HeroSection onGetStarted={() => setCurrentPage("farmer")} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background">
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
          {renderPage()}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
