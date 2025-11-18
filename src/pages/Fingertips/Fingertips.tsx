import React from 'react';
import { Box } from '@mui/material';
import HeaderContainer from '../Fingertips/components/HeaderBanner/HeaderContainer';
import ChartPanel from './components/ChartPanel/ChartPanel';

const Fingertips: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh', // Changed from 120vh - now fits in viewport
        height: '100vh', // Added to constrain to viewport
        backgroundColor: '#f0e0fb',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden', // Prevent scrolling
      }}
    >
      <HeaderContainer />
      <Box
        sx={{
          padding: { xs: '0.5rem', md: '1.5rem' },
          overflow: 'auto', // Allow scrolling only in this section if needed
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <ChartPanel />
      </Box>
    </Box>
  );
};

export default Fingertips;