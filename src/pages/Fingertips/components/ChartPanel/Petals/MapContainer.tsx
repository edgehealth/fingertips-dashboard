// MapContainer.tsx - Tasks 6/7/8: Using unified sidebar
import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FreshICBMap from '../Charts/ICBMap';
import MapSidebar from '../SharedComponents/MapSidebar';

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
  const selectedRegionName = selectedICB ? getAreaName(selectedICB) : null;

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
          padding: '16px 20px',
          flexShrink: 0,
          borderBottom: '1px solid #f0f0f0',
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

      {/* Main Content - Side by Side */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          gap: '20px',
          padding: '20px',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {/* Left Sidebar - Unified component */}
        <Box
          sx={{
            flexShrink: 0,
            width: '300px',
          }}
        >
          <MapSidebar
            selectedMetric={selectedMetric}
            selectedICB={selectedICB}
            selectedICBName={selectedRegionName}
            currentValue={currentValue}
            averageValue={averageValue}
            valueRange={valueRange}
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