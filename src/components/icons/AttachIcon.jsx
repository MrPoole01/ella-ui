import React from 'react';

const AttachIcon = ({ className, width = 20, height = 20 }) => (
  <div 
    className={`attach-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679cd0571-a7b17b6a-fcbd-4969-b398-7695960ad4e4.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default AttachIcon; 