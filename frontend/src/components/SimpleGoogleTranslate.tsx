import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

interface SimpleGoogleTranslateProps {
  className?: string;
}

export const SimpleGoogleTranslate: React.FC<SimpleGoogleTranslateProps> = ({ className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Google Translate script dynamically
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    
    // Define the callback function
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,or',
        layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
        multilanguagePage: true
      }, 'google_translate_element');
      setIsLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      document.head.removeChild(script);
      delete (window as any).googleTranslateElementInit;
    };
  }, []);

  const translateToLanguage = (languageCode: string) => {
    if (!isLoaded) return;

    // Find the Google Translate select element
    const translateSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (translateSelect) {
      translateSelect.value = languageCode;
      translateSelect.dispatchEvent(new Event('change'));
    }
  };

  const toggleTranslate = () => {
    if (!isLoaded) return;
    
    const translateSelect = document.querySelector('.goog-te-combo') as HTMLElement;
    if (translateSelect) {
      translateSelect.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Google Translate Widget Container */}
      <div id="google_translate_element" className="hidden"></div>
      
      {/* Custom Translate Interface */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTranslate}
          className="flex items-center gap-2"
          disabled={!isLoaded}
        >
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">Translate</span>
        </Button>
        
        {/* Quick Language Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => translateToLanguage('en')}
            className="h-7 px-2 text-xs"
            title="English"
            disabled={!isLoaded}
          >
            EN
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => translateToLanguage('hi')}
            className="h-7 px-2 text-xs"
            title="Hindi"
            disabled={!isLoaded}
          >
            HI
          </Button>
          <Button
            variant="ghost"
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
