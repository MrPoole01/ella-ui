import React from 'react';

const ClockIcon = ({ className, width = 20, height = 20 }) => (
  <div 
    className={`clock-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679c759cc-29f81445-0d72-490c-9efe-dc226400dc0b.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default ClockIcon; 