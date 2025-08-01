import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { BarChart } from '@mui/icons-material';

interface MetricOption {
  id: string;
  name: string;
}

interface MetricCardProps {
  selectedMetric: MetricOption | null;
  displayValue?: number;
  displayLabel?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  selectedMetric,
  displayValue,
  displayLabel,
}) => {
  
  if (!selectedMetric) {
    return (
      <Card
        sx={{
          minWidth: 250,
          maxWidth: 300,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(78, 205, 196, 0.2)',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent sx={{ padding: '16px' }}>
          <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
            No metric selected
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        minWidth: 250,
        maxWidth: 300,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(78, 205, 196, 0.3)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <CardContent sx={{ padding: '16px' }}>
        {/* Metric Name */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <BarChart 
            sx={{ 
              color: '#4ECDC4', 
              fontSize: '20px', 
              marginRight: '8px',
            }} 
          />
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600,
              color: '#2C3E50',
              fontSize: '14px'
            }}
          >
            {selectedMetric.name}
          </Typography>
        </Box>

        {/* The Value */}
        {displayValue !== undefined ? (
          <Box sx={{ textAlign: 'center', marginBottom: '16px' }}>
            <Typography
              variant="h4"
              sx={{
                color: '#E91E63',
                fontWeight: 700,
                fontSize: '36px',
                lineHeight: 1,
              }}
            >
              {displayValue.toFixed(1)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#4ECDC4',
                fontSize: '12px',
                fontWeight: 500,
                textAlign: 'center',
                display: 'block',
                marginTop: '4px',
              }}
            >
              {displayLabel || "Value"}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', marginBottom: '16px' }}>
            <Typography
              variant="h4"
              sx={{
                color: '#999',
                fontSize: '36px',
                lineHeight: 1,
              }}
            >
              --
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#999',
                fontSize: '12px',
                textAlign: 'center',
                display: 'block',
                marginTop: '4px',
              }}
            >
              No data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;