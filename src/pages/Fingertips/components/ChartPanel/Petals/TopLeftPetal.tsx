import React from 'react';
import { Box, Typography } from '@mui/material';
import FreshICBMap from '../Charts/ICBMap';
import MetricCard from '../SharedComponents/MetricCard';

// Define the type for the filter state
interface FilterState {
  selectedMetricDetails: { id: string; name: string } | null;
  averageValue: number | undefined;
  loading: boolean;
  // Add other properties as needed
}

interface TopLeftPetalProps {
  filterState: FilterState;
}

const TopLeftPetal: React.FC<TopLeftPetalProps> = ({ filterState }) => {
  const [petalImage, setPetalImage] = React.useState<string>('');
  
  const { selectedMetricDetails, averageValue, loading } = filterState;
     
  React.useEffect(() => {
    import('../../../../../assets/top-left-petal.png')
      .then((imageModule) => {
        setPetalImage(imageModule.default);
      })
      .catch((error) => {
        console.error('Failed to load top-left-petal.png:', error);
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
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat',
        height: '100%',
        width: '100%',
        minHeight: '400px',
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
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          paddingLeft: '16rem',
          paddingTop: '6rem',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: '#2C3E50',
            fontWeight: 600,
            fontSize: '18px',
            marginBottom: '1rem',
          }}
        >
          ICB Map
        </Typography>
        
        <Box sx={{ marginBottom: '1rem' }}>
          <MetricCard
            selectedMetric={selectedMetricDetails}
            averageValue={averageValue}
          />
        </Box>
        
        <Box
          sx={{
            position: 'absolute',
            right: '2rem',
            top: '2rem',
            width: '100%',
            height: '90%',
            maxWidth: '320px',
            maxHeight: '300px',
            minWidth: '250px',
            minHeight: '280px',
          }}
        >
          <FreshICBMap />
        </Box>
      </Box>
    </Box>
  );
};

export default TopLeftPetal;