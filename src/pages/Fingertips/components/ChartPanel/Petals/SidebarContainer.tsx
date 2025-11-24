// Containers/SidebarContainer.tsx - Task 2: Move legend to header
import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MetricFilter from '../../FilterPanel/Filters';
import ICBLineChart from '../Charts/ICBLineChart';
import YearSlider from '../SharedComponents/YearSlider';

interface FilterState {
  availableMetrics: { id: string; name: string }[];
  selectedMetric: string | null;
  selectedMetricDetails?: { id: string; name: string } | null;
  setSelectedMetric: (metric: string) => void;
  barChartData?: any[];
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
        overflow: 'visible',
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
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        }}
      >
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

        <Box sx={{ width: '100%', flexShrink: 0 }}>
          <MetricFilter
            availableMetrics={availableMetrics}
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
          />
        </Box>

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
          overflow: 'visible',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        }}
      >
        {/* Header with Legend */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: { xs: '0.5rem', md: '0.75rem' },
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                '&:hover': {
                  color: '#5850d6',
                },
              }}
              titleAccess="Compare selected ICB performance against the England average"
            />
          </Box>

          {/* Legend - Moved here */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', marginLeft: '20px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 16,
                  height: 3,
                  backgroundColor: '#4ECDC4',
                  borderRadius: 1,
                }}
              />
              <Typography variant="caption" sx={{ fontSize: '11px', color: '#666' }}>
                England
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 3,
                    backgroundColor: '#E91E63',
                    borderRadius: 1,
                  }}
                />
                <Typography variant="caption" sx={{ fontSize: '11px', color: '#666' }}>
                  Selected ICB
                </Typography>
              </Box>
          </Box>
        </Box>

        {/* Chart */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 0,
            overflow: 'visible',
          }}
        >
          <ICBLineChart filterState={filterState} />
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarContainer;