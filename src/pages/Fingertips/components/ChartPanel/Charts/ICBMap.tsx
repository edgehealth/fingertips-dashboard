import React from 'react';
import { Box, Typography } from '@mui/material';
import { useMap } from '../../../../Fingertips/hooks/useMap';

const ICBMap: React.FC = () => {
  const {
    loading,
    geoData,
    hoveredICB,
    selectedICB,
    mapBounds,
    coordinatesToPath,
    handleICBClick,
    handleICBHover,
    handleICBLeave,
    getRegionColor,
  } = useMap();

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        color: 'text.secondary'
      }}>
        <Typography>Loading map...</Typography>
      </Box>
    );
  }

  if (!mapBounds || geoData.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        color: 'text.secondary'
      }}>
        <Typography>No map data available</Typography>
      </Box>
    );
  }

  const selectedRegion = selectedICB ? geoData.find(f => f.properties.icb23cd === selectedICB) : null;
  const selectedName = selectedRegion?.properties.icb23nm || '';

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
      {/* SVG MAP */}
      <div style={{ flex: 1, position: 'relative' }}>
        {hoveredICB && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '6px 12px',
            fontSize: '14px',
            borderRadius: '4px',
            zIndex: 1000,
            pointerEvents: 'none'
          }}>
            {hoveredICB}
          </div>
        )}

        <svg
          width="100%"
          height="100%"
          viewBox="0 0 500 600"
          preserveAspectRatio="xMidYMid meet"
          style={{ background: 'transparent' }}
        >
          {geoData.map((feature, index) => {
            const pathData = coordinatesToPath(feature.geometry.coordinates);
            const icbCode = feature.properties.icb23cd;
            const icbName = feature.properties.icb23nm;
            
            if (!pathData) return null;
            
            return (
              <path
                key={`${icbCode}-${index}`}
                d={pathData}
                fill={getRegionColor(icbCode)}
                stroke="#2C3E50"
                strokeWidth="0.5"
                style={{ 
                  cursor: 'pointer',
                  transition: 'fill 0.2s ease, opacity 0.2s ease',
                  opacity: hoveredICB && hoveredICB !== icbName ? 0.7 : 1,
                }}
                onMouseEnter={() => handleICBHover(icbName)}
                onMouseLeave={handleICBLeave}
                onClick={() => handleICBClick(icbCode, icbName)}
              />
            );
          })}
        </svg>
      </div>

      {/* TEXT BELOW SVG */}
      <div style={{
        textAlign: 'center',
        padding: '8px 0',
        minHeight: '24px'
      }}>
        <Typography
          variant="body2"
          sx={{
            color: selectedICB ? '#E91E63' : '#666',
            fontWeight: selectedICB ? 600 : 400,
            fontSize: selectedICB ? '16px' : '14px',
            fontStyle: selectedICB ? 'normal' : 'italic',
          }}
        >
          {selectedICB ? selectedName : 'Click an area to select'}
        </Typography>
      </div>
    </div>
  );
};

export default ICBMap;