
import React from 'react';
import LogoBlueWhite from '../../../../../assets/LogoBlueWhite.png';

const Logo: React.FC = () => {
  return (
    <div>
      <img 
  src={LogoBlueWhite} 
  alt="Edge Health Logo" 
  style={{ height: '60px', width: 'auto' }}
/>
    </div>
  );
};

export default Logo;