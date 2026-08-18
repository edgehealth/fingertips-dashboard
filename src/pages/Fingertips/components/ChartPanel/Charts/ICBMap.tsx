import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useMap } from '../../../../Fingertips/hooks/useMap';
import type { AreaDetails } from '../../../hooks/useFilter';

interface FilterState {
  getValueForArea: (areaCode: string) => number | undefined;
  getAreaDetails: (areaCode: string) => AreaDetails | undefined;
  averageValue: number | undefined;
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

const comparisonColor = (value: number, englandValue: number | undefined) =>
  englandValue === undefined || value === englandValue
    ? 'white'
    : value > englandValue
    ? '#81c784'
    : '#e57373';

const formatWhole = (n: number): string =>
  Math.round(n).toLocaleString('en-GB');

const describeTrend = (
  details: { value: number; previousValue: number | null; previousPeriod: string | null }
): string | null => {
  if (details.previousValue === null || !details.previousPeriod) return null;
  const diff = details.value - details.previousValue;
  const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '▬';
  const signed = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}`;
  return `${arrow} ${signed} vs ${details.previousPeriod}`;
};

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
    getAreaDetails,
    averageValue,
    valueRange,
    selectedICB,
    handleICBClick,
  } = filterState;

  const mapFeatures = useMemo(
    () =>
      geoData
        .map(feature => ({
          icbCode: feature.properties.icb23cd,
          icbName: feature.properties.icb23nm,
          pathData: coordinatesToPath(feature.geometry.coordinates),
        }))
        .filter(f => f.pathData),
    [geoData, coordinatesToPath]
  );

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
    return '#7c75b9';
  }
  
  const { min, max } = valueRange;
  
  if (max <= min) {
    return '#7c75b9';
  }
  
  // Calculate normalized value (0 to 1) based on THIS metric's range
  const normalizedValue = (dataValue - min) / (max - min);
  const clampedValue = Math.max(0, Math.min(1, normalizedValue));
  
  // FIXED GRADIENT: Always use the same color scale
  // Light blue → Dark blue (consistent across ALL metrics)
  const hue = 246; // Edge-blue (fixed)
  const saturation = 65; // Fixed saturation
  const lightness = 75 - (clampedValue * 35); // 75% (light) to 40% (dark)
  
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

  const hoveredFeature = hoveredICB
    ? mapFeatures.find(f => f.icbName === hoveredICB)
    : null;
  const hoveredDetails = hoveredFeature ? getAreaDetails(hoveredFeature.icbCode) : undefined;
  const hoveredHasValue = hoveredDetails !== undefined && !isNaN(hoveredDetails.value);
  const hoveredTrend = hoveredHasValue ? describeTrend(hoveredDetails!) : null;

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        {hoveredICB && (
          <div
            role="status"
            style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
              padding: '8px 14px',
            fontSize: '12px',
            borderRadius: '4px',
            zIndex: 1000,
            pointerEvents: 'none',
              maxWidth: '220px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 600, lineHeight: 1.3 }}>{hoveredICB}</div>
            {hoveredHasValue ? (
              <>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    marginTop: '2px',
                    color: comparisonColor(hoveredDetails!.value, averageValue),
                  }}
                >
                  {hoveredDetails!.value.toFixed(1)}
                </div>
                {hoveredTrend && (
                  <div style={{ fontSize: '10px', opacity: 0.9, marginTop: '2px' }}>
                    {hoveredTrend}
                  </div>
                )}
                {hoveredDetails!.count !== null && hoveredDetails!.denominator !== null && (
                  <div style={{ fontSize: '10px', opacity: 0.75, marginTop: '2px' }}>
                    {formatWhole(hoveredDetails!.count)} of {formatWhole(hoveredDetails!.denominator)}
                  </div>
                )}
              </>
            ) : (
              <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>
                No data available
              </div>
            )}
          </div>
        )}

        <svg
  width="100%"
  height="100%"  // Changed from 90%
  viewBox="0 0 500 600"  // Start at 0,0 and increase height
  preserveAspectRatio="xMidYMid meet"
  style={{ background: 'transparent', display: 'block' }}
  role="group"
  aria-label="Map of Integrated Care Boards in England. Select a region to view its value for the chosen metric."
>
          {mapFeatures.map(({ icbCode, icbName, pathData }, index) => {
            const details = getAreaDetails ? getAreaDetails(icbCode) : undefined;
            const hasValue = details !== undefined && !isNaN(details.value);
            const isSelected = selectedICB === icbCode;
            const ariaLabel = `${icbName}: ${
              hasValue ? details!.value.toFixed(1) : 'no data available'
            }`;

            return (
              <path
                key={`${icbCode}-${index}`}
                d={pathData}
                fill={getRegionColor(icbCode)}
                stroke="#2C3E50"
                strokeWidth="0.5"
                role="button"
                tabIndex={0}
                aria-label={ariaLabel}
                aria-pressed={isSelected}
                style={{
                  cursor: 'pointer',
                  transition: 'fill 0.2s ease, opacity 0.2s ease',
                  opacity: hoveredICB && hoveredICB !== icbName ? 0.7 : 1,
                }}
                onMouseEnter={() => mapHover(icbName)}
                onMouseLeave={mapLeave}
                onFocus={() => mapHover(icbName)}
                onBlur={mapLeave}
                onClick={() => handleICBClick(icbCode, icbName)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleICBClick(icbCode, icbName);
                  }
                }}
              />
            );
          })}
        </svg>
      </div>

      <div style={{
        textAlign: 'center',
        minHeight: '20px',
        flexShrink: 0
      }}>
        <Typography
          variant="body2"
          sx={{
            color: selectedICB ? '#E91E63' : '#666',
            fontWeight: selectedICB ? 600 : 400,
            fontSize: { xs: '12px', md: '13px' },
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