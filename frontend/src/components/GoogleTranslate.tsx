import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Languages } from 'lucide-react';

interface GoogleTranslateProps {
  className?: string;
}

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export const GoogleTranslate: React.FC<GoogleTranslateProps> = ({ className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    // Check if Google Translate is already loaded
    if (window.google && window.google.translate) {
      setIsLoaded(true);
      return;
    }

    // Wait for Google Translate to load
    const checkGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        setIsLoaded(true);
        // Initialize the widget after a short delay to ensure DOM is ready
        setTimeout(() => {
          if (window.googleTranslateElementInit) {
            window.googleTranslateElementInit();
          }
        }, 100);
      } else {
        setTimeout(checkGoogleTranslate, 100);
      }
    };

    // Start checking after a short delay to allow script to load
    setTimeout(checkGoogleTranslate, 500);
  }, []);

  useEffect(() => {
    // Listen for language changes
    const handleLanguageChange = () => {
      const translateElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (translateElement) {
        setCurrentLanguage(translateElement.value);
      }
    };

    // Add event listener for language changes
    document.addEventListener('change', handleLanguageChange);
    
    return () => {
      document.removeEventListener('change', handleLanguageChange);
    };
  }, [isLoaded]);

  const toggleTranslate = () => {
    if (!isLoaded) return;
    
    setIsVisible(!isVisible);
    
    // Trigger Google Translate dropdown
    const translateElement = document.querySelector('.goog-te-combo');
    if (translateElement) {
      (translateElement as HTMLElement).click();
    }
  };

  const translateToLanguage = (languageCode: string) => {
    if (!isLoaded) return;

    // Try multiple selectors to find the translate element
    const selectors = ['.goog-te-combo', 'select.goog-te-combo', '#google_translate_element select'];
    let translateElement: HTMLSelectElement | null = null;
    
    for (const selector of selectors) {
      translateElement = document.querySelector(selector) as HTMLSelectElement;
      if (translateElement) break;
    }

    if (translateElement) {
      translateElement.value = languageCode;
      translateElement.dispatchEvent(new Event('change'));
      setCurrentLanguage(languageCode);
    } else {
      // Fallback: try to trigger Google Translate directly
      if (window.google && window.google.translate) {
        const translateInstance = window.google.translate.TranslateElement.getInstance();
        if (translateInstance) {
          translateInstance.showBanner(false);
          // Force translation
          const iframe = document.querySelector('iframe.goog-te-menu-frame');
          if (iframe) {
            (iframe as HTMLIFrameElement).contentWindow?.postMessage({
              'goog-translate': {
                'command': 'setLanguage',
                'language': languageCode
              }
            }, '*');
          }
        }
      }
    }
  };

  const getLanguageName = (code: string) => {
    const names: { [key: string]: string } = {
      'en': 'English',
      'hi': 'Hindi',
      'or': 'Odia'
    };
    return names[code] || code;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Google Translate Widget Container */}
      <div id="google_translate_element" className="hidden"></div>
      
      {/* Custom Translate Button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTranslate}
          className="flex items-center gap-2"
          disabled={!isLoaded}
          title={`Current: ${getLanguageName(currentLanguage)}`}
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">Translate</span>
        </Button>
        
        {/* Quick Language Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant={currentLanguage === 'en' ? "default" : "ghost"}
            size="sm"
            onClick={() => translateToLanguage('en')}
            className="h-7 px-2 text-xs"
            title="English"
            disabled={!isLoaded}
          >
            EN
          </Button>
          <Button
            variant={currentLanguage === 'hi' ? "default" : "ghost"}
            size="sm"
            onClick={() => translateToLanguage('hi')}
            className="h-7 px-2 text-xs"
            title="Hindi"
            disabled={!isLoaded}
          >
            HI
          </Button>
          <Button
            variant={currentLanguage === 'or' ? "default" : "ghost"}
            size="sm"
            onClick={() => translateToLanguage('or')}
            className="h-7 px-2 text-xs"
            title="Odia"
            disabled={!isLoaded}
          >
            OR
          </Button>
        </div>
      </div>
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-muted-foreground mt-1">
          Google Translate: {isLoaded ? 'Loaded' : 'Loading...'}
        </div>
      )}
    </div>
  );
};

// Custom CSS for Google Translate Widget
export const GoogleTranslateStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Hide Google Translate Banner */
      .goog-te-banner-frame {
        display: none !important;
      }
      
      /* Style Google Translate Dropdown */
      .goog-te-combo {
        background: hsl(var(--background)) !important;
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 6px !important;
        color: hsl(var(--foreground)) !important;
        font-size: 14px !important;
        padding: 4px 8px !important;
        min-width: 120px !important;
      }
      
      .goog-te-combo:hover {
        background: hsl(var(--accent)) !important;
      }
      
      /* Style Google Translate Panel */
      .goog-te-panel {
        background: hsl(var(--popover)) !important;
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
        z-index: 1000 !important;
      }
      
      /* Style Google Translate Links */
      .goog-te-menu2 {
        background: hsl(var(--popover)) !important;
        border: 1px solid hsl(var(--border)) !important;
        border-radius: 6px !important;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
      }
      
      .goog-te-menu2-item {
        color: hsl(var(--foreground)) !important;
        padding: 8px 12px !important;
      }
      
      .goog-te-menu2-item:hover {
        background: hsl(var(--accent)) !important;
      }
      
      .goog-te-menu2-item-selected {
        background: hsl(var(--primary)) !important;
        color: hsl(var(--primary-foreground)) !important;
      }
      
      /* Hide Google Translate Attribution */
      .goog-te-gadget .goog-te-combo {
        margin: 0 !important;
      }
      
      .goog-te-gadget-simple {
        background: transparent !important;
        border: none !important;
        font-size: 0 !important;
      }
      
      /* Mobile Responsive */
      @media (max-width: 640px) {
        .goog-te-combo {
          font-size: 12px !important;
          padding: 2px 6px !important;
          min-width: 100px !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null;
};
