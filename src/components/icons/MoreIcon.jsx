import React from 'react';

const MoreIcon = ({ className, width = 20, height = 20 }) => (
  <div 
    className={`more-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679c3fbb7-d304e505-1c87-4693-a87c-85ea79ab494f.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default MoreIcon; 