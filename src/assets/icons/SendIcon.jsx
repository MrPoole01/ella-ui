import React from 'react';

const SendIcon = ({ className, width = 18, height = 18 }) => (
  <div 
    className={`send-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679ced055-4fc4a440-a4c8-4f39-8826-6201d0227f17.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default SendIcon; 