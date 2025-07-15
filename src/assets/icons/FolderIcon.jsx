import React from 'react';

const FolderIcon = ({ className, width = 16, height = 16 }) => (
  <div 
    className={`folder-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679c4e2cd-55c0633a-20b2-45ef-9fcc-5100225fcfa6.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default FolderIcon; 