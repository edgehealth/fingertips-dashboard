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
          xs: '1fr',
          lg: '1fr 1fr',
          xl: '2fr 1fr',
        },
        gap: {
          xs: '0.75rem',
          lg: '1rem',
        },
        flex: 1, // Take available space from parent
        minHeight: 0, // Allow grid to shrink
        width: '100%', // Changed from 97%
        maxWidth: '1600px',
        margin: '0 auto',
        padding: {
          xs: '0.5rem',
          sm: '0.75rem',
          lg: '1rem',
        },
        boxSizing: 'border-box',
      }}
    >
      <MapContainer filterState={combinedState} />
      <SidebarContainer filterState={combinedState} />
    </Box>
  );
};

export default ChartPanel;