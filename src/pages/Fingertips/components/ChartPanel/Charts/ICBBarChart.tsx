import React from 'react';
import { Box, Typography } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { FilterState } from '../../../../../types/types'; // Adjust the import path as necessary

interface ICBBarChartProps {
  filterState?: FilterState;
}

const ICBBarChart: React.FC<ICBBarChartProps> = ({ filterState }) => {
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
      const timePeriodsSet = new Set(englandData.map((item: any) => item.time_period));
      const timePeriods = Array.from(timePeriodsSet).sort();

      // Create chart data
      const result: any[] = [];

      timePeriods.forEach(period => {
        const englandItem = englandData.find((item: any) => item.time_period === period);
        const icbItem = icbData.find((item: any) => item.time_period === period);

        if (englandItem) {
          const dataPoint: any = {
            year: period,
            England: englandItem.value,
          };

          if (icbItem && selectedICB && getAreaName) {
            dataPoint['ICB'] = icbItem.value;
          }

          result.push(dataPoint);
        }
      });

      return result;
    } catch (error) {
      console.error('Error creating chart data:', error);
      return [];
    }
  }, [filterState]);

  const keys = React.useMemo(() => {
    const baseKeys = ['England'];

    if (filterState?.selectedICB && chartData.length > 0) {
      baseKeys.push('ICB');
    }

    return baseKeys;
  }, [chartData, filterState?.selectedICB]);

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
      <Box sx={{ flex: 1, minHeight: 300 }}>
        <ResponsiveBar
          data={chartData}
          keys={keys}
          indexBy="year"
          groupMode="grouped"
          margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={['#4ECDC4', '#E91E63']}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 40
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          animate={true}
        />
      </Box>
    </Box>
  );
};

export default ICBBarChart;