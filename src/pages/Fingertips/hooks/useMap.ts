// hooks/useMap.ts
import { useState, useEffect } from 'react';
import icbBoundaries from '../../../data/icb-boundaries.json';
import type { 
  GeoFeature, 
  MapBounds, 
  MapHookReturn,
  ValueRange 
} from '../../../types/types'

export const useMap = (): MapHookReturn => {
  const [geoData, setGeoData] = useState<GeoFeature[]>([]);
  const [hoveredICB, setHoveredICB] = useState<string | null>(null);
  const [selectedICB, setSelectedICB] = useState<string | null>(null);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  try {
    const geojson = icbBoundaries as any;
    const features = geojson.features || [];
    setGeoData(features);
    
    // DEBUG: Log ICB codes from boundary file
    console.log('=== MAP BOUNDARY DATA ===');
    console.log('Total ICB features:', features.length);
    const icbCodes = features.map((f: any) => f.properties.icb23cd);
    console.log('ALL boundary ICB codes:', icbCodes);
    console.log('First 10 boundary codes:', icbCodes.slice(0, 10));
    
    // Also log the properties to see what fields are available
    if (features.length > 0) {
      console.log('Boundary feature properties:', Object.keys(features[0].properties));
      console.log('Sample boundary feature:', features[0].properties);
    }
    
    // ... rest of your existing code for bounds calculation
  } catch (error) {
    console.error('Error loading ICB boundaries:', error);
    setLoading(false);
  }
}, []);

  useEffect(() => {
    try {
      const geojson = icbBoundaries as any;
      const features = geojson.features || [];
      setGeoData(features);
      
      // DEBUG: Log ICB codes from boundary file
      console.log('=== MAP BOUNDARY DATA ===');
      console.log('Total ICB features:', features.length);
      const icbCodes = features.map((f: any) => f.properties.icb23cd);
      console.log('ICB codes from boundaries:', icbCodes.slice(0, 10), '...');
      
      // Calculate actual bounds from the GeoJSON data
      let minLng = Infinity, maxLng = -Infinity;
      let minLat = Infinity, maxLat = -Infinity;
      
      features.forEach((feature: GeoFeature) => {
        const coords = feature.geometry.coordinates;
        const flatCoords = flattenCoordinates(coords);
        
        flatCoords.forEach(([lng, lat]) => {
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
        });
      });
      
      // Add small padding to bounds
      const lngPadding = (maxLng - minLng) * 0.02;
      const latPadding = (maxLat - minLat) * 0.02;
      
      setMapBounds({
        minLng: minLng - lngPadding,
        maxLng: maxLng + lngPadding,
        minLat: minLat - latPadding,
        maxLat: maxLat + latPadding,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading ICB boundaries:', error);
      setLoading(false);
    }
  }, []);

  // Flatten nested coordinate arrays from GeoJSON
  const flattenCoordinates = (coords: any): number[][] => {
    const result: number[][] = [];
    
    const flatten = (arr: any) => {
      if (Array.isArray(arr) && arr.length > 0) {
        if (typeof arr[0] === 'number' && arr.length === 2) {
          // This is a coordinate pair [lng, lat]
          result.push(arr);
        } else {
          // This is a nested array, continue flattening
          arr.forEach(flatten);
        }
      }
    };
    
    flatten(coords);
    return result;
  };

  // Project geographic coordinates to SVG coordinates
  const projectToSVG = (lng: number, lat: number) => {
    if (!mapBounds) return { x: 0, y: 0 };
    
    const width = 500;
    const height = 600;
    
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * width;
    // Flip Y coordinate for SVG (SVG Y increases downward, lat increases upward)
    const y = height - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * height;
    
    return { x, y };
  };

  // Convert GeoJSON coordinates to SVG path string
  const coordinatesToPath = (coordinates: number[][][] | number[][][][]) => {
    const paths: string[] = [];
    
    // Handle both Polygon and MultiPolygon geometries
    const polygons = coordinates[0] && Array.isArray(coordinates[0][0]) && Array.isArray(coordinates[0][0][0])
      ? coordinates as number[][][][]  // MultiPolygon: [[[[[lng,lat]]]]]
      : [coordinates as number[][][]]; // Polygon: [[[lng,lat]]]
    
    polygons.forEach(polygon => {
      polygon.forEach((ring, ringIndex) => {
        if (ring.length < 3) return; // Skip invalid rings
        
        const pathCommands = ring.map(([lng, lat], index) => {
          const { x, y } = projectToSVG(lng, lat);
          return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
        });
        
        if (pathCommands.length > 0) {
          paths.push(pathCommands.join(' ') + ' Z');
        }
      });
    });
    
    return paths.join(' ');
  };

  // Event handlers
  const handleICBClick = (icbCode: string, icbName: string) => {
    console.log('=== MAP CLICK ===');
    console.log('Clicked ICB code:', icbCode);
    console.log('Clicked ICB name:', icbName);
    console.log('Previous selectedICB:', selectedICB);
    setSelectedICB(icbCode);
    console.log('Set selectedICB to:', icbCode);
  };

  const handleICBHover = (icbName: string) => {
    setHoveredICB(icbName);
  };

  const handleICBLeave = () => {
    setHoveredICB(null);
  };

  // Get region color based on selection state and data value
  const getRegionColor = (icbCode: string, dataValue?: number, valueRange?: ValueRange) => {
    if (selectedICB === icbCode) {
      return '#E91E63'; // Pink for selected
    }
    
    // If we have data value and range, create heatmap
    if (dataValue !== undefined && valueRange) {
      const { min, max } = valueRange;
      const normalizedValue = (dataValue - min) / (max - min);
      
      // Create color gradient from light teal to dark teal
      const lightness = 85 - (normalizedValue * 35); // 85% to 50% lightness
      return `hsl(178, 54%, ${lightness}%)`; // HSL for teal with varying lightness
    }
    
    return '#4ECDC4'; // Default teal
  };

  return {
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
  };
};