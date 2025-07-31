import React from 'react';

const EllaBrandIcon = ({ className, width = 55, height = 24 }) => (
  <div 
    className={`ella-brand-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679bf66b6-086a0634-f4c5-4bba-b389-9ddc0b63cb08.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default EllaBrandIcon; 