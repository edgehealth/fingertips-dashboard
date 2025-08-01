import React, { createContext, useContext, useState, useEffect } from 'react';
import mockData from '../data/mockdata.json'; // Import directly

// Simple types
export interface NHSDataPoint {
  area_code: string;
  area_name: string;
  value: number;
  indicator_name: string;
  time_period: string; // Add this field
}

export interface NHSContextType {
  data: NHSDataPoint[];
  selectedRegion: string | null;
  loading: boolean;
  setSelectedRegion: (regionCode: string | null) => void;
}

const NHSContext = createContext<NHSContextType | undefined>(undefined);

export const FingertipsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<NHSDataPoint[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        console.log('Loaded mock data:', mockData); // Debug log
        
        // Transform the data to include time_period
        const transformedData: NHSDataPoint[] = mockData.data.map((item: any) => ({
          area_code: item.area_code,
          area_name: item.area_name,
          value: item.value,
          indicator_name: item.indicator_name,
          time_period: item.time_period || 'Unknown', // Include time_period
        }));
        
        console.log('Transformed data:', transformedData); // Debug log
        setData(transformedData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <NHSContext.Provider value={{
      data,
      selectedRegion,
      loading,
      setSelectedRegion,
    }}>
      {children}
    </NHSContext.Provider>
  );
};

// Export useNHSData hook AFTER the provider
export const useNHSData = () => {
  const context = useContext(NHSContext);
  if (!context) {
    throw new Error('useNHSData must be used within FingertipsProvider');
  }
  return context;
};