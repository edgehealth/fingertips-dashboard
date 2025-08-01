import React from 'react';
import { Box, Typography } from '@mui/material';
import { useMap } from '../../../../Fingertips/hooks/useMap';

interface FilterState {
  getValueForArea: (areaCode: string) => number | undefined;
  valueRange: { min: number; max: number } | null;
  selectedMetric: string | null;
  selectedICB: string | null;
  handleICBClick: (icbCode: string, icbName: string) => void;
  handleICBHover: (icbName: string) => void;
  handleICBLeave: () => void;
}

interface ICBMapProps {
  filterState: FilterState;
}

const ICBMap: React.FC<ICBMapProps> = ({ filterState }) => {
  const {
    loading,
    geoData,
    hoveredICB,
    mapBounds,
    coordinatesToPath,
    handleICBHover: mapHover,
    handleICBLeave: mapLeave,
  } = useMap();

  const { 
    getValueForArea, 
    valueRange, 
    selectedICB,
    handleICBClick,
  } = filterState;

  const getRegionColor = (icbCode: string) => {
    if (selectedICB === icbCode) {
      return '#E91E63'; // Pink for selected
    }
    
    if (!getValueForArea || !icbCode) {
      return '#E0E0E0'; // Light gray for no data
    }
    
    const dataValue = getValueForArea(icbCode);
    
    if (dataValue === undefined || dataValue === null || isNaN(dataValue)) {
      return '#E0E0E0';
    }
    
    if (!valueRange || 
        typeof valueRange.min !== 'number' || 
        typeof valueRange.max !== 'number' ||
        isNaN(valueRange.min) || 
        isNaN(valueRange.max)) {
      return '#4ECDC4';
    }
    
    const { min, max } = valueRange;
    
    if (max <= min) {
      return '#4ECDC4';
    }
    
    const normalizedValue = (dataValue - min) / (max - min);
    const clampedValue = Math.max(0, Math.min(1, normalizedValue));
    
    // Create smooth color gradient using HSL
    const hue = 240 - (clampedValue * 240); 
    const saturation = 70;
    const lightness = 60 - (clampedValue * 20);
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

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
            pointerEvents: 'none',
            maxWidth: '200px',
            textAlign: 'center'
          }}>
            {hoveredICB}
            {(() => {
              const hoveredRegion = geoData.find(f => f.properties.icb23nm === hoveredICB);
              const hoveredCode = hoveredRegion?.properties.icb23cd;
              const hoveredValue = hoveredCode && getValueForArea ? getValueForArea(hoveredCode) : undefined;
              
              if (hoveredValue !== undefined && hoveredValue !== null && !isNaN(hoveredValue)) {
                return <div style={{fontSize: '10px', opacity: 0.8}}>Value: {hoveredValue.toFixed(1)}</div>;
              } else {
                return <div style={{fontSize: '10px', opacity: 0.8}}>No data available</div>;
              }
            })()}
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
                onMouseEnter={() => mapHover(icbName)}
                onMouseLeave={mapLeave}
                onClick={() => handleICBClick(icbCode, icbName)}
              />
            );
          })}
        </svg>
      </div>

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
          {selectedICB ? selectedName : 'Interactive map'}
        </Typography>
      </div>
    </div>
  );
};

export default ICBMap;