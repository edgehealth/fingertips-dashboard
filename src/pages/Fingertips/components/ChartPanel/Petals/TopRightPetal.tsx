import React from 'react';
import { Box } from '@mui/material';

const TopRightPetal: React.FC = () => {
  const [petalImage, setPetalImage] = React.useState<string>('');
  
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
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Your filter components go here */}
      </Box>
    </Box>
  );
};

export default TopRightPetal;