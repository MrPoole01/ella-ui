import React from 'react';

const ChevronRightIcon = ({ className, width = 20.36, height = 20.36 }) => (
  <div 
    className={`chevron-right-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679c07a5a-b7228a04-dead-4027-8f06-cef58f1a236b.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default ChevronRightIcon; 