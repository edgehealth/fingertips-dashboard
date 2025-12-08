// ChartPanel.tsx
import React from 'react';
import { Box } from '@mui/material';
import MapContainer from './Petals/MapContainer';
import SidebarContainer from './Petals/SidebarContainer';
import { useFilter } from '../../hooks/useFilter';
import { useMap } from '../../../Fingertips/hooks/useMap';

const ChartPanel: React.FC = () => {
  const filterState = useFilter();
  const { selectedICB, handleICBClick, handleICBHover, handleICBLeave } = useMap();
  
  const combinedState = {
    ...filterState,
    selectedICB,
    handleICBClick,
    handleICBHover,
    handleICBLeave,
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',           // Mobile & tablet: single column
          lg: '1fr 1fr',       // Small desktop: equal columns
          xl: '2fr 1fr',       // Large desktop: map takes 2/3
        },
        gap: {
          xs: '1rem',
          lg: '1.5rem',
        },
        height: {
          xs: 'auto',
          lg: '50rem',
        },
        minHeight: {
          xs: '100vh',
          lg: 'auto',
        },
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        padding: {
          xs: '0.5rem',
          sm: '0.75rem',
          lg: '1rem',
        },
      }}
    >
      {/* Left side - Large map container */}
      <MapContainer filterState={combinedState} />

      {/* Right side - Sidebar with controls and chart */}
      <SidebarContainer filterState={combinedState} />
    </Box>
  );
};

export default ChartPanel;