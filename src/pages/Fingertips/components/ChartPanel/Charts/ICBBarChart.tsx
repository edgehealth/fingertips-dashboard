import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FilterState {
  selectedMetricDetails?: { id: string; name: string } | null;
  selectedICB?: string | null;
  data?: any[];
  selectedMetric?: string | null;
  getAreaName?: (areaCode: string) => string | undefined;
  loading?: boolean;
}

interface ICBBarChartProps {
  filterState?: FilterState;
}

const ICBBarChart: React.FC<ICBBarChartProps> = ({ filterState }) => {
  // Create chart data using useMemo at the top level
  const chartData = React.useMemo(() => {
    if (!filterState || !filterState.selectedMetric || !filterState.data) {
      return [];
    }

    const { data, selectedMetric, selectedICB, getAreaName } = filterState;

    try {
      // Filter data for the selected metric
      const filtered = data.filter((item: any) => 
        item && 
        item.indicator_name === selectedMetric &&
        item.value !== undefined &&
        item.value !== null &&
        !isNaN(item.value)
      );

      // Get England data
      const englandData = filtered.filter((item: any) => 
        item.area_name && (
          item.area_name.toLowerCase().includes('england') || 
          item.area_code === 'E92000001' ||
          item.area_name === 'England'
        )
      );

      // Get ICB data if selected
      const icbData = selectedICB ? 
        filtered.filter((item: any) => item.area_code === selectedICB) : [];

      // Get unique time periods
      const timePeriodsSet = new Set(englandData.map((item: any) => (item as any).time_period));
      const timePeriods = Array.from(timePeriodsSet).sort();

      // Create chart data
      const result: any[] = [];
      
      timePeriods.forEach(period => {
        const englandItem = englandData.find((item: any) => (item as any).time_period === period);
        const icbItem = icbData.find((item: any) => (item as any).time_period === period);
        
        if (englandItem) {
          const dataPoint: any = {
            year: period,
            England: englandItem.value,
          };
          
          if (icbItem && selectedICB && getAreaName) {
            const icbName = getAreaName(selectedICB) || 'Selected ICB';
            dataPoint[icbName] = icbItem.value;
          }
          
          result.push(dataPoint);
        }
      });

      console.log('=== BAR CHART DATA ===');
      console.log('Chart data generated:', result);
      
      return result;
    } catch (error) {
      console.error('Error creating chart data:', error);
      return [];
    }
  }, [filterState]);

  // Early returns after hooks
  if (!filterState) {
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

  const { selectedMetricDetails, selectedICB, getAreaName, loading } = filterState;
  const selectedRegionName = (selectedICB && getAreaName) ? getAreaName(selectedICB) : null;

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

  if (chartData.length === 0) {
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
          {selectedMetricDetails.name || 'Unknown metric'}
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
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              stroke="#666"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={80}
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
                (typeof value === 'number' && !isNaN(value)) ? value.toFixed(1) : 'No data', 
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
            {selectedICB && selectedRegionName && (
              <Bar 
                dataKey={selectedRegionName} 
                fill="#E91E63" 
                name={selectedRegionName}
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