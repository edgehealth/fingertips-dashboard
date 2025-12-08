// Fingertips.tsx
import React from 'react';
import { Box } from '@mui/material';
import HeaderContainer from '../Fingertips/components/HeaderBanner/HeaderContainer';
import ChartPanel from './components/ChartPanel/ChartPanel';

const Fingertips: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: {
          xs: 'auto',
          lg: '100vh',
        },
        backgroundColor: '#f0e0fb',
        display: 'flex',
        flexDirection: 'column',
        overflow: {
          xs: 'auto',
          lg: 'hidden',
        },
      }}
    >
      <HeaderContainer />
      <Box
        sx={{
          padding: {
            xs: '0.5rem',
            sm: '0.75rem',
            lg: '1.5rem',
          },
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ChartPanel />
      </Box>
    </Box>
  );
};

export default Fingertips;