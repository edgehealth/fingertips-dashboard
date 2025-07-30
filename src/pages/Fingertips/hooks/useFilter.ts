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

  // Get filtered data for current selections (for heatmap)
  const filteredData = useMemo(() => {
    if (!selectedMetric) return {};
    
    const filtered = data.filter(item => item.indicator_name === selectedMetric);
    
    // Create lookup by area_code
    const lookup: { [areaCode: string]: number } = {};
    filtered.forEach(item => {
      lookup[item.area_code] = item.value;
    });
    
    return lookup;
  }, [data, selectedMetric]);

  // Calculate value range for heatmap
  const valueRange = useMemo(() => {
    if (!selectedMetric) return { min: 0, max: 100 };
    
    const values = data
      .filter(item => item.indicator_name === selectedMetric)
      .map(item => item.value);
    
    if (values.length === 0) return { min: 0, max: 100 };
    
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }, [data, selectedMetric]);

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

  // Get value for specific area (for heatmap)
  const getValueForArea = (areaCode: string): number | undefined => {
    return filteredData[areaCode];
  };

  // Get area name for area code
  const getAreaName = (areaCode: string): string | undefined => {
    const item = data.find(d => d.area_code === areaCode);
    return item?.area_name;
  };

  return {
    // Data
    data,
    filteredData,
    
    // Selections
    selectedMetric,
    selectedMetricDetails,
    setSelectedMetric,
    
    // Options
    availableMetrics,
    
    // Results
    averageValue,
    valueRange,
    getValueForArea,
    getAreaName,
    loading,
  };
};