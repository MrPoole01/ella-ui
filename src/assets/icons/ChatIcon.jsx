import React from 'react';

const ChatIcon = ({ className, width = 20, height = 20 }) => (
  <div 
    className={`chat-icon ${className || ''}`}
    style={{
      backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679c6f267-f93b6785-21a0-49df-80c9-3a429031288c.svg')",
      width: `${width}px`,
      height: `${height}px`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }}
  />
);

export default ChatIcon; 