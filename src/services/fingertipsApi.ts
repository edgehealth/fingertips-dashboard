const API_BASE_URL = process.env.REACT_APP_DASH_API_BASE_URL;
const API_KEY = process.env.REACT_APP_DASH_API_KEY;

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

const fetchFromApi = async <T>(endpoint: string): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}?code=${API_KEY}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

export const apiService = {
  getIndicatorData: (): Promise<IndicatorDataResponse> => 
    fetchFromApi('/indicators'),

  getIndicatorMetadata: (): Promise<IndicatorMetadataResponse> => 
    fetchFromApi('/indicator_metadata'),
};