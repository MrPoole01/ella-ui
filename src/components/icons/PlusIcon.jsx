import React from 'react';

const PlusIcon = ({ className, width = 20, height = 20 }) => (
  <div className={`plus-icon ${className || ''}`}>
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={width} 
      height={height} 
      viewBox="0 0 20 20"
    >
      <g style={{ fill: 'var(--theme-accent-primary)' }}>
        <path d="M10 3 C10.5523 3 11 3.4477 11 4 L11 16 C11 16.5523 10.5523 17 10 17 C9.4477 17 9 16.5523 9 16 L9 4 C9 3.4477 9.4477 3 10 3 Z"/>
        <path d="M3 10 C3 9.4477 3.4477 9 4 9 L16 9 C16.5523 9 17 9.4477 17 10 C17 10.5523 16.5523 11 16 11 L4 11 C3.4477 11 3 10.5523 3 10 Z"/>
      </g>
    </svg>
  </div>
);

export default PlusIcon; 