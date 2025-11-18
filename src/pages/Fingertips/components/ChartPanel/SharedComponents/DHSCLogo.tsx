
import React from 'react';
import DHSC from '../../../../../assets/DHSC.png';

const DHSCLogo: React.FC = () => {
  return (
    <div>
      <img 
  src={DHSC} 
  alt="DHSC Logo" 
  style={{ height: '80px', width: 'auto' }}
/>
    </div>
  );
};

export default DHSCLogo;