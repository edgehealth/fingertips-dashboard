// hooks/useICBData.ts
import { useState, useEffect, useMemo } from 'react';
import type { 
  ICBDataPoint, 
  ProcessedData, 
  MetricOption, 
  ICBDataHookReturn,
  ValueRange,
  CurrentYearData } from '../../../types/types'

export const useICBData = (): ICBDataHookReturn => {
  const [rawData, setRawData] = useState<ICBDataPoint[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    // Replace this with your actual data loading
    // For now, using mock data structure
    const loadData = async () => {
      try {
        // This would be your actual API call or data import
        const mockData: ICBDataPoint[] = [
          // Your paste.txt data would go here
          // For now, I'll assume it's loaded from somewhere
        ];
        setRawData(mockData);
        
        // Set default metric and year
        if (mockData.length > 0) {
          const firstMetric = mockData[0].indicator_id;
          setSelectedMetric(firstMetric);
          
          const latestYear = Math.max(...mockData.map(d => d.time_period_sortable));
          const latestYearString = mockData.find(d => d.time_period_sortable === latestYear)?.time_period || '';
          setSelectedYear(latestYearString);
        }
      } catch (error) {
        console.error('Error loading ICB data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Get available metrics
  const availableMetrics = useMemo((): MetricOption[] => {
    const uniqueMetrics = rawData.reduce((acc, item) => {
      if (!acc.find(m => m.id === item.indicator_id)) {
        acc.push({
          id: item.indicator_id,
          name: item.indicator_name
        });
      }
      return acc;
    }, [] as MetricOption[]);
    
    return uniqueMetrics.sort((a, b) => a.name.localeCompare(b.name));
  }, [rawData]);

  // Get available years for selected metric
  const availableYears = useMemo((): string[] => {
    if (!selectedMetric) return [];
    
    const years = rawData
      .filter(item => item.indicator_id === selectedMetric)
      .map(item => item.time_period)
      .filter((year, index, arr) => arr.indexOf(year) === index)
      .sort((a, b) => {
        const aSort = rawData.find(d => d.time_period === a)?.time_period_sortable || 0;
        const bSort = rawData.find(d => d.time_period === b)?.time_period_sortable || 0;
        return bSort - aSort; // Most recent first
      });
    
    return years;
  }, [rawData, selectedMetric]);

  // Process data for current selections
  const processedData = useMemo((): ProcessedData => {
    if (!selectedMetric) return {};
    
    const filtered = rawData.filter(item => item.indicator_id === selectedMetric);
    
    const processed: ProcessedData = {};
    
    filtered.forEach(item => {
      if (!processed[item.area_code]) {
        processed[item.area_code] = {};
      }
      processed[item.area_code][item.time_period] = item.value;
    });
    
    return processed;
  }, [rawData, selectedMetric]);

  // Get current year data for heatmap
  const currentYearData = useMemo((): CurrentYearData => {
    if (!selectedYear || !selectedMetric) return {};
    
    const yearData: CurrentYearData = {};
    
    rawData
      .filter(item => 
        item.indicator_id === selectedMetric && 
        item.time_period === selectedYear
      )
      .forEach(item => {
        yearData[item.area_code] = item.value;
      });
    
    return yearData;
  }, [rawData, selectedMetric, selectedYear]);

  // Calculate value ranges for color scaling
  const valueRange = useMemo((): ValueRange => {
    if (!selectedMetric) return { min: 0, max: 100 };
    
    const values = rawData
      .filter(item => item.indicator_id === selectedMetric)
      .map(item => item.value);
    
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }, [rawData, selectedMetric]);

  // Calculate average for selected metric across all years
  const calculateAverage = (areaCode: string): number => {
    if (!selectedMetric) return 0;
    
    const areaData = rawData.filter(item => 
      item.area_code === areaCode && 
      item.indicator_id === selectedMetric
    );
    
    if (areaData.length === 0) return 0;
    
    const sum = areaData.reduce((acc, item) => acc + item.value, 0);
    return sum / areaData.length;
  };

  return {
    // Data
    rawData,
    processedData,
    currentYearData,
    
    // Selections
    selectedMetric,
    selectedYear,
    setSelectedMetric,
    setSelectedYear,
    
    // Options
    availableMetrics,
    availableYears,
    
    // Utilities
    valueRange,
    calculateAverage,
    loading,
  };
};