import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import '../styles/MainContent.scss';

const MainContent = ({ selectedProject }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const handleEditClick = () => {
    setIsEditingTitle(true);
    setEditedTitle(selectedProject.name);
  };

  const handleTitleSave = () => {
    // Here you would typically update the project in your state management
    // For now, we'll just exit edit mode
    setIsEditingTitle(false);
    // You might want to call a callback to update the project in parent component
    console.log('Project title updated to:', editedTitle);
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setEditedTitle('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      handleTitleCancel();
    }
  };

  return (
    <div className="main-content">
      {/* Top Navigation */}
      <div className="main-content__nav body-nav-container"> 
        {/* Project Breadcrumb Navigation */}
        <div className="main-content__project-info-container">
        {selectedProject && (
          <div className="main-content__project-nav">
            <div className="main-content__project-header">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={handleKeyPress}
                  className="main-content__project-title-input"
                  autoFocus
                />
              ) : (
                <h2 className="main-content__project-title">{selectedProject.name}</h2>
              )}
              <svg 
                className="main-content__project-share" 
                xmlns="http://www.w3.org/2000/svg" 
                xmlnsXlink="http://www.w3.org/1999/xlink" 
                width="14" 
                height="14" 
                viewBox="0 0 14 14"
                onClick={handleEditClick}
                style={{ cursor: 'pointer' }}
              >
                <defs>
                  <clipPath id="clipPath2367811232">
                    <path d="M0 0L14 0L14 14L0 14L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                  </clipPath>
                </defs>
                <g clipPath="url(#clipPath2367811232)">
                  <path d="M8.70554 2.32503L11.5535 5.17292L4.3446 12.3818L1.4983 9.5339L8.70554 2.32503ZM13.7145 1.63819L12.4444 0.368126C11.9536 -0.122709 11.1566 -0.122709 10.6641 0.368126L9.44747 1.58472L12.2954 4.43263L13.7145 3.01355C14.0952 2.63283 14.0952 2.01888 13.7145 1.63819ZM0.00792508 13.5368C-0.0439033 13.7701 0.166693 13.9791 0.399973 13.9224L3.5735 13.1529L0.727197 10.305L0.00792508 13.5368Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0.0341408)" fill="rgb(193, 193, 193)"/>
                </g>
              </svg>
            </div>
            <div className="main-content__breadcrumb">
              <span className="main-content__breadcrumb-item">{selectedProject.workspace}</span>
              <svg className="main-content__breadcrumb-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="main-content__breadcrumb-item">Projects</span>
              <svg className="main-content__breadcrumb-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="main-content__breadcrumb-item">{selectedProject.name}</span>
            </div>
          </div>
        )}
        </div>
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className="menu-icon">
          <defs>
            <clipPath id="clipPath5469496504-menu">
              <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
            </clipPath>
          </defs>
          <g clipPath="url(#clipPath5469496504-menu)">
            <defs>
              <clipPath id="clipPath6274391462-menu">
                <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
              </clipPath>
            </defs>
            <g clipPath="url(#clipPath6274391462-menu)">
              <circle cx="1.875" cy="1.875" r="1.875" strokeWidth="1.25" transform="matrix(1 0 0 1 3.125 8.125)" stroke="rgb(75, 85, 99)" fill="transparent"/>
              <circle cx="1.875" cy="1.875" r="1.875" strokeWidth="1.25" transform="matrix(1 0 0 1 13.125 2.5)" stroke="rgb(75, 85, 99)" fill="transparent"/>
              <circle cx="1.875" cy="1.875" r="1.875" strokeWidth="1.25" transform="matrix(1 0 0 1 13.125 13.75)" stroke="rgb(75, 85, 99)" fill="transparent"/>
              <path d="M6.42562 -0.544736C6.72647 -0.713961 7.10754 -0.607257 7.27677 -0.30641C7.44599 -0.00556311 7.33929 0.375512 7.03844 0.544736L0.30641 4.33145C0.0055632 4.50068 -0.375512 4.39398 -0.544736 4.09313C-0.713961 3.79228 -0.607257 3.41121 -0.30641 3.24198L6.42562 -0.544736ZM-0.544736 5.31859C-0.71396 5.61944 -0.607257 6.00051 -0.30641 6.16974L6.42562 9.95646C6.72647 10.1257 7.10754 10.019 7.27677 9.71813C7.44599 9.41728 7.33929 9.03621 7.03844 8.86698L0.306411 5.08026C0.00556388 4.91104 -0.375512 5.01774 -0.544736 5.31859Z" fillRule="evenodd" transform="matrix(1 0 0 1 6.63398 5.29414)" fill="rgb(75, 85, 99)"/>
            </g>
          </g>
        </svg>
      </div>

      {/* Chat Container */}
      <div className="main-content__chat chat-container">
        <ChatInterface selectedProject={selectedProject} />
      </div>
    </div>
  );
};

export default MainContent; 