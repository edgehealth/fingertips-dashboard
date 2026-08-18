const API_BASE_URL = process.env.REACT_APP_DASH_API_BASE_URL;
const API_KEY = process.env.REACT_APP_DASH_API_KEY;

// API version prefix. The backend serves all routes under /api/v1/...
const API_VERSION = 'v1';

export interface IndicatorData {
  indicator_id: number;
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

export interface Pagination {
  page: number;
  page_size: number;
  total_records: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface IndicatorDataResponse {
  data: IndicatorData[];
  pagination: Pagination;
}

export interface IndicatorMetadata {
  indicator_id: number;
  indicator_name: string;
}

export interface IndicatorMetadataResponse {
  indicators: IndicatorMetadata[];
}

// RFC 7807 problem detail returned by the API on error.
export interface ProblemDetail {
  type?: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  correlationId?: string;
}

// How many records to request per page when paging through a collection.
const PAGE_SIZE = 5000;

const buildUrl = (endpoint: string, params: Record<string, string> = {}): string => {
  const search = new URLSearchParams({ code: API_KEY ?? '', ...params });
  return `${API_BASE_URL}/${API_VERSION}${endpoint}?${search.toString()}`;
};

const fetchJson = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      // The API returns RFC 7807 problem+json on error; surface its detail if present.
      let message = `HTTP error! status: ${response.status}`;
      try {
        const problem = (await response.json()) as ProblemDetail;
        if (problem?.detail) {
          message = `${problem.title ?? 'Error'}: ${problem.detail}`;
          if (problem.correlationId) message += ` (correlationId: ${problem.correlationId})`;
        }
      } catch {
        // response had no JSON body; keep the generic message
      }
      throw new Error(message);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

const fetchPage = (
  endpoint: string,
  params: Record<string, string>,
  page: number
): Promise<PaginatedResponse<IndicatorData>> =>
  fetchJson<PaginatedResponse<IndicatorData>>(
    buildUrl(endpoint, { ...params, page: String(page), page_size: String(PAGE_SIZE) })
  );

/**
 * Fetch every page of a paginated collection endpoint and concatenate the results.
 * The backend caps page_size, so large collections come back across several pages.
 * Page 1 tells us the total page count; the remaining pages are fetched in parallel.
 */
const fetchAllPages = async (
  endpoint: string,
  params: Record<string, string> = {}
): Promise<IndicatorData[]> => {
  const first = await fetchPage(endpoint, params, 1);
  const totalPages = first.pagination?.total_pages ?? 1;
  if (totalPages <= 1) return first.data;

  const rest = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(endpoint, params, i + 2))
  );
  return first.data.concat(...rest.map((response) => response.data));
};

// Datasets already downloaded this session, keyed by category, so switching
// sections never re-fetches. Stores the in-flight promise (not the resolved
// value) so concurrent callers for the same category share a single download.
const indicatorDataCache = new Map<string, Promise<IndicatorDataResponse>>();

export const apiService = {
  getIndicatorData: (category: string): Promise<IndicatorDataResponse> => {
    const cached = indicatorDataCache.get(category);
    if (cached) return cached;

    const request = (async (): Promise<IndicatorDataResponse> => {
      const data = await fetchAllPages('/indicators', { category });
      return {
        data,
        pagination: {
          page: 1,
          page_size: data.length,
          total_records: data.length,
          total_pages: 1,
        },
      };
    })();

    // Don't cache failures — a retry (e.g. remounting the section) should hit the network again.
    request.catch(() => indicatorDataCache.delete(category));

    indicatorDataCache.set(category, request);
    return request;
  },

  getIndicatorMetadata: (): Promise<IndicatorMetadataResponse> =>
    fetchJson<IndicatorMetadataResponse>(buildUrl('/indicator-metadata')),
};
