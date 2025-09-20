const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface PricePredictionRequest {
  crop_name: string;
  quantity_kg: number;
  location: string;
}

export interface MarketPrice {
  price_per_kg: number;
  total_price: number;
  currency: string;
}

export interface PricingTier {
  price_per_kg: number;
  total_price: number;
  profit: number;
  margin_percentage?: number;
  markup_percentage?: number;
}

export interface PricingTiers {
  farmer_to_distributor: PricingTier;
  distributor_to_retailer: PricingTier;
  retailer_to_customer: PricingTier;
}

export interface PriceRange {
  p25: number;
  median: number;
  p75: number;
  recent_median?: number;
}

export interface MarketTrends {
  data_points: number;
  date_range: {
    from: string;
    to: string;
  };
  price_range: PriceRange;
}

export interface Recommendations {
  optimal_profit_margin: number;
  optimal_distributor_markup: number;
  notes: string[];
}

export interface ModelInfo {
  estimator: string;
  assumptions: string;
  warnings: string[];
}

export interface PricePredictionResult {
  crop_name: string;
  quantity_kg: number;
  location: string;
  weather_summary?: string;
  market_price: MarketPrice;
  pricing_tiers: PricingTiers;
  recommendations: Recommendations;
  market_trends: MarketTrends;
  model_info: ModelInfo;
}

export interface PricePredictionError {
  error: string;
}

class PricePredictionApi {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async predictPrice(request: PricePredictionRequest): Promise<PricePredictionResult> {
    return this.makeRequest<PricePredictionResult>('/predict-price/', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health/`);
      return response.ok;
    } catch (error) {
      console.error('API health check failed:', error);
      return false;
    }
  }

  async getCropTypes(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/crop-types/`);
    if (!response.ok) {
      throw new Error('Failed to fetch crop types');
    }
    const data = await response.json();
    return data.crop_types || [];
  }
}

export const pricePredictionApi = new PricePredictionApi();
