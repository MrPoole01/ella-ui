import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronUpIcon,
  EllipsisIcon,
  PlusIcon
} from '../icons';
import ChatItem from '../ui/ChatItem';
import SavedWorkDrawer from '../features/SavedWorkDrawer';
import DocumentDrawer from '../features/DocumentDrawer';
import EllamentDrawer from '../features/EllamentDrawer';
import ManageTagsDrawer from '../features/ManageTagsDrawer';
import UploadedFilesDrawer from '../features/UploadedFilesDrawer';
import TagManagementModal from '../ui/Modal/TagManagementModal';
import ProjectCreateModal from '../ui/Modal/ProjectCreateModal';
import ConvertToProjectModal from '../ui/Modal/ConvertToProjectModal';
import DocumentUploadModal from '../ui/Modal/DocumentUploadModal';
import Box from '@mui/joy/Box';
import CircularProgress from '@mui/joy/CircularProgress';
import '../../styles/Sidebar.scss';

const Sidebar = ({ selectedProject, onProjectSelect, onNewChat, onOpenTemplateDrawer }) => {
  const [isRecentChatsExpanded, setIsRecentChatsExpanded] = useState(true);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isSectionMenuOpen, setIsSectionMenuOpen] = useState(false);
  const [activeSectionType, setActiveSectionType] = useState('');
  const [isFilesMenuOpen, setIsFilesMenuOpen] = useState(false);
  const [isSavedWorkMenuOpen, setIsSavedWorkMenuOpen] = useState(false);
  const [activeEllipsisMenu, setActiveEllipsisMenu] = useState(null);
  const [activeTaskMenu, setActiveTaskMenu] = useState(null);
  const [showSavedWorkDrawer, setShowSavedWorkDrawer] = useState(false);
  const [showDocumentDrawer, setShowDocumentDrawer] = useState(false);
  const [showEllamentDrawer, setShowEllamentDrawer] = useState(false);
  const [showManageTagsDrawer, setShowManageTagsDrawer] = useState(false);
  const [showUploadedFilesDrawer, setShowUploadedFilesDrawer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedEllament, setSelectedEllament] = useState(null);
  const [activeDocumentMenu, setActiveDocumentMenu] = useState(null);
  const [activeProjectMenu, setActiveProjectMenu] = useState(null);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagModalDocument, setTagModalDocument] = useState(null);
  const [tagModalType, setTagModalType] = useState(''); // 'document', 'task', 'savedWork'
  const [isProjectCreateModalOpen, setIsProjectCreateModalOpen] = useState(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [convertSourceWorkspace, setConvertSourceWorkspace] = useState(null);
  const [isDocumentUploadModalOpen, setIsDocumentUploadModalOpen] = useState(false);
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Marketing Campaign Q4',
      description: 'End-of-year marketing push for holiday season',
      createdAt: '2024-11-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Product Launch Beta',
      description: 'Beta testing and feedback collection for new features',
      createdAt: '2024-11-10T14:20:00Z'
    },
    {
      id: 3,
      name: 'Customer Onboarding',
      description: 'Streamlining the new customer experience process',
      createdAt: '2024-11-05T09:15:00Z'
    }
  ]);

  // Mock workspace data for conversion
  const orgWorkspaces = [
    { id: 1, name: 'Marketing Hub', hasChildProjects: false },
    { id: 2, name: 'Product Design', hasChildProjects: true },
    { id: 3, name: 'Engineering Team', hasChildProjects: false },
    { id: 4, name: 'Sales Operations', hasChildProjects: false },
    { id: 5, name: 'Creative Studio', hasChildProjects: false }
  ];

  // Current workspace (mock)
  const currentWorkspace = { id: 6, name: 'Current Workspace', hasChildProjects: false };

  const workspaceMenuRef = useRef(null);
  const projectMenuRef = useRef(null);
  const sectionMenuRef = useRef(null);
  const filesMenuRef = useRef(null);
  const savedWorkMenuRef = useRef(null);
  const ellipsisMenuRef = useRef(null);
  const documentMenuRef = useRef(null);
  const projectMenuDropdownRef = useRef(null);

  // Predefined tags for the tag management modal (values match existing data)
  const predefinedTags = [
    { value: 'Legal', label: 'Legal' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Customer', label: 'Customer' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Product', label: 'Product' },
    { value: 'Support', label: 'Support' },
    { value: 'Order', label: 'Order' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Products', label: 'Products' },
    { value: 'Feedback', label: 'Feedback' },
    { value: 'Survey', label: 'Survey' },
    { value: 'Design 2021', label: 'Design 2021' },
    { value: 'Work', label: 'Work' },
    { value: 'Design', label: 'Design' },
    { value: 'Daily', label: 'Daily' },
    { value: 'Social Post', label: 'Social Post' },
    { value: 'Campaign', label: 'Campaign' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Professional', label: 'Professional' },
    { value: 'other', label: 'Other...' }
  ];

  // Sample documents data based on Motiff design (now stateful for tag updates)
  const [sampleDocuments, setSampleDocuments] = useState([
    {
      id: 1,
      type: 'PDF',
      name: 'Service Contract v2.1',
      description: 'Legal agreement for software services and maintenance',
      updated: '05/13/2025 @ 4:15pm',
      tags: ['Legal', 'Contract'],
      typeColor: '#DC2626',
      typeBg: '#FEE2E2'
    },
    {
      id: 2,
      type: 'DOC',
      name: 'Customer Agreement',
      description: 'Terms and conditions for new customer onboarding',
      updated: '05/10/2025 @ 2:30pm',
      tags: ['Contract', 'Customer'],
      typeColor: '#2563EB',
      typeBg: '#DBEAFE'
    },
    {
      id: 3,
      type: 'XLS',
      name: 'Q2 Financial Report',
      description: 'Quarterly financial analysis and projections',
      updated: '05/08/2025 @ 9:45am',
      tags: ['Finance', 'Reports'],
      typeColor: '#059669',
      typeBg: '#D1FAE5'
    },
    {
      id: 4,
      type: 'PDF',
      name: 'Brand Guidelines',
      description: 'Official brand identity and usage guidelines',
      updated: '05/01/2025 @ 11:20am',
      tags: ['Marketing', 'Brand'],
      typeColor: '#DC2626',
      typeBg: '#FEE2E2'
    },
    {
      id: 5,
      type: 'DOC',
      name: 'Product Specifications',
      description: 'Technical specifications and requirements',
      updated: '04/28/2025 @ 3:45pm',
      tags: ['Technical', 'Product'],
      typeColor: '#2563EB',
      typeBg: '#DBEAFE'
    }
  ]);

  // Sample saved work data based on Motiff design (now stateful for tag updates)
  const [sampleSavedWork, setSampleSavedWork] = useState([
    {
      id: 1,
      title: 'Customer Support Response',
      description: 'Standard response for order tracking and delivery inquiries',
      tags: ['Support', 'Order'],
      saved: '05/13/2025 @ 4:15pm'
    },
    {
      id: 2,
      title: 'Product Recommendation',
      description: 'Personalized product suggestions based on purchase history',
      tags: ['Sales', 'Products'],
      saved: '05/08/2025 @ 11:45am'
    },
    {
      id: 3,
      title: 'New Customer Welcome',
      description: 'Personalized welcome message for new account registrations',
      tags: ['Onboarding', 'Welcome'],
      saved: '05/10/2025 @ 2:30pm'
    },
    {
      id: 4,
      title: 'Refund Confirmation',
      description: 'Standard response for processing refund requests and confirmations',
      tags: ['Support', 'Refund'],
      saved: '05/05/2025 @ 3:20pm'
    },
    {
      id: 5,
      title: 'Feedback Request',
      description: 'Post-purchase survey and product review request template',
      tags: ['Feedback', 'Survey'],
      saved: '05/01/2025 @ 9:10am'
    }
  ]);

  // Sample tasks data based on Motiff design (now stateful for tag updates)
  const [sampleTasks, setSampleTasks] = useState([
    {
      id: 1,
      title: 'User Experience',
      description: 'Planning for next week\'s user research sessions',
      updated: '10/12/2025 @ 2:30pm',
      tags: ['Design 2021', 'Work'],
      completed: false
    },
    {
      id: 2,
      title: 'Market Analysis',
      description: 'Competitive analysis and market research findings',
      updated: '10/24/2025 @ 9:15am',
      tags: ['Design 2021'],
      completed: false
    },
    {
      id: 3,
      title: 'Define Problem Statement',
      description: 'Team discussion on project scope and challenges',
      updated: '10/22/2025 @ 4:45pm',
      tags: ['Design 2021'],
      completed: true
    },
    {
      id: 4,
      title: 'Set Objectives',
      description: 'Defining key goals and success metrics',
      updated: '10/16/2025 @ 11:20am',
      tags: ['Design 2021', 'Work'],
      completed: false
    },
    {
      id: 5,
      title: 'Create Wireframes',
      description: 'Initial sketches and wireframes for the new dashboard',
      updated: '10/18/2025 @ 3:10pm',
      tags: ['Design', 'Daily'],
      completed: false
    }
  ]);

  const recentChats = [
    {
      id: 1,
      title: "Strategy Documents",
      timeAgo: "9d ago",
      project: "Ellaments",
      projectColor: "#A5F2B7",
      projectTextColor: "#057B14",
      updated: "Updated: 05/13/2025 @ 4:15pm"
    },
    {
      id: 2,
      title: "Social Media Campaign Planning for Nostal...",
      timeAgo: "9d ago", 
      project: "Project A",
      projectColor: "#B5CCFF",
      projectTextColor: "#1757C1",
      updated: "Updated: 05/13/2025 @ 4:15pm"
    },
    {
      id: 3,
      title: "Nurture Email Sequence Development for T...",
      timeAgo: "9d ago",
      project: "Project A", 
      projectColor: "#B5CCFF",
      projectTextColor: "#1757C1",
      updated: "Updated: 05/13/2025 @ 4:15pm"
    },
    {
      id: 4,
      title: "Social Media Post Strategy and Content De...",
      timeAgo: "9d ago",
      project: "Project A",
      projectColor: "#B5CCFF", 
      projectTextColor: "#1757C1",
      updated: "Updated: 05/13/2025 @ 4:15pm"
    }
  ];

  // Dynamic Tags Component for sidebar menus (239px width limit)
  const SidebarDynamicTags = ({ tags, item, type, containerClass, addButtonClass, tagChipClass, tagMoreClass }) => {
    const [visibleTagCount, setVisibleTagCount] = useState(tags ? tags.length : 0);
    const [isCompact, setIsCompact] = useState(false);

    // Calculate visible tags and compact mode (239px limit for sidebar)
    useEffect(() => {
      if (!tags || tags.length === 0) {
        setVisibleTagCount(0);
        setIsCompact(false);
        return;
      }

      const baseWidth = 30; // Add tag button width
      const safetyMargin = 20; // More conservative margin for sidebar
      const targetWidth = 239 - safetyMargin; // 239px limit for sidebar (219px effective)
      let visibleCount = 0;

      console.log(`[${type}] Calculating tags for ${tags.length} tags with ${targetWidth}px target width`);

      // First, try to fit as many tags as possible at 12px
      let totalWidth12px = baseWidth;
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        const tagInfo = predefinedTags.find(t => t.value === tag);
        const tagText = tagInfo ? tagInfo.label : tag;
        // More conservative estimation for longer tags: scale up character width for longer text
        const charWidth = tagText.length > 12 ? 6.5 : 5.8;
        const estimatedTagWidth = Math.ceil(tagText.length * charWidth) + 16 + 6;
        
        console.log(`[${type}] Tag "${tagText}" (${tagText.length} chars) estimated width: ${estimatedTagWidth}px, running total: ${totalWidth12px + estimatedTagWidth}px`);
        
        if (totalWidth12px + estimatedTagWidth <= targetWidth) {
          totalWidth12px += estimatedTagWidth;
          visibleCount = i + 1;
        } else {
          break;
        }
      }

      // If all tags fit, no need for compact mode
      if (visibleCount >= tags.length) {
        console.log(`[${type}] All ${tags.length} tags fit at 12px font`);
        setVisibleTagCount(tags.length);
        setIsCompact(false);
        return;
      }

      // If we can't fit all tags, we need "+X more"
      const remainingCount = tags.length - visibleCount;
      const moreText = `+${remainingCount} more`;
      // "+X more" estimation: 5.5px per character + 6px gap (more conservative)
      const moreWidth = Math.ceil(moreText.length * 5.5) + 6;
      console.log(`[${type}] "+X more" text: "${moreText}" estimated width: ${moreWidth}px`);

      // Check if current visible tags + "+X more" fit within 239px at 12px
      console.log(`[${type}] Tags calculation: ${visibleCount} visible tags, width: ${totalWidth12px}px, +more width: ${moreWidth}px, total: ${totalWidth12px + moreWidth}px`);
      
      if (totalWidth12px + moreWidth <= targetWidth) {
        // Perfect! Use 12px font size
        console.log(`[${type}] Using 12px font: ${visibleCount} tags + "${moreText}" fits in ${totalWidth12px + moreWidth}px`);
        setVisibleTagCount(visibleCount);
        setIsCompact(false);
        return;
      }

      // If it doesn't fit, we need to try compact mode (9px)
      // Recalculate everything with 9px font
      let totalWidth9px = 30; // Same base width for compact mode
      let visibleCountCompact = 0;
      
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];
        const tagInfo = predefinedTags.find(t => t.value === tag);
        const tagText = tagInfo ? tagInfo.label : tag;
        // 9px font estimation: scale up for longer tags
        const charWidth9px = tagText.length > 12 ? 4.8 : 4.2;
        const estimatedTagWidth = Math.ceil(tagText.length * charWidth9px) + 16 + 6;
        
        // Calculate remaining count for this iteration
        const currentRemainingCount = tags.length - (i + 1);
        const currentMoreText = `+${currentRemainingCount} more`;
        const currentMoreWidth = currentRemainingCount > 0 ? Math.ceil(currentMoreText.length * 4.2) + 6 : 0;
        
        if (totalWidth9px + estimatedTagWidth + currentMoreWidth <= targetWidth) {
          totalWidth9px += estimatedTagWidth;
          visibleCountCompact = i + 1;
        } else {
          break;
        }
      }

      console.log(`[${type}] Using 9px compact mode: ${visibleCountCompact} visible tags`);
      setVisibleTagCount(visibleCountCompact);
      setIsCompact(true);
    }, [tags, type]);



    if (!tags || tags.length === 0) return null;

    const visibleTags = tags.slice(0, visibleTagCount);
    const remainingTags = tags.slice(visibleTagCount);
    const remainingCount = remainingTags.length;

    console.log(`[${type}] Final render: ${visibleTagCount} visible tags, ${remainingCount} remaining, isCompact: ${isCompact}`);

    return (
      <>
        <div className={`${containerClass}${isCompact ? ` ${containerClass}--compact` : ''}`}>
          <button 
            className={addButtonClass} 
            title="Manage Tags" 
            onClick={(e) => { e.stopPropagation(); handleOpenTagModal(item, type); }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </button>
          {visibleTags.map((tag, index) => (
            <span key={index} className={tagChipClass}>
              {predefinedTags.find(t => t.value === tag)?.label || tag}
            </span>
          ))}
          {remainingCount > 0 && (
            <span 
              className={tagMoreClass}
              onClick={(e) => e.stopPropagation()}
            >
              +{remainingCount} more
            </span>
          )}
        </div>


      </>
    );
  };

  // Tag management functions
  const handleOpenTagModal = (item, type) => {
    // Normalize the item structure for the modal
    const normalizedItem = {
      ...item,
      title: item.title || item.name, // Ensure title exists for all types
      tags: item.tags || [] // Ensure tags array exists
    };
    console.log('Opening tag modal for:', type, 'Item:', normalizedItem);
    console.log('Item tags:', normalizedItem.tags);
    console.log('Predefined tags:', predefinedTags.map(t => t.value));
    setTagModalDocument(normalizedItem);
    setTagModalType(type);
    setIsTagModalOpen(true);
  };

  const handleCloseTagModal = () => {
    setIsTagModalOpen(false);
    setTagModalDocument(null);
    setTagModalType('');
  };

  // Project Create Modal handlers
  const handleCreateProjectClick = () => {
    setIsProjectCreateModalOpen(true);
  };

  const handleProjectCreateClose = () => {
    setIsProjectCreateModalOpen(false);
  };

  const handleProjectCreateSubmit = (projectData) => {
    // Add new project to the list
    setProjects(prev => [projectData, ...prev]);
    setIsProjectCreateModalOpen(false);
    
    // Show success message (you could implement a toast notification here)
    console.log('Project created successfully:', projectData.name);
  };

  // Convert to Project Modal handlers
  const handleConvertToProjectClick = () => {
    setConvertSourceWorkspace(currentWorkspace);
    setIsConvertModalOpen(true);
    setIsWorkspaceMenuOpen(false); // Close the workspace menu
  };

  const handleConvertModalClose = () => {
    setIsConvertModalOpen(false);
    setConvertSourceWorkspace(null);
  };

  // Document Upload Modal handlers
  const handleDocumentUploadClose = () => {
    setIsDocumentUploadModalOpen(false);
  };

  const handleDocumentUpload = (uploadedFiles) => {
    // Handle the uploaded files here
    console.log('Files uploaded:', uploadedFiles);
    // You can add logic to update the documents list or call an API
    setIsDocumentUploadModalOpen(false);
  };

  const handleConvertSubmit = async (conversionData) => {
    console.log('Converting workspace to project:', conversionData);
    
    // Simulate conversion process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success toast (in a real app, this would be handled by a toast system)
    console.log('Conversion successful! New project created in workspace:', conversionData.destinationWorkspaceId);
    
    // In a real implementation, you would:
    // 1. Make API call to convert workspace
    // 2. Update UI to reflect changes
    // 3. Show success toast with link to new project
    // 4. Optionally archive source workspace
    
    return Promise.resolve();
  };

  const handleSaveTagChanges = (itemId, newTags) => {
    if (tagModalType === 'document') {
      setSampleDocuments(prev => 
        prev.map(doc => 
          doc.id === itemId ? { ...doc, tags: newTags } : doc
        )
      );
    } else if (tagModalType === 'task') {
      setSampleTasks(prev => 
        prev.map(task => 
          task.id === itemId ? { ...task, tags: newTags } : task
        )
      );
    } else if (tagModalType === 'savedWork') {
      setSampleSavedWork(prev => 
        prev.map(work => 
          work.id === itemId ? { ...work, tags: newTags } : work
        )
      );
    }
  };

  const handleWorkspaceMenuClick = () => {
    setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen);
  };

  const handleWorkspaceMenuClose = () => {
    setIsWorkspaceMenuOpen(false);
  };

  const handleProjectMenuClick = () => {
    setIsProjectMenuOpen(!isProjectMenuOpen);
  };

  const handleProjectMenuClose = () => {
    setIsProjectMenuOpen(false);
  };

  const handleProjectSelect = (project) => {
    onProjectSelect(project);
    setIsProjectMenuOpen(false); // Close the project menu after selection
  };

  const handleSectionClick = (sectionType) => {
    // Close other menus first
    setIsFilesMenuOpen(false);
    setIsSavedWorkMenuOpen(false);
    
    // Toggle behavior: close if same section is clicked while menu is open
    if (isSectionMenuOpen && activeSectionType === sectionType) {
      setIsSectionMenuOpen(false);
      setActiveSectionType('');
    } else {
      setActiveSectionType(sectionType);
      setIsSectionMenuOpen(true);
    }
  };

  const handleSectionMenuClose = () => {
    setIsSectionMenuOpen(false);
    setActiveSectionType('');
  };

  const handleFilesMenuClick = () => {
    // Close other menus first
    setIsSectionMenuOpen(false);
    setIsSavedWorkMenuOpen(false);
    setActiveSectionType('');
    
    setIsFilesMenuOpen(!isFilesMenuOpen);
  };

  const handleFilesMenuClose = () => {
    setIsFilesMenuOpen(false);
    setActiveDocumentMenu(null); // Close any open document menus
  };

  const handleSavedWorkMenuClick = () => {
    // Close other menus first
    setIsSectionMenuOpen(false);
    setIsFilesMenuOpen(false);
    setActiveSectionType('');
    
    setIsSavedWorkMenuOpen(!isSavedWorkMenuOpen);
  };

  const handleSavedWorkMenuClose = () => {
    setIsSavedWorkMenuOpen(false);
    setActiveEllipsisMenu(null); // Close any open ellipsis menus
  };

  const handleEllipsisMenuClick = (itemId, e) => {
    e.stopPropagation();
    setActiveEllipsisMenu(activeEllipsisMenu === itemId ? null : itemId);
  };

  const handleEllipsisMenuClose = () => {
    setActiveEllipsisMenu(null);
  };

  const handleEllipsisAction = (action, itemId) => {
    // Handle the different ellipsis menu actions
    console.log(`Action: ${action}, Item ID: ${itemId}`);
    setActiveEllipsisMenu(null);
    
    switch(action) {
      case 'edit':
        // Find the saved work item and open DocumentDrawer
        const savedWorkItem = sampleSavedWork.find(item => item.id === itemId);
        if (savedWorkItem) {
          // Map saved work item to document shape for DocumentDrawer
          const documentForDrawer = {
            id: savedWorkItem.id,
            title: savedWorkItem.title,
            type: 'saved_work',
            project: 'Saved Work',
            tags: savedWorkItem.tags || [],
            status: 'approved',
            lastUpdated: savedWorkItem.saved || new Date().toISOString(),
            author: 'Brand Bot'
          };
          setSelectedDocument(documentForDrawer);
          setShowDocumentDrawer(true);
        }
        break;
      case 'share':
        // Launch share modal
        break;
      case 'archive':
        // Move to archive
        break;
      case 'delete':
        // Show confirmation modal then delete
        break;
      case 'move':
        // Open move to project modal
        break;
      default:
        break;
    }
  };

  const handleDocumentMenuClick = (docId, e) => {
    e.stopPropagation();
    setActiveDocumentMenu(activeDocumentMenu === docId ? null : docId);
  };

  const handleDocumentMenuClose = () => {
    setActiveDocumentMenu(null);
  };

  const handleProjectCardMenuClick = (projectId, e) => {
    e.stopPropagation();
    setActiveProjectMenu(activeProjectMenu === projectId ? null : projectId);
  };

  const handleProjectCardMenuClose = () => {
    setActiveProjectMenu(null);
  };

  const handleProjectAction = (action, projectId) => {
    // Handle the different project menu actions
    console.log(`Action: ${action}, Project ID: ${projectId}`);
    setActiveProjectMenu(null);
    
    // TODO: Implement actual functionality for each action
    switch(action) {
      case 'edit':
        // Open edit modal
        break;
      case 'share':
        // Launch share modal
        break;
      case 'archive':
        // Move to archive
        break;
      case 'delete':
        // Show confirmation modal then delete
        break;
      case 'move':
        // Open move to workspace modal
        break;
      default:
        break;
    }
  };

  // Task menu handlers
  const handleTaskMenuClick = (taskId, e) => {
    e.stopPropagation();
    setActiveTaskMenu(activeTaskMenu === taskId ? null : taskId);
  };

  const handleTaskMenuClose = () => {
    setActiveTaskMenu(null);
  };

  const handleTaskAction = (action, taskId) => {
    // Handle the different task menu actions
    console.log(`Action: ${action}, Task ID: ${taskId}`);
    setActiveTaskMenu(null);
    
    switch(action) {
      case 'edit':
        // Find the task and open DocumentDrawer
        const task = sampleTasks.find(t => t.id === taskId);
        if (task) {
          // Map task to document shape for DocumentDrawer
          const documentForDrawer = {
            id: task.id,
            title: task.title,
            type: 'task',
            project: 'Tasks',
            tags: task.tags || [],
            status: task.completed ? 'approved' : 'draft',
            lastUpdated: task.updated || new Date().toISOString(),
            author: 'Brand Bot'
          };
          setSelectedDocument(documentForDrawer);
          setShowDocumentDrawer(true);
        }
        break;
      case 'share':
        // Launch share modal
        break;
      case 'archive':
        // Move to archive
        break;
      case 'delete':
        // Show confirmation modal then delete
        break;
      case 'move':
        // Open move to project modal
        break;
      default:
        break;
    }
  };

  const handleDocumentAction = (action, docId) => {
    // Handle the different document menu actions
    console.log(`Document Action: ${action}, Doc ID: ${docId}`);
    setActiveDocumentMenu(null);
    
    // TODO: Implement actual functionality for each action
    switch(action) {
      case 'edit':
        // Open edit modal
        break;
      case 'share':
        // Launch share modal
        break;
      case 'archive':
        // Move to archive
        break;
      case 'delete':
        // Show confirmation modal then delete
        break;
      case 'move':
        // Open move to project modal
        break;
      default:
        break;
    }
  };

  const getSectionTitle = (sectionType) => {
    switch(sectionType) {
      case 'chats': return 'Project Chats';
      case 'files': return 'Uploaded Files';
      case 'work': return 'Saved Work';
      default: return '';
    }
  };





  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ignore clicks on the tag management modal or when modal is open
      if (isTagModalOpen || 
          event.target.closest('.tag-management-modal') || 
          event.target.closest('.tag-management-modal__backdrop') ||
          event.target.classList.contains('tag-management-modal__backdrop')) {
        return;
      }
      
      // Workspace menu should only close via the close button, so no click-outside behavior
      
      if (projectMenuRef.current && !projectMenuRef.current.contains(event.target)) {
        // Check if the clicked element is the project toggle button or its children
        const isToggleButton = event.target.closest('.sidebar__create-project');
        if (!isToggleButton) {
          setIsProjectMenuOpen(false);
        }
      }
      if (sectionMenuRef.current && !sectionMenuRef.current.contains(event.target)) {
        // Check if the clicked element is the section trigger button or its children
        const isSectionTrigger = event.target.closest('.sidebar__project-section-item');
        if (!isSectionTrigger) {
          setIsSectionMenuOpen(false);
        }
      }
      if (filesMenuRef.current && !filesMenuRef.current.contains(event.target)) {
        // Check if the clicked element is the files trigger button or its children
        const isFilesTrigger = event.target.closest('.sidebar__uploaded-files-item');
        if (!isFilesTrigger) {
          setIsFilesMenuOpen(false);
        }
      }
      if (savedWorkMenuRef.current && !savedWorkMenuRef.current.contains(event.target)) {
        // Check if the clicked element is the saved work trigger button or its children
        const isSavedWorkTrigger = event.target.closest('.sidebar__saved-work-item');
        if (!isSavedWorkTrigger) {
          setIsSavedWorkMenuOpen(false);
          setActiveEllipsisMenu(null); // Close any open ellipsis menus
        }
      }

      // Handle ellipsis menu click outside
      if (activeEllipsisMenu && ellipsisMenuRef.current && !ellipsisMenuRef.current.contains(event.target)) {
        // Check if the clicked element is an ellipsis button
        const isEllipsisButton = event.target.closest('.saved-work-menu__item-menu');
        if (!isEllipsisButton) {
          setActiveEllipsisMenu(null);
        }
      }

      // Handle document menu click outside
      if (activeDocumentMenu && documentMenuRef.current && !documentMenuRef.current.contains(event.target)) {
        // Check if the clicked element is a document ellipsis button
        const isDocumentButton = event.target.closest('.files-menu__document-menu');
        if (!isDocumentButton) {
          setActiveDocumentMenu(null);
        }
      }
      // Handle project menu click outside
      if (activeProjectMenu && projectMenuDropdownRef.current && !projectMenuDropdownRef.current.contains(event.target)) {
        // Check if the clicked element is a project ellipsis button
        const isProjectButton = event.target.closest('.project-menu__project-menu');
        if (!isProjectButton) {
          setActiveProjectMenu(null);
        }
      }
    };

    // Only listen for click outside on other menus, not workspace menu
    if (isProjectMenuOpen || isSectionMenuOpen || isFilesMenuOpen || isSavedWorkMenuOpen || activeEllipsisMenu || activeDocumentMenu || activeProjectMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isProjectMenuOpen, isSectionMenuOpen, isFilesMenuOpen, isSavedWorkMenuOpen, activeEllipsisMenu, activeDocumentMenu, activeProjectMenu, isTagModalOpen]);

  return (
    <>
      <div className="sidebar nav-container">
      {/* Workspace Header */}
      <div 
        className="sidebar__workspace-header" 
        ref={workspaceMenuRef}
        onClick={handleWorkspaceMenuClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="sidebar__workspace-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="folder-icon">
            <defs>
              <clipPath id="clipPath4370725531-folder">
                <path d="M0 0L16 0L16 16L0 16L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 4 4)"/>
              </clipPath>
            </defs>
            <g clipPath="url(#clipPath4370725531-folder)">
              <defs>
                <clipPath id="clipPath2775076877-folder">
                  <path d="M0 0L16 0L16 16L0 16L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 4 4)"/>
                </clipPath>
              </defs>
              <g clipPath="url(#clipPath2775076877-folder)">
                <path d="M7.00207 0.67082L0.33541 4.00415L0 3.33333L0.335411 2.66251L7.00207 5.99585L6.66666 6.66667L6.33125 5.99585L12.998 2.66251L13.3334 3.33333L12.998 4.00415L6.33125 0.670821L6.66666 0L7.00207 0.67082ZM6.33125 -0.67082Q6.40936 -0.709873 6.49434 -0.729937Q6.57933 -0.75 6.66666 -0.75Q6.75398 -0.75 6.83897 -0.729937Q6.92396 -0.709874 7.00207 -0.670821L13.6688 2.66251Q13.7776 2.71694 13.8637 2.803Q13.9498 2.88906 14.0042 2.99792Q14.0372 3.06399 14.0567 3.13524Q14.0762 3.20648 14.0815 3.28016Q14.0867 3.35385 14.0775 3.42713Q14.0682 3.50042 14.0449 3.5705Q14.0215 3.64058 13.9849 3.70475Q13.9483 3.76893 13.8999 3.82473Q13.8515 3.88054 13.7932 3.92583Q13.7348 3.97112 13.6688 4.00415L7.00207 7.33749Q6.92396 7.37654 6.83897 7.39661Q6.75398 7.41667 6.66666 7.41667Q6.57933 7.41667 6.49434 7.39661Q6.40936 7.37654 6.33125 7.33749L-0.335411 4.00415Q-0.44427 3.94972 -0.53033 3.86366Q-0.616391 3.7776 -0.67082 3.66874Q-0.703855 3.60267 -0.723366 3.53142Q-0.742877 3.46018 -0.748113 3.3865Q-0.75335 3.31281 -0.744111 3.23952Q-0.734872 3.16624 -0.711512 3.09616Q-0.688153 3.02608 -0.651571 2.96191Q-0.614989 2.89773 -0.56659 2.84193Q-0.518192 2.78612 -0.459836 2.74083Q-0.40148 2.69554 -0.33541 2.66251L6.33125 -0.67082Z" fillRule="nonzero" transform="matrix(1 0 0 1 5.33334 5.33334)" fill="var(--theme-primary-deep)"/>
                <path d="M-0.670818 -0.335416C-0.856061 0.0350633 -0.705895 0.485574 -0.335416 0.670818L6.33124 4.00422Q6.40935 4.04327 6.49434 4.06334Q6.57933 4.0834 6.66666 4.0834Q6.75398 4.0834 6.83898 4.06334Q6.92397 4.04327 7.00207 4.00422L13.6688 0.670818C14.0393 0.485576 14.1894 0.0350651 14.0042 -0.335414C13.8189 -0.705894 13.3684 -0.856061 12.9979 -0.670818L6.66666 2.49487L0.335416 -0.670818C-0.0350633 -0.856061 -0.485574 -0.705895 -0.670818 -0.335416Z" fillRule="evenodd" transform="matrix(1 0 0 1 5.33334 15.3333)" fill="var(--theme-primary-deep)"/>
                <path d="M-0.335408 0.670822C-0.705889 0.485582 -0.856061 0.0350735 -0.670822 -0.335408C-0.485582 -0.705889 -0.0350735 -0.856061 0.335408 -0.670822L-0.335408 0.670822ZM12.998 -0.670822L6.66666 2.49478L0.335408 -0.670822L-0.335408 0.670822L6.33125 4.00412Q6.40936 4.04317 6.49435 4.06324Q6.57933 4.0833 6.66666 4.0833Q6.75398 4.0833 6.83897 4.06324Q6.92396 4.04317 7.00207 4.00412L13.6688 0.670822C14.0392 0.485584 14.1894 0.0350758 14.0042 -0.335406C13.8189 -0.705888 13.3684 -0.856061 12.998 -0.670822Z" fillRule="evenodd" transform="matrix(1 0 0 1 5.33334 12)" fill="var(--theme-primary-deep)"/>
              </g>
            </g>
          </svg>
          <span className="sidebar__workspace-name">Workspace 1</span>
        </div>


      </div>

      {/* Active Tab Section */}
      <div className="sidebar__active-section">
        <div 
          className="sidebar__active-tab ellament-tab"
          onClick={() => setShowEllamentDrawer(true)}
          style={{ cursor: 'pointer' }}
        >
          <div className="sidebar__tab-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 1275.12 1225.43"
              className="chat-icon"
            >
              <path
                d="M833.45,622.12v96.07c0,55.59-45.06,100.65-100.65,100.65h-192.13c-55.59,0-100.65-45.06-100.65-100.65v-192.13c0-55.59,45.06-100.65,100.65-100.65h96.07"
                fill="none"
                stroke="var(--theme-primary-deep)"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="28"
              />
              <g>
                <path
                  d="M708.49,630.13c3.21,7.6,5.81,15.52,7.75,23.7.44,1.87,2.1,3.21,4.02,3.21h.07c1.92,0,3.58-1.34,4.02-3.21,1.94-8.18,4.54-16.1,7.75-23.7,18.41-43.53,56.77-76.57,103.62-87.67,1.87-.44,3.21-2.1,3.21-4.02v-.07c0-1.92-1.34-3.58-3.21-4.02-46.85-11.1-85.21-44.14-103.62-87.67-3.21-7.6-5.81-15.52-7.75-23.7-.44-1.87-2.1-3.21-4.02-3.21h-.07c-1.92,0-3.58,1.34-4.02,3.21-1.94,8.18-4.54,16.1-7.75,23.7-18.41,43.53-56.77,76.57-103.62,87.67-1.87.44-3.21,2.1-3.21,4.02v.07c0,1.92,1.34,3.58,3.21,4.02,46.85,11.1,85.21,44.14,103.62,87.67Z"
                  fill="var(--theme-primary-deep)"
                />
                <path
                  d="M571.91,732.21c1.83,4.33,3.32,8.85,4.42,13.52.25,1.07,1.2,1.83,2.29,1.83h.04c1.1,0,2.04-.77,2.29-1.83,1.1-4.66,2.59-9.18,4.42-13.52,10.5-24.83,32.38-43.67,59.1-50.01,1.07-.25,1.83-1.2,1.83-2.29v-.04c0-1.09-.77-2.04-1.83-2.29-26.72-6.33-48.6-25.18-59.1-50.01-1.83-4.33-3.32-8.85-4.42-13.52-.25-1.07-1.2-1.83-2.29-1.83h-.04c-1.1,0-2.04.77-2.29,1.83-1.1,4.66-2.59,9.18-4.42,13.52-10.5,24.83-32.38,43.67-59.1,50.01-1.07.25-1.83,1.2-1.83,2.29v.04c0,1.09.77,2.04,1.83,2.29,26.72,6.33,48.6,25.18,59.1,50.01Z"
                  fill="var(--theme-primary-deep)"
                />
              </g>
            </svg>
            <span className="sidebar__tab-text">Brand Bot Ella-ments</span>
          </div>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <CircularProgress 
              determinate 
              value={50}
              sx={{ 
                width: 48, 
                height: 48,
                '--CircularProgress-progressColor': 'var(--theme-interactive-primary)',
                color: 'var(--theme-interactive-primary)',
                '& .MuiCircularProgress-progress': {
                  stroke: 'var(--theme-interactive-primary)'
                }
              }}
            >
              50%
            </CircularProgress>
          </Box>
        </div>

        {/* New Chat Button */}
        <div 
          className="sidebar__new-chat-button"
          onClick={onNewChat}
          style={{ cursor: 'pointer' }}
        >
          + New Chat
        </div>

        {/* Recent Chats */}
        <div className="sidebar__recent-section">
          <div 
            className="sidebar__recent-header"
            onClick={() => setIsRecentChatsExpanded(!isRecentChatsExpanded)}
          >
            <div className="sidebar__recent-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className="clock-icon">
                <defs>
                  <clipPath id="clipPath4007935854-clock">
                    <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                  </clipPath>
                </defs>
                <g clipPath="url(#clipPath4007935854-clock)">
                  <defs>
                    <clipPath id="clipPath1227593552-clock">
                      <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                    </clipPath>
                  </defs>
                  <g clipPath="url(#clipPath1227593552-clock)">
                    <path d="M15.8333 10Q15.8333 11.0355 15.1011 11.7678Q14.3689 12.5 13.3333 12.5L3.33333 12.5L3.33333 11.6667L3.92259 12.2559L0.589256 15.5893Q0.531219 15.6473 0.462975 15.6929Q0.394731 15.7385 0.318903 15.7699Q0.243074 15.8013 0.162575 15.8173Q0.0820763 15.8333 1.3411e-07 15.8333Q-0.082076 15.8333 -0.162575 15.8173Q-0.243074 15.8013 -0.318903 15.7699Q-0.394731 15.7385 -0.462975 15.6929Q-0.531219 15.6473 -0.589256 15.5893Q-0.706466 15.472 -0.7699 15.3189Q-0.833333 15.1658 -0.833333 15L-0.833333 1.66667Q-0.833333 0.631132 -0.1011 -0.1011Q0.631133 -0.833333 1.66667 -0.833333L13.3333 -0.833333Q14.3689 -0.833333 15.1011 -0.101101Q15.8333 0.631131 15.8333 1.66667L15.8333 10ZM14.1667 10L14.1667 1.66667Q14.1667 1.32149 13.9226 1.07741Q13.6785 0.833333 13.3333 0.833333L1.66667 0.833333Q1.32149 0.833333 1.07741 1.07741Q0.833333 1.32149 0.833333 1.66667L0.833333 15L0 15L-0.589256 14.4107L2.74408 11.0774Q2.86129 10.9602 3.01443 10.8968Q3.16757 10.8333 3.33333 10.8333L13.3333 10.8333Q13.6785 10.8333 13.9226 10.5893Q14.1667 10.3452 14.1667 10Z" fillRule="nonzero" transform="matrix(1 0 0 1 2.5 2.5)" fill="var(--theme-primary-deep)"/>
                  </g>
                </g>
              </svg>
              <span>Recent Chats</span>
            </div>
            <div className={`sidebar__chevron ${isRecentChatsExpanded ? 'expanded' : 'collapsed'}`}>
              <ChevronUpIcon />
            </div>
          </div>

          {isRecentChatsExpanded && (
            <div className="sidebar__chat-list">
              {recentChats.map(chat => (
                <ChatItem key={chat.id} {...chat} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Projects Section */}
      <div className="sidebar__projects-section">
        <div className="sidebar__projects-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className="project-icon">
            <defs>
              <clipPath id="clipPath4532578984-project">
                <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
              </clipPath>
            </defs>
            <g clipPath="url(#clipPath4532578984-project)">
              <defs>
                <clipPath id="clipPath0426603476-project">
                  <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                </clipPath>
              </defs>
              <g clipPath="url(#clipPath0426603476-project)">
                <path d="M15.9375 14.375L1.5625 14.375Q0.656407 14.375 0.0157034 13.7343Q-0.625 13.0936 -0.625 12.1875L-0.625 1.5625Q-0.625 0.656408 0.0157039 0.0157039Q0.656408 -0.625 1.5625 -0.625L4.52695 -0.625Q4.8509 -0.624992 5.16094 -0.531102Q5.47097 -0.437213 5.74049 -0.257499L6.82794 0.467469Q6.94349 0.544519 7.07636 0.584758Q7.20923 0.624996 7.34806 0.625L15.9375 0.625Q16.8436 0.625 17.4843 1.2657Q18.125 1.90641 18.125 2.8125L18.125 12.1875Q18.125 13.0936 17.4843 13.7343Q16.8436 14.375 15.9375 14.375ZM16.875 5L16.875 12.1875Q16.875 12.5758 16.6004 12.8504Q16.3258 13.125 15.9375 13.125L1.5625 13.125Q1.17418 13.125 0.899588 12.8504Q0.625 12.5758 0.625 12.1875L0.625 5L16.875 5ZM16.875 3.75L0.625 3.75L0.625 1.5625Q0.625 1.17417 0.899587 0.899587Q1.17417 0.625 1.5625 0.625L4.52695 0.625Q4.66577 0.625003 4.79864 0.665242Q4.93151 0.70548 5.04701 0.782499L6.13456 1.50753Q6.40403 1.68721 6.71406 1.7811Q7.0241 1.87499 7.34803 1.875L15.9375 1.875Q16.3258 1.875 16.6004 2.14959Q16.875 2.42418 16.875 2.8125L16.875 3.75Z" fillRule="evenodd" transform="matrix(1 0 0 1 1.25 3.125)" fill="var(--theme-primary-deep)"/>
              </g>
            </g>
          </svg>
          
          {/* Show breadcrumb when project is selected */}
          {selectedProject ? (
            <div className="sidebar__projects-breadcrumb">
              <span className="sidebar__projects-breadcrumb-item sidebar__projects-breadcrumb-item--parent">Projects</span>
              <svg className="sidebar__projects-breadcrumb-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="sidebar__projects-breadcrumb-item sidebar__projects-breadcrumb-item--current">{selectedProject.name}</span>
            </div>
          ) : (
          <span>Projects</span>
          )}
          
          <div 
            className="sidebar__create-project"
            onClick={handleProjectMenuClick}
            style={{ cursor: 'pointer' }}
          >
            {/* Hide text when project is selected, but keep the chevron */}
            {!selectedProject && <span>+ create a project</span>}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              xmlnsXlink="http://www.w3.org/1999/xlink" 
              width="20" 
              height="20" 
              viewBox="0 0 20.3672 20.3647" 
              style={{ 
                transform: isProjectMenuOpen ? 'rotate(90deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <defs>
                                  <clipPath id="clipPathSidebarChevron">
                    <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(0.999831 0.0184092 -0.0184092 0.999831 0.368187 -2.47955e-05)"/>
                  </clipPath>
              </defs>
              <g clipPath="url(#clipPathSidebarChevron)">
                <path d="M-0.662913 -0.662913C-1.02903 -0.296799 -1.02903 0.296799 -0.662913 0.662913L4.96209 6.28791Q5.09395 6.41977 5.26623 6.49114Q5.43852 6.5625 5.625 6.5625Q5.81148 6.5625 5.98377 6.49114Q6.15605 6.41977 6.28791 6.28791L11.9129 0.662913C12.279 0.296799 12.279 -0.296799 11.9129 -0.662913C11.5468 -1.02903 10.9532 -1.02903 10.5871 -0.662912L5.625 4.29918L0.662913 -0.662913C0.296799 -1.02903 -0.296799 -1.02903 -0.662913 -0.662913Z" fillRule="evenodd" transform="matrix(0.999831 0.0184092 -0.0184092 0.999831 4.61013 7.2668)" fill="rgb(156, 163, 175)"/>
              </g>
            </svg>
          </div>
        </div>

        {/* Project-specific sections - only show when a project is selected */}
        {selectedProject && (
          <div className="sidebar__project-sections">
                          <div 
                className={`sidebar__project-section-item ${isSectionMenuOpen ? 'sidebar__project-section-item--active' : ''}`}
                onClick={() => handleSectionClick('chats')}
                style={{ cursor: 'pointer' }}
              >
              <div className="sidebar__project-section-content">
                Project Chats
              </div>
            </div>
                          <div 
                className={`sidebar__project-section-item sidebar__uploaded-files-item ${isFilesMenuOpen ? 'sidebar__project-section-item--active' : ''}`}
                onClick={handleFilesMenuClick}
                style={{ cursor: 'pointer' }}
              >
              <div className="sidebar__project-section-content">
                Uploaded Files
              </div>
            </div>
                          <div 
                className={`sidebar__project-section-item sidebar__saved-work-item ${isSavedWorkMenuOpen ? 'sidebar__project-section-item--active' : ''}`}
                onClick={handleSavedWorkMenuClick}
                style={{ cursor: 'pointer' }}
              >
              <div className="sidebar__project-section-content">
                Saved Work
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sliding Project Menu */}
      <div 
        className={`project-menu ${isProjectMenuOpen ? 'project-menu--open' : ''}`}
        ref={projectMenuRef}
      >
        <div className="project-menu__content">
          {/* Header */}
          <div className="project-menu__header">
            <button 
              className="project-menu__close"
              onClick={handleProjectMenuClose}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="#D3D0D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Create Project Button */}
          <div className="project-menu__create">
            <button 
              className="project-menu__create-btn"
              onClick={handleCreateProjectClick}
            >
              + Create Project
            </button>
          </div>

          {/* Search */}
          <div className="project-menu__search">
            <div className="project-menu__search-container">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6.5 12C9.26142 12 11.5 9.76142 11.5 7C11.5 4.23858 9.26142 2 6.5 2C3.73858 2 1.5 4.23858 1.5 7C1.5 9.76142 3.73858 12 6.5 12Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.5 12.5L10.5 10.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search projects..."
                className="project-menu__search-input"
              />
            </div>
          </div>

          {/* Filter Categories */}
          <div className="project-menu__filters">
            <div className="project-menu__filter-item">
              <div className="project-menu__filter-content">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 3h14v2H2V3zm1 4h12v2H3V7zm2 4h8v2H5v-2z" fill="#6B7280"/>
                </svg>
                <span>All Projects</span>
              </div>
              <div className="project-menu__filter-count">{projects.length}</div>
            </div>

            <div className="project-menu__filter-item">
              <div className="project-menu__filter-content">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1.5L11.5 6.5H16L12.5 10L14 15L9 12L4 15L5.5 10L2 6.5H6.5L9 1.5Z" fill="#6B7280"/>
                </svg>
                <span>Favorites</span>
              </div>
              <div className="project-menu__filter-count">3</div>
            </div>
          </div>

          {/* Projects List */}
          <div className="project-menu__projects">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="project-menu__project-card"
                onClick={() => handleProjectSelect({
                  id: project.id,
                  name: project.name,
                  description: project.description,
                  workspace: 'Workspace 1',
                  updatedDate: new Date(project.createdAt).toLocaleDateString()
                })}
                style={{ cursor: 'pointer' }}
              >
                <div className="project-menu__project-header">
                  <h3 className="project-menu__project-title">{project.name}</h3>
                  <div className="project-menu__project-actions">
                    <div className="project-menu__project-menu-container">
                      <button 
                        className="project-menu__project-menu"
                        onClick={(e) => handleProjectCardMenuClick(project.id, e)}
                      >
                        <EllipsisIcon width={12} height={12} />
                      </button>
                      
                      {activeProjectMenu === project.id && (
                        <div className="project-menu__project-dropdown" ref={projectMenuDropdownRef}>
                          <button 
                            className="project-menu__project-dropdown-option"
                            onClick={() => handleProjectAction('edit', project.id)}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M6.36 2.68L2.5 6.54L2.5 8.96L4.92 8.96L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46ZM1.5 5.54L8.78 -1.74C9.17 -2.13 9.81 -2.13 10.2 -1.74L11.24 -0.7C11.63 -0.31 11.63 0.33 11.24 0.72L3.96 7.96L1.5 8.96L1.5 5.54Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Edit
                          </button>
                          <button 
                            className="project-menu__project-dropdown-option"
                            onClick={() => handleProjectAction('share', project.id)}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M11 9.5C10.59 9.5 10.22 9.65 9.93 9.88L4.69 7.26C4.73 7.09 4.75 6.91 4.75 6.75C4.75 6.59 4.73 6.41 4.69 6.24L9.93 3.62C10.22 3.85 10.59 4 11 4C12.1 4 13 3.1 13 2C13 0.9 12.1 0 11 0C9.9 0 9 0.9 9 2C9 2.16 9.02 2.34 9.06 2.51L3.82 5.13C3.53 4.9 3.16 4.75 2.75 4.75C1.65 4.75 0.75 5.65 0.75 6.75C0.75 7.85 1.65 8.75 2.75 8.75C3.16 8.75 3.53 8.6 3.82 8.37L9.06 10.99C9.02 11.16 9 11.34 9 11.5C9 12.6 9.9 13.5 11 13.5C12.1 13.5 13 12.6 13 11.5C13 10.4 12.1 9.5 11 9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Share
                          </button>
                          <button 
                            className="project-menu__project-dropdown-option"
                            onClick={() => handleProjectAction('archive', project.id)}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M12.25 3.5L1.75 3.5L1.75 11.25C1.75 11.8 2.2 12.25 2.75 12.25L11.25 12.25C11.8 12.25 12.25 11.8 12.25 11.25L12.25 3.5ZM5.25 7L8.75 7M0.5 1.75L13.5 1.75C13.78 1.75 14 1.97 14 2.25L14 3.5L0 3.5L0 2.25C0 1.97 0.22 1.75 0.5 1.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Archive
                          </button>
                          <button 
                            className="project-menu__project-dropdown-option"
                            onClick={() => handleProjectAction('move', project.id)}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2.5 1.75L11.5 1.75C12.05 1.75 12.5 2.2 12.5 2.75L12.5 4.75M1.5 5.75L10.5 5.75C11.05 5.75 11.5 6.2 11.5 6.75L11.5 11.25C11.5 11.8 11.05 12.25 10.5 12.25L1.5 12.25C0.95 12.25 0.5 11.8 0.5 11.25L0.5 6.75C0.5 6.2 0.95 5.75 1.5 5.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Move
                          </button>
                          <hr className="project-menu__project-dropdown-divider" />
                          <button 
                            className="project-menu__project-dropdown-option project-menu__project-dropdown-option--danger"
                            onClick={() => handleProjectAction('delete', project.id)}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M1.75 3.5L12.25 3.5M5.25 6.5L5.25 10.5M8.75 6.5L8.75 10.5M2.625 3.5L2.625 11.375C2.625 11.9273 3.07272 12.375 3.625 12.375L10.375 12.375C10.9273 12.375 11.375 11.9273 11.375 11.375L11.375 3.5M5.25 3.5L5.25 2.625C5.25 2.07272 5.69772 1.625 6.25 1.625L7.75 1.625C8.30228 1.625 8.75 2.07272 8.75 2.625L8.75 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="project-menu__project-description">
                  {project.description}
                </p>
                <div className="project-menu__project-meta">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <defs>
                      <clipPath id={`clipPath-${project.id}`}>
                        <path d="M0 0L12 0L12 12L0 12L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                      </clipPath>
                    </defs>
                    <g clipPath={`url(#clipPath-${project.id})`}>
                      <path d="M0 -0.5625C-0.310658 -0.5625 -0.5625 -0.310658 -0.5625 0L-0.5625 2.5Q-0.5625 2.61189 -0.519682 2.71526Q-0.476864 2.81864 -0.397747 2.89775L1.10225 4.39775C1.32192 4.61741 1.67808 4.61741 1.89775 4.39774C2.11742 4.17808 2.11742 3.82192 1.89775 3.60225L0.5625 2.26701L0.5625 0C0.5625 -0.310658 0.310658 -0.5625 0 -0.5625Z" fillRule="evenodd" transform="matrix(1 0 0 1 6 3.5)" fill="rgb(107, 114, 128)"/>
                      <path d="M4.5 8.4375Q5.30147 8.4375 6.03251 8.1283Q6.73903 7.82947 7.28427 7.28423Q7.82951 6.73899 8.12835 6.03248Q8.43754 5.30146 8.43754 4.50001Q8.43754 3.69855 8.12835 2.96752Q7.82951 2.26101 7.28427 1.71577Q6.73903 1.17053 6.03251 0.871698Q5.30147 0.5625 4.5 0.5625Q3.69854 0.5625 2.96752 0.871697Q2.26101 1.17053 1.71577 1.71577Q1.17053 2.26101 0.871698 2.96752Q0.5625 3.69855 0.5625 4.50001Q0.5625 5.30146 0.871697 6.03248Q1.17053 6.73899 1.71577 7.28423Q2.261 7.82947 2.96752 8.1283Q3.69854 8.4375 4.5 8.4375ZM4.5 9.5625Q3.47041 9.5625 2.52927 9.16443Q1.62066 8.78012 0.920271 8.07973Q0.219875 7.37933 -0.164433 6.47073Q-0.5625 5.52959 -0.5625 4.50001Q-0.5625 3.47041 -0.164433 2.52928Q0.219875 1.62067 0.920271 0.920273Q1.62067 0.219875 2.52927 -0.164433Q3.47041 -0.5625 4.5 -0.5625Q5.5296 -0.5625 6.47075 -0.164434Q7.37936 0.219872 8.07976 0.920271Q8.78016 1.62067 9.16448 2.52928Q9.56254 3.47041 9.56254 4.50001Q9.56255 5.5296 9.16448 6.47073Q8.78016 7.37933 8.07976 8.07973Q7.37936 8.78013 6.47075 9.16443Q5.5296 9.5625 4.5 9.5625Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.50003 1.5)" fill="rgb(107, 114, 128)"/>
                    </g>
                  </svg>
                  <span>Updated: {new Date(project.createdAt).toLocaleDateString()} @ {new Date(project.createdAt).toLocaleTimeString([], {hour: 'numeric', minute: '2-digit', hour12: true}).toLowerCase()}</span>
                </div>
              </div>
            ))}
            <div 
              className="project-menu__project-card"
              onClick={() => handleProjectSelect({
                id: 'project-a',
                name: 'Project A',
                description: 'Online shopping platform with modern UI/UX',
                workspace: 'Workspace 1',
                updatedDate: '05/13/2025'
              })}
              style={{ cursor: 'pointer' }}
            >
              <div className="project-menu__project-header">
                <h3 className="project-menu__project-title">Project A</h3>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 1.5L11.5 6.5H16L12.5 10L14 15L9 12L4 15L5.5 10L2 6.5H6.5L9 1.5Z" fill="#6B7280"/>
                </svg>
                <div className="project-menu__project-actions">
                  <div className="project-menu__project-menu-container">
                    <button 
                      className="project-menu__project-menu"
                      onClick={(e) => handleProjectCardMenuClick('project-a', e)}
                    >
                      <EllipsisIcon width={12} height={12} />
                    </button>
                    
                    {activeProjectMenu === 'project-a' && (
                      <div className="project-menu__project-dropdown" ref={projectMenuDropdownRef}>
                        <button 
                          className="project-menu__project-dropdown-option"
                          onClick={() => handleProjectAction('edit', 'project-a')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M6.36 2.68L2.5 6.54L2.5 8.96L4.92 8.96L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46ZM1.5 5.54L8.78 -1.74C9.17 -2.13 9.81 -2.13 10.2 -1.74L11.24 -0.7C11.63 -0.31 11.63 0.33 11.24 0.72L3.96 7.96L1.5 8.96L1.5 5.54Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Edit
                        </button>
                        <button 
                          className="project-menu__project-dropdown-option"
                          onClick={() => handleProjectAction('share', 'project-a')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11 9.5C10.59 9.5 10.22 9.65 9.93 9.88L4.69 7.26C4.73 7.09 4.75 6.91 4.75 6.75C4.75 6.59 4.73 6.41 4.69 6.24L9.93 3.62C10.22 3.85 10.59 4 11 4C12.1 4 13 3.1 13 2C13 0.9 12.1 0 11 0C9.9 0 9 0.9 9 2C9 2.16 9.02 2.34 9.06 2.51L3.82 5.13C3.53 4.9 3.16 4.75 2.75 4.75C1.65 4.75 0.75 5.65 0.75 6.75C0.75 7.85 1.65 8.75 2.75 8.75C3.16 8.75 3.53 8.6 3.82 8.37L9.06 10.99C9.02 11.16 9 11.34 9 11.5C9 12.6 9.9 13.5 11 13.5C12.1 13.5 13 12.6 13 11.5C13 10.4 12.1 9.5 11 9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Share
                        </button>
                        <button 
                          className="project-menu__project-dropdown-option"
                          onClick={() => handleProjectAction('archive', 'project-a')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12.25 3.5L1.75 3.5L1.75 11.25C1.75 11.8 2.2 12.25 2.75 12.25L11.25 12.25C11.8 12.25 12.25 11.8 12.25 11.25L12.25 3.5ZM5.25 7L8.75 7M0.5 1.75L13.5 1.75C13.78 1.75 14 1.97 14 2.25L14 3.5L0 3.5L0 2.25C0 1.97 0.22 1.75 0.5 1.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Archive
                        </button>
                        <button 
                          className="project-menu__project-dropdown-option"
                          onClick={() => handleProjectAction('move', 'project-a')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 1.75L11.5 1.75C12.05 1.75 12.5 2.2 12.5 2.75L12.5 4.75M1.5 5.75L10.5 5.75C11.05 5.75 11.5 6.2 11.5 6.75L11.5 11.25C11.5 11.8 11.05 12.25 10.5 12.25L1.5 12.25C0.95 12.25 0.5 11.8 0.5 11.25L0.5 6.75C0.5 6.2 0.95 5.75 1.5 5.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Move
                        </button>
                        <hr className="project-menu__project-dropdown-divider" />
                        <button 
                          className="project-menu__project-dropdown-option project-menu__project-dropdown-option--danger"
                          onClick={() => handleProjectAction('delete', 'project-a')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1.75 3.5L12.25 3.5M5.25 6.5L5.25 10.5M8.75 6.5L8.75 10.5M2.625 3.5L2.625 11.375C2.625 11.9273 3.07272 12.375 3.625 12.375L10.375 12.375C10.9273 12.375 11.375 11.9273 11.375 11.375L11.375 3.5M5.25 3.5L5.25 2.625C5.25 2.07272 5.69772 1.625 6.25 1.625L7.75 1.625C8.30228 1.625 8.75 2.07272 8.75 2.625L8.75 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="project-menu__project-description">
                Online shopping platform with modern UI/UX
              </p>
              <div className="project-menu__project-meta">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <defs>
                    <clipPath id="clipPath0737389489-1">
                      <path d="M0 0L12 0L12 12L0 12L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                    </clipPath>
                  </defs>
                  <g clipPath="url(#clipPath0737389489-1)">
                    <path d="M0 -0.5625C-0.310658 -0.5625 -0.5625 -0.310658 -0.5625 0L-0.5625 2.5Q-0.5625 2.61189 -0.519682 2.71526Q-0.476864 2.81864 -0.397747 2.89775L1.10225 4.39775C1.32192 4.61741 1.67808 4.61741 1.89775 4.39774C2.11742 4.17808 2.11742 3.82192 1.89775 3.60225L0.5625 2.26701L0.5625 0C0.5625 -0.310658 0.310658 -0.5625 0 -0.5625Z" fillRule="evenodd" transform="matrix(1 0 0 1 6 3.5)" fill="rgb(107, 114, 128)"/>
                    <path d="M4.5 8.4375Q5.30147 8.4375 6.03251 8.1283Q6.73903 7.82947 7.28427 7.28423Q7.82951 6.73899 8.12835 6.03248Q8.43754 5.30146 8.43754 4.50001Q8.43754 3.69855 8.12835 2.96752Q7.82951 2.26101 7.28427 1.71577Q6.73903 1.17053 6.03251 0.871698Q5.30147 0.5625 4.5 0.5625Q3.69854 0.5625 2.96752 0.871697Q2.26101 1.17053 1.71577 1.71577Q1.17053 2.26101 0.871698 2.96752Q0.5625 3.69855 0.5625 4.50001Q0.5625 5.30146 0.871697 6.03248Q1.17053 6.73899 1.71577 7.28423Q2.261 7.82947 2.96752 8.1283Q3.69854 8.4375 4.5 8.4375ZM4.5 9.5625Q3.47041 9.5625 2.52927 9.16443Q1.62066 8.78012 0.920271 8.07973Q0.219875 7.37933 -0.164433 6.47073Q-0.5625 5.52959 -0.5625 4.50001Q-0.5625 3.47041 -0.164433 2.52928Q0.219875 1.62067 0.920271 0.920273Q1.62067 0.219875 2.52927 -0.164433Q3.47041 -0.5625 4.5 -0.5625Q5.5296 -0.5625 6.47075 -0.164434Q7.37936 0.219872 8.07976 0.920271Q8.78016 1.62067 9.16448 2.52928Q9.56254 3.47041 9.56254 4.50001Q9.56255 5.5296 9.16448 6.47073Q8.78016 7.37933 8.07976 8.07973Q7.37936 8.78013 6.47075 9.16443Q5.5296 9.5625 4.5 9.5625Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.50003 1.5)" fill="rgb(107, 114, 128)"/>
                  </g>
                </svg>
                <span>Updated: 05/13/2025</span>
              </div>
            </div>

            <div className="project-menu__project-card">
              <div className="project-menu__project-header">
                <h3 className="project-menu__project-title">Project B</h3>
                <div className="project-menu__project-actions">
                  <div className="project-menu__project-menu-container">
                    <button 
                      className="project-menu__project-menu"
                      onClick={(e) => handleProjectCardMenuClick('project-b', e)}
                    >
                      <EllipsisIcon width={12} height={12} />
                    </button>
                    
                    {activeProjectMenu === 'project-b' && (
                      <div className="project-menu__project-dropdown" ref={projectMenuDropdownRef}>
                        <button 
                          className="project-menu__project-dropdown-option"
                          onClick={() => handleProjectAction('edit', 'project-b')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M6.36 2.68L2.5 6.54L2.5 8.96L4.92 8.96L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46ZM1.5 5.54L8.78 -1.74C9.17 -2.13 9.81 -2.13 10.2 -1.74L11.24 -0.7C11.63 -0.31 11.63 0.33 11.24 0.72L3.96 7.96L1.5 8.96L1.5 5.54Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Edit
                        </button>
                        <button 
                          className="project-menu__project-dropdown-option"
                          onClick={() => handleProjectAction('share', 'project-b')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11 9.5C10.59 9.5 10.22 9.65 9.93 9.88L4.69 7.26C4.73 7.09 4.75 6.91 4.75 6.75C4.75 6.59 4.73 6.41 4.69 6.24L9.93 3.62C10.22 3.85 10.59 4 11 4C12.1 4 13 3.1 13 2C13 0.9 12.1 0 11 0C9.9 0 9 0.9 9 2C9 2.16 9.02 2.34 9.06 2.51L3.82 5.13C3.53 4.9 3.16 4.75 2.75 4.75C1.65 4.75 0.75 5.65 0.75 6.75C0.75 7.85 1.65 8.75 2.75 8.75C3.16 8.75 3.53 8.6 3.82 8.37L9.06 10.99C9.02 11.16 9 11.34 9 11.5C9 12.6 9.9 13.5 11 13.5C12.1 13.5 13 12.6 13 11.5C13 10.4 12.1 9.5 11 9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Share
                        </button>
                        <button 
                          className="project-menu__project-dropdown-option"
                          onClick={() => handleProjectAction('archive', 'project-b')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12.25 3.5L1.75 3.5L1.75 11.25C1.75 11.8 2.2 12.25 2.75 12.25L11.25 12.25C11.8 12.25 12.25 11.8 12.25 11.25L12.25 3.5ZM5.25 7L8.75 7M0.5 1.75L13.5 1.75C13.78 1.75 14 1.97 14 2.25L14 3.5L0 3.5L0 2.25C0 1.97 0.22 1.75 0.5 1.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Archive
                        </button>
                        <button 
                          className="project-menu__project-dropdown-option"
                          onClick={() => handleProjectAction('move', 'project-b')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 1.75L11.5 1.75C12.05 1.75 12.5 2.2 12.5 2.75L12.5 4.75M1.5 5.75L10.5 5.75C11.05 5.75 11.5 6.2 11.5 6.75L11.5 11.25C11.5 11.8 11.05 12.25 10.5 12.25L1.5 12.25C0.95 12.25 0.5 11.8 0.5 11.25L0.5 6.75C0.5 6.2 0.95 5.75 1.5 5.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Move
                        </button>
                        <hr className="project-menu__project-dropdown-divider" />
                        <button 
                          className="project-menu__project-dropdown-option project-menu__project-dropdown-option--danger"
                          onClick={() => handleProjectAction('delete', 'project-b')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1.75 3.5L12.25 3.5M5.25 6.5L5.25 10.5M8.75 6.5L8.75 10.5M2.625 3.5L2.625 11.375C2.625 11.9273 3.07272 12.375 3.625 12.375L10.375 12.375C10.9273 12.375 11.375 11.9273 11.375 11.375L11.375 3.5M5.25 3.5L5.25 2.625C5.25 2.07272 5.69772 1.625 6.25 1.625L7.75 1.625C8.30228 1.625 8.75 2.07272 8.75 2.625L8.75 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="project-menu__project-description">
                Online shopping platform with modern UI/UX
              </p>
              <div className="project-menu__project-meta">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <defs>
                    <clipPath id="clipPath0737389489-2">
                      <path d="M0 0L12 0L12 12L0 12L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                    </clipPath>
                  </defs>
                  <g clipPath="url(#clipPath0737389489-2)">
                    <path d="M0 -0.5625C-0.310658 -0.5625 -0.5625 -0.310658 -0.5625 0L-0.5625 2.5Q-0.5625 2.61189 -0.519682 2.71526Q-0.476864 2.81864 -0.397747 2.89775L1.10225 4.39775C1.32192 4.61741 1.67808 4.61741 1.89775 4.39774C2.11742 4.17808 2.11742 3.82192 1.89775 3.60225L0.5625 2.26701L0.5625 0C0.5625 -0.310658 0.310658 -0.5625 0 -0.5625Z" fillRule="evenodd" transform="matrix(1 0 0 1 6 3.5)" fill="rgb(107, 114, 128)"/>
                    <path d="M4.5 8.4375Q5.30147 8.4375 6.03251 8.1283Q6.73903 7.82947 7.28427 7.28423Q7.82951 6.73899 8.12835 6.03248Q8.43754 5.30146 8.43754 4.50001Q8.43754 3.69855 8.12835 2.96752Q7.82951 2.26101 7.28427 1.71577Q6.73903 1.17053 6.03251 0.871698Q5.30147 0.5625 4.5 0.5625Q3.69854 0.5625 2.96752 0.871697Q2.26101 1.17053 1.71577 1.71577Q1.17053 2.26101 0.871698 2.96752Q0.5625 3.69855 0.5625 4.50001Q0.5625 5.30146 0.871697 6.03248Q1.17053 6.73899 1.71577 7.28423Q2.261 7.82947 2.96752 8.1283Q3.69854 8.4375 4.5 8.4375ZM4.5 9.5625Q3.47041 9.5625 2.52927 9.16443Q1.62066 8.78012 0.920271 8.07973Q0.219875 7.37933 -0.164433 6.47073Q-0.5625 5.52959 -0.5625 4.50001Q-0.5625 3.47041 -0.164433 2.52928Q0.219875 1.62067 0.920271 0.920273Q1.62067 0.219875 2.52927 -0.164433Q3.47041 -0.5625 4.5 -0.5625Q5.5296 -0.5625 6.47075 -0.164434Q7.37936 0.219872 8.07976 0.920271Q8.78016 1.62067 9.16448 2.52928Q9.56254 3.47041 9.56254 4.50001Q9.56255 5.5296 9.16448 6.47073Q8.78016 7.37933 8.07976 8.07973Q7.37936 8.78013 6.47075 9.16443Q5.5296 9.5625 4.5 9.5625Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.50003 1.5)" fill="rgb(107, 114, 128)"/>
                  </g>
                </svg>
                <span>Updated: 05/13/2025</span>
              </div>
            </div>

            <div className="project-menu__project-card">
              <div className="project-menu__project-header">
                <h3 className="project-menu__project-title">Project C</h3>
                <div className="project-menu__project-actions">
                  <div className="project-menu__project-menu-container">
                    <button 
                      className="project-menu__project-menu"
                      onClick={(e) => handleProjectCardMenuClick('project-c', e)}
                    >
                      <EllipsisIcon width={12} height={12} />
                    </button>
                    
                    {activeProjectMenu === 'project-c' && (
                      <div className="project-menu__project-dropdown" ref={projectMenuDropdownRef}>
                        <button 
                          className="project-menu__project-dropdown-option"
                          onClick={() => handleProjectAction('edit', 'project-c')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M6.36 2.68L2.5 6.54L2.5 8.96L4.92 8.96L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46ZM1.5 5.54L8.78 -1.74C9.17 -2.13 9.81 -2.13 10.2 -1.74L11.24 -0.7C11.63 -0.31 11.63 0.33 11.24 0.72L3.96 7.96L1.5 8.96L1.5 5.54Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Edit
                        </button>
                        <button 
                          className="project-menu__project-dropdown-option"
                          onClick={() => handleProjectAction('share', 'project-c')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11 9.5C10.59 9.5 10.22 9.65 9.93 9.88L4.69 7.26C4.73 7.09 4.75 6.91 4.75 6.75C4.75 6.59 4.73 6.41 4.69 6.24L9.93 3.62C10.22 3.85 10.59 4 11 4C12.1 4 13 3.1 13 2C13 0.9 12.1 0 11 0C9.9 0 9 0.9 9 2C9 2.16 9.02 2.34 9.06 2.51L3.82 5.13C3.53 4.9 3.16 4.75 2.75 4.75C1.65 4.75 0.75 5.65 0.75 6.75C0.75 7.85 1.65 8.75 2.75 8.75C3.16 8.75 3.53 8.6 3.82 8.37L9.06 10.99C9.02 11.16 9 11.34 9 11.5C9 12.6 9.9 13.5 11 13.5C12.1 13.5 13 12.6 13 11.5C13 10.4 12.1 9.5 11 9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Share
                        </button>
                        <button 
                          className="project-menu__project-dropdown-option"
                          onClick={() => handleProjectAction('archive', 'project-c')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12.25 3.5L1.75 3.5L1.75 11.25C1.75 11.8 2.2 12.25 2.75 12.25L11.25 12.25C11.8 12.25 12.25 11.8 12.25 11.25L12.25 3.5ZM5.25 7L8.75 7M0.5 1.75L13.5 1.75C13.78 1.75 14 1.97 14 2.25L14 3.5L0 3.5L0 2.25C0 1.97 0.22 1.75 0.5 1.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Archive
                        </button>
                        <button 
                          className="project-menu__project-dropdown-option"
                          onClick={() => handleProjectAction('move', 'project-c')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 1.75L11.5 1.75C12.05 1.75 12.5 2.2 12.5 2.75L12.5 4.75M1.5 5.75L10.5 5.75C11.05 5.75 11.5 6.2 11.5 6.75L11.5 11.25C11.5 11.8 11.05 12.25 10.5 12.25L1.5 12.25C0.95 12.25 0.5 11.8 0.5 11.25L0.5 6.75C0.5 6.2 0.95 5.75 1.5 5.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Move
                        </button>
                        <hr className="project-menu__project-dropdown-divider" />
                        <button 
                          className="project-menu__project-dropdown-option project-menu__project-dropdown-option--danger"
                          onClick={() => handleProjectAction('delete', 'project-c')}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1.75 3.5L12.25 3.5M5.25 6.5L5.25 10.5M8.75 6.5L8.75 10.5M2.625 3.5L2.625 11.375C2.625 11.9273 3.07272 12.375 3.625 12.375L10.375 12.375C10.9273 12.375 11.375 11.9273 11.375 11.375L11.375 3.5M5.25 3.5L5.25 2.625C5.25 2.07272 5.69772 1.625 6.25 1.625L7.75 1.625C8.30228 1.625 8.75 2.07272 8.75 2.625L8.75 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p className="project-menu__project-description">
                Online shopping platform with modern UI/UX
              </p>
              <div className="project-menu__project-meta">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <defs>
                    <clipPath id="clipPath0737389489-3">
                      <path d="M0 0L12 0L12 12L0 12L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                    </clipPath>
                  </defs>
                  <g clipPath="url(#clipPath0737389489-3)">
                    <path d="M0 -0.5625C-0.310658 -0.5625 -0.5625 -0.310658 -0.5625 0L-0.5625 2.5Q-0.5625 2.61189 -0.519682 2.71526Q-0.476864 2.81864 -0.397747 2.89775L1.10225 4.39775C1.32192 4.61741 1.67808 4.61741 1.89775 4.39774C2.11742 4.17808 2.11742 3.82192 1.89775 3.60225L0.5625 2.26701L0.5625 0C0.5625 -0.310658 0.310658 -0.5625 0 -0.5625Z" fillRule="evenodd" transform="matrix(1 0 0 1 6 3.5)" fill="rgb(107, 114, 128)"/>
                    <path d="M4.5 8.4375Q5.30147 8.4375 6.03251 8.1283Q6.73903 7.82947 7.28427 7.28423Q7.82951 6.73899 8.12835 6.03248Q8.43754 5.30146 8.43754 4.50001Q8.43754 3.69855 8.12835 2.96752Q7.82951 2.26101 7.28427 1.71577Q6.73903 1.17053 6.03251 0.871698Q5.30147 0.5625 4.5 0.5625Q3.69854 0.5625 2.96752 0.871697Q2.26101 1.17053 1.71577 1.71577Q1.17053 2.26101 0.871698 2.96752Q0.5625 3.69855 0.5625 4.50001Q0.5625 5.30146 0.871697 6.03248Q1.17053 6.73899 1.71577 7.28423Q2.261 7.82947 2.96752 8.1283Q3.69854 8.4375 4.5 8.4375ZM4.5 9.5625Q3.47041 9.5625 2.52927 9.16443Q1.62066 8.78012 0.920271 8.07973Q0.219875 7.37933 -0.164433 6.47073Q-0.5625 5.52959 -0.5625 4.50001Q-0.5625 3.47041 -0.164433 2.52928Q0.219875 1.62067 0.920271 0.920273Q1.62067 0.219875 2.52927 -0.164433Q3.47041 -0.5625 4.5 -0.5625Q5.5296 -0.5625 6.47075 -0.164434Q7.37936 0.219872 8.07976 0.920271Q8.78016 1.62067 9.16448 2.52928Q9.56254 3.47041 9.56254 4.50001Q9.56255 5.5296 9.16448 6.47073Q8.78016 7.37933 8.07976 8.07973Q7.37936 8.78013 6.47075 9.16443Q5.5296 9.5625 4.5 9.5625Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.50003 1.5)" fill="rgb(107, 114, 128)"/>
                  </g>
                </svg>
                <span>Updated: 05/13/2025</span>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="project-menu__pagination">
            <span className="project-menu__pagination-info">
              Showing 1-6 of 20
            </span>
            <div className="project-menu__pagination-controls">
              <button className="project-menu__page-btn project-menu__page-btn--active">1</button>
              <button className="project-menu__page-btn">2</button>
              <button className="project-menu__page-btn">3</button>
            </div>
          </div>
        </div>
      </div>

      {/* Sliding Section Menu */}
      <div 
        className={`section-menu ${isSectionMenuOpen ? 'section-menu--open' : ''}`}
        ref={sectionMenuRef}
      >
        <div className="section-menu__content">
          {/* Header */}
          <div className="section-menu__header">
            <button 
              className="section-menu__back" 
              onClick={handleSectionMenuClose}
              title="Go back"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* New Project Chat Button */}
          <div className="section-menu__create">
            <button 
              className="section-menu__create-btn"
              onClick={() => console.log('New Project Chat clicked')}
            >
              + New Project Chat
            </button>
          </div>

          {/* Search and Filter */}
          <div className="section-menu__search-container">
            <div className="section-menu__search">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M6 12C9.26142 12 11.5 9.76142 11.5 7C11.5 4.23858 9.26142 2 6 2C3.73858 2 1.5 4.23858 1.5 7C1.5 9.76142 3.73858 12 6 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 12L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search chats"
                className="section-menu__search-input"
              />
            </div>
            <button className="section-menu__filter-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Chat Tabs */}
          <div className="section-menu__tabs">
            <div className="section-menu__tab section-menu__tab--active">
              <span>All Chats</span>
            </div>
            <div className="section-menu__tab">
              <span>My Chats</span>
            </div>
          </div>



          {/* Tasks List */}
          <div className="section-menu__tasks">
            {sampleTasks.map((task) => (
              <div key={task.id} className="section-menu__task">
                <div className="section-menu__task-header">
                  <div className="section-menu__task-left">
                    {/* <div className="section-menu__task-checkbox">
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => {}}
                      />
                    </div> */}
                    <div className="section-menu__task-title">{task.title}</div>
                  </div>
                  <div className="section-menu__task-actions">
                    <button 
                      className="section-menu__task-menu"
                      onClick={(e) => handleTaskMenuClick(task.id, e)}
                    >
                      <svg width="4" height="17" viewBox="0 0 4 17" fill="none">
                        <path d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z" fill="#5D5D5D"/>
                      </svg>
                    </button>
                    
                    {activeTaskMenu === task.id && (
                      <div className="section-menu__task-dropdown">
                        <button 
                          className="section-menu__task-dropdown-option"
                          onClick={() => handleTaskAction('edit', task.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M6.36 2.68L2.5 6.54L2.5 8.96L4.92 8.96L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46ZM1.5 5.54L8.78 -1.74C9.17 -2.13 9.81 -2.13 10.2 -1.74L11.24 -0.7C11.63 -0.31 11.63 0.33 11.24 0.72L3.96 7.96L1.5 8.96L1.5 5.54Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Edit
                        </button>
                        <button 
                          className="section-menu__task-dropdown-option"
                          onClick={() => handleTaskAction('share', task.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11 9.5C10.59 9.5 10.22 9.65 9.93 9.88L4.69 7.26C4.73 7.09 4.75 6.91 4.75 6.75C4.75 6.59 4.73 6.41 4.69 6.24L9.93 3.62C10.22 3.85 10.59 4 11 4C12.1 4 13 3.1 13 2C13 0.9 12.1 0 11 0C9.9 0 9 0.9 9 2C9 2.16 9.02 2.34 9.06 2.51L3.82 5.13C3.53 4.9 3.16 4.75 2.75 4.75C1.65 4.75 0.75 5.65 0.75 6.75C0.75 7.85 1.65 8.75 2.75 8.75C3.16 8.75 3.53 8.6 3.82 8.37L9.06 10.99C9.02 11.16 9 11.34 9 11.5C9 12.6 9.9 13.5 11 13.5C12.1 13.5 13 12.6 13 11.5C13 10.4 12.1 9.5 11 9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Share
                        </button>
                        <button 
                          className="section-menu__task-dropdown-option"
                          onClick={() => handleTaskAction('archive', task.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12.25 3.5L1.75 3.5L1.75 11.25C1.75 11.8 2.2 12.25 2.75 12.25L11.25 12.25C11.8 12.25 12.25 11.8 12.25 11.25L12.25 3.5ZM5.25 7L8.75 7M0.5 1.75L13.5 1.75C13.78 1.75 14 1.97 14 2.25L14 3.5L0 3.5L0 2.25C0 1.97 0.22 1.75 0.5 1.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Archive
                        </button>
                        <button 
                          className="section-menu__task-dropdown-option"
                          onClick={() => handleTaskAction('move', task.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 1.75L11.5 1.75C12.05 1.75 12.5 2.2 12.5 2.75L12.5 4.75M1.5 5.75L10.5 5.75C11.05 5.75 11.5 6.2 11.5 6.75L11.5 11.25C11.5 11.8 11.05 12.25 10.5 12.25L1.5 12.25C0.95 12.25 0.5 11.8 0.5 11.25L0.5 6.75C0.5 6.2 0.95 5.75 1.5 5.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Move
                        </button>
                        <hr className="section-menu__task-dropdown-divider" />
                        <button 
                          className="section-menu__task-dropdown-option section-menu__task-dropdown-option--danger"
                          onClick={() => handleTaskAction('delete', task.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1.75 3.5L12.25 3.5M5.25 3.5L5.25 2.25C5.25 1.7 5.7 1.25 6.25 1.25L7.75 1.25C8.3 1.25 8.75 1.7 8.75 2.25L8.75 3.5M10.5 3.5L10.5 11.25C10.5 11.8 10.05 12.25 9.5 12.25L4.5 12.25C3.95 12.25 3.5 11.8 3.5 11.25L3.5 3.5M5.75 6.25L5.75 9.5M8.25 6.25L8.25 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="section-menu__task-details">
                  <div className="files-menu__document-updated">
                    Updated: {task.updated}
                  </div>
                                     <SidebarDynamicTags
                     tags={task.tags}
                     item={task}
                     type="task"
                     containerClass="section-menu__task-tags"
                     addButtonClass="section-menu__add-tag"
                     tagChipClass="section-menu__tag-chip"
                     tagMoreClass="section-menu__tag-more"
                   />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="section-menu__pagination">
            <span className="section-menu__pagination-info">
              Showing 1-6 of 20
            </span>
            <div className="section-menu__pagination-controls">
              <button className="section-menu__page-btn section-menu__page-btn--active">1</button>
              <button className="section-menu__page-btn">2</button>
              <button className="section-menu__page-btn">3</button>
            </div>
          </div>
        </div>
      </div>

      {/* Files Menu */}
      <div 
        className={`files-menu ${isFilesMenuOpen ? 'files-menu--open' : ''}`}
        ref={filesMenuRef}
      >
        <div className="files-menu__content">
          {/* Header */}
          <div className="files-menu__header">
            <button 
              className="files-menu__back"
              onClick={handleFilesMenuClose}
              title="Go back"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Upload Button */}
          <div className="files-menu__create">
            <button 
              className="files-menu__create-btn"
              onClick={() => setIsDocumentUploadModalOpen(true)}
            >
              + Upload Files
            </button>
          </div>

          {/* Search and Filter */}
          <div className="files-menu__search-container">
            <div className="files-menu__search">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.5 11.5L9.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search files..."
                className="files-menu__search-input"
              />
            </div>
            <button className="files-menu__filter-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Documents List */}
          <div className="files-menu__documents">
            {sampleDocuments.map(doc => (
              <div key={doc.id} className="files-menu__document-card">
                <div className="files-menu__document-header">
                  <div className="files-menu__document-info">
                    <div 
                      className="files-menu__document-type"
                      style={{ 
                        backgroundColor: doc.typeBg,
                        color: doc.typeColor
                      }}
                    >
                      {doc.type}
                    </div>
                    <div className="files-menu__document-name">
                      {doc.name}
                    </div>
                  </div>
                  <div className="files-menu__document-menu-container">
                    <button 
                      className="files-menu__document-menu"
                      onClick={(e) => handleDocumentMenuClick(doc.id, e)}
                    >
                      <svg width="4" height="17.5" viewBox="0 0 4 17.5" fill="none">
                        <path d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z" fill="#5D5D5D"/>
                      </svg>
                    </button>
                    
                    {activeDocumentMenu === doc.id && (
                      <div className="files-menu__document-dropdown" ref={documentMenuRef}>
                        <button 
                          className="files-menu__document-dropdown-option"
                          onClick={() => handleDocumentAction('edit', doc.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M6.36 2.68L2.5 6.54L2.5 8.96L4.92 8.96L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46ZM1.5 5.54L8.78 -1.74C9.17 -2.13 9.81 -2.13 10.2 -1.74L11.24 -0.7C11.63 -0.31 11.63 0.33 11.24 0.72L3.96 7.96L1.5 8.96L1.5 5.54Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Edit
                        </button>
                        <button 
                          className="files-menu__document-dropdown-option"
                          onClick={() => handleDocumentAction('share', doc.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11 9.5C10.59 9.5 10.22 9.65 9.93 9.88L4.69 7.26C4.73 7.09 4.75 6.91 4.75 6.75C4.75 6.59 4.73 6.41 4.69 6.24L9.93 3.62C10.22 3.85 10.59 4 11 4C12.1 4 13 3.1 13 2C13 0.9 12.1 0 11 0C9.9 0 9 0.9 9 2C9 2.16 9.02 2.34 9.06 2.51L3.82 5.13C3.53 4.9 3.16 4.75 2.75 4.75C1.65 4.75 0.75 5.65 0.75 6.75C0.75 7.85 1.65 8.75 2.75 8.75C3.16 8.75 3.53 8.6 3.82 8.37L9.06 10.99C9.02 11.16 9 11.34 9 11.5C9 12.6 9.9 13.5 11 13.5C12.1 13.5 13 12.6 13 11.5C13 10.4 12.1 9.5 11 9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Share
                        </button>
                        <button 
                          className="files-menu__document-dropdown-option"
                          onClick={() => handleDocumentAction('archive', doc.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12.25 3.5L1.75 3.5L1.75 11.25C1.75 11.8 2.2 12.25 2.75 12.25L11.25 12.25C11.8 12.25 12.25 11.8 12.25 11.25L12.25 3.5ZM5.25 7L8.75 7M0.5 1.75L13.5 1.75C13.78 1.75 14 1.97 14 2.25L14 3.5L0 3.5L0 2.25C0 1.97 0.22 1.75 0.5 1.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Archive
                        </button>
                        <button 
                          className="files-menu__document-dropdown-option"
                          onClick={() => handleDocumentAction('move', doc.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 1.75L11.5 1.75C12.05 1.75 12.5 2.2 12.5 2.75L12.5 4.75M1.5 5.75L10.5 5.75C11.05 5.75 11.5 6.2 11.5 6.75L11.5 11.25C11.5 11.8 11.05 12.25 10.5 12.25L1.5 12.25C0.95 12.25 0.5 11.8 0.5 11.25L0.5 6.75C0.5 6.2 0.95 5.75 1.5 5.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Move
                        </button>
                        <hr className="files-menu__document-dropdown-divider" />
                        <button 
                          className="files-menu__document-dropdown-option files-menu__document-dropdown-option--danger"
                          onClick={() => handleDocumentAction('delete', doc.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1.75 3.5L12.25 3.5M5.25 3.5L5.25 2.25C5.25 1.7 5.7 1.25 6.25 1.25L7.75 1.25C8.3 1.25 8.75 1.7 8.75 2.25L8.75 3.5M10.5 3.5L10.5 11.25C10.5 11.8 10.05 12.25 9.5 12.25L4.5 12.25C3.95 12.25 3.5 11.8 3.5 11.25L3.5 3.5M5.75 6.25L5.75 9.5M8.25 6.25L8.25 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="files-menu__document-footer">
                  <div className="files-menu__document-updated">
                    Updated: {doc.updated}
                  </div>
                                     <SidebarDynamicTags
                     tags={doc.tags}
                     item={doc}
                     type="document"
                     containerClass="files-menu__document-category"
                     addButtonClass="files-menu__add-tag"
                     tagChipClass="files-menu__tag-chip"
                     tagMoreClass="files-menu__tag-more"
                   />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="files-menu__pagination">
            <div className="files-menu__pagination-info">
              Showing 1-6 of 20
            </div>
            <div className="files-menu__pagination-controls">
              <button className="files-menu__page-btn files-menu__page-btn--active">1</button>
              <button className="files-menu__page-btn">2</button>
              <button className="files-menu__page-btn">3</button>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Work Menu */}
      <div 
        className={`saved-work-menu ${isSavedWorkMenuOpen ? 'saved-work-menu--open' : ''}`}
        ref={savedWorkMenuRef}
      >
        <div className="saved-work-menu__content">
          {/* Header */}
          <div className="saved-work-menu__header">
            <button 
              className="saved-work-menu__back"
              onClick={handleSavedWorkMenuClose}
              title="Go back"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* View All Saved Work Button */}
          <div className="saved-work-menu__create">
            <button 
              className="saved-work-menu__create-btn"
              onClick={() => {
                setShowSavedWorkDrawer(true);
                setIsSavedWorkMenuOpen(false);
              }}
            >
              View All Saved Work
            </button>
          </div>

          {/* Search and Filter */}
          <div className="saved-work-menu__search-container">
            <div className="saved-work-menu__search">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.5 11.5L9.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search saved work..."
                className="saved-work-menu__search-input"
              />
            </div>
            <button className="saved-work-menu__filter-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Saved Work Items */}
          <div className="saved-work-menu__items">
            {sampleSavedWork.map(item => (
              <div key={item.id} className="saved-work-menu__item-card">
                <div className="saved-work-menu__item-header">
                  <div className="saved-work-menu__item-title">
                    {item.title}
                  </div>
                  <div className="saved-work-menu__item-menu-container">
                    <button 
                      className="saved-work-menu__item-menu"
                      onClick={(e) => handleEllipsisMenuClick(item.id, e)}
                    >
                      <svg width="4" height="17.5" viewBox="0 0 4 17.5" fill="none">
                        <path d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z" fill="#5D5D5D"/>
                      </svg>
                    </button>
                    
                    {activeEllipsisMenu === item.id && (
                      <div className="saved-work-menu__item-dropdown" ref={ellipsisMenuRef}>
                        <button 
                          className="saved-work-menu__item-dropdown-option"
                          onClick={() => handleEllipsisAction('edit', item.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M6.36 2.68L2.5 6.54L2.5 8.96L4.92 8.96L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46ZM1.5 5.54L8.78 -1.74C9.17 -2.13 9.81 -2.13 10.2 -1.74L11.24 -0.7C11.63 -0.31 11.63 0.33 11.24 0.72L3.96 7.96L1.5 8.96L1.5 5.54Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Edit
                        </button>
                        <button 
                          className="saved-work-menu__item-dropdown-option"
                          onClick={() => handleEllipsisAction('share', item.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M11 9.5C10.59 9.5 10.22 9.65 9.93 9.88L4.69 7.26C4.73 7.09 4.75 6.91 4.75 6.75C4.75 6.59 4.73 6.41 4.69 6.24L9.93 3.62C10.22 3.85 10.59 4 11 4C12.1 4 13 3.1 13 2C13 0.9 12.1 0 11 0C9.9 0 9 0.9 9 2C9 2.16 9.02 2.34 9.06 2.51L3.82 5.13C3.53 4.9 3.16 4.75 2.75 4.75C1.65 4.75 0.75 5.65 0.75 6.75C0.75 7.85 1.65 8.75 2.75 8.75C3.16 8.75 3.53 8.6 3.82 8.37L9.06 10.99C9.02 11.16 9 11.34 9 11.5C9 12.6 9.9 13.5 11 13.5C12.1 13.5 13 12.6 13 11.5C13 10.4 12.1 9.5 11 9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Share
                        </button>
                        <button 
                          className="saved-work-menu__item-dropdown-option"
                          onClick={() => handleEllipsisAction('archive', item.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M12.25 3.5L1.75 3.5L1.75 11.25C1.75 11.8 2.2 12.25 2.75 12.25L11.25 12.25C11.8 12.25 12.25 11.8 12.25 11.25L12.25 3.5ZM5.25 7L8.75 7M0.5 1.75L13.5 1.75C13.78 1.75 14 1.97 14 2.25L14 3.5L0 3.5L0 2.25C0 1.97 0.22 1.75 0.5 1.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Archive
                        </button>
                        <button 
                          className="saved-work-menu__item-dropdown-option"
                          onClick={() => handleEllipsisAction('move', item.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 1.75L11.5 1.75C12.05 1.75 12.5 2.2 12.5 2.75L12.5 4.75M1.5 5.75L10.5 5.75C11.05 5.75 11.5 6.2 11.5 6.75L11.5 11.25C11.5 11.8 11.05 12.25 10.5 12.25L1.5 12.25C0.95 12.25 0.5 11.8 0.5 11.25L0.5 6.75C0.5 6.2 0.95 5.75 1.5 5.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Move
                        </button>
                        <hr className="saved-work-menu__item-dropdown-divider" />
                        <button 
                          className="saved-work-menu__item-dropdown-option saved-work-menu__item-dropdown-option--danger"
                          onClick={() => handleEllipsisAction('delete', item.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1.75 3.5L12.25 3.5M5.25 3.5L5.25 2.25C5.25 1.7 5.7 1.25 6.25 1.25L7.75 1.25C8.3 1.25 8.75 1.7 8.75 2.25L8.75 3.5M10.5 3.5L10.5 11.25C10.5 11.8 10.05 12.25 9.5 12.25L4.5 12.25C3.95 12.25 3.5 11.8 3.5 11.25L3.5 3.5M5.75 6.25L5.75 9.5M8.25 6.25L8.25 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="saved-work-menu__item-tags">
                <div className="saved-work-menu__item-saved">
                    Saved: {item.saved}
                  </div>
                </div>
                                 <SidebarDynamicTags
                   tags={item.tags}
                   item={item}
                   type="savedWork"
                   containerClass="saved-work-menu__item-footer"
                   addButtonClass="saved-work-menu__add-tag"
                   tagChipClass="saved-work-menu__tag-chip"
                   tagMoreClass="saved-work-menu__tag-more"
                 />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="saved-work-menu__pagination">
            <div className="saved-work-menu__pagination-info">
              Showing 1-6 of 20
            </div>
            <div className="saved-work-menu__pagination-controls">
              <button className="saved-work-menu__page-btn saved-work-menu__page-btn--active">1</button>
              <button className="saved-work-menu__page-btn">2</button>
              <button className="saved-work-menu__page-btn">3</button>
            </div>
          </div>
        </div>
      </div>

    </div>

    {/* Workspace Slide-Out Menu - Outside sidebar container */}
    {isWorkspaceMenuOpen && (
      <>
        {/* Backdrop */}
        <div 
          className="workspace-menu-backdrop"
          onClick={(e) => {
            // Backdrop click should not close the menu - only the close button should
          }}
        />
        
                            {/* Slide-Out Panel */}
          <div className={`workspace-slide-menu ${isWorkspaceMenuOpen ? 'workspace-slide-menu--open' : ''}`}>
            {/* Close Button - Prominent above content */}
            <div className="workspace-menu__close-section">
              <button 
                className="workspace-menu__close"
                onClick={handleWorkspaceMenuClose}
                aria-label="Close workspace menu"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="workspace-menu__header">
            <div className="workspace-menu__title">Workspace 1</div>
            <div className="workspace-menu__subtitle">Last updated 2 hours ago</div>
          </div>
          
          <div className="workspace-menu__actions">
            <button 
              className="workspace-menu__action-btn"
              onClick={() => {
                setShowSavedWorkDrawer(true);
                setIsWorkspaceMenuOpen(false);
              }}
            >
              All Saved Work
            </button>
            <button 
              className="workspace-menu__action-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Use setTimeout to ensure template drawer opens after any menu closing logic
                setTimeout(() => {
                  onOpenTemplateDrawer();
                }, 10);
              }}
            >
              Template Library
            </button>
            <button 
              className="workspace-menu__action-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowUploadedFilesDrawer(true);
                setIsWorkspaceMenuOpen(false);
              }}
            >
              Workspace Uploads
            </button>
            <button 
              className="workspace-menu__action-btn"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowManageTagsDrawer(true);
                setIsWorkspaceMenuOpen(false);
              }}
            >
              Tag Manager
            </button>
          </div>

          <div className="workspace-menu__options">
            <div className="workspace-menu__option" onClick={() => console.log('Manage Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM8 5.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM8 11a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z" fill="#6B7280"/>
              </svg>
              <span>Manage Workspace</span>
            </div>

            <div className="workspace-menu__option" onClick={() => console.log('Rename Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12.854 3.146a.5.5 0 0 1 0 .708L8.207 8.5l4.647 4.646a.5.5 0 0 1-.708.708L7.5 9.207l-4.646 4.647a.5.5 0 0 1-.708-.708L6.793 8.5 2.146 3.854a.5.5 0 1 1 .708-.708L7.5 7.793l4.646-4.647a.5.5 0 0 1 .708 0z" fill="#6B7280"/>
              </svg>
              <span>Rename</span>
            </div>

            <div className="workspace-menu__option" onClick={() => console.log('Share Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM4 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#6B7280"/>
              </svg>
              <span>Share</span>
            </div>

            <div className="workspace-menu__option" onClick={() => console.log('Un-Share Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM4 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#6B7280"/>
              </svg>
              <span>Un-Share</span>
            </div>

            <div className="workspace-menu__option" onClick={() => console.log('Transfer Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2l4 4h-3v6H7V6H4l4-4z" fill="#6B7280"/>
              </svg>
              <span>Transfer</span>
            </div>



            <div className="workspace-menu__option" onClick={() => console.log('Download Documents')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 12l4-4h-3V2H7v6H4l4 4zM2 14h12v2H2v-2z" fill="#6B7280"/>
              </svg>
              <span>Download Documents</span>
            </div>

            <div className="workspace-menu__option" onClick={() => console.log('Archive Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 3h12v2H2V3zm1 3h10v8H3V6zm3 2v4h4V8H6z" fill="#6B7280"/>
              </svg>
              <span>Archive</span>
            </div>

            <div className="workspace-menu__option" onClick={() => console.log('Delete Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3V2h4v1h3v1H3V3h3zM4 5h8v9H4V5zm2 2v5h1V7H6zm3 0v5h1V7H9z" fill="#6B7280"/>
              </svg>
              <span>Delete</span>
            </div>
          </div>
        </div>
      </>
    )}

    {/* Saved Work Drawer */}
    <SavedWorkDrawer
      isOpen={showSavedWorkDrawer}
      onClose={() => setShowSavedWorkDrawer(false)}
      onDocumentSelect={(document) => {
        setSelectedDocument(document);
        setShowDocumentDrawer(true);
        setShowSavedWorkDrawer(false);
      }}
    />

    {/* Document Drawer */}
    <DocumentDrawer
      isOpen={showDocumentDrawer}
      onClose={() => {
        setShowDocumentDrawer(false);
        setSelectedDocument(null);
      }}
      document={selectedDocument}
      onEdit={(document) => {
        console.log('Edit document:', document);
        // Document drawer will handle edit mode internally
      }}
    />

    {/* Ellament Drawer */}
    <EllamentDrawer
      isOpen={showEllamentDrawer}
      onClose={() => {
        setShowEllamentDrawer(false);
        setSelectedEllament(null);
      }}
      onEllamentSelect={(ellament) => {
        setSelectedEllament(ellament);
        // Map ellament to a document shape for the DocumentDrawer
        const mappedDocument = {
          id: ellament.id,
          title: ellament.title,
          status: ellament.status || 'draft',
          lastUpdated: ellament.lastUpdated || new Date().toISOString().slice(0, 10),
          project: 'Ellaments',
          type: ellament.category || 'ellament',
          tags: ellament.tags || (ellament.category ? [ellament.category] : [])
        };
        setSelectedDocument(mappedDocument);
        setShowDocumentDrawer(true);
        setShowEllamentDrawer(false);
      }}
    />

    {/* Tag Management Modal */}
    <TagManagementModal
      isOpen={isTagModalOpen}
      onClose={handleCloseTagModal}
      onSave={handleSaveTagChanges}
      document={tagModalDocument}
      predefinedTags={predefinedTags}
    />

          {/* Project Create Modal */}
      <ProjectCreateModal
        isOpen={isProjectCreateModalOpen}
        onClose={handleProjectCreateClose}
        onSubmit={handleProjectCreateSubmit}
        existingProjects={projects}
      />

      {/* Convert to Project Modal */}
      <ConvertToProjectModal
        isOpen={isConvertModalOpen}
        onClose={handleConvertModalClose}
        onConfirm={handleConvertSubmit}
        sourceWorkspace={convertSourceWorkspace}
        orgWorkspaces={orgWorkspaces}
        hasChildProjects={convertSourceWorkspace?.hasChildProjects || false}
      />

      {/* Manage Tags Drawer */}
      <ManageTagsDrawer
        isOpen={showManageTagsDrawer}
        onClose={() => setShowManageTagsDrawer(false)}
        currentUserRole="Admin" // This would come from auth context
      />

      {/* Uploaded Files Drawer */}
      <UploadedFilesDrawer
        isOpen={showUploadedFilesDrawer}
        onClose={() => setShowUploadedFilesDrawer(false)}
      />

      {/* Document Upload Modal */}
      <DocumentUploadModal
        isOpen={isDocumentUploadModalOpen}
        onClose={handleDocumentUploadClose}
        onUpload={handleDocumentUpload}
      />
      </>
    );
};

export default Sidebar; 