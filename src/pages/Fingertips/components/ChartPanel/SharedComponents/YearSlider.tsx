// components/YearSlider.tsx
import React from 'react';
import { Box, Slider, Typography } from '@mui/material';
import type { YearSliderProps } from '../../../../../types/types';
import { sortTimePeriodsAscending } from '../../../utils/dateUtils';

const YearSlider: React.FC<YearSliderProps> = ({
  availableYears,
  selectedYear,
  onYearChange,
}) => {
  // Sort years using shared utility - MUST be before any conditional returns
  const sortedYears = React.useMemo(() => 
    sortTimePeriodsAscending(availableYears), 
    [availableYears]
  );

  if (availableYears.length === 0) {
    return null;
  }

  // Create year index mapping with sorted years
  const yearToIndex = sortedYears.reduce((acc, year, index) => {
    acc[year] = index;
    return acc;
  }, {} as { [year: string]: number });

  const indexToYear = sortedYears.reduce((acc, year, index) => {
    acc[index] = year;
    return acc;
  }, {} as { [index: number]: string });

  const currentIndex = yearToIndex[selectedYear] || 0;

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const newIndex = Array.isArray(newValue) ? newValue[0] : newValue;
    const newYear = indexToYear[newIndex];
    if (newYear) {
      onYearChange(newYear);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        padding: '12px 0',
        backgroundColor: 'transparent',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          textAlign: 'center',
          marginBottom: '4px',
          fontSize: '11px',
        }}
      >
        Time Period
      </Typography>
      
      <Typography
        variant="h6"
        sx={{
          color: '#2C3E50',
          textAlign: 'center',
          marginBottom: '12px',
          fontWeight: 600,
          fontSize: '14px',
        }}
      >
        {selectedYear}
      </Typography>

      <Box sx={{ px: 1 }}>
        <Slider
          value={currentIndex}
          onChange={handleSliderChange}
          min={0}
          max={sortedYears.length - 1}
          step={1}
          marks={sortedYears.map((year, index) => ({
            value: index,
            label: index % Math.ceil(sortedYears.length / 4) === 0 ? year : '',
          }))}
          sx={{
            color: '#4ECDC4',
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
              backgroundColor: '#4ECDC4',
              '&:hover': {
                boxShadow: '0px 0px 0px 8px rgba(78, 205, 196, 0.16)',
              },
            },
            '& .MuiSlider-track': {
              backgroundColor: '#4ECDC4',
              height: 4,
            },
            '& .MuiSlider-rail': {
              backgroundColor: '#E0E0E0',
              height: 4,
            },
            '& .MuiSlider-mark': {
              backgroundColor: '#BDBDBD',
              height: 6,
              width: 2,
            },
            '& .MuiSlider-markActive': {
              backgroundColor: '#4ECDC4',
            },
            '& .MuiSlider-markLabel': {
              fontSize: '9px',
              color: '#666',
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '4px',
          px: 1,
        }}
      >
        
        <Typography variant="caption" sx={{ color: '#999', fontSize: '9px' }}>
          {sortedYears[0]} (Earliest)
        </Typography>
        <Typography variant="caption" sx={{ color: '#999', fontSize: '9px' }}>
          {sortedYears[sortedYears.length - 1]} (Latest)
        </Typography>
      </Box>
    </Box>
  );
};

export default YearSlider;