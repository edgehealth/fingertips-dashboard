// ChartPanel.tsx - Refactored with two main containers
import React from 'react';
import { Box } from '@mui/material';
import MapContainer from './Petals/MapContainer';
import SidebarContainer from './Petals/SidebarContainer';
import { useFilter } from '../../hooks/useFilter';
import { useMap } from '../../../Fingertips/hooks/useMap';

const ChartPanel: React.FC = () => {
  // Lift the filter state up to the parent
  const filterState = useFilter();
  
  // Get the selected ICB from the map
  const { selectedICB, handleICBClick, handleICBHover, handleICBLeave } = useMap();
  
  // Combine both states
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
        gridTemplateColumns: '2fr 1fr',
        gap: '1.5rem',
        height: '50rem',
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '1rem',
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