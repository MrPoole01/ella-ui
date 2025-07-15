import React from 'react';

const UserIcon = ({ className, width = 22, height = 21 }) => (
  <div 
    className={`user-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679c29d21-5caf8099-d02f-45d7-affa-a1cd1b3bbe03.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default UserIcon; 