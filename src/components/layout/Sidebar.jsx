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
  const [showSavedWorkDrawer, setShowSavedWorkDrawer] = useState(false);
  const [showDocumentDrawer, setShowDocumentDrawer] = useState(false);
  const [showEllamentDrawer, setShowEllamentDrawer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedEllament, setSelectedEllament] = useState(null);
  const [activeDocumentMenu, setActiveDocumentMenu] = useState(null);
  const workspaceMenuRef = useRef(null);
  const projectMenuRef = useRef(null);
  const sectionMenuRef = useRef(null);
  const filesMenuRef = useRef(null);
  const savedWorkMenuRef = useRef(null);
  const ellipsisMenuRef = useRef(null);
  const documentMenuRef = useRef(null);

  // Sample documents data based on Motiff design
  const sampleDocuments = [
    {
      id: 1,
      type: 'PDF',
      name: 'Service Contract v2.1',
      description: 'Legal agreement for software services and maintenance',
      updated: '05/13/2025 @ 4:15pm',
      category: 'Legal',
      typeColor: '#DC2626',
      typeBg: '#FEE2E2'
    },
    {
      id: 2,
      type: 'DOC',
      name: 'Customer Agreement',
      description: 'Terms and conditions for new customer onboarding',
      updated: '05/10/2025 @ 2:30pm',
      category: 'Contract',
      typeColor: '#2563EB',
      typeBg: '#DBEAFE'
    },
    {
      id: 3,
      type: 'XLS',
      name: 'Q2 Financial Report',
      description: 'Quarterly financial analysis and projections',
      updated: '05/08/2025 @ 9:45am',
      category: 'Finance',
      typeColor: '#059669',
      typeBg: '#D1FAE5'
    },
    {
      id: 4,
      type: 'PDF',
      name: 'Brand Guidelines',
      description: 'Official brand identity and usage guidelines',
      updated: '05/01/2025 @ 11:20am',
      category: 'Marketing',
      typeColor: '#DC2626',
      typeBg: '#FEE2E2'
    },
    {
      id: 5,
      type: 'DOC',
      name: 'Product Specifications',
      description: 'Technical specifications and requirements',
      updated: '04/28/2025 @ 3:45pm',
      category: 'Technical',
      typeColor: '#2563EB',
      typeBg: '#DBEAFE'
    }
  ];

  // Sample saved work data based on Motiff design
  const sampleSavedWork = [
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
  ];

  // Sample tasks data based on Motiff design
  const sampleTasks = [
    {
      id: 1,
      title: 'User Experience',
      description: 'Planning for next week\'s user research sessions',
      date: '12 Oct',
      progress: '0/4',
      tags: ['Design 2021', 'Work'],
      priority: 'high',
      completed: false
    },
    {
      id: 2,
      title: 'Market Analysis',
      description: 'Competitive analysis and market research findings',
      date: '24 Oct',
      progress: '0/4',
      tags: ['Design 2021'],
      priority: 'medium',
      completed: false
    },
    {
      id: 3,
      title: 'Define Problem Statement',
      description: 'Team discussion on project scope and challenges',
      date: '22 Oct',
      progress: '0/4',
      tags: ['Design 2021'],
      priority: 'low',
      completed: true
    },
    {
      id: 4,
      title: 'Set Objectives',
      description: 'Defining key goals and success metrics',
      date: '16 Oct',
      progress: '0/4',
      tags: ['Design 2021', 'Work'],
      priority: 'medium',
      completed: false
    },
    {
      id: 5,
      title: 'Create Wireframes',
      description: 'Initial sketches and wireframes for the new dashboard',
      date: '18 Oct',
      progress: '2/5',
      tags: ['Design', 'Daily'],
      priority: 'high',
      completed: false
    }
  ];

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
    setIsFilesMenuOpen(!isFilesMenuOpen);
  };

  const handleFilesMenuClose = () => {
    setIsFilesMenuOpen(false);
    setActiveDocumentMenu(null); // Close any open document menus
  };

  const handleSavedWorkMenuClick = () => {
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

  const handleDocumentMenuClick = (docId, e) => {
    e.stopPropagation();
    setActiveDocumentMenu(activeDocumentMenu === docId ? null : docId);
  };

  const handleDocumentMenuClose = () => {
    setActiveDocumentMenu(null);
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

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#9CA3AF';
    }
  };

  const getTagStyle = (tag) => {
    const tagStyles = {
      'Design 2021': { bg: '#FFEDD5', color: '#C2410C' },
      'Work': { bg: '#FEF9C3', color: '#A16207' },
      'Design': { bg: '#F3E8FF', color: '#7E22CE' },
      'Daily': { bg: '#DCFCE7', color: '#15803D' }
    };
    return tagStyles[tag] || { bg: '#F3F4F6', color: '#6B7280' };
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
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
    };

    // Only listen for click outside on other menus, not workspace menu
    if (isProjectMenuOpen || isSectionMenuOpen || isFilesMenuOpen || isSavedWorkMenuOpen || activeEllipsisMenu || activeDocumentMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isProjectMenuOpen, isSectionMenuOpen, isFilesMenuOpen, isSavedWorkMenuOpen, activeEllipsisMenu, activeDocumentMenu]);

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
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="4" 
          height="17.5" 
          viewBox="0 0 4 17.5" 
          className="chevron-down-icon workspace-ellipsis"
        >
          <defs>
            <clipPath id="clipPath9062581315-ellipsis">
              <path d="M0 0L4 0L4 16L0 16L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 1.5)"/>
            </clipPath>
          </defs>
          <g clipPath="url(#clipPath9062581315-ellipsis)">
            <defs>
              <mask id="mask5370462388-ellipsis" style={{maskType: 'alpha'}}>
                <path d="M0 0L4 0L4 16L0 16L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 1.5)" fill="rgb(0, 0, 0)"/>
              </mask>
            </defs>
            <g mask="url(#mask5370462388-ellipsis)">
              <path d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 1.5)" fill="rgb(93, 93, 93)"/>
            </g>
          </g>
        </svg>

      </div>

      {/* Active Tab Section */}
      <div className="sidebar__active-section">
        <div 
          className="sidebar__active-tab ellament-tab"
          onClick={() => setShowEllamentDrawer(true)}
          style={{ cursor: 'pointer' }}
        >
          <div className="sidebar__tab-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className="chat-icon">
              <defs>
                <clipPath id="clipPath7274651217-chat">
                  <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                </clipPath>
              </defs>
              <g clipPath="url(#clipPath7274651217-chat)">
                <defs>
                  <clipPath id="clipPath7136715570-chat">
                    <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                  </clipPath>
                </defs>
                <g clipPath="url(#clipPath7136715570-chat)">
                  <path d="M11.25 1.25C11.25 1.62021 11.0891 1.95282 10.8333 2.18171L10.8333 3.75L15 3.75C16.3808 3.75 17.5 4.86929 17.5 6.25L17.5 14.5833C17.5 15.9641 16.3808 17.0833 15 17.0833L5 17.0833C3.61929 17.0833 2.5 15.9641 2.5 14.5833L2.5 6.25C2.5 4.86929 3.61929 3.75 5 3.75L9.16667 3.75L9.16667 2.18171C8.91092 1.95282 8.75 1.62021 8.75 1.25C8.75 0.559642 9.30967 0 10 0C10.6903 0 11.25 0.559642 11.25 1.25ZM5 5.41667C4.53977 5.41667 4.16667 5.78977 4.16667 6.25L4.16667 14.5833C4.16667 15.0436 4.53977 15.4167 5 15.4167L15 15.4167C15.4602 15.4167 15.8333 15.0436 15.8333 14.5833L15.8333 6.25C15.8333 5.78977 15.4602 5.41667 15 5.41667L10.8333 5.41667L9.16667 5.41667L5 5.41667ZM1.66667 7.91667L0 7.91667L0 12.9167L1.66667 12.9167L1.66667 7.91667ZM18.3333 7.91667L20 7.91667L20 12.9167L18.3333 12.9167L18.3333 7.91667ZM7.5 11.6667C8.19036 11.6667 8.75 11.107 8.75 10.4167C8.75 9.72633 8.19036 9.16667 7.5 9.16667C6.80964 9.16667 6.25 9.72633 6.25 10.4167C6.25 11.107 6.80964 11.6667 7.5 11.6667ZM12.5 11.6667C13.1903 11.6667 13.75 11.107 13.75 10.4167C13.75 9.72633 13.1903 9.16667 12.5 9.16667C11.8097 9.16667 11.25 9.72633 11.25 10.4167C11.25 11.107 11.8097 11.6667 12.5 11.6667Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0.416667)" fill="var(--theme-primary-deep)"/>
                </g>
              </g>
            </svg>
            <span className="sidebar__tab-text">Brand Bot Ellaments</span>
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
              className="sidebar__project-section-item"
              onClick={() => handleSectionClick('chats')}
              style={{ cursor: 'pointer' }}
            >
              <div className="sidebar__project-section-content">
                Project Chats
              </div>
            </div>
            <div 
              className="sidebar__uploaded-files-item"
              onClick={handleFilesMenuClick}
              style={{ cursor: 'pointer' }}
            >
              <div className="sidebar__project-section-content">
                Uploaded Files
              </div>
            </div>
            <div 
              className="sidebar__saved-work-item"
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
            <button className="project-menu__create-btn">
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
              <div className="project-menu__filter-count">8</div>
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
                <div className="project-menu__project-actions">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5L11.5 6.5H16L12.5 10L14 15L9 12L4 15L5.5 10L2 6.5H6.5L9 1.5Z" fill="#6B7280"/>
                  </svg>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 3V9M3 6H9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 3V9M3 6H9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 3V9M3 6H9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
              Showing 1-6 of 20 projects
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

          {/* Filter Options */}
          <div className="section-menu__filters">
            <div className="section-menu__filter-option section-menu__filter-option--active">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 3h16v2H2V3zm1 4h12v2H3V7zm2 4h8v2H5v-2z" fill="#6B7280"/>
              </svg>
              <span>All Chats</span>
            </div>
            <div className="section-menu__filter-option">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 1.5L11.5 6.5H16L12.5 10L14 15L9 12L4 15L5.5 10L2 6.5H6.5L9 1.5Z" fill="#6B7280"/>
              </svg>
              <span>Favorites</span>
            </div>
            <div className="section-menu__filter-option">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Starred</span>
            </div>
          </div>

          {/* Tasks List */}
          <div className="section-menu__tasks">
            {sampleTasks.map((task) => (
              <div key={task.id} className="section-menu__task">
                <div className="section-menu__task-header">
                  <div className="section-menu__task-left">
                    <div className="section-menu__task-checkbox">
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => {}}
                      />
                    </div>
                    <div 
                      className="section-menu__task-priority"
                      style={{ backgroundColor: getPriorityColor(task.priority) }}
                    ></div>
                    <div className="section-menu__task-title">{task.title}</div>
                  </div>
                  <div className="section-menu__task-actions">
                    <svg width="4" height="17" viewBox="0 0 4 17" fill="none">
                      <path d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z" fill="#5D5D5D"/>
                    </svg>
                  </div>
                </div>
                <div className="section-menu__task-details">
                  <div className="section-menu__task-description">{task.description}</div>
                  <div className="section-menu__task-meta">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="#9CA3AF" strokeWidth="1.5"/>
                      <path d="M7 3.5V7l2.5 2.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{task.date}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1v6h6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="7" cy="7" r="6" stroke="#9CA3AF" strokeWidth="1.5"/>
                    </svg>
                    <span>{task.progress}</span>
                  </div>
                  <div className="section-menu__task-tags">
                    {task.tags.map((tag, index) => {
                      const tagStyle = getTagStyle(tag);
                      return (
                        <span 
                          key={index} 
                          className="section-menu__task-tag"
                          style={{ 
                            backgroundColor: tagStyle.bg,
                            color: tagStyle.color
                          }}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="section-menu__pagination">
            <span className="section-menu__pagination-info">
              Showing 1-6 of 20 chats
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
            <button className="files-menu__create-btn">
              + Upload Document
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
                placeholder="Search documents..."
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
                <div className="files-menu__document-description">
                  {doc.description}
                </div>
                <div className="files-menu__document-footer">
                  <div className="files-menu__document-updated">
                    Updated: {doc.updated}
                  </div>
                  <div className="files-menu__document-category">
                    {doc.category}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="files-menu__pagination">
            <div className="files-menu__pagination-info">
              Showing 1-6 of 20 files
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
                <div className="saved-work-menu__item-description">
                  {item.description}
                </div>
                <div className="saved-work-menu__item-tags">
                  {item.tags.map((tag, index) => (
                    <div key={index} className="saved-work-menu__item-tag">
                      {tag}
                    </div>
                  ))}
                </div>
                <div className="saved-work-menu__item-footer">
                  <div className="saved-work-menu__item-saved">
                    Saved: {item.saved}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="saved-work-menu__pagination">
            <div className="saved-work-menu__pagination-info">
              Showing 1-6 of 20 docs
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
              Manage Saved Work
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
              Manage Templates
            </button>
          </div>

          <div className="workspace-menu__options">
            <div className="workspace-menu__option" onClick={() => console.log('Rename Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12.854 3.146a.5.5 0 0 1 0 .708L8.207 8.5l4.647 4.646a.5.5 0 0 1-.708.708L7.5 9.207l-4.646 4.647a.5.5 0 0 1-.708-.708L6.793 8.5 2.146 3.854a.5.5 0 1 1 .708-.708L7.5 7.793l4.646-4.647a.5.5 0 0 1 .708 0z" fill="#6B7280"/>
              </svg>
              <span>Rename Workspace</span>
            </div>

            <div className="workspace-menu__option" onClick={() => console.log('Share Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM4 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#6B7280"/>
              </svg>
              <span>Share Workspace</span>
            </div>

            <div className="workspace-menu__option" onClick={() => console.log('Un-Share Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM4 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#6B7280"/>
              </svg>
              <span>Un-Share Workspace</span>
            </div>

            <div className="workspace-menu__option" onClick={() => console.log('Download Documents')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 12l4-4h-3V2H7v6H4l4 4zM2 14h12v2H2v-2z" fill="#6B7280"/>
              </svg>
              <span>Download Documents</span>
            </div>

            <div className="workspace-menu__option" onClick={() => console.log('Transfer Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2l4 4h-3v6H7V6H4l4-4z" fill="#6B7280"/>
              </svg>
              <span>Transfer Workspace</span>
            </div>

            <div className="workspace-menu__option" onClick={() => console.log('Archive Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 3h12v2H2V3zm1 3h10v8H3V6zm3 2v4h4V8H6z" fill="#6B7280"/>
              </svg>
              <span>Archive Workspace</span>
            </div>

            <div className="workspace-menu__option" onClick={() => console.log('Delete Workspace')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3V2h4v1h3v1H3V3h3zM4 5h8v9H4V5zm2 2v5h1V7H6zm3 0v5h1V7H9z" fill="#6B7280"/>
              </svg>
              <span>Delete Workspace</span>
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
          tags: ellament.category ? [ellament.category] : []
        };
        setSelectedDocument(mappedDocument);
        setShowDocumentDrawer(true);
        setShowEllamentDrawer(false);
      }}
    />
    </>
  );
};

export default Sidebar; 