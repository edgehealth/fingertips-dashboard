// types/fingertips.types.ts

export interface ICBDataPoint {
  indicator_id: string;
  indicator_name: string;
  parent_code: string;
  parent_name: string;
  area_code: string;
  area_name: string;
  area_type: string;
  sex: string;
  age: string;
  time_period: string;
  value: number;
  count: number;
  denominator: number;
  value_note: string | null;
  compared_to_england_value_or_percentiles: string;
  time_period_sortable: number;
  time_period_range: string;
}

export interface ProcessedData {
  [areaCode: string]: {
    [year: string]: number;
  };
}

export interface MetricOption {
  id: string;
  name: string;
}

export interface ValueRange {
  min: number;
  max: number;
}

export interface CurrentYearData {
  [areaCode: string]: number;
}

export interface GeoFeature {
  type: 'Feature';
  properties: {
    icb23cd: string;
    icb23nm: string;
    geo_point_2d?: {
      lon: number;
      lat: number;
    };
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoJSON {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

export interface MapBounds {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

// Hook return types
export interface ICBDataHookReturn {
  rawData: ICBDataPoint[];
  processedData: ProcessedData;
  currentYearData: CurrentYearData;
  selectedMetric: string | null;
  selectedYear: string;
  setSelectedMetric: (metricId: string) => void;
  setSelectedYear: (year: string) => void;
  availableMetrics: MetricOption[];
  availableYears: string[];
  valueRange: ValueRange;
  calculateAverage: (areaCode: string) => number;
  loading: boolean;
}

export interface MapHookReturn {
  loading: boolean;
  geoData: GeoFeature[];
  hoveredICB: string | null;
  selectedICB: string | null;
  mapBounds: MapBounds | null;
  coordinatesToPath: (coordinates: number[][][] | number[][][][]) => string;
  handleICBClick: (icbCode: string, icbName: string) => void;
  handleICBHover: (icbName: string) => void;
  handleICBLeave: () => void;
  getRegionColor: (icbCode: string, dataValue?: number, valueRange?: ValueRange) => string;
  clearSelection: () => void;
}

// Component prop types
export interface YearSliderProps {
  availableYears: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export interface MetricFilterProps {
  availableMetrics: MetricOption[];
  selectedMetric: string | null;
  onMetricChange: (metricId: string) => void;
}