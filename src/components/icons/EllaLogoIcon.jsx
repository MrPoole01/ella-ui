import React from 'react';

const EllaLogoIcon = ({ className, width = 21.73, height = 22 }) => (
  <div 
    className={`ella-logo-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679bf699f-184ac0ae-575f-40ca-8a46-aa70de86d376.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default EllaLogoIcon; 