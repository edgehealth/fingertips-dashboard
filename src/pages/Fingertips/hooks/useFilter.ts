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

  const availableYears = useMemo((): string[] => {
    if (!selectedMetric) return [];
    
    const uniqueYears = data
      .filter(item => item.indicator_name === selectedMetric)
      .map(item => item.time_period)
      .filter((year, index, self) => year && self.indexOf(year) === index);
    
    return uniqueYears.sort((a, b) => {
      const aData = data.find(d => d.time_period === a && d.indicator_name === selectedMetric);
      const bData = data.find(d => d.time_period === b && d.indicator_name === selectedMetric);
      const aSort = aData?.time_period_sortable || 0;
      const bSort = bData?.time_period_sortable || 0;
      return bSort - aSort;
    });
  }, [data, selectedMetric]);

  useEffect(() => {
    if (availableMetrics.length > 0 && !selectedMetric) {
      setSelectedMetric(availableMetrics[0].id);
    }
  }, [availableMetrics, selectedMetric]);

  useEffect(() => {
    if (availableYears.length > 0 && !selectedYear) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  useEffect(() => {
    if (selectedMetric && availableYears.length > 0) {
      setSelectedYear(availableYears[0]);
    }
  }, [selectedMetric, availableYears]);

  const filteredData = useMemo(() => {
    if (!selectedMetric || !selectedYear) return {};
    
    const filtered = data.filter(item => 
      item.indicator_name === selectedMetric &&
      item.time_period === selectedYear &&
      item.value !== undefined &&
      item.value !== null &&
      !isNaN(item.value)
    );
    
    const lookup: { [areaCode: string]: number } = {};
    
    filtered.forEach(item => {
      lookup[item.area_code] = item.value;
    });
    
    return lookup;
  }, [data, selectedMetric, selectedYear]);

  const valueRange = useMemo(() => {
    if (!selectedMetric || !selectedYear) return { min: 0, max: 100 };
    
    const values = data
      .filter(item => 
        item.indicator_name === selectedMetric &&
        item.time_period === selectedYear &&
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
  }, [data, selectedMetric, selectedYear]);

  const averageValue = useMemo(() => {
    if (!selectedMetric || !selectedYear) return undefined;
    
    const filteredData = data.filter(item => 
      item.indicator_name === selectedMetric &&
      item.time_period === selectedYear &&
      item.value !== undefined &&
      item.value !== null &&
      !isNaN(item.value)
    );
    
    if (filteredData.length === 0) return undefined;
    
    const sum = filteredData.reduce((acc, item) => acc + item.value, 0);
    return sum / filteredData.length;
  }, [data, selectedMetric, selectedYear]);

  const selectedMetricDetails = selectedMetric 
    ? availableMetrics.find(m => m.id === selectedMetric) || null
    : null;

  const getValueForArea = (areaCode: string): number | undefined => {
    return filteredData[areaCode];
  };

  const getAreaName = (areaCode: string): string | undefined => {
    const item = data.find(d => d.area_code === areaCode);
    return item?.area_name;
  };

  return {
    data,
    filteredData,
    selectedMetric,
    selectedMetricDetails,
    setSelectedMetric,
    selectedYear,
    setSelectedYear,
    availableMetrics,
    availableYears,
    averageValue,
    valueRange,
    getValueForArea,
    getAreaName,
    loading,
  };
};