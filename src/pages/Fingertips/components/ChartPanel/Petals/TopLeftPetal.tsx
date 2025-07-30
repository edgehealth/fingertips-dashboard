import React from 'react';
import { Box } from '@mui/material';
import FreshICBMap from '../Charts/ICBMap';

const TopLeftPetal: React.FC = () => {
  const [petalImage, setPetalImage] = React.useState<string>('');
     
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
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '15rem',
          paddingRight: '4rem',
          paddingBottom: '1.5rem',
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '90%',
            maxWidth: '320px',
            maxHeight: '300px',
            minWidth: '250px',
            minHeight: '280px',
            marginLeft: '6rem',
            marginTop: '-10rem',
          }}
        >
          <FreshICBMap />
        </Box>
      </Box>
    </Box>
  );
};

export default TopLeftPetal;