import React from 'react';
import { Box, Typography } from '@mui/material';
import ICBBarChart from '../Charts/ICBBarChart';

// Define the type for the filter state with optional properties for safety
interface FilterState {
  selectedMetricDetails?: { id: string; name: string } | null;
  selectedICB?: string | null;
  barChartData?: any[];
  getAreaName?: (areaCode: string) => string | undefined;
  loading?: boolean;
  // Add other properties as needed
}

interface BottomRightPetalProps {
  filterState?: FilterState;
}

const BottomRightPetal: React.FC<BottomRightPetalProps> = ({ filterState }) => {
  const [petalImage, setPetalImage] = React.useState<string>('');
  
  React.useEffect(() => {
    import('../../../../../assets/bottom-right-petal.png')
      .then((imageModule) => {
        setPetalImage(imageModule.default);
      })
      .catch((error) => {
        console.error('Failed to load bottom-right-petal.png:', error);
      });
  }, []);

  // Add safety check for filterState
  if (!filterState) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        color: 'text.secondary'
      }}>
        <Typography>Loading chart data...</Typography>
      </Box>
    );
  }

  if (!petalImage) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        backgroundImage: `url(${petalImage})`,
        backgroundSize: 'contain',
        backgroundPosition: 'left',
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
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Bar Chart Component */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            maxWidth: '500px',
            maxHeight: '350px',
            backgroundColor: 'transparent',
            marginRight: '200px',
          }}
        >
          <ErrorBoundary>
            <ICBBarChart filterState={filterState} />
          </ErrorBoundary>
        </Box>
      </Box>
    </Box>
  );
};

// Simple Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('BarChart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100%',
          color: 'text.secondary',
          flexDirection: 'column',
          textAlign: 'center'
        }}>
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            Chart temporarily unavailable
          </Typography>
          <Typography variant="caption" sx={{ marginTop: '8px', opacity: 0.7 }}>
            Try selecting a different metric
          </Typography>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default BottomRightPetal;