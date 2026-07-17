import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors, typography } from '../../../../../theme';

interface TitleTextProps {
  mainTitle?: string;
  subtitle?: string;
  workInProgress?: boolean;
}

const TitleText: React.FC<TitleTextProps> = ({
  mainTitle = "Edge Health",
  subtitle = "Children & Young People Health",
  workInProgress = false
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
      {workInProgress && (
        <Box
          component="span"
          sx={{
            ml: '1rem',
            px: '0.625rem',
            py: '0.25rem',
            borderRadius: '0.375rem',
            backgroundColor: colors.secondary.orange,
            color: colors.primary.darkBlue,
            fontFamily: typography.fonts.body,
            fontSize: typography.fontSizes.sm,
            fontWeight: typography.fontWeights.bold,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}
        >
          🚧 Work in Progress
        </Box>
      )}
    </Box>
  );
};

export default TitleText;