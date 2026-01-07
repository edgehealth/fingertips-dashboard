import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import HeaderContainer from '../Fingertips/components/HeaderBanner/HeaderContainer';
import ChartPanel from './components/ChartPanel/ChartPanel';
import { useNHSData } from '../../context/FingertipsContext';

const Fingertips: React.FC = () => {
  const { loading, error } = useNHSData();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f0e0fb',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#7b2cbf' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f0e0fb',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <h2>Error loading NHS data</h2>
          <p>Please try refreshing the page.</p>
        </Box>
      </Box>
    );
  }

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