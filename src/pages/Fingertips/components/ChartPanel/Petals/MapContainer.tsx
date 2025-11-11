// Containers/MapContainer.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FreshICBMap from '../Charts/ICBMap';
import MetricCard from '../SharedComponents/MetricCard';

// Define the type for the filter state
interface FilterState {
  selectedMetricDetails: { id: string; name: string } | null;
  selectedMetric: string | null;
  selectedICB: string | null;
  averageValue: number | undefined;
  getValueForArea: (areaCode: string) => number | undefined;
  getAreaName: (areaCode: string) => string | undefined;
  valueRange: { min: number; max: number } | null;
  handleICBClick: (icbCode: string, icbName: string) => void;
  handleICBHover: (icbName: string) => void;
  handleICBLeave: () => void;
  loading: boolean;
}

interface MapContainerProps {
  filterState: FilterState;
}

const MapContainer: React.FC<MapContainerProps> = ({ filterState }) => {
  const { 
    selectedMetricDetails, 
    selectedMetric, 
    selectedICB,
    averageValue, 
    getValueForArea, 
    getAreaName,
    valueRange, 
    loading 
  } = filterState;
  
  // Get current value and region name for selected ICB
  const currentValue = selectedICB ? getValueForArea(selectedICB) : undefined;
  const selectedRegionName = selectedICB ? getAreaName(selectedICB) : undefined;
  
  // Decide what to show: selected ICB value or average
  const displayValue = currentValue !== undefined ? currentValue : averageValue;
  const displayLabel = selectedICB ? selectedRegionName : "Average across all areas";

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '0px 100px 0px 100px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '2px solid #161658ff',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          margin: '10px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#2C3E50',
            fontWeight: 600,
            fontSize: '18px',
          }}
        >
          ICB Map
        </Typography>
        <InfoOutlinedIcon
          sx={{
            color: '#6c63ff',
            cursor: 'help',
            fontSize: '20px',
            '&:hover': {
              color: '#5850d6',
            },
          }}
          titleAccess="Click on any Integrated Care Board to view detailed metrics. Colors represent performance relative to England average."
        />
      </Box>

      {/* Metric Card */}
      <Box sx={{ 
          margin: '10px'}}>
        <MetricCard
          selectedMetric={selectedMetricDetails}
          displayValue={displayValue}
          displayLabel={displayLabel}
        />
      </Box>
      
      {/* Map */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 0,
          overflow: 'visible',
        }}
      >
        <FreshICBMap filterState={filterState} />
      </Box>
    </Box>
  );
};

export default MapContainer;