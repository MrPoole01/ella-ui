import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MainContent from '../components/layout/MainContent';
import TemplateDrawer from '../components/features/TemplateDrawer';
import '../styles/Workspace.scss';

const Workspace = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState(false);
  const [externalPrompt, setExternalPrompt] = useState('');
  // Placeholder permissions and brandbot scoping
  const canManageCustomTemplates = true;
  const brandBotId = 'default';
  const currentUserId = 'demo-user';

  const handleNewChat = () => {
    setSelectedProject(null);
  };

  const handleOpenTemplateDrawer = () => {
    setIsTemplateDrawerOpen(true);
  };

  const handleCloseTemplateDrawer = () => {
    setIsTemplateDrawerOpen(false);
  };

  const handleTemplateSelected = (prompt) => {
    setExternalPrompt(prompt || '');
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
          externalPrompt={externalPrompt}
        />
      </div>
      
      {/* Template Drawer */}
      <TemplateDrawer 
        isOpen={isTemplateDrawerOpen}
        onClose={handleCloseTemplateDrawer}
        onTemplateSelected={handleTemplateSelected}
        canManageCustomTemplates={canManageCustomTemplates}
        brandBotId={brandBotId}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default Workspace; 