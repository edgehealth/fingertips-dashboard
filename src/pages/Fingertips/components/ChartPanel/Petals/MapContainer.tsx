// MapContainer.tsx - Task 3: Using extracted legend component
import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FreshICBMap from '../Charts/ICBMap';
import MetricCard from '../SharedComponents/MetricCard';
import MapColorLegend from '../Charts/MapColorLegend';

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
  
  const currentValue = selectedICB ? getValueForArea(selectedICB) : undefined;
  const selectedRegionName = selectedICB ? getAreaName(selectedICB) : undefined;
  
  const displayValue = currentValue !== undefined ? currentValue : averageValue;
  const displayLabel = selectedICB ? selectedRegionName : "Average across all areas";

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '0px 80px 0px 80px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '2px solid #161658ff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
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
          padding: '10px 20px',
          flexShrink: 0,
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
            marginLeft: '8px',
            '&:hover': {
              color: '#5850d6',
            },
          }}
          titleAccess="Click on any Integrated Care Board to view detailed metrics. Colors represent performance relative to England average."
        />
      </Box>

      {/* Metric Name */}
      {selectedMetricDetails && (
        <Box
          sx={{
            margin: '0 10px 10px 10px',
            padding: '8px 12px',
            flexShrink: 0,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: '#2C3E50',
              fontWeight: 600,
              fontSize: '18px',
            }}
          >
            {selectedMetric}
          </Typography>
        </Box>
      )}

      {/* Main Content - Side by Side */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          gap: '20px',
          padding: '0 20px 20px 20px',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* Left Column - Metric Card + Legend */}
        <Box
          sx={{
            flexShrink: 0,
            width: '320px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Metric Card */}
          <Box sx={{ flexShrink: 0 }}>
            <MetricCard
              displayValue={displayValue}
              displayLabel={displayLabel}
            />
          </Box>

          {/* Color Legend - Now extracted component with pink indicator */}
          <MapColorLegend
            valueRange={valueRange}
            selectedICB={selectedICB}
            selectedICBValue={currentValue}
          />
        </Box>

        {/* Map - Takes remaining space */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <FreshICBMap filterState={filterState} />
        </Box>
      </Box>
    </Box>
  );
};

export default MapContainer;