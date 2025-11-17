import { useState, useMemo, useEffect } from 'react';
import { useNHSData } from '../../../context/FingertipsContext';

interface MetricOption {
  id: string;
  name: string;
}

export const useFilter = () => {
  const { data, loading } = useNHSData();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

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

  // Get available years for the selected metric
  const availableYears = useMemo((): string[] => {
    if (!selectedMetric) return [];
    
    const uniqueYears = data
      .filter(item => item.indicator_name === selectedMetric)
      .map(item => item.time_period)
      .filter((year, index, self) => year && self.indexOf(year) === index);
    
    // Sort by time_period_sortable (most recent first)
    return uniqueYears.sort((a, b) => {
      const aData = data.find(d => d.time_period === a && d.indicator_name === selectedMetric);
      const bData = data.find(d => d.time_period === b && d.indicator_name === selectedMetric);
      const aSort = aData?.time_period_sortable || 0;
      const bSort = bData?.time_period_sortable || 0;
      return bSort - aSort; // Most recent first
    });
  }, [data, selectedMetric]);

  // Set default metric when data loads
  useEffect(() => {
    if (availableMetrics.length > 0 && !selectedMetric) {
      setSelectedMetric(availableMetrics[0].id);
    }
  }, [availableMetrics, selectedMetric]);

  // Set default year when metric changes or years load
  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0]); // Most recent year
    }
  }, [availableYears, selectedYear]);

  // Reset year when metric changes
  useEffect(() => {
    if (selectedMetric && availableYears.length > 0) {
      setSelectedYear(availableYears[0]); // Reset to most recent year
    }
  }, [selectedMetric, availableYears]);

  // Get filtered data for current selections (for heatmap)
  const filteredData = useMemo(() => {
    if (!selectedMetric) return {};
    
    const filtered = data.filter(item => 
      item.indicator_name === selectedMetric &&
      item.value !== undefined &&
      item.value !== null &&
      !isNaN(item.value) &&
      (!selectedYear || item.time_period === selectedYear) // Filter by year if selected
    );
    
    // Group by area_code
    const lookup: { [areaCode: string]: number } = {};
    const areaTimeData: { [areaCode: string]: any[] } = {};
    
    // Group data by area code
    filtered.forEach(item => {
      if (!areaTimeData[item.area_code]) {
        areaTimeData[item.area_code] = [];
      }
      areaTimeData[item.area_code].push(item);
    });
    
    // For each area, get the most recent time period (or selected year)
    Object.keys(areaTimeData).forEach(areaCode => {
      const areaData = areaTimeData[areaCode];
      
      if (selectedYear) {
        // If year is selected, use that year's data
        const yearData = areaData.find(d => d.time_period === selectedYear);
        if (yearData) {
          lookup[areaCode] = yearData.value;
        }
      } else {
        // Sort by time_period_sortable (descending) to get most recent first
        const sortedData = areaData.sort((a, b) => {
          const aTime = (a as any).time_period_sortable || 0;
          const bTime = (b as any).time_period_sortable || 0;
          return bTime - aTime; // Most recent first
        });
        
        // Use the most recent data point
        lookup[areaCode] = sortedData[0].value;
      }
    });
    
    return lookup;
  }, [data, selectedMetric, selectedYear]);

  // Calculate value range for heatmap
  const valueRange = useMemo(() => {
    if (!selectedMetric) return { min: 0, max: 100 };
    
    const values = data
      .filter(item => 
        item.indicator_name === selectedMetric &&
        item.value !== undefined &&
        item.value !== null &&
        !isNaN(item.value) &&
        (!selectedYear || item.time_period === selectedYear)
      )
      .map(item => item.value);
    
    if (values.length === 0) return { min: 0, max: 100 };
    
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }, [data, selectedMetric, selectedYear]);

  // Calculate average value for selected metric and year
  const averageValue = useMemo(() => {
    if (!selectedMetric) return undefined;
    
    const filteredData = data.filter(item => 
      item.indicator_name === selectedMetric &&
      item.value !== undefined &&
      item.value !== null &&
      !isNaN(item.value) &&
      (!selectedYear || item.time_period === selectedYear)
    );
    
    if (filteredData.length === 0) return undefined;
    
    const sum = filteredData.reduce((acc, item) => acc + item.value, 0);
    return sum / filteredData.length;
  }, [data, selectedMetric, selectedYear]);

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
    selectedYear,
    setSelectedYear,
    
    // Options
    availableMetrics,
    availableYears,
    
    // Results
    averageValue,
    valueRange,
    getValueForArea,
    getAreaName,
    
    loading,
  };
};