import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/layout/MainContent';
import TemplateDrawer from '../components/features/TemplateDrawer';
import '../styles/Workspace.scss';

const Workspace = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);

  const handleNewChat = () => {
    setSelectedProject(null);
  };

  const handleOpenTemplateDrawer = () => {
    setIsTemplateDrawerOpen(true);
  };

  const handleCloseTemplateDrawer = () => {
    setIsTemplateDrawerOpen(false);
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
          onOpenTemplateDrawer={handleOpenTemplateDrawer}
        />
        
        {/* Main Content Area */}
        <MainContent 
          selectedProject={selectedProject} 
          onOpenTemplateDrawer={handleOpenTemplateDrawer}
        />
      </div>
      
      {/* Template Drawer */}
      <TemplateDrawer 
        isOpen={isTemplateDrawerOpen}
        onClose={handleCloseTemplateDrawer}
      />
    </div>
  );
};

export default Workspace; 