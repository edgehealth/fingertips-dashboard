// SharedComponents/MapColorLegend.tsx - Task 3: Add pink box for selected ICB
import React from 'react';
import { Box, Typography } from '@mui/material';

interface MapColorLegendProps {
  valueRange: { min: number; max: number } | null;
  selectedICB: string | null;
  selectedICBValue?: number;
}

const MapColorLegend: React.FC<MapColorLegendProps> = ({
  valueRange,
  selectedICB,
  selectedICBValue,
}) => {
  // Calculate position of selected ICB on the scale (0-100%)
  const getSelectedICBPosition = () => {
    if (!selectedICB || selectedICBValue === undefined || !valueRange) {
      return null;
    }

    const { min, max } = valueRange;
    if (max <= min) return null;

    const normalizedValue = (selectedICBValue - min) / (max - min);
    const clampedValue = Math.max(0, Math.min(1, normalizedValue));
    return clampedValue * 100; // Return as percentage
  };

  const selectedPosition = getSelectedICBPosition();

  return (
    <Box 
      sx={{ 
        p: 2, 
        backgroundColor: '#f8f9fa', 
        borderRadius: '12px',
        border: '1px solid rgba(78, 205, 196, 0.2)',
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          fontWeight: 600, 
          display: 'block', 
          mb: 1.5,
          color: '#2C3E50',
          fontSize: '12px',
        }}
      >
        Map Color Scale
      </Typography>
      
      {valueRange && valueRange.min !== null && valueRange.max !== null ? (
        <>
          {/* Gradient Bar with Pink Indicator */}
          <Box sx={{ mb: 1, position: 'relative' }}>
            <Box sx={{ 
              width: '100%', 
              height: '14px', 
              background: 'linear-gradient(to right, hsl(246, 65%, 75%), hsl(246, 65%, 57.5%), hsl(246, 65%, 40%))',
              borderRadius: '6px',
              border: '1px solid rgba(0,0,0,0.1)',
            }} />
            
            {/* Pink indicator box for selected ICB */}
            {selectedPosition !== null && (
              <Box
                sx={{
                  position: 'absolute',
                  left: `${selectedPosition}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#E91E63',
                  border: '2px solid white',
                  borderRadius: '4px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />
            )}
          </Box>
          
          {/* Min/Max Values */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 0.5,
            px: 0.5,
          }}>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="caption" sx={{ fontSize: '13px', fontWeight: 700, color: '#2C3E50', display: 'block' }}>
                {valueRange.min.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '9px', color: '#767676', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Lowest
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ fontSize: '13px', fontWeight: 700, color: '#2C3E50', display: 'block' }}>
                {valueRange.max.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '9px', color: '#767676', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Highest
              </Typography>
            </Box>
          </Box>
          
          {/* Explanation */}
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '10px', 
              color: '#666',
              display: 'block',
              mt: 1.5,
              lineHeight: 1.4,
              textAlign: 'center',
            }}
          >
            Lighter = lower values, darker = higher values within this metric's range
          </Typography>
        </>
      ) : (
        <Typography variant="caption" sx={{ color: '#767676', fontStyle: 'italic', fontSize: '11px' }}>
          Select a metric to view scale
        </Typography>
      )}
      
      {/* Selected ICB Indicator */}
      {selectedICB && selectedICBValue !== undefined && (
        <Box sx={{ 
          mt: 2, 
          pt: 2, 
          borderTop: '1px solid rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: '16px',
              height: '16px',
              backgroundColor: '#E91E63',
              borderRadius: '4px',
              border: '1px solid rgba(0,0,0,0.1)',
            }} />
            <Typography variant="caption" sx={{ fontSize: '11px', color: '#666' }}>
              Selected ICB
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 600, color: '#E91E63' }}>
            {selectedICBValue.toFixed(1)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapColorLegend;