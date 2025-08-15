import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors, typography } from '../../../../../theme';

interface TitleTextProps {
  mainTitle?: string;
  subtitle?: string;
}

const TitleText: React.FC<TitleTextProps> = ({ 
  mainTitle = "Egde Health",
  subtitle = "Women & Children's Health"

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
        sx={{
          color: colors.secondary.white,
          fontFamily: typography.fonts.body,
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