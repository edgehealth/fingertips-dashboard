import React from 'react';
import { Box, Typography } from '@mui/material';
import FreshICBMap from '../Charts/ICBMap';
import MetricCard from '../SharedComponents/MetricCard';

// Define the type for the filter state
interface FilterState {
  selectedMetricDetails: { id: string; name: string } | null;
  selectedMetric: string | null;
  selectedICB: string | null;
  averageValue: number | undefined;
  getValueForArea: (areaCode: string) => number | undefined;
  getAreaName: (areaCode: string) => string | undefined;
  valueRange: { min: number; max: number } | null;
  handleICBClick: (icbCode: string, icbName: string) => void;
  handleICBHover: (icbName: string) => void;
  handleICBLeave: () => void;
  loading: boolean;
  // Add other properties as needed
}

interface TopLeftPetalProps {
  filterState: FilterState;
}

const TopLeftPetal: React.FC<TopLeftPetalProps> = ({ filterState }) => {
  const [petalImage, setPetalImage] = React.useState<string>('');
  
  const { 
    selectedMetricDetails, 
    selectedMetric, 
    selectedICB,
    averageValue, 
    getValueForArea, 
    getAreaName,
    valueRange, 
    loading 
  } = filterState;
  
  // Get current value and region name for selected ICB
  const currentValue = selectedICB ? getValueForArea(selectedICB) : undefined;
  const selectedRegionName = selectedICB ? getAreaName(selectedICB) : undefined;
  
  // Decide what to show: selected ICB value or average
  const displayValue = currentValue !== undefined ? currentValue : averageValue;
  const displayLabel = selectedICB ? selectedRegionName : "Average across all areas";

  // DEBUG: Log the values
  console.log('=== TOP LEFT PETAL DEBUG ===');
  console.log('selectedICB:', selectedICB);
  console.log('currentValue:', currentValue);
  console.log('selectedRegionName:', selectedRegionName);
  console.log('displayValue:', displayValue);
  console.log('displayLabel:', displayLabel);
     
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: '1rem',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#2C3E50',
              fontWeight: 600,
              fontSize: '18px',
            }}
          >
            ICB Map
          </Typography>
        </Box>
        
        <Box sx={{ marginBottom: '1rem' }}>
          <MetricCard
            selectedMetric={selectedMetricDetails}
            displayValue={displayValue}
            displayLabel={displayLabel}
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
          <FreshICBMap filterState={filterState} />
        </Box>
      </Box>
    </Box>
  );
};

export default TopLeftPetal;