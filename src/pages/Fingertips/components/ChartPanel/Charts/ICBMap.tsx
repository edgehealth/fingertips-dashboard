import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNHSData } from '../../../../../context/FingertipsContext';
import { colors } from '../../../../../theme';
import icbBoundaries from '../../../../../data/icb-boundaries.json'; // Import directly

interface GeoFeature {
  type: 'Feature';
  properties: {
    icb23cd: string;
    icb23nm: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: any;
  };
}

const SimpleSVGMap: React.FC = () => {
  const { data, selectedRegion, setSelectedRegion } = useNHSData();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<GeoFeature[]>([]);
  const [loading, setLoading] = useState(true);

  // Load GeoJSON data from imported file
  useEffect(() => {
    try {
      console.log('Loaded geo data:', icbBoundaries); // Debug log
      setGeoData(icbBoundaries.features || []);
    } catch (error) {
      console.error('Error loading geo data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create lookup for quick access to data
  const dataLookup = data.reduce((acc, item) => {
    acc[item.area_code] = item;
    return acc;
  }, {} as Record<string, any>);

  const getRegionColor = (areaCode: string) => {
    if (selectedRegion === areaCode) {
      return colors.primary.pink;
    }
    
    if (dataLookup[areaCode]) {
      return colors.secondary.aquamarine;
    }
    
    return colors.background.secondary;
  };

  // Simple coordinate projection (you might need to adjust this)
  const projectCoordinates = (coordinates: any[]): string => {
    // Very basic projection - you might need a proper projection library
    const scale = 0.0001;
    const offsetX = 50000;
    const offsetY = 100000;
    
    return coordinates.map((coord: any) => {
      if (Array.isArray(coord) && Array.isArray(coord[0])) {
        // Handle nested arrays
        return coord.map((point: number[]) => 
          `${(point[0] - offsetX) * scale},${400 - (point[1] - offsetY) * scale}`
        ).join(' ');
      }
      if (Array.isArray(coord) && coord.length >= 2) {
        return `${(coord[0] - offsetX) * scale},${400 - (coord[1] - offsetY) * scale}`;
      }
      return '';
    }).join(' ');
  };

  const renderPath = (feature: GeoFeature) => {
    const { coordinates, type } = feature.geometry;
    
    if (type === 'Polygon' && coordinates && coordinates[0]) {
      const pathData = coordinates[0].map((coord: number[], index: number) => {
        const scale = 0.0001;
        const offsetX = 50000;
        const offsetY = 100000;
        const x = (coord[0] - offsetX) * scale;
        const y = 400 - (coord[1] - offsetY) * scale;
        return `${index === 0 ? 'M' : 'L'}${x},${y}`;
      }).join(' ') + ' Z';
      
      return pathData;
    }
    
    return '';
  };

  if (loading) {
    return (
      <Box sx={{ padding: '2rem', textAlign: 'center' }}>
        <Typography>Loading map...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '600px',
        backgroundColor: 'white',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        position: 'relative',
      }}
    >
      {/* Title */}
      <Box
        sx={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '0.5rem',
          padding: '0.5rem 1rem',
        }}
      >
        <Typography variant="h6">ICB Map</Typography>
        <Typography variant="body2" color="text.secondary">
          {geoData.length} regions loaded
        </Typography>
      </Box>

      {/* Hover info */}
      {hoveredRegion && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            zIndex: 1000,
            backgroundColor: 'rgba(35, 32, 63, 0.9)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
          }}
        >
          <Typography variant="body2">{hoveredRegion}</Typography>
        </Box>
      )}

      {/* Simple SVG Map */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        style={{ background: colors.background.primary }}
      >
        {geoData.map((feature, index) => {
          const areaCode = feature.properties.icb23cd;
          const areaName = feature.properties.icb23nm;
          const regionData = dataLookup[areaCode];
          
          return (
            <path
              key={`${areaCode}-${index}`}
              d={renderPath(feature)}
              fill={getRegionColor(areaCode)}
              stroke={colors.primary.darkBlue}
              strokeWidth="0.5"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => {
                const displayText = regionData 
                  ? `${areaName}: ${regionData.value}%`
                  : `${areaName}: No data`;
                setHoveredRegion(displayText);
              }}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => {
                setSelectedRegion(areaCode);
                console.log('Selected:', areaCode, areaName);
              }}
            />
          );
        })}
      </svg>

      {/* Fallback message if no geo data */}
      {geoData.length === 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No geographic data loaded
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check that icb-boundaries.geojson is in /public/data/
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SimpleSVGMap;