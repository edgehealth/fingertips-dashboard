import React from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { sortTimePeriodsAscending } from '../../../utils/dateUtils';

interface FilterState {
  selectedMetricDetails?: { id: string; name: string } | null;
  selectedICB?: string | null;
  data?: any[];
  selectedMetric?: string | null;
  getAreaName?: (areaCode: string) => string | undefined;
  loading?: boolean;
}

interface ICBLineChartProps {
  filterState?: FilterState;
}

const ICBLineChart: React.FC<ICBLineChartProps> = ({ filterState }) => {
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

      // Get unique time periods and sort them using shared utility
      const timePeriodsSet = new Set(englandData.map((item: any) => item.time_period));
      const timePeriods = sortTimePeriodsAscending(Array.from(timePeriodsSet));

      // Create line chart data format
      const result: any[] = [];
      
      // England line
      const englandLine = {
        id: 'England',
        color: '#4ECDC4',
        data: timePeriods.map(period => {
          const item = englandData.find((d: any) => d.time_period === period);
          return {
            x: period,
            y: item ? item.value : null
          };
        }).filter(point => point.y !== null)
      };
      
      result.push(englandLine);
      
      // ICB line if selected
      if (selectedICB && icbData.length > 0 && getAreaName) {
        const icbName = 'Selected ICB';
        const icbLine = {
          id: icbName,
          color: '#E91E63',
          data: timePeriods.map(period => {
            const item = icbData.find((d: any) => d.time_period === period);
            return {
              x: period,
              y: item ? item.value : null
            };
          }).filter(point => point.y !== null)
        };
        
        result.push(icbLine);
      }
      
      return result;
    } catch (error) {
      console.error('Error creating chart data:', error);
      return [];
    }
  }, [filterState]);

  // Loading states
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

  const { selectedMetricDetails, loading } = filterState;

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
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false
          }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: '',
            legendOffset: 40,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendOffset: -45,
            legendPosition: 'middle'
          }}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableArea={false}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemDirection: 'left-to-right',
              itemWidth: 100,
              itemHeight: 20,
              itemOpacity: 0.85,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          animate={true}
          motionConfig="gentle"
          lineWidth={3}
          colors={{ datum: 'color' }}
        />
      </Box>
    </Box>
  );
};

export default ICBLineChart;