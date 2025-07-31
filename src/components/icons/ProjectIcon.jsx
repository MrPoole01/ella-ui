import React from 'react';

const ProjectIcon = ({ className, width = 20, height = 20 }) => (
  <div 
    className={`project-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679cb96e2-ac2c876c-9a02-4c5c-a71f-be452e793947.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default ProjectIcon; 