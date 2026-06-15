import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/fingertipsApi';

export interface NHSDataPoint {
  value_note: string;
  area_code: string;
  area_name: string;
  value: number;
  indicator_name: string;
  time_period: string;
  time_period_sortable?: number;
}

export interface NHSContextType {
  data: NHSDataPoint[];
  selectedRegion: string | null;
  loading: boolean;
  error: boolean;
  setSelectedRegion: (regionCode: string | null) => void;
}

const NHSContext = createContext<NHSContextType | undefined>(undefined);

export const FingertipsProvider: React.FC<{ children: React.ReactNode; category: string }> = ({ children, category }) => {
  const [data, setData] = useState<NHSDataPoint[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [gameVisible, setGameVisible] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    setGameVisible(true);
    try {
      const response = await apiService.getIndicatorData(category);
      
      const transformedData: NHSDataPoint[] = response.data.map((item: any) => ({
        area_code: item.area_code,
        area_name: item.area_name,
        value: item.value,
        indicator_name: item.indicator_name,
        time_period: item.time_period,
        time_period_sortable: item.time_period_sortable,
        value_note: item.value_note || 'Other',
      }));
      
      setData(transformedData);
    } catch (error) {
      console.error('Error loading data from API:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [category]);

  return (
    <NHSContext.Provider value={{
      data,
      selectedRegion,
      loading,
      error,
      setSelectedRegion,
    }}>
      {children}
    </NHSContext.Provider>
  );
};

export const useNHSData = () => {
  const context = useContext(NHSContext);
  if (!context) {
    throw new Error('useNHSData must be used within FingertipsProvider');
  }
  return context;
};