import React from 'react';
import { Box, Typography } from '@mui/material';
import MetricFilter from '../../FilterPanel/Filters';
import { FilterState } from '../../../../../types/types'; // Adjust the import path as necessary


//// Define the type for the filter state
//interface FilterState {
//  availableMetrics: { id: string; name: string }[];
//  selectedMetric: string | null;
//  setSelectedMetric: (metric: string) => void;
//  loading: boolean;
//  // Add other properties as needed
//}

interface TopRightPetalProps {
  filterState: FilterState;
}

const TopRightPetal: React.FC<TopRightPetalProps> = ({ filterState }) => {
  const [petalImage, setPetalImage] = React.useState<string>('');

  const {
    availableMetrics,
    selectedMetric,
    setSelectedMetric,
    loading,
  } = filterState;

  console.log('TopRightPetal - availableMetrics:', availableMetrics);
  console.log('TopRightPetal - selectedMetric:', selectedMetric);
  console.log('TopRightPetal - loading:', loading);

  React.useEffect(() => {
    import('../../../../../assets/top-right-petal.png')
      .then((imageModule) => {
        setPetalImage(imageModule.default);
      })
      .catch((error) => {
        console.error('Failed to load top-right-petal.png:', error);
      });
  }, []);

  if (!petalImage) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        backgroundImage: `url(${petalImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        height: '100%',
        width: '100%',
        minHeight: '300px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: 0,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-6px)',
          filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))',
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          paddingLeft: '2rem',
          paddingRight: '4rem',
          paddingTop: '2rem',
        }}
      >
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            color: '#2C3E50',
            fontWeight: 600,
            fontSize: '18px',
            marginBottom: '1.5rem',
          }}
        >
          Controls
        </Typography>


        {/* Metric Filter */}
        <Box
          sx={{
            width: '300px',
            marginTop: '3rem',
            marginLeft: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(78, 205, 196, 0.2)',
          }}
        >
          <MetricFilter
            availableMetrics={availableMetrics}
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TopRightPetal;