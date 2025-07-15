import React from 'react';
import { EllipsisIcon } from '../assets/icons';
import '../styles/ChatItem.scss';

const ChatItem = ({ title, timeAgo, project, projectColor, projectTextColor, updated }) => {
  // Determine the project type based on the project name
  const getProjectClass = (projectName) => {
    if (projectName?.toLowerCase().includes('ellament')) {
      return 'chat-item__project-tag chat-item__project-tag--ellament';
    } else if (projectName?.toLowerCase().includes('project')) {
      return 'chat-item__project-tag chat-item__project-tag--project';
    }
    return 'chat-item__project-tag';
  };

  return (
    <div className="chat-item">
      <div className="chat-item__frame">
        <div className="chat-item__header">
          <div className="chat-item__title" title={title}>{title}</div>
          <EllipsisIcon width={12} height={12} />
        </div>
        
        <div className="chat-item__footer">
          <div className="chat-item__project-info">
            <div 
              className={getProjectClass(project)}
            >
              {project}
            </div>
            <div className="chat-item__updated">{updated}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem; 