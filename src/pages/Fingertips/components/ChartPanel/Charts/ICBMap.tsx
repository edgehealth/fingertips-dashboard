import React from 'react';
import { Box, Typography } from '@mui/material';
import { useMap } from '../../../../Fingertips/hooks/useMap';

// Define the filter state interface
interface FilterState {
  getValueForArea: (areaCode: string) => number | undefined;
  valueRange: { min: number; max: number } | null;
  selectedMetric: string | null;
  selectedICB: string | null;
  handleICBClick: (icbCode: string, icbName: string) => void;
  handleICBHover: (icbName: string) => void;
  handleICBLeave: () => void;
  // Add other properties as needed
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
    handleICBHover: mapHover,  // Get hover from useMap
    handleICBLeave: mapLeave,  // Get leave from useMap
  } = useMap();

  const { 
    getValueForArea, 
    valueRange, 
    selectedMetric,
    selectedICB,
    handleICBClick,
    handleICBHover,  // From props (for consistency)
    handleICBLeave   // From props (for consistency)
  } = filterState;

  // Add safety check
  console.log('ICBMap filterState:', { getValueForArea: !!getValueForArea, valueRange, selectedMetric, selectedICB });

  // Enhanced color function with smooth HSL gradients and better null handling
  const getRegionColor = (icbCode: string) => {
    if (selectedICB === icbCode) {
      return '#E91E63'; // Pink for selected
    }
    
    // Safety checks
    if (!getValueForArea || !icbCode) {
      return '#E0E0E0'; // Light gray for no data
    }
    
    // Get data value for this area
    const dataValue = getValueForArea(icbCode);
    
    // Enhanced null/undefined checks
    if (dataValue === undefined || dataValue === null || isNaN(dataValue)) {
      return '#E0E0E0'; // Light gray for invalid/missing data
    }
    
    // Check if we have valid range data
    if (!valueRange || 
        typeof valueRange.min !== 'number' || 
        typeof valueRange.max !== 'number' ||
        isNaN(valueRange.min) || 
        isNaN(valueRange.max)) {
      return '#4ECDC4'; // Default teal if no valid range
    }
    
    const { min, max } = valueRange;
    
    // Check for valid range
    if (max <= min) {
      return '#4ECDC4'; // Default teal if invalid range
    }
    
    const normalizedValue = (dataValue - min) / (max - min);
    
    // Clamp normalized value between 0 and 1
    const clampedValue = Math.max(0, Math.min(1, normalizedValue));
    
    // Only log occasionally to avoid spam
    if (Math.random() < 0.05) {
      console.log(`=== HEATMAP DEBUG ===`);
      console.log(`Selected metric: ${selectedMetric}`);
      console.log(`ICB ${icbCode}: value=${dataValue}, min=${min}, max=${max}, normalized=${clampedValue.toFixed(3)}`);
    }
    
    // Create smooth color gradient using HSL
    // Hue: 240 (blue) to 0 (red) - covers blue, cyan, green, yellow, orange, red
    const hue = 240 - (clampedValue * 240); // 240 to 0
    const saturation = 70; // Keep saturation consistent
    const lightness = 60 - (clampedValue * 20); // 60% to 40% lightness for better contrast
    
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
            pointerEvents: 'none',
            maxWidth: '200px',
            textAlign: 'center'
          }}>
            {hoveredICB}
            {(() => {
              // Find the hovered region's code and show its value
              const hoveredRegion = geoData.find(f => f.properties.icb23nm === hoveredICB);
              const hoveredCode = hoveredRegion?.properties.icb23cd;
              const hoveredValue = hoveredCode && getValueForArea ? getValueForArea(hoveredCode) : undefined;
              
              // Enhanced null checking for hover display
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
          {selectedICB ? selectedName : 'Interactive map'}
        </Typography>
      </div>
    </div>
  );
};

export default ICBMap;