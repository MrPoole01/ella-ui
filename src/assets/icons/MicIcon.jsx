import React from 'react';

const MicIcon = ({ className, width = 35.56, height = 35.56 }) => (
  <div 
    className={`mic-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679cca817-8cf295bc-1f2c-4fa9-aa42-857dffdf1108.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default MicIcon; 