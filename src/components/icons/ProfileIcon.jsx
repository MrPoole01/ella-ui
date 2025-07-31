import React from 'react';

const ProfileIcon = ({ className, width = 25, height = 25 }) => (
  <div 
    className={`profile-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679c4b11d-5b3004e6-a320-424c-8459-52e22ff76e2e.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default ProfileIcon; 