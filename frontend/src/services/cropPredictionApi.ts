/**
 * API service for crop quality prediction
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface CropPredictionResult {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    profile: any;
  };
  image: string;
  image_url: string;
  predicted_quality: 'good' | 'bad';
  quality_score: number;
  prediction_confidence: number;
  created_at: string;
}

export interface PredictionError {
  error: string;
  detail?: string;
}

class CropPredictionApi {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('auth_token');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    return headers;
  }

  private async getFormDataHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('auth_token');
    const headers: HeadersInit = {};

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    return headers;
  }

  /**
   * Upload an image and get crop quality prediction
   */
  async predictCropQuality(imageFile: File): Promise<CropPredictionResult> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const headers = await this.getFormDataHeaders();

    const response = await fetch(`${API_BASE_URL}/predict-crop/`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!response.ok) {
      const errorData: PredictionError = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get all predictions for the current user
   */
  async getUserPredictions(): Promise<CropPredictionResult[]> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/my-predictions/`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData: PredictionError = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get a specific prediction by ID
   */
  async getPredictionById(id: number): Promise<CropPredictionResult> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/crop-prediction/${id}/`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData: PredictionError = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Check if the API is available
   */
  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health/`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

export const cropPredictionApi = new CropPredictionApi();
