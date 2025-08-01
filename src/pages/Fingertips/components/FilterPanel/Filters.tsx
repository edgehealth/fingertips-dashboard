import React from 'react';
import { 
  Box, 
  FormControl, 
  Select, 
  MenuItem, 
  Typography,
  SelectChangeEvent 
} from '@mui/material';

interface MetricOption {
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

  if (availableMetrics.length === 0) {
    return (
      <Box sx={{ padding: '16px' }}>
        <Typography
          variant="body2"
          sx={{
            color: '#999',
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
          {availableMetrics.map((metric) => (
            <MenuItem 
              key={metric.id} 
              value={metric.id}
              sx={{
                fontSize: '14px',
                '&:hover': {
                  backgroundColor: 'rgba(78, 205, 196, 0.1)',
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {metric.name}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MetricFilter;