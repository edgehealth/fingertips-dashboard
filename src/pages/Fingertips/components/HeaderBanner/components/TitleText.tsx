import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors, typography } from '../../../../../theme';

interface TitleTextProps {
  mainTitle?: string;
  subtitle?: string;
}

const TitleText: React.FC<TitleTextProps> = ({
  mainTitle = "Edge Health",
  subtitle = "Children & Young People Health"
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.primary.darkBlue,
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Box
        component="h1"
        sx={{
          color: colors.secondary.white,
          fontFamily: typography.fonts.body,
          margin: 0,
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: typography.fontSizes.xl,
            fontWeight: typography.fontWeights.bold,
          }}
        >
          {mainTitle}
        </Typography>
        {subtitle && (
          <Typography
            component="span"
            sx={{
              fontSize: typography.fontSizes.xl,
              fontWeight: typography.fontWeights.normal,
            }}
          >
            {' | '}{subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TitleText;