import React from 'react';
import Card, { CardHeader, CardFooter } from './Card';
import '../../styles/ChatItem.scss';

const ChatItem = ({ title, timeAgo, project, projectColor, projectTextColor, updated }) => {
  // Determine the project tag CSS class based on the project name
  const getProjectTagClass = (projectName) => {
    const baseClass = 'chat-item__project-tag';
    if (projectName?.toLowerCase().includes('ellament')) {
      return `${baseClass} chat-item__project-tag--ellament`;
    } else if (projectName?.toLowerCase().includes('project')) {
      return `${baseClass} chat-item__project-tag--project`;
    }
    return `${baseClass} chat-item__project-tag--project`; // Default to project styling
  };

  const projectTagClass = getProjectTagClass(project);

  return (
    <Card 
      variant="chat-item" 
      hover 
      clickable
      className="chat-item"
    >
      <CardHeader
        title={title}
      />
      
      <CardFooter
        meta={
          <div className="chat-item__project-info">
            <div className={projectTagClass}>
              {project}
            </div>
            <div className="chat-item__updated">{updated}</div>
          </div>
        }
      />
    </Card>
  );
};

export default ChatItem; 