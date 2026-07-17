import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import HeaderContainer from '../Fingertips/components/HeaderBanner/HeaderContainer';
import ChartPanel from './components/ChartPanel/ChartPanel';
import { useNHSData } from '../../context/FingertipsContext';
import { SectionConfig } from '../../config/sections';
import { colors } from '../../theme';

interface FingertipsProps {
  section: SectionConfig;
}

const Fingertips: React.FC<FingertipsProps> = ({ section }) => {
  const { loading, error } = useNHSData();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: section.backgroundColor,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress sx={{ color: colors.secondary.purple }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: section.backgroundColor,
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
        backgroundColor: section.backgroundColor,
        display: 'flex',
        flexDirection: 'column',
        overflow: {
          xs: 'auto',
          lg: 'hidden',
        },
      }}
    >
      <HeaderContainer section={section} />
      <Box
        component="main"
        id="main-content"
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