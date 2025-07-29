import React from 'react';
import { Box } from '@mui/material';
import Logo from './components/Logo';
import TitleText from './components/TitleText';
import Filters from '../FilterPanel/Filters';
import { colors } from '../../../../theme';

console.log('Filters component:', Filters); // Add this line

const HeaderContainer: React.FC = () => {
  return (
    <Box
      sx={{
        padding: '0.5rem',
        backgroundColor: colors.primary.darkBlue,
        borderTopRightRadius: '24px',
        borderBottomLeftRadius: '24px',
        borderTopLeftRadius: '0',
        borderBottomRightRadius: '0',
        boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {/* Logo section */}
        <Logo />
        
        {/* Title section - takes up remaining space */}
        <TitleText />
        
        {/* Filters section */}
        <Filters />
      </Box>
    </Box>
  );
};

export default HeaderContainer;