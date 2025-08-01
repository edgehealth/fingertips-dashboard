import React from 'react';
import { Box } from '@mui/material';
import src from '@emotion/styled/dist/declarations/src';

const BottomLeftPetal: React.FC = () => {
  const [petalImage, setPetalImage] = React.useState<string>('');
  const [tomImage, setTomImage] = React.useState<string>('');

  React.useEffect(() => {
    import('../../../../../assets/bottom-left-petal.png')
      .then((imageModule) => {
        setPetalImage(imageModule.default);
      })
      .catch((error) => {
        console.error('Failed to load bottom-left-petal.png:', error);
      });
  }, []);

  React.useEffect(() => {
    import('../../../../../assets/tired-tom.png')
      .then((imageModule) => {
        setTomImage(imageModule.default);
      })
      .catch((error) => {
        console.error('Failed to load tired-tom.png:', error);
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
        backgroundPosition: 'top',
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
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {tomImage && petalImage && (
          <Box
            component="img"
            src={tomImage}
            alt="Tired Tom"
            sx={{
              maxWidth: '114%',
              maxHeight: '108%',
              objectFit: 'cover',
              mb: 'auto',
              display: 'block',
              WebkitMaskImage: `url(${petalImage})`,
              maskImage: `url(${petalImage})`,
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskPosition: 'top',
              maskPosition: 'top',
              position: 'relative',
              top: '-19px', // Move image up by 20px
            }}
          />
        )}
      </Box>
    </Box >
  );
};

export default BottomLeftPetal;