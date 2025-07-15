import React from 'react';

const ChevronUpIcon = ({ className, width = 20, height = 20 }) => (
  <div 
    className={`chevron-up-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679c79eae-ba1e5807-5368-4026-bfb5-a8fb2f08ae5b.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default ChevronUpIcon; 