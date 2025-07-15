import React from 'react';

const MenuIcon = ({ className, width = 20, height = 20 }) => (
  <div 
    className={`menu-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197ef8de3cbb6b6-f2c6f97f-78eb-486a-99a4-fa90a6ef6a58.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default MenuIcon; 