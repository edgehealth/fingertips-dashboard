import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors } from '../../../../theme';
import SimpleSVGMap from './Charts/ICBMap'; // Adjust path as needed

const ChartPanel: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '1rem',
        height: '80vh',
        width: '100%',
      }}
    >
      {/* Top Left - UK Map (Biggest petal) */}
      <Box
        sx={{
          gridColumn: '1 / 2',
          gridRow: '1 / 2',
          backgroundColor: 'white',
          borderRadius: '2rem 0.5rem 2rem 0.5rem', // Organic flower petal shape
          padding: '1rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <SimpleSVGMap />
      </Box>

      {/* Top Right - Key Indicator/Stats (Second petal) */}
      <Box
        sx={{
          gridColumn: '2 / 3',
          gridRow: '1 / 2',
          background: `linear-gradient(135deg, ${colors.primary.pink}, ${colors.text.light})`,
          borderRadius: '0.5rem 2rem 0.5rem 2rem', // Organic shape
          padding: '2rem',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
          72.9%
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: '0.5rem', opacity: 0.9 }}>
          Leeds CCG
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.8 }}>
          Breastfeeding at 6-8 Weeks
        </Typography>
        <Box
          sx={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '1rem',
            fontSize: '0.875rem',
          }}
        >
          ↗ 2.3% from last year
        </Box>
      </Box>

      {/* Bottom Left - Chart/Progress (Third petal) */}
      <Box
        sx={{
          gridColumn: '1 / 2',
          gridRow: '2 / 2',
          backgroundColor: 'white',
          borderRadius: '2rem 0.5rem 0.5rem 2rem', // Organic shape
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          position: 'relative',
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            marginBottom: '1.5rem', 
            color: colors.text.primary,
            fontWeight: 600 
          }}
        >
          Progress Over Time
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            marginBottom: '1rem', 
            color: colors.text.secondary 
          }}
        >
          Leeds CCG vs England Average
        </Typography>
        
        {/* Mock chart area */}
        <Box 
          sx={{ 
            height: '200px', 
            background: `linear-gradient(45deg, ${colors.background.secondary}, ${colors.secondary.aquamarine}20)`,
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.text.secondary,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Placeholder for actual chart */}
          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
            Chart Component
          </Typography>
          
          {/* Mock trend lines */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              right: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
            }}
          >
            {[65, 68, 70, 72, 73].map((value, index) => (
              <Box
                key={index}
                sx={{
                  width: '12px',
                  height: `${value}px`,
                  backgroundColor: colors.primary.pink,
                  borderRadius: '2px',
                  opacity: 0.7,
                }}
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ marginTop: '1rem', fontSize: '0.75rem', color: colors.text.secondary }}>
          Latest Performance: 1.6 percentage points below England average
        </Box>
      </Box>

      {/* Bottom Right - Supporting Info (Fourth petal) */}
      <Box
        sx={{
          gridColumn: '2 / 3',
          gridRow: '2 / 2',
          background: `linear-gradient(135deg, ${colors.secondary.aquamarine}, ${colors.accent.info})`,
          borderRadius: '0.5rem 2rem 2rem 0.5rem', // Organic shape
          padding: '2rem',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: '1rem', fontWeight: 600 }}>
          Supporting Families
        </Typography>
        
        <Box sx={{ marginBottom: '1.5rem' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            73
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            out of 100 families have positive outcomes
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '1rem',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
            Supporting families through evidence-based practices and community engagement
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Box
            sx={{
              width: '8px',
              height: '8px',
              backgroundColor: colors.accent.success,
              borderRadius: '50%',
            }}
          />
          <Typography variant="caption">
            Meeting national standards
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ChartPanel;