import React from 'react';

const EllipsisIcon = ({ className, width = 16, height = 16 }) => {
  // Generate unique IDs to avoid conflicts when multiple icons are rendered
  const uniqueId = React.useId();
  
  return (
    <svg 
      className={`ellipsis-icon ${className || ''}`}
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 4 16"
      fill="none"
    >
      <circle cx="2" cy="2" r="2" fill="#5D5D5D"/>
      <circle cx="2" cy="8" r="2" fill="#5D5D5D"/>
      <circle cx="2" cy="14" r="2" fill="#5D5D5D"/>
    </svg>
  );
};

export default EllipsisIcon; 