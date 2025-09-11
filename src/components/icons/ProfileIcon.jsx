import React from 'react';

const ProfileIcon = ({ className, width = 25, height = 25 }) => (
  <div 
    className={`profile-icon ${className || ''}`}
    style={{
      ...(width !== 25 && { width: `${width}px` }),
      ...(height !== 25 && { height: `${height}px` })
    }}
  />
);

export default ProfileIcon; 