import React from 'react';
import { Box } from '@mui/material';

const Filters: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#a855f7',
        '&:hover': {
          backgroundColor: '#9333ea',
        },
        transition: 'background-color 0.2s',
        paddingX: '1.5rem',
        paddingY: '1rem',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        color: 'white',
        fontWeight: 600,
        fontSize: '1.125rem',
      }}
    >
      INDICATOR
    </Box>
  );
};

export default Filters;