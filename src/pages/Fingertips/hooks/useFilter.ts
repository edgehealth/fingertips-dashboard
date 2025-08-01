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
    
    const filtered = data.filter(item => 
      item.indicator_name === selectedMetric &&
      item.value !== undefined &&
      item.value !== null &&
      !isNaN(item.value)
    );
    
    // Group by area_code and get the most recent time period for each area
    const lookup: { [areaCode: string]: number } = {};
    const areaTimeData: { [areaCode: string]: any[] } = {};
    
    // Group data by area code
    filtered.forEach(item => {
      if (!areaTimeData[item.area_code]) {
        areaTimeData[item.area_code] = [];
      }
      areaTimeData[item.area_code].push(item);
    });
    
    // For each area, get the most recent time period
    Object.keys(areaTimeData).forEach(areaCode => {
      const areaData = areaTimeData[areaCode];
      
      // Sort by time_period_sortable (descending) to get most recent first
      const sortedData = areaData.sort((a, b) => {
        const aTime = (a as any).time_period_sortable || 0;
        const bTime = (b as any).time_period_sortable || 0;
        return bTime - aTime; // Most recent first
      });
      
      // Use the most recent data point
      lookup[areaCode] = sortedData[0].value;
    });
    
    return lookup;
  }, [data, selectedMetric]);

  // Calculate value range for heatmap
  const valueRange = useMemo(() => {
    if (!selectedMetric) return { min: 0, max: 100 };
    
    const values = data
      .filter(item => 
        item.indicator_name === selectedMetric &&
        item.value !== undefined &&
        item.value !== null &&
        !isNaN(item.value)
      )
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
    
    const filteredData = data.filter(item => 
      item.indicator_name === selectedMetric &&
      item.value !== undefined &&
      item.value !== null &&
      !isNaN(item.value)
    );
    
    if (filteredData.length === 0) return undefined;
    
    const sum = filteredData.reduce((acc, item) => acc + item.value, 0);
    return sum / filteredData.length;
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