import React from 'react';

const ChevronDownIcon = ({ className, width = 20, height = 20 }) => (
  <div 
    className={`chevron-down-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679c574d6-acb6927c-7746-40a2-9d10-718f9218cca7.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default ChevronDownIcon; 