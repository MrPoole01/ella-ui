import React from 'react';

const SettingsIcon = ({ className, width = 20, height = 20 }) => (
  <div 
    className={`settings-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679c17217-cede8fc6-db43-484f-ac47-902a61bcada3.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default SettingsIcon; 