import { useState, useMemo, useEffect } from 'react';
import { useNHSData } from '../../../context/FingertipsContext';
import { applyIcbCodeAliases } from '../utils/icbCodeAliases';

interface MetricOption {
  id: string;
  name: string;
  category: string;
}

const asNumber = (n: number | null | undefined): number | null =>
  typeof n === 'number' && !isNaN(n) ? n : null;

export interface AreaDetails {
  value: number;
  count: number | null;
  denominator: number | null;
  previousValue: number | null;
  previousPeriod: string | null;
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
          name: item.indicator_name,
          category: item.value_note || 'Other'
        });
      }
      return acc;
    }, [] as MetricOption[]);
    
    return uniqueMetrics.sort((a, b) => {
      const catCompare = a.category.localeCompare(b.category);
      if (catCompare !== 0) return catCompare;
      return a.name.localeCompare(b.name);
    });
  }, [data]);

  const availableYears = useMemo((): string[] => {
    if (!selectedMetric) return [];
    
    const uniqueYears = data
      .filter(item => 
        item.indicator_name === selectedMetric &&
        item.area_code !== 'E92000001' // Exclude England-only data
      )
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
    if (availableMetrics.length === 0) return;
    // Also covers a selection carried over from another section's dataset
    // (the component is not remounted when switching between sections).
    if (!selectedMetric || !availableMetrics.some(m => m.id === selectedMetric)) {
      setSelectedMetric(availableMetrics[0].id);
      setSelectedYear(null);
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

  const areaDetails = useMemo((): { [areaCode: string]: AreaDetails } => {
    if (!selectedMetric || !selectedYear) return {};

    const yearIndex = availableYears.indexOf(selectedYear);
    const previousPeriod =
      yearIndex >= 0 && yearIndex + 1 < availableYears.length
        ? availableYears[yearIndex + 1]
        : null;

    const lookup: { [areaCode: string]: AreaDetails } = {};
    const previousValues: { [areaCode: string]: number } = {};

    data.forEach(item => {
      if (
        item.indicator_name !== selectedMetric ||
        item.value === undefined ||
        item.value === null ||
        isNaN(item.value)
      ) {
        return;
      }

      if (item.time_period === selectedYear) {
        lookup[item.area_code] = {
          value: item.value,
          count: asNumber(item.count),
          denominator: asNumber(item.denominator),
          previousValue: null,
          previousPeriod,
        };
      } else if (previousPeriod && item.time_period === previousPeriod) {
        previousValues[item.area_code] = item.value;
      }
    });

    applyIcbCodeAliases(lookup);
    applyIcbCodeAliases(previousValues);

    Object.entries(lookup).forEach(([areaCode, details]) => {
      if (previousValues[areaCode] !== undefined) {
        details.previousValue = previousValues[areaCode];
      }
    });

    return lookup;
  }, [data, selectedMetric, selectedYear, availableYears]);

  const filteredData = useMemo(() => {
    const lookup: { [areaCode: string]: number } = {};
    Object.entries(areaDetails).forEach(([areaCode, details]) => {
      lookup[areaCode] = details.value;
    });
    return lookup;
  }, [areaDetails]);

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

    // Prefer the actual England value from the data (a population-weighted rate)
    // over a simple mean of the ICB values. The England row is published as
    // area_code E92000001 / area_name "England".
    const englandRow = filteredData.find(item =>
      item.area_code === 'E92000001' ||
      item.area_name?.toLowerCase() === 'england'
    );

    if (englandRow) return englandRow.value;

    // Fallback: no England row present, so approximate with a simple mean of the
    // remaining area values. Note this is unweighted and only an approximation.
    const icbData = filteredData.filter(item =>
      item.area_code !== 'E92000001' &&
      item.area_name?.toLowerCase() !== 'england'
    );

    if (icbData.length === 0) return undefined;

    const sum = icbData.reduce((acc, item) => acc + item.value, 0);
    return sum / icbData.length;
  }, [data, selectedMetric, selectedYear]);

  const selectedMetricDetails = selectedMetric 
    ? availableMetrics.find(m => m.id === selectedMetric) || null
    : null;

  const getValueForArea = (areaCode: string): number | undefined => {
    return filteredData[areaCode];
  };

  const getAreaDetails = (areaCode: string): AreaDetails | undefined => {
    return areaDetails[areaCode];
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
    getAreaDetails,
    getAreaName,
    loading,
  };
};