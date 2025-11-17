// MapContainer.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FreshICBMap from '../Charts/ICBMap';
import MetricCard from '../SharedComponents/MetricCard';

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
        borderRadius: '0px 100px 0px 100px',
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
            '&:hover': {
              color: '#5850d6',
            },
          }}
          titleAccess="Click on any Integrated Care Board to view detailed metrics. Colors represent performance relative to England average."
        />
      </Box>

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
              selectedMetric={selectedMetricDetails}
              displayValue={displayValue}
              displayLabel={displayLabel}
            />
          </Box>

          {/* Color Legend */}
          <Box 
  sx={{ 
    p: 2, 
    backgroundColor: '#f8f9fa', 
    borderRadius: '12px',
    border: '1px solid rgba(78, 205, 196, 0.2)',
  }}
>
  <Typography 
    variant="caption" 
    sx={{ 
      fontWeight: 600, 
      display: 'block', 
      mb: 1.5,
      color: '#2C3E50',
      fontSize: '12px',
    }}
  >
    Map Color Scale
  </Typography>
  
  {valueRange && valueRange.min !== null && valueRange.max !== null ? (
    <>
      {/* Gradient Bar - MATCHES the fixed HSL gradient exactly */}
      <Box sx={{ mb: 1 }}>
        <Box sx={{ 
          width: '100%', 
          height: '14px', 
          background: 'linear-gradient(to right, hsl(195, 65%, 75%), hsl(195, 65%, 57.5%), hsl(195, 65%, 40%))',
          borderRadius: '6px',
          border: '1px solid rgba(0,0,0,0.1)',
        }} />
      </Box>
      
      {/* Min/Max Values for THIS metric */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 0.5,
        px: 0.5,
      }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="caption" sx={{ fontSize: '13px', fontWeight: 700, color: '#2C3E50', display: 'block' }}>
            {valueRange.min.toFixed(1)}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '9px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Lowest
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="caption" sx={{ fontSize: '13px', fontWeight: 700, color: '#2C3E50', display: 'block' }}>
            {valueRange.max.toFixed(1)}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '9px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Highest
          </Typography>
        </Box>
      </Box>
      
      {/* Explanation */}
      <Typography 
        variant="caption" 
        sx={{ 
          fontSize: '10px', 
          color: '#666',
          display: 'block',
          mt: 1.5,
          lineHeight: 1.4,
          textAlign: 'center',
        }}
      >
        Lighter = lower values, darker = higher values within this metric's range
      </Typography>
    </>
  ) : (
    <Typography variant="caption" sx={{ color: '#999', fontStyle: 'italic', fontSize: '11px' }}>
      Select a metric to view scale
    </Typography>
  )}
  
  {/* Selected ICB Indicator */}
  {selectedICB && (
    <Box sx={{ 
      mt: 2, 
      pt: 2, 
      borderTop: '1px solid rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    }}>
      <Box sx={{
        width: '16px',
        height: '16px',
        backgroundColor: '#E91E63',
        borderRadius: '4px',
        border: '1px solid rgba(0,0,0,0.1)',
      }} />
      <Typography variant="caption" sx={{ fontSize: '11px', color: '#666' }}>
        Selected ICB
      </Typography>
    </Box>
  )}
</Box>
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