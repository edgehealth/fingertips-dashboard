import React, { useMemo } from 'react';
import { 
  Box, 
  FormControl, 
  Select, 
  MenuItem, 
  Typography,
  SelectChangeEvent,
  ListSubheader 
} from '@mui/material';

interface MetricOption {
  category: string;
  id: string;
  name: string;
}

interface MetricFilterProps {
  availableMetrics: MetricOption[];
  selectedMetric: string | null;
  onMetricChange: (metricId: string) => void;
}

const MetricFilter: React.FC<MetricFilterProps> = ({
  availableMetrics,
  selectedMetric,
  onMetricChange,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as string;
    onMetricChange(value);
  };

  // Group metrics by category
  const groupedMetrics = useMemo(() => {
    const groups: Record<string, MetricOption[]> = {};
    
    availableMetrics.forEach(metric => {
      const category = metric.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(metric);
    });
    
    return groups;
  }, [availableMetrics]);

  // Build the menu items with headers
  const renderMenuItems = () => {
    const items: React.ReactNode[] = [];
    
    Object.entries(groupedMetrics).forEach(([category, metrics]) => {
      // Add category header
      items.push(
        <ListSubheader 
          key={`header-${category}`}
          sx={{
            backgroundColor: '#f5f5f5',
            fontWeight: 600,
            fontSize: '12px',
            color: '#666',
            lineHeight: '32px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {category}
        </ListSubheader>
      );
      
      // Add metrics under this category
      metrics.forEach(metric => {
        items.push(
          <MenuItem 
            key={metric.id} 
            value={metric.id}
            sx={{
              fontSize: '14px',
              pl: 3, // Indent items under header
              '&:hover': {
                backgroundColor: 'rgba(78, 205, 196, 0.1)',
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {metric.name}
            </Typography>
          </MenuItem>
        );
      });
    });
    
    return items;
  };

  if (availableMetrics.length === 0) {
    return (
      <Box sx={{ padding: '16px' }}>
        <Typography
          variant="body2"
          sx={{
            color: '#767676',
            fontSize: '12px',
            fontStyle: 'italic',
          }}
        >
          No metrics available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '16px' }}>
      <FormControl fullWidth size="small">
        <Select
          value={selectedMetric || ''}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Select a health metric to display' }}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(5px)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(44, 62, 80, 0.2)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4ECDC4',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#4ECDC4',
            },
            '& .MuiSelect-select': {
              padding: '12px 16px',
              fontSize: '14px',
              color: '#2C3E50',
              fontWeight: 500,
            },
          }}
        >
          <MenuItem value="" disabled>
            <em>Choose a metric...</em>
          </MenuItem>
          {renderMenuItems()}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MetricFilter;