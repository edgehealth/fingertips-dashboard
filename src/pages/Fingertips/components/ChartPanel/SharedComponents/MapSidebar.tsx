// SharedComponents/MapSidebar.tsx - Tasks 6/7/8: Unified cohesive sidebar
import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface MapSidebarProps {
  selectedMetric: string | null;
  selectedICB: string | null;
  selectedICBName: string | null | undefined;
  currentValue?: number;
  averageValue?: number;
  valueRange: { min: number; max: number } | null;
}

const MapSidebar: React.FC<MapSidebarProps> = ({
  selectedMetric,
  selectedICB,
  selectedICBName,
  currentValue,
  averageValue,
  valueRange,
}) => {
  // Calculate position of selected ICB on the scale
  const getSelectedICBPosition = () => {
    if (!selectedICB || currentValue === undefined || !valueRange) {
      return null;
    }
    const { min, max } = valueRange;
    if (max <= min) return null;
    const normalizedValue = (currentValue - min) / (max - min);
    return Math.max(0, Math.min(1, normalizedValue)) * 100;
  };

  const selectedPosition = getSelectedICBPosition();
  const displayValue = currentValue !== undefined ? currentValue : averageValue;
  const isICBSelected = selectedICB && currentValue !== undefined;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px',
        backgroundColor: '#fafbfc',
        borderRadius: '16px',
        border: '1px solid #e1e8ed',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Metric Title Section */}
      {selectedMetric && (
        <Box
          sx={{
            padding: '12px 16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e1e8ed',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <TrendingUpIcon sx={{ fontSize: '16px', color: '#6c63ff' }} />
            <Typography variant="caption" sx={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
              Selected Metric
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#2C3E50', fontWeight: 600, fontSize: '14px', lineHeight: 1.4 }}>
            {selectedMetric}
          </Typography>
        </Box>
      )}

      {/* Value Display Section */}
      <Box
        sx={{
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e1e8ed',
          textAlign: 'center',
        }}
      >
        {/* ICB Name if selected */}
        {isICBSelected && selectedICBName && (
          <Box
            sx={{
              mb: 2,
              pb: 2,
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <Typography variant="caption" sx={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, display: 'block', mb: 0.5 }}>
              Selected ICB
            </Typography>
            <Typography variant="body2" sx={{ color: '#E91E63', fontWeight: 600, fontSize: '13px' }}>
              {selectedICBName}
            </Typography>
          </Box>
        )}

        {/* The Value */}
        {displayValue !== undefined ? (
          <>
            <Typography
              variant="h3"
              sx={{
                color: isICBSelected ? '#E91E63' : '#4ECDC4',
                fontWeight: 700,
                fontSize: '48px',
                lineHeight: 1,
                mb: 1,
              }}
            >
              {displayValue.toFixed(1)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#999',
                fontSize: '11px',
                display: 'block',
              }}
            >
              {isICBSelected ? 'ICB Value' : 'England Average'}
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h3" sx={{ color: '#999', fontSize: '48px', lineHeight: 1 }}>
              --
            </Typography>
            <Typography variant="caption" sx={{ color: '#999', fontSize: '11px', display: 'block', mt: 1 }}>
              No data available
            </Typography>
          </>
        )}
      </Box>

      {/* Color Scale Section */}
      {valueRange && valueRange.min !== null && valueRange.max !== null && (
        <Box
          sx={{
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e1e8ed',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#2C3E50', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Color Scale
            </Typography>
            <Tooltip title="Colors represent values across all ICBs for this metric. Lighter = lower, darker = higher" arrow>
              <InfoOutlinedIcon sx={{ fontSize: '14px', color: '#999', cursor: 'help' }} />
            </Tooltip>
          </Box>

          {/* Gradient Bar with Pink Indicator */}
          <Box sx={{ mb: 1.5, position: 'relative' }}>
            <Box
              sx={{
                width: '100%',
                height: '12px',
                background: 'linear-gradient(to right, hsl(246, 65%, 75%), hsl(246, 65%, 57.5%), hsl(246, 65%, 40%))',
                borderRadius: '6px',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            />

            {/* Pink indicator for selected ICB */}
            {selectedPosition !== null && (
              <Box
                sx={{
                  position: 'absolute',
                  left: `${selectedPosition}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '18px',
                  height: '18px',
                  backgroundColor: '#E91E63',
                  border: '2px solid white',
                  borderRadius: '4px',
                  boxShadow: '0 2px 6px rgba(233, 30, 99, 0.4)',
                  zIndex: 10,
                }}
              />
            )}
          </Box>

          {/* Min/Max Labels */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Box>
              <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 700, color: '#2C3E50', display: 'block' }}>
                {valueRange.min.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '9px', color: '#999' }}>
                Lowest
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 700, color: '#2C3E50', display: 'block' }}>
                {valueRange.max.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '9px', color: '#999' }}>
                Highest
              </Typography>
            </Box>
          </Box>

          {/* England Average Indicator */}
          {averageValue !== undefined && (
            <Box
              sx={{
                mt: 1.5,
                pt: 1.5,
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: '12px', height: '3px', backgroundColor: '#4ECDC4', borderRadius: '2px' }} />
                <Typography variant="caption" sx={{ fontSize: '11px', color: '#666' }}>
                  England Average
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 600, color: '#4ECDC4' }}>
                {averageValue.toFixed(1)}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Info Box */}
      <Box
        sx={{
          padding: '12px 16px',
          backgroundColor: '#f0f7ff',
          borderRadius: '12px',
          border: '1px solid #d4e7ff',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <InfoOutlinedIcon sx={{ fontSize: '16px', color: '#6c63ff', flexShrink: 0, mt: 0.2 }} />
          <Box>
            <Typography variant="caption" sx={{ fontSize: '11px', color: '#2C3E50', lineHeight: 1.5, display: 'block', mb: 0.5, fontWeight: 600 }}>
              How to use this map
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '10px', color: '#666', lineHeight: 1.5, display: 'block' }}>
              Click on any region to view its specific value. Colors represent performance across all ICBs for the selected metric.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MapSidebar;