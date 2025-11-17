// Containers/SidebarContainer.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MetricFilter from '../../FilterPanel/Filters';
import ICBLineChart from '../Charts/ICBBarChart';
import YearSlider from '../SharedComponents/YearSlider';

interface FilterState {
  availableMetrics: { id: string; name: string }[];
  selectedMetric: string | null;
  selectedMetricDetails?: { id: string; name: string } | null;
  selectedICB?: string | null;
  setSelectedMetric: (metric: string) => void;
  barChartData?: any[];
  getAreaName?: (areaCode: string) => string | undefined;
  loading: boolean;
  availableYears?: string[];
  selectedYear?: string | null;
  setSelectedYear?: (year: string) => void;
}

interface SidebarContainerProps {
  filterState: FilterState;
}

const SidebarContainer: React.FC<SidebarContainerProps> = ({ filterState }) => {
  const {
    availableMetrics,
    selectedMetric,
    setSelectedMetric,
    loading,
    availableYears = [],
    selectedYear,
    setSelectedYear,
  } = filterState;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: '0.75rem', md: '1rem' },
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Top Section - Controls */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '80px 0px 80px 0px',
          padding: { xs: '0.75rem', md: '1rem' },
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid #2d2d44',
          flex: '0 0 auto',
          minHeight: { xs: '250px', md: '280px' },
          maxHeight: { xs: '320px', md: '350px' },
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: { xs: '0.75rem', md: '1rem' },
            justifyContent: 'right',
            flexShrink: 0,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#2C3E50',
              fontWeight: 600,
              fontSize: { xs: '14px', md: '16px' },
            }}
          >
            Controls
          </Typography>
          <InfoOutlinedIcon
            sx={{
              color: '#6c63ff',
              cursor: 'help',
              fontSize: { xs: '16px', md: '18px' },
              '&:hover': {
                color: '#5850d6',
              },
            }}
            titleAccess="Select metrics and time periods to visualize health data across Integrated Care Boards"
          />
        </Box>

        {/* Metric Filter */}
        <Box sx={{ width: '100%', flexShrink: 0 }}>
          <MetricFilter
            availableMetrics={availableMetrics}
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
          />
        </Box>

        {/* Year Slider */}
        {availableYears.length > 0 && selectedYear && setSelectedYear && (
          <Box sx={{ width: '100%', flexShrink: 0, mt: 2 }}>
            <YearSlider
              availableYears={availableYears}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
            />
          </Box>
        )}
      </Box>

      {/* Bottom Section - Chart */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '0px 80px 0px 80px',
          padding: { xs: '0.75rem', md: '1rem' },
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid #2d2d44',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: { xs: '0.5rem', md: '0.75rem' },
            flexShrink: 0,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#2C3E50',
              fontWeight: 600,
              fontSize: { xs: '14px', md: '16px' },
            }}
          >
            Comparison to England
          </Typography>
          <InfoOutlinedIcon
            sx={{
              color: '#6c63ff',
              cursor: 'help',
              fontSize: { xs: '16px', md: '18px' },
              marginLeft: '8px',
              '&:hover': {
                color: '#5850d6',
              },
            }}
            titleAccess="Compare selected ICB performance against the England average"
          />
        </Box>

        {/* Chart */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <ICBLineChart filterState={filterState} />
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarContainer;