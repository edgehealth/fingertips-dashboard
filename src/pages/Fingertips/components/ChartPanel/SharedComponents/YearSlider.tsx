// components/YearSlider.tsx
import React from 'react';
import { Box, Slider, Typography } from '@mui/material';
import type { YearSliderProps } from '../../../../../types/types';

const YearSlider: React.FC<YearSliderProps> = ({
  availableYears,
  selectedYear,
  onYearChange,
}) => {
  if (availableYears.length === 0) {
    return null;
  }

  // Create year index mapping
  const yearToIndex = availableYears.reduce((acc, year, index) => {
    acc[year] = index;
    return acc;
  }, {} as { [year: string]: number });

  const indexToYear = availableYears.reduce((acc, year, index) => {
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

  // Format year for display (remove "/15" etc if present)
  const formatYear = (year: string) => {
    return year.split('/')[0] || year;
  };

  return (
    <Box
      sx={{
        width: '100%',
        padding: '16px 24px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderTop: '1px solid #E0E0E0',
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          textAlign: 'center',
          marginBottom: '8px',
          fontSize: '12px',
        }}
      >
        Time Period
      </Typography>
      
      <Typography
        variant="h6"
        sx={{
          color: '#2C3E50',
          textAlign: 'center',
          marginBottom: '16px',
          fontWeight: 600,
        }}
      >
        {selectedYear}
      </Typography>

      <Box sx={{ px: 2 }}>
        <Slider
          value={currentIndex}
          onChange={handleSliderChange}
          min={0}
          max={availableYears.length - 1}
          step={1}
          marks={availableYears.map((year, index) => ({
            value: index,
            label: index % Math.ceil(availableYears.length / 4) === 0 ? formatYear(year) : '',
          }))}
          sx={{
            color: '#4ECDC4',
            '& .MuiSlider-thumb': {
              backgroundColor: '#4ECDC4',
              '&:hover': {
                boxShadow: '0px 0px 0px 8px rgba(78, 205, 196, 0.16)',
              },
            },
            '& .MuiSlider-track': {
              backgroundColor: '#4ECDC4',
            },
            '& .MuiSlider-rail': {
              backgroundColor: '#E0E0E0',
            },
            '& .MuiSlider-mark': {
              backgroundColor: '#BDBDBD',
            },
            '& .MuiSlider-markActive': {
              backgroundColor: '#4ECDC4',
            },
            '& .MuiSlider-markLabel': {
              fontSize: '10px',
              color: '#666',
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          px: 2,
        }}
      >
        <Typography variant="caption" sx={{ color: '#999', fontSize: '10px' }}>
          {formatYear(availableYears[availableYears.length - 1])} (Earliest)
        </Typography>
        <Typography variant="caption" sx={{ color: '#999', fontSize: '10px' }}>
          {formatYear(availableYears[0])} (Latest)
        </Typography>
      </Box>
    </Box>
  );
};

export default YearSlider;