// ChartPanel.tsx - All Four Petals in Flower Layout
import React from 'react';
import { Box } from '@mui/material';
import TopLeftPetal from './Petals/TopLeftPetal';
import TopRightPetal from './Petals/TopRightPetal';
import BottomLeftPetal from './Petals/BottomLeftPetal';
import BottomRightPetal from './Petals/BottomRightPetal';

const ChartPanel: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '90vh', // Taller to fit both rows
        width: '100%',
        maxWidth: '1400px', // Wider for full flower
        margin: '0 auto',
        padding: '1rem',
        paddingTop: '0.5rem',
        gap: '1rem', // Gap between top and bottom rows
      }}
    >
      {/* Top Row */}
      <Box
        sx={{
          display: 'flex',
          gap: '20px', // Restored gap between petals
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          width: '100%',
          marginRight: '170px', // Increased from 150px - just a bit further toward center
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
          <TopLeftPetal />
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
          <TopRightPetal />
        </Box>
      </Box>

      {/* Bottom Row */}
      <Box
        sx={{
          display: 'flex',
          gap: '20px', // Restored gap between petals
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          width: '100%',
          marginLeft: '170px', // Increased from 150px - just a bit further toward center
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