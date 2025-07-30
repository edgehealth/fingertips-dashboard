const REACT_APP_DASH_API_BASE_URL = process.env.REACT_APP_DASH_API_BASE_URL;
const REACT_APP_DASH_API_KEY = process.env.REACT_APP_DASH_API_KEY;

export interface IndicatorData {
  indicator_id: number;
  indicator_name: string;
  parent_code: string;
  parent_name: string;
  area_code: string;
  area_name: string;
  area_type: string;
  sex: string;
  age: string;
  time_period: string;
  value: number;
  count: number;
  denominator: number;
  value_note: string | null;
  compared_to_england_value_or_percentiles: string;
  time_period_sortable: number;
  time_period_range: string;
}

export interface IndicatorDataResponse {
  total_records: number;
  data: IndicatorData[];
}

export interface IndicatorMetadata {
  indicator_id: number;
  indicator_name: string;
}

export interface IndicatorMetadataResponse {
  indicators: IndicatorMetadata[];
}

// Simple fetch wrapper with logging
const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  const url = `${REACT_APP_DASH_API_BASE_URL}${endpoint}?code=${REACT_APP_DASH_API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Data received successfully');
    return data;
    
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// API service functions
export const apiService = {
  // Get indicator data
  getIndicatorData: (): Promise<IndicatorDataResponse> => 
    fetchFromApi('/indicators'),

  // Get indicator metadata
  getIndicatorMetadata: (): Promise<IndicatorMetadataResponse> => 
    fetchFromApi('/indicator_metadata'),
};