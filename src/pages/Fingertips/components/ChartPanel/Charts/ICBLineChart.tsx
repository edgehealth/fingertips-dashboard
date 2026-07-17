// ICBLineChart.tsx
import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const chartData = React.useMemo(() => {
    if (!filterState || !filterState.selectedMetric || !filterState.data) {
      return [];
    }

    const { data, selectedMetric, selectedICB, getAreaName } = filterState;

    try {
      const filtered = data.filter((item: any) => 
        item && 
        item.indicator_name === selectedMetric &&
        item.value !== undefined &&
        item.value !== null &&
        !isNaN(item.value)
      );

      const englandData = filtered.filter((item: any) => 
        item.area_name && (
          item.area_name.toLowerCase().includes('england') || 
          item.area_code === 'E92000001' ||
          item.area_name === 'England'
        )
      );

      const icbData = selectedICB ? 
        filtered.filter((item: any) => item.area_code === selectedICB) : [];

      const timePeriodsSet = new Set(englandData.map((item: any) => item.time_period));
      const timePeriods = sortTimePeriodsAscending(Array.from(timePeriodsSet));

      const result: any[] = [];
      
      const englandLine = {
        id: 'England',
        color: '#4ECDC4',
        data: timePeriods.map(period => {
          const item = englandData.find((d: any) => d.time_period === period);
          return {
            x: period,
            y: item ? (item.value > 10 ? Math.round(item.value) : Math.round(item.value * 10) / 10) : null
          };
        }).filter(point => point.y !== null)
      };
      
      result.push(englandLine);
      
      if (selectedICB && icbData.length > 0 && getAreaName) {
        const icbName = getAreaName(selectedICB) || 'ICB';
        const icbLine = {
          id: icbName,
          color: '#E91E63',
          data: timePeriods.map(period => {
            const item = icbData.find((d: any) => d.time_period === period);
            return {
              x: period,
              y: item ? (item.value > 10 ? Math.round(item.value) : Math.round(item.value * 10) / 10) : null
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

  if (!filterState) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        minHeight: '200px',
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
        minHeight: '200px',
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
        minHeight: '200px',
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
        minHeight: '200px',
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

  const chartSummary =
    `Line chart of ${selectedMetricDetails.name} over time. ` +
    chartData
      .map((series: any) => {
        const pts = series.data;
        if (!pts || pts.length === 0) return `${series.id}: no data.`;
        const first = pts[0];
        const last = pts[pts.length - 1];
        return `${series.id}: from ${first.y} in ${first.x} to ${last.y} in ${last.x}.`;
      })
      .join(' ');

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      minHeight: { xs: '250px', lg: '300px' },
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ flex: 1, minHeight: 0, height: '100%' }} role="img" aria-label={chartSummary}>
        <ResponsiveLine
          data={chartData}
          margin={isMobile 
            ? { top: 10, right: 10, bottom: 50, left: 60 }
            : { top: 20, right: 20, bottom: 50, left: 60 }
          }
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
            tickRotation: isMobile ? -60 : -45,
            legend: '',
            legendOffset: 40,
            legendPosition: 'middle',
            tickValues: isMobile ? 'every 2' : undefined,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendOffset: -45,
            legendPosition: 'middle',
            format: isMobile ? (v) => Math.round(v as number) : undefined,
          }}
          pointSize={isMobile ? 4 : 8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={isMobile ? 1 : 2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableArea={false}
          useMesh={true}
          tooltip={({ point }) => (
            <Box
              sx={{
                background: 'white',
                padding: '8px 12px',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                border: '1px solid #ccc',
              }}
            >
              <Typography variant="body2" sx={{ color: point.seriesColor, fontWeight: 750 }}>
                {point.data.xFormatted}: {point.data.yFormatted}
              </Typography>
            </Box>
          )}
          animate={true}
          motionConfig="gentle"
          lineWidth={isMobile ? 2 : 3}
          colors={{ datum: 'color' }}
        />
      </Box>
    </Box>
  );
};

export default ICBLineChart;