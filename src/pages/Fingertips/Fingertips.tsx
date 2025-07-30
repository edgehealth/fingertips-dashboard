import React from 'react';
import { Box } from '@mui/material';
import HeaderContainer from '../Fingertips/components/HeaderBanner/HeaderContainer';
import ChartPanel from './components/ChartPanel/ChartPanel';

const Fingertips: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '120vh',
        backgroundColor: '#f0e0fb',
        padding: '1rem',
      }}
    >
      <HeaderContainer />
      <Box
        sx={{
          padding: '1.5rem',
        }}
      >
        <ChartPanel />
      </Box>
    </Box>
  );
};

export default Fingertips;