import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/fingertipsApi';
import HospitalBedGame from '../pages/Fingertips/components/HospitalBedGame/HospitalBedGame';

export interface NHSDataPoint {
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

export const FingertipsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<NHSDataPoint[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [gameVisible, setGameVisible] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    setGameVisible(true); // Show game when loading starts
    try {
      const response = await apiService.getIndicatorData();
      
      const transformedData: NHSDataPoint[] = response.data.map((item: any) => ({
        area_code: item.area_code,
        area_name: item.area_name,
        value: item.value,
        indicator_name: item.indicator_name,
        time_period: item.time_period,
      }));
      
      setData(transformedData);
      // Don't auto-hide game - let user close it
    } catch (error) {
      console.error('Error loading data from API:', error);
      setError(true);
      // Keep game visible on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <NHSContext.Provider value={{
      data,
      selectedRegion,
      loading,
      error,
      setSelectedRegion,
    }}>
      {/* Always render the dashboard */}
      {children}
      
      {/* Game stays visible once shown, until user closes it */}
      {gameVisible && (
        <HospitalBedGame 
          onRetry={error ? loadData : undefined}
          onClose={() => setGameVisible(false)}
          showCloseButton={true}
          message={
            error 
              ? "Connection lost. Play while we reconnect to the NHS data..."
              : loading
              ? "Loading NHS data. Play while you wait!"
              : "Data loaded! Close this when you're done playing."
          }
        />
      )}
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