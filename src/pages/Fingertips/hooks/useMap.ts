// hooks/useMap.ts
import { useState, useEffect } from 'react';
import icbBoundaries from '../../../data/icb-boundaries.json';

interface GeoFeature {
  type: 'Feature';
  properties: {
    icb23cd: string;
    icb23nm: string;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

interface MapBounds {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

export const useMap = () => {
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
    setSelectedICB(icbCode);
    console.log('Selected ICB:', icbCode, icbName);
  };

  const handleICBHover = (icbName: string) => {
    setHoveredICB(icbName);
  };

  const handleICBLeave = () => {
    setHoveredICB(null);
  };

  // Get region color based on selection state
  const getRegionColor = (icbCode: string) => {
    if (selectedICB === icbCode) {
      return '#E91E63'; // Pink for selected
    }
    return '#4ECDC4'; // Teal for default
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