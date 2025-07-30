// ChartPanel.tsx - All Four Petals in Flower Layout with shared state
import React from 'react';
import { Box } from '@mui/material';
import TopLeftPetal from './Petals/TopLeftPetal';
import TopRightPetal from './Petals/TopRightPetal';
import BottomLeftPetal from './Petals/BottomLeftPetal';
import BottomRightPetal from './Petals/BottomRightPetal';
import { useFilter } from '../../hooks/useFilter';
import { useMap } from '../../../Fingertips/hooks/useMap';

const ChartPanel: React.FC = () => {
  // Lift the filter state up to the parent
  const filterState = useFilter();
  
  // Get the selected ICB from the map
  const { selectedICB, handleICBClick, handleICBHover, handleICBLeave } = useMap();
  
  // ADD THIS DEBUG LOG:
  console.log('=== CHART PANEL DEBUG ===');
  console.log('ChartPanel selectedICB:', selectedICB);
  
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '90vh',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '1rem',
        paddingTop: '0.5rem',
        gap: '1rem',
      }}
    >
      {/* Top Row */}
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          width: '100%',
          marginRight: '170px',
        }}
      >
        {/* Top Left Petal - Biggest */}
        <Box
          sx={{
            width: '800px',
            height: '500px',
            margin: 0,
            padding: 0,
          }}
        >
          <TopLeftPetal filterState={combinedState} />
        </Box>

        {/* Top Right Petal - Medium */}
        <Box
          sx={{
            width: '400px',
            height: '320px',
            margin: 0,
            padding: 0,
          }}
        >
          <TopRightPetal filterState={combinedState} />
        </Box>
      </Box>

      {/* Bottom Row */}
      <Box
        sx={{
          display: 'flex',
          gap: '20px',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          width: '100%',
          marginLeft: '170px',
        }}
      >
        {/* Bottom Left Petal - Medium */}
        <Box
          sx={{
            width: '450px',
            height: '350px',
            margin: 0,
            padding: 0,
          }}
        >
          <BottomLeftPetal />
        </Box>

        {/* Bottom Right Petal - Second Biggest */}
        <Box
          sx={{
            width: '750px',
            height: '450px',
            margin: 0,
            padding: 0,
          }}
        >
          <BottomRightPetal />
        </Box>
      </Box>
    </Box>
  );
};

export default ChartPanel;