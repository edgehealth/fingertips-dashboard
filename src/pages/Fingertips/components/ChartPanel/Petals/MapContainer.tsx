// MapContainer.tsx
import React, { useState } from 'react';
import { Box, Typography, Drawer, IconButton, useMediaQuery, useTheme } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FreshICBMap from '../Charts/ICBMap';
import MapSidebar from '../SharedComponents/MapSidebar';

interface FilterState {
  selectedMetric: string | null;
  selectedICB: string | null;
  averageValue: number | undefined;
  getValueForArea: (areaCode: string) => number | undefined;
  getAreaName: (areaCode: string) => string | undefined;
  valueRange: { min: number; max: number } | null;
  handleICBClick: (icbCode: string, icbName: string) => void;
  handleICBHover: (icbName: string) => void;
  handleICBLeave: () => void;
}

interface MapContainerProps {
  filterState: FilterState;
}

const MapContainer: React.FC<MapContainerProps> = ({ filterState }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const { 
    selectedMetric, 
    selectedICB,
    averageValue, 
    getValueForArea, 
    getAreaName,
    valueRange, 
  } = filterState;
  
  const currentValue = selectedICB ? getValueForArea(selectedICB) : undefined;
  const selectedRegionName = selectedICB ? getAreaName(selectedICB) : null;

  const sidebarContent = (
    <MapSidebar
      selectedMetric={selectedMetric}
      selectedICB={selectedICB}
      selectedICBName={selectedRegionName}
      currentValue={currentValue}
      averageValue={averageValue}
      valueRange={valueRange}
    />
  );

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '0px 80px 0px 80px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '2px solid #161658ff',
        height: { xs: '500px', lg: '100%' },
        maxHeight: { lg: '800px' },
        minWidth: 0,
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
          justifyContent: 'space-between',
          padding: { xs: '12px 16px', lg: '16px 20px' },
          flexShrink: 0,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              color: '#2C3E50',
              fontWeight: 600,
              fontSize: { xs: '16px', lg: '18px' },
            }}
          >
            ICB Map
          </Typography>
          <InfoOutlinedIcon
            sx={{
              color: '#6c63ff',
              cursor: 'help',
              fontSize: { xs: '18px', lg: '20px' },
              marginLeft: '8px',
              '&:hover': {
                color: '#5850d6',
              },
            }}
            titleAccess="Click on any Integrated Care Board to view detailed metrics. Colors represent performance relative to England average."
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          gap: { xs: '12px', lg: '16px' },
          padding: { xs: '12px', lg: '16px' },
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        {/* Mobile menu button */}
        {isMobile && (
          <IconButton
            onClick={() => setDrawerOpen(true)}
            aria-label="Open map details"
            sx={{
              backgroundColor: '#6c63ff',
              color: 'white',
              height: '40px',
              '&:hover': {
                backgroundColor: '#5850d6',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        
        {/* Left Sidebar - Hidden on mobile */}
        {!isMobile && (
          <Box
            sx={{
              flexShrink: 0,
              width: { lg: '260px', xl: '300px' },
              minWidth: '240px',
              maxWidth: '300px',
            }}
          >
            {sidebarContent}
          </Box>
        )}

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

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '300px',
            padding: '16px',
            backgroundColor: '#f8f9fa',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, color: '#2C3E50' }}>
            Map Details
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)} aria-label="Close map details">
            <CloseIcon />
          </IconButton>
        </Box>
        {sidebarContent}
      </Drawer>
    </Box>
  );
};

export default MapContainer;