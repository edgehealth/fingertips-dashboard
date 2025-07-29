// Fingertips API Response Types

export interface FingertipsApiResponse {
  AgeId: number;
  SexId: number;
  IndicatorId: number;
  AreaCode: string;
  Denom: number;
  Denom2: number;
  Year: number;
  YearRange: number;
  Quarter: number;
  Month: number;
  Sig: { [key: string]: number };
  CategoryTypeId: number;
  CategoryId: number;
  DataDate: string | null;
  LoCI: number;
  UpCI: number;
  LoCIF: string;
  UpCIF: string;
  LoCI99_8: number;
  UpCI99_8: number;
  LoCI99_8F: string;
  UpCI99_8F: string;
  Val: number;
  ValF: string;
  Count: number;
}

// Transformed data types for our application
export interface DataItem {
  area: string;
  value: number;
  formattedValue: string;
  areaCode: string;
  year: number;
  count: number;
  confidence?: {
    lower: number;
    upper: number;
    lowerFormatted: string;
    upperFormatted: string;
  };
}

export interface Indicator {
  id: string;
  name: string;
  unit?: string;
  description?: string;
  profileId?: string;
  groupId?: string;
}

// API parameters
export interface FingertipsApiParams {
  indicatorId: string;
  sexId?: string; // 1 = Female, 4 = Male
  ageId?: string; // 189 is a common age group
  areaTypeId?: string; // 167 for ICBs
  parentAreaCode?: string; // E92000001 for England
  groupId?: string;
  profileId?: string;
  comparatorId?: string;
  categoryTypeId?: string;
  categoryId?: string;
  yearRange?: string;
}

// Sex mapping
export enum SexId {
  FEMALE = 1,
  MALE = 4,
  PERSONS = 4 // Often both sexes combined use 4
}

// Common area types
export enum AreaTypeId {
  ENGLAND = 6,
  REGION = 6,
  LOCAL_AUTHORITY = 101,
  CCG = 153,
  ICB = 167,
  GP_PRACTICE = 7
}

// API endpoints
export const FINGERTIPS_ENDPOINTS = {
  SINGLE_INDICATOR_ALL_AREAS: '/api/latest_data/single_indicator_for_all_areas',
  ALL_DATA_BY_INDICATOR: '/api/all_data/json/by_indicator_id',
  AREA_TYPES: '/api/area_types',
  AREAS_BY_TYPE: '/api/areas_by_area_type',
  INDICATOR_METADATA: '/api/indicator_metadata/json/by_indicator_id'
} as const;

// Standard API response wrapper
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}