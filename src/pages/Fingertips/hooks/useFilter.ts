import { useState, useMemo, useEffect } from 'react';
import { useNHSData } from '../../../context/FingertipsContext';

interface MetricOption {
  id: string;
  name: string;
}

export const useFilter = () => {
  const { data, loading } = useNHSData();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Get available metrics from indicator_name column
  const availableMetrics = useMemo((): MetricOption[] => {
    const uniqueMetrics = data.reduce((acc, item) => {
      if (!acc.find(m => m.name === item.indicator_name)) {
        acc.push({
          id: item.indicator_name,
          name: item.indicator_name
        });
      }
      return acc;
    }, [] as MetricOption[]);
    
    return uniqueMetrics.sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  // Set default metric when data loads
  useEffect(() => {
    if (availableMetrics.length > 0 && !selectedMetric) {
      setSelectedMetric(availableMetrics[0].id);
    }
  }, [availableMetrics, selectedMetric]);

  // Calculate average value for selected metric
  const averageValue = useMemo(() => {
    if (!selectedMetric) return undefined;
    
    const filteredData = data.filter(item => item.indicator_name === selectedMetric);
    
    console.log('=== CALCULATING AVERAGE ===');
    console.log('Selected metric:', selectedMetric);
    console.log('Filtered data count:', filteredData.length);
    
    if (filteredData.length === 0) return undefined;
    
    const sum = filteredData.reduce((acc, item) => acc + item.value, 0);
    const average = sum / filteredData.length;
    
    console.log('Sum:', sum);
    console.log('Average:', average);
    
    return average;
  }, [data, selectedMetric]);

  // Get selected metric details
  const selectedMetricDetails = selectedMetric 
    ? availableMetrics.find(m => m.id === selectedMetric) || null
    : null;

  return {
    // Data
    data,
    
    // Selections
    selectedMetric,
    selectedMetricDetails,
    setSelectedMetric,
    
    // Options
    availableMetrics,
    
    // Results
    averageValue,
    loading,
  };
};