import React from 'react';

const ShareIcon = ({ className, width = 19, height = 22 }) => (
  <div 
    className={`share-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679c1f0e3-e8cc73bd-a897-4648-9801-62788295c103.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default ShareIcon; 