import React from 'react';

const MenuIcon = ({ className, width = 20, height = 20 }) => (
  <svg 
    className={`menu-icon ${className || ''}`}
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none"
  >
    <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default MenuIcon; 