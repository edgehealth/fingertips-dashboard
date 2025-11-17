// utils/dateUtils.ts

/**
 * Sorts time periods in descending order (newest first)
 * Handles formats like "2023/24", "2022/23", etc.
 * @param timePeriods - Array of time period strings
 * @returns Sorted array with newest periods first
 */
export const sortTimePeriodsDescending = (timePeriods: string[]): string[] => {
  return [...timePeriods].sort((a, b) => {
    // Extract the first year from format like "2012/13"
    const yearA = parseInt(a.split('/')[0]);
    const yearB = parseInt(b.split('/')[0]);
    return yearB - yearA; // Descending order (newest first)
  });
};

/**
 * Sorts time periods in ascending order (oldest first)
 * @param timePeriods - Array of time period strings
 * @returns Sorted array with oldest periods first
 */
export const sortTimePeriodsAscending = (timePeriods: string[]): string[] => {
  return [...timePeriods].sort((a, b) => {
    const yearA = parseInt(a.split('/')[0]);
    const yearB = parseInt(b.split('/')[0]);
    return yearA - yearB; // Ascending order (oldest first)
  });
};