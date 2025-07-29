// Application-specific types

import { DataItem, Indicator } from './API';

// Application state
export interface FingertipsState {
  data: DataItem[];
  loading: boolean;
  error: string | null;
  selectedIndicator: string;
  selectedSex: string;
  selectedAreaType: string;
  indicators: Indicator[];
  filters: FilterState;
}

// Filter state
export interface FilterState {
  searchTerm: string;
  sortBy: 'value' | 'area' | 'year';
  sortOrder: 'asc' | 'desc';
  showTop: number;
  yearRange: string;
}

// Actions for state management
export type FingertipsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_DATA'; payload: DataItem[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SELECTED_INDICATOR'; payload: string }
  | { type: 'SET_SELECTED_SEX'; payload: string }
  | { type: 'SET_SELECTED_AREA_TYPE'; payload: string }
  | { type: 'SET_INDICATORS'; payload: Indicator[] }
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'RESET_FILTERS' };

// Chart configuration
export interface ChartConfig {
  height: number;
  showGrid: boolean;
  colorScheme: 'blue' | 'green' | 'red' | 'purple' | 'nhs';
  showConfidenceIntervals: boolean;
  maxBars: number;
}

// NHS-specific data mappings for the 10 Year Plan
export interface NHSPlanMetric {
  indicatorId: string;
  name: string;
  category: 'prevention' | 'digital' | 'community' | 'inequality' | 'access';
  targetDirection: 'higher' | 'lower'; // Whether higher or lower values are better
  nhsPlanGoal?: string;
  currentTarget?: number;
  targetYear?: number;
}

// Dashboard view types
export type DashboardView = 'overview' | 'comparison' | 'trends' | 'map';

// Export configuration for different formats
export interface ExportConfig {
  format: 'csv' | 'excel' | 'pdf' | 'png';
  includeMetadata: boolean;
  includeFilters: boolean;
  dateRange?: string;
}