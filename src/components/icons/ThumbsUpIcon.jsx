import React from 'react';

const ThumbsUpIcon = ({ className, width = 18, height = 18 }) => (
  <div 
    className={`thumbs-up-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679ced91e-4c416c18-3980-4557-8d06-1404cd1c04b5.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default ThumbsUpIcon; 