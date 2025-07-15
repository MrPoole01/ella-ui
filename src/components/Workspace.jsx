import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import '../styles/Workspace.scss';

const Workspace = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleNewChat = () => {
    setSelectedProject(null);
  };

  return (
    <div className="workspace clips-content">
      {/* Header */}
      <Header />
      
      {/* Main Layout */}
      <div className="workspace__main">
        {/* Sidebar */}
        <Sidebar 
          selectedProject={selectedProject} 
          onProjectSelect={setSelectedProject}
          onNewChat={handleNewChat}
        />
        
        {/* Main Content Area */}
        <MainContent selectedProject={selectedProject} />
      </div>
    </div>
  );
};

export default Workspace; 