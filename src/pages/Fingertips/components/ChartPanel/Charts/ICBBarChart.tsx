import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FilterState {
  selectedMetricDetails: { id: string; name: string } | null;
  selectedICB: string | null;
  barChartData: any[];
  getAreaName: (areaCode: string) => string | undefined;
  loading: boolean;
}

interface ICBBarChartProps {
  filterState: FilterState;
}

const ICBBarChart: React.FC<ICBBarChartProps> = ({ filterState }) => {
  const { 
    selectedMetricDetails, 
    selectedICB, 
    barChartData, 
    getAreaName, 
    loading 
  } = filterState;

  const selectedRegionName = selectedICB ? getAreaName(selectedICB) : null;

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        color: 'text.secondary'
      }}>
        <Typography>Loading chart...</Typography>
      </Box>
    );
  }

  if (!selectedMetricDetails) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        color: 'text.secondary'
      }}>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          Select a metric to view the chart
        </Typography>
      </Box>
    );
  }

  if (barChartData.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        color: 'text.secondary',
        textAlign: 'center'
      }}>
        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          No data available for comparison
        </Typography>
        <Typography variant="caption" sx={{ marginTop: '8px', opacity: 0.7 }}>
          {selectedMetricDetails.name}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      padding: '16px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          color: '#2C3E50',
          fontWeight: 600,
          fontSize: '16px',
          marginBottom: '8px',
          textAlign: 'center'
        }}
      >
        {selectedICB ? `${selectedRegionName} vs England` : 'England Trend'}
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          color: '#666',
          fontSize: '12px',
          marginBottom: '16px',
          textAlign: 'center'
        }}
      >
        {selectedMetricDetails.name}
      </Typography>

      {/* Chart */}
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barChartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              stroke="#666"
              fontSize={11}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#666"
              fontSize={11}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: any, name: string) => [
                value?.toFixed(1) || 'No data', 
                name
              ]}
            />
            <Legend />
            <Bar 
              dataKey="England" 
              fill="#4ECDC4" 
              name="England"
              radius={[2, 2, 0, 0]}
            />
            {selectedICB && (
              <Bar 
                dataKey={selectedRegionName || 'Selected ICB'} 
                fill="#E91E63" 
                name={selectedRegionName || 'Selected ICB'}
                radius={[2, 2, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ICBBarChart;