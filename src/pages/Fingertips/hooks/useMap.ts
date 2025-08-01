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
          result.push(arr);
        } else {
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
    const y = height - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * height;
    
    return { x, y };
  };

  // Convert GeoJSON coordinates to SVG path string
  const coordinatesToPath = (coordinates: number[][][] | number[][][][]) => {
    const paths: string[] = [];
    
    const polygons = coordinates[0] && Array.isArray(coordinates[0][0]) && Array.isArray(coordinates[0][0][0])
      ? coordinates as number[][][][]
      : [coordinates as number[][][]];
    
    polygons.forEach(polygon => {
      polygon.forEach((ring, ringIndex) => {
        if (ring.length < 3) return;
        
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
      return '#E91E63';
    }
    
    if (dataValue !== undefined && valueRange) {
      const { min, max } = valueRange;
      const normalizedValue = (dataValue - min) / (max - min);
      
      const lightness = 85 - (normalizedValue * 35);
      return `hsl(178, 54%, ${lightness}%)`;
    }
    
    return '#4ECDC4';
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
    clearSelection: () => setSelectedICB(null),
  };
};