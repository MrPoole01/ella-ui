import React, { useState, useRef, useEffect } from 'react';
import { InviteUsersModal } from '../ui/Modal';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRightIcon,
  ProfileIcon,
  MenuIcon,
  ProjectIcon
} from '../icons';
import { useTheme } from '../../context';
import WorkspaceDropdown from '../features/WorkspaceDropdown';
import OrganizationDropdown from '../features/OrganizationDropdown';
import EllamentDrawer from '../features/EllamentDrawer';
import WorkspaceFilter from '../features/WorkspaceFilter';
import { WorkspaceCreateModal } from '../ui/Modal';
import '../../styles/Header.scss';
import { ReactComponent as EllaTextLogo } from '../icons/ella_ai_text_logo.svg';

const Header = () => {
  const navigate = useNavigate();
  const { currentTheme, themes, setTheme } = useTheme();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isOrganizationDropdownOpen, setIsOrganizationDropdownOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState({ id: 1, name: 'Creative Studio' }); // Default workspace
  const [selectedOrganization, setSelectedOrganization] = useState({ id: 1, name: 'Acme Corp', workspaceCount: 8 }); // Default organization
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true); // Show notifications by default
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [isEllamentDrawerOpen, setIsEllamentDrawerOpen] = useState(false);
  const [orgBrandBots, setOrgBrandBots] = useState([]);
  const [isWorkspaceShareModalOpen, setIsWorkspaceShareModalOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('appearance');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeMobileNavItem, setActiveMobileNavItem] = useState('home');
  const [isMobileWorkspaceDropdownOpen, setIsMobileWorkspaceDropdownOpen] = useState(false);
  const [mobileWorkspaceSearchQuery, setMobileWorkspaceSearchQuery] = useState('');
  const [mobileWorkspaceFilterOpen, setMobileWorkspaceFilterOpen] = useState(false);
  const [mobileWorkspaceSortOrder, setMobileWorkspaceSortOrder] = useState('default');
  const [activeMobileEllipsisMenu, setActiveMobileEllipsisMenu] = useState(null);
  const [appearanceMode, setAppearanceMode] = useState('auto'); // 'light', 'dark', 'auto'
  const [startWeekOn, setStartWeekOn] = useState('Monday');
  const [autoTimezone, setAutoTimezone] = useState(true);
  const [timezone, setTimezone] = useState('');
  
  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    // In-App Notifications
    workspacesSharedByOthers: true,
    userAccessRequests: true,
    ellaAppUpdates: true,
    // Email Notifications
    activityInWorkspace: true,
    alwaysSendEmail: false,
    workspaceDigest: true,
    announcementsAndUpdates: true
  });

  // People Management State
  const [peopleSearchQuery, setPeopleSearchQuery] = useState('');
  const [activePeopleTab, setActivePeopleTab] = useState('users');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // Mobile workspace data - should match the main workspace dropdown data
  const [mobilePinnedWorkspaces, setMobilePinnedWorkspaces] = useState([
    { id: 101, name: 'Marketing Hub', lastUpdated: '2 days ago', icon: 'folder', isPinned: true },
    { id: 102, name: 'Product Design', lastUpdated: '8 days ago', icon: 'folder', isPinned: true }
  ]);

  const [mobileAllWorkspaces, setMobileAllWorkspaces] = useState([
    { id: 1, name: 'Creative Studio', lastUpdated: '2 days ago', isActive: true, isPinned: false },
    { id: 2, name: 'Engineering Team', lastUpdated: '1 week ago', isActive: false, isPinned: false },
    { id: 3, name: 'Sales Operations', lastUpdated: '2 week ago', isActive: false, isPinned: false },
    { id: 4, name: 'Client Projects', lastUpdated: '3 week ago', isActive: false, isPinned: false },
    { id: 5, name: 'Research Lab', lastUpdated: '1 month ago', isActive: false, isPinned: false },
    { id: 6, name: 'Brand Strategy', lastUpdated: '2 months ago', isActive: false, isPinned: false }
  ]);
  
  // Sample workspaces and projects for the invite modal
  const [availableWorkspaces] = useState([
    { id: 1, name: 'Marketing', description: 'Marketing campaigns and content' },
    { id: 2, name: 'Design', description: 'Design assets and brand guidelines' },
    { id: 3, name: 'Development', description: 'Software development projects' },
    { id: 4, name: 'QA', description: 'Quality assurance and testing' },
    { id: 5, name: 'Client Projects', description: 'External client work' }
  ]);

  const [availableProjects] = useState([
    { id: 1, name: 'Q4 Campaign', workspaces: [1], workspace: 1 },
    { id: 2, name: 'Website Redesign', workspaces: [1, 2], workspace: 2 },
    { id: 3, name: 'Brand Guidelines', workspaces: [2], workspace: 2 },
    { id: 4, name: 'API Refactor', workspaces: [3], workspace: 3 },
    { id: 5, name: 'Mobile App', workspaces: [3], workspace: 3 },
    { id: 6, name: 'Testing Suite', workspaces: [3, 4], workspace: 4 },
    { id: 7, name: 'Social Media', workspaces: [1], workspace: 1 },
    { id: 8, name: 'Content Strategy', workspaces: [1], workspace: 1 },
    { id: 9, name: 'Logo Design', workspaces: [2], workspace: 2 },
    { id: 10, name: 'Brand Review', workspaces: [5], workspace: 5 },
    { id: 11, name: 'Website Updates', workspaces: [3], workspace: 3 }
  ]);

  // Mobile navigation items
  const mobileNavItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <ProjectIcon />
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <ProfileIcon />
    }
  ];
  const [sampleUsers, setSampleUsers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: 'SJ',
      role: 'Admin',
      workspaces: ['Marketing', 'Design'],
      projects: ['Q4 Campaign', 'Website Redesign', 'Brand Guidelines'],
      lastActive: '2024-01-15T10:30:00Z',
      status: 'active'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      avatar: 'MC',
      role: 'Workspace Owner',
      workspaces: ['Development', 'QA'],
      projects: ['API Refactor', 'Mobile App', 'Testing Suite'],
      lastActive: '2024-01-15T09:15:00Z',
      status: 'active'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      avatar: 'ER',
      role: 'User',
      workspaces: ['Marketing'],
      projects: ['Social Media', 'Content Strategy'],
      lastActive: '2024-01-14T16:45:00Z',
      status: 'active'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@external.com',
      avatar: 'DK',
      role: 'User',
      workspaces: ['Design'],
      projects: ['Logo Design'],
      lastActive: '2024-01-13T14:20:00Z',
      status: 'active'
    }
  ]);
  const [sampleGuests, setSampleGuests] = useState([
    {
      id: 5,
      name: 'Jessica Taylor',
      email: 'jessica.taylor@client.com',
      avatar: 'JT',
      role: 'Guest',
      workspaces: ['Client Projects'],
      projects: ['Brand Review'],
      lastActive: '2024-01-12T11:30:00Z',
      status: 'pending'
    },
    {
      id: 6,
      name: 'Robert Wilson',
      email: 'robert.wilson@contractor.com',
      avatar: 'RW',
      role: 'Guest',
      workspaces: ['Development'],
      projects: ['Website Updates'],
      lastActive: '2024-01-10T08:45:00Z',
      status: 'active'
    }
  ]);
  const themeDropdownRef = useRef(null);
  const workspaceDropdownRef = useRef(null);
  const organizationDropdownRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const settingsMenuRef = useRef(null);
  const helpMenuRef = useRef(null);
  const mobileNavRef = useRef(null);

  // Sample notification data based on the Motiff design
  const notifications = [
    {
      id: 1,
      type: 'message',
      title: 'New message in Project A discussion',
      time: 'July 8, 2025 – 10:30 AM',
      category: 'Chat',
      isUnread: true,
      iconColor: '#DBEAFE',
      iconBg: '#DBEAFE'
    },
    {
      id: 2,
      type: 'document',
      title: 'Strategy document has been updated with new content',
      time: 'July 7, 2025 – 3:45 PM',
      category: 'Document',
      isUnread: true,
      iconColor: '#E0E7FF',
      iconBg: '#E0E7FF'
    },
    {
      id: 3,
      type: 'billing',
      title: 'Your subscription will renew in 7 days',
      time: 'July 6, 2025 – 9:15 AM',
      category: 'Billing',
      isUnread: true,
      iconColor: '#FEF3C7',
      iconBg: '#FEF3C7'
    },
    {
      id: 4,
      type: 'document',
      title: 'Social Media Campaign Planning completed',
      time: 'July 5, 2025 – 2:20 PM',
      category: 'Document',
      isUnread: false,
      iconColor: '#E0E7FF',
      iconBg: '#E0E7FF'
    }
  ];

  const unreadCount = notifications.filter(n => n.isUnread).length;

  const handleLogout = () => {
    // Clear authentication token
    localStorage.removeItem('ella-auth-token');
    
    // Navigate to login page
    navigate('/login', { replace: true });
  };

  // Settings menu handlers
  const handleSettingsClick = (e) => {
    e.stopPropagation();
    setShowSettingsMenu(true);
    setShowProfileDropdown(false);
  };

  const handleSettingsClose = () => {
    setShowSettingsMenu(false);
  };

  // Help menu handlers
  const handleHelpClick = (e) => {
    e.stopPropagation();
    setShowHelpMenu(true);
    setShowProfileDropdown(false);
    setShowSettingsMenu(false);
  };

  const handleHelpClose = () => {
    setShowHelpMenu(false);
  };

  const handleHelpMenuAction = (action) => {
    console.log('Help action:', action);
    setShowHelpMenu(false);
    
    // Here you would implement the actual actions
    switch (action) {
      case 'billing':
        // Open billing page or modal
        window.open('/billing', '_blank');
        break;
      case 'documentation':
        // Open documentation
        window.open('https://docs.ella.ai', '_blank');
        break;
      case 'submit-ticket':
        // Open support ticket form
        window.open('/support/new-ticket', '_blank');
        break;
      case 'contact-sales':
        // Open contact sales form or link
        window.open('/contact-sales', '_blank');
        break;
      default:
        break;
    }
  };

  const handleAppearanceModeChange = (mode) => {
    setAppearanceMode(mode);
    
    // Apply theme immediately based on mode
    if (mode === 'light') {
      setTheme('Ella EV2 Light');
    } else if (mode === 'dark') {
      setTheme('Ella EV2 Dark');
    } else if (mode === 'auto') {
      // Auto mode - switch based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'Ella EV2 Dark' : 'Ella EV2 Light');
    }
  };

  const handleStartWeekOnChange = (day) => {
    setStartWeekOn(day);
    // Here you would typically save to user preferences
    console.log('Start week on:', day);
  };

  const handleAutoTimezoneToggle = () => {
    const newAutoTimezone = !autoTimezone;
    setAutoTimezone(newAutoTimezone);
    
    if (newAutoTimezone) {
      // Detect and set timezone automatically
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(detectedTimezone);
    }
  };

  const handleTimezoneChange = (e) => {
    if (!autoTimezone) {
      setTimezone(e.target.value);
    }
  };

  // Notification Settings Handlers
  const handleNotificationToggle = (settingKey) => {
    setNotificationSettings(prev => {
      const updated = {
        ...prev,
        [settingKey]: !prev[settingKey]
      };
      
      // Persist to localStorage
      localStorage.setItem('ellaNotificationSettings', JSON.stringify(updated));
      return updated;
    });
  };

  // Load notification settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('ellaNotificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setNotificationSettings(parsed);
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  // People Management Handlers
  const handlePeopleSearchChange = (e) => {
    setPeopleSearchQuery(e.target.value);
  };

  const handleUserRoleChange = (userId, newRole) => {
    setSampleUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleGuestRoleChange = (guestId, newRole) => {
    setSampleGuests(prev => 
      prev.map(guest => 
        guest.id === guestId ? { ...guest, role: newRole } : guest
      )
    );
  };

  const handleAddUserClick = () => {
    setIsAddUserModalOpen(true);
  };

  const handleAddUserClose = () => {
    setIsAddUserModalOpen(false);
  };

  const handleSendInvites = async (inviteData) => {
    try {
      // Simulate API call with some validation
      console.log('Sending invites:', inviteData);
      
      // Simulate some email-specific errors for demo
      const emailErrors = [];
      const successfulEmails = [];
      
      inviteData.emails.forEach(email => {
        // Simulate some validation errors
        if (email.includes('blocked')) {
          emailErrors.push({ email, message: 'Domain is blocked' });
        } else if (email.includes('exists')) {
          emailErrors.push({ email, message: 'User already exists' });
        } else {
          successfulEmails.push(email);
          
          // Add new pending users to the appropriate list
          const newUser = {
            id: Date.now() + Math.random(),
            name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            email: email,
            avatar: email.charAt(0).toUpperCase() + email.charAt(1).toUpperCase(),
            role: inviteData.role,
            workspaces: inviteData.workspaces.map(w => w.name),
            projects: inviteData.projects.map(p => p.name),
            lastActive: new Date().toISOString(),
            status: 'pending'
          };
          
          if (inviteData.role === 'Guest') {
            setSampleGuests(prev => [newUser, ...prev]);
          } else {
            setSampleUsers(prev => [newUser, ...prev]);
          }
        }
      });
      
      // Show success toast (you could implement a toast system here)
      if (successfulEmails.length > 0) {
        console.log(`Successfully sent ${successfulEmails.length} invite${successfulEmails.length !== 1 ? 's' : ''}`);
      }
      
      return {
        success: emailErrors.length === 0,
        emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
        successCount: successfulEmails.length
      };
      
    } catch (error) {
      console.error('Error sending invites:', error);
      return {
        success: false,
        error: 'Failed to send invites. Please try again.'
      };
    }
  };

  const handleRemoveUser = (userId, isGuest = false) => {
    if (isGuest) {
      setSampleGuests(prev => prev.filter(guest => guest.id !== userId));
    } else {
      setSampleUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  // Filter users and guests based on search query
  const filteredUsers = sampleUsers.filter(user =>
    user.name.toLowerCase().includes(peopleSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(peopleSearchQuery.toLowerCase())
  );

  const filteredGuests = sampleGuests.filter(guest =>
    guest.name.toLowerCase().includes(peopleSearchQuery.toLowerCase()) ||
    guest.email.toLowerCase().includes(peopleSearchQuery.toLowerCase())
  );

  // Initialize timezone on component mount
  useEffect(() => {
    if (autoTimezone) {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(detectedTimezone);
    }
  }, [autoTimezone]);

  // Auto theme switching based on system preference
  useEffect(() => {
    if (appearanceMode === 'auto') {
      const updateThemeBasedOnSystemPreference = () => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'Ella EV2 Dark' : 'Ella Web Light');
      };

      // Set initial theme based on system preference
      updateThemeBasedOnSystemPreference();
      
      // Listen for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateThemeBasedOnSystemPreference();
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [appearanceMode, setTheme]);

  const handleThemeSelect = (theme) => {
    setTheme(theme);
    setIsThemeDropdownOpen(false);
  };

  const handleWorkspaceClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Header workspace container clicked - opening workspace dropdown');
    setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen);
  };

  const handleWorkspaceDropdownClose = () => {
    setIsWorkspaceDropdownOpen(false);
  };

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
  };

  const handleWorkspaceShareModalStateChange = (isOpen) => {
    setIsWorkspaceShareModalOpen(isOpen);
  };

  const handleOrganizationClick = () => {
    setIsOrganizationDropdownOpen(!isOrganizationDropdownOpen);
  };

  const handleOrganizationDropdownClose = () => {
    setIsOrganizationDropdownOpen(false);
  };

  const handleOrganizationSelect = (organization) => {
    setSelectedOrganization(organization);
  };

  // Mobile navigation handlers
  const handleMobileNavToggle = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleMobileWorkspaceToggle = () => {
    setIsMobileWorkspaceDropdownOpen(!isMobileWorkspaceDropdownOpen);
    setActiveMobileEllipsisMenu(null); // Close any open ellipsis menus
  };

  const handleMobileEllipsisClick = (e, workspaceId) => {
    e.stopPropagation();
    setActiveMobileEllipsisMenu(activeMobileEllipsisMenu === workspaceId ? null : workspaceId);
  };

  const handleMobileWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
    setIsMobileWorkspaceDropdownOpen(false);
    setActiveMobileEllipsisMenu(null);
  };

  const handleMobileWorkspaceSearch = (e) => {
    setMobileWorkspaceSearchQuery(e.target.value);
  };

  const handleMobileWorkspaceFilterToggle = () => {
    setMobileWorkspaceFilterOpen(!mobileWorkspaceFilterOpen);
  };

  const handleMobileWorkspaceFilterClose = () => {
    setMobileWorkspaceFilterOpen(false);
  };

  const handleMobileWorkspaceSortChange = (newSortOrder) => {
    setMobileWorkspaceSortOrder(newSortOrder);
  };

  const handleMobilePinToggle = (workspace) => {
    if (workspace.isPinned) {
      // Unpin: Remove from pinned and add back to all workspaces
      setMobilePinnedWorkspaces(prev => prev.filter(w => w.id !== workspace.id));
      setMobileAllWorkspaces(prev => [...prev, { ...workspace, isPinned: false }].sort((a, b) => a.id - b.id));
    } else {
      // Pin: Remove from all workspaces and add to pinned
      setMobileAllWorkspaces(prev => prev.filter(w => w.id !== workspace.id));
      setMobilePinnedWorkspaces(prev => [...prev, { ...workspace, isPinned: true }]);
    }
    setActiveMobileEllipsisMenu(null);
  };

  const handleMobileMenuAction = (action, workspace) => {
    console.log(`Mobile ${action} action for workspace:`, workspace.name);
    setActiveMobileEllipsisMenu(null);
    // Add specific action handlers as needed
  };

  // Sort workspaces based on selected sort order
  const sortMobileWorkspaces = (workspaces, sortOrder) => {
    switch (sortOrder) {
      case 'a-z':
        return [...workspaces].sort((a, b) => a.name.localeCompare(b.name));
      case 'z-a':
        return [...workspaces].sort((a, b) => b.name.localeCompare(a.name));
      case 'default':
      default:
        return workspaces;
    }
  };

  const sortedMobileWorkspaces = sortMobileWorkspaces(mobileAllWorkspaces, mobileWorkspaceSortOrder);
  const sortedMobilePinnedWorkspaces = sortMobileWorkspaces(mobilePinnedWorkspaces, mobileWorkspaceSortOrder);

  const handleMobileNavItemClick = (itemId) => {
    setActiveMobileNavItem(itemId);
    setIsMobileNavOpen(false);
    // Handle navigation logic here
    console.log('Mobile nav item clicked:', itemId);
  };



  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Handle search submission
      console.log('Search query:', searchQuery);
      // You can add your search logic here
    }
    if (e.key === 'Escape') {
      // Clear search on escape
      setSearchQuery('');
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationMenuOpen(!isNotificationMenuOpen);
  };

  const handleNotificationMenuClose = () => {
    setIsNotificationMenuOpen(false);
  };

  const handleMarkAllAsRead = () => {
    // Mark all notifications as read
    console.log('Mark all as read');
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target) && !isWorkspaceShareModalOpen) {
        setIsWorkspaceDropdownOpen(false);
      }
      if (organizationDropdownRef.current && !organizationDropdownRef.current.contains(event.target)) {
        setIsOrganizationDropdownOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setIsNotificationMenuOpen(false);
      }

      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target)) {
        setShowHelpMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isWorkspaceShareModalOpen]);

  // Click outside handler for mobile nav
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target) && isMobileNavOpen) {
        setIsMobileNavOpen(false);
      }
    };

    if (isMobileNavOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileNavOpen]);

  return (
    <div className="header close-ella-search">
      <div className="header__left">
        {/* Mobile Hamburger Menu */}
        <button 
          className="header__mobile-hamburger"
          onClick={handleMobileNavToggle}
        >
          <MenuIcon />
        </button>
        
        <div className="header__logo-section">
          <svg xmlns="http://www.w3.org/2000/svg" width="21.7344" height="20" viewBox="0 0 20 24" className="nav-toggle">
            <path d="M19.0199 21.9997L2.7159 21.9997C1.21683 21.9997 0 20.7687 0 19.2521L0 2.74761C0 1.2315 1.21683 0 2.7159 0L19.0199 0C20.519 0 21.7358 1.2315 21.7358 2.74761L21.7358 19.2521C21.7358 20.7687 20.519 21.9997 19.0199 21.9997ZM7.24845 20.166L7.24845 1.83373L3.16576 1.83373C2.41827 1.83373 1.81166 2.44742 1.81166 3.20364L1.81166 18.7961C1.81166 19.5523 2.41826 20.166 3.16576 20.166L7.24845 20.166ZM18.5701 1.83373L9.06057 1.83373L9.06057 20.166L18.5701 20.166C19.3176 20.166 19.9242 19.5523 19.9242 18.7961L19.9242 3.20364C19.9242 2.44742 19.3176 1.83373 18.5701 1.83373Z" fillRule="evenodd" transform="matrix(1 0 0 1 9.53674e-07 -9.53674e-05)" fill="rgb(0, 0, 0)"/>
            <path d="M3.09328 6.25924L0 3.12985L3.09328 0L4.3749 1.29658L2.56278 3.12985L4.3749 4.96312L3.09328 6.25924Z" fillRule="evenodd" transform="matrix(1 0 0 1 2.34285 7.8455)" fill="rgb(0, 0, 0)"/>
          </svg>
          <EllaTextLogo width={50} height={19} style={{ marginLeft: 8, marginRight: 8 }} />
          <div 
            className="header__organization-container" 
            ref={organizationDropdownRef}
            onClick={handleOrganizationClick}
          >
            <div className="header__organization-text">{selectedOrganization.name}</div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20.3672" 
              height="20.3647" 
              viewBox="0 0 20.3672 20.3647" 
              className="chevron-down-icon"
              style={{
                transform: isOrganizationDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <defs>
                <clipPath id="clipPathOrgChevron">
                  <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(0.999831 0.0184092 -0.0184092 0.999831 0.368187 -2.47955e-05)"/>
                </clipPath>
              </defs>
              <g clipPath="url(#clipPathOrgChevron)">
                <path d="M-0.662913 -0.662913C-1.02903 -0.296799 -1.02903 0.296799 -0.662913 0.662913L4.96209 6.28791Q5.09395 6.41977 5.26623 6.49114Q5.43852 6.5625 5.625 6.5625Q5.81148 6.5625 5.98377 6.49114Q6.15605 6.41977 6.28791 6.28791L11.9129 0.662913C12.279 0.296799 12.279 -0.296799 11.9129 -0.662913C11.5468 -1.02903 10.9532 -1.02903 10.5871 -0.662912L5.625 4.29918L0.662913 -0.662913C0.296799 -1.02903 -0.296799 -1.02903 -0.662913 -0.662913Z" fillRule="evenodd" transform="matrix(0.999831 0.0184092 -0.0184092 0.999831 4.61013 7.2668)" fill="rgb(156, 163, 175)"/>
              </g>
            </svg>
            <OrganizationDropdown 
              isOpen={isOrganizationDropdownOpen} 
              onClose={handleOrganizationDropdownClose}
              selectedOrganization={selectedOrganization}
              onOrganizationSelect={handleOrganizationSelect}
              onOrganizationCreated={(org) => {
                // TODO: propagate to global state; for now, log
                console.log('Organization created:', org);
              }}
              onOpenCreateOrganization={() => {
                // TODO: Open create organization modal
                console.log('Open create organization modal');
              }}
            />
          </div>
          <div 
            className="header__workspace-container" 
            ref={workspaceDropdownRef}
            onClick={handleWorkspaceClick}
          >
          <div className="header__workspace-text">{selectedWorkspace.name}</div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20.3672" 
              height="20.3647" 
              viewBox="0 0 20.3672 20.3647" 
              className="chevron-down-icon"
              style={{
                transform: isWorkspaceDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <defs>
                <clipPath id="clipPath7611540475">
                  <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(0.999831 0.0184092 -0.0184092 0.999831 0.368187 -2.47955e-05)"/>
                </clipPath>
              </defs>
              <g clipPath="url(#clipPath7611540475)">
                <path d="M-0.662913 -0.662913C-1.02903 -0.296799 -1.02903 0.296799 -0.662913 0.662913L4.96209 6.28791Q5.09395 6.41977 5.26623 6.49114Q5.43852 6.5625 5.625 6.5625Q5.81148 6.5625 5.98377 6.49114Q6.15605 6.41977 6.28791 6.28791L11.9129 0.662913C12.279 0.296799 12.279 -0.296799 11.9129 -0.662913C11.5468 -1.02903 10.9532 -1.02903 10.5871 -0.662912L5.625 4.29918L0.662913 -0.662913C0.296799 -1.02903 -0.296799 -1.02903 -0.662913 -0.662913Z" fillRule="evenodd" transform="matrix(0.999831 0.0184092 -0.0184092 0.999831 4.61013 7.2668)" fill="rgb(156, 163, 175)"/>
              </g>
            </svg>
            <WorkspaceDropdown 
              isOpen={isWorkspaceDropdownOpen} 
              onClose={handleWorkspaceDropdownClose}
              selectedWorkspace={selectedWorkspace}
              onWorkspaceSelect={handleWorkspaceSelect}
              onWorkspaceCreated={(ws) => {
                // TODO: propagate to global state; for now, log
                console.log('Workspace created:', ws);
              }}
              onOpenCreateWorkspace={({ orgBrandBots: bots }) => {
                setOrgBrandBots(bots || []);
                setIsCreateWorkspaceOpen(true);
              }}
              onShareModalStateChange={handleWorkspaceShareModalStateChange}
            />
          </div>
        </div>
      </div>
      
      <div className="header__center">
        {/* Mobile Workspace Text with Chevron */}
        <div 
          className="header__center-mobile-workspace"
          onClick={handleMobileWorkspaceToggle}
        >
          <span>{selectedWorkspace?.name || 'Workspace'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20.3672" height="20.3647" viewBox="0 0 20.3672 20.3647" className="chevron-down-icon" style={{transform: isMobileWorkspaceDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}>
            <defs>
              <clipPath id="clipPathOrgChevron">
                <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(0.999831 0.0184092 -0.0184092 0.999831 0.368187 -2.47955e-05)"></path>
              </clipPath>
            </defs>
            <g clipPath="url(#clipPathOrgChevron)">
              <path d="M-0.662913 -0.662913C-1.02903 -0.296799 -1.02903 0.296799 -0.662913 0.662913L4.96209 6.28791Q5.09395 6.41977 5.26623 6.49114Q5.43852 6.5625 5.625 6.5625Q5.81148 6.5625 5.98377 6.49114Q6.15605 6.41977 6.28791 6.28791L11.9129 0.662913C12.279 0.296799 12.279 -0.296799 11.9129 -0.662913C11.5468 -1.02903 10.9532 -1.02903 10.5871 -0.662912L5.625 4.29918L0.662913 -0.662913C0.296799 -1.02903 -0.296799 -1.02903 -0.662913 -0.662913Z" fillRule="evenodd" transform="matrix(0.999831 0.0184092 -0.0184092 0.999831 4.61013 7.2668)" fill="rgb(156, 163, 175)"></path>
            </g>
          </svg>
        </div>

        {/* Mobile Workspace Dropdown */}
        {isMobileWorkspaceDropdownOpen && (
          <div className="header__mobile-workspace-dropdown">
            <div className="header__mobile-workspace-overlay" onClick={handleMobileWorkspaceToggle}></div>
            <div className="header__mobile-workspace-content">
              <div className="header__mobile-workspace-header">
                <span>+ Create New Workspace</span>
              </div>
              <div className="header__mobile-workspace-search">
                <div className="header__mobile-workspace-search-container">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="header__mobile-workspace-search-icon">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search workspaces..."
                    value={mobileWorkspaceSearchQuery}
                    onChange={handleMobileWorkspaceSearch}
                    className="header__mobile-workspace-search-input"
                  />
                </div>
                <div className="header__mobile-workspace-filter-container">
                  <button 
                    className={`header__mobile-workspace-filter-btn ${mobileWorkspaceFilterOpen ? 'header__mobile-workspace-filter-btn--active' : ''}`}
                    onClick={handleMobileWorkspaceFilterToggle}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="16" height="16" viewBox="0 0 16 16">
                      <defs>
                        <clipPath id="clipPathMobileFilterIcon">
                          <path d="M0 0L16 0L16 16L0 16L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                        </clipPath>
                      </defs>
                      <g clipPath="url(#clipPathMobileFilterIcon)">
                        <path d="M-0.6 0C-0.6 0.331368 -0.331368 0.6 0 0.6L12 0.6C12.3314 0.6 12.6 0.331368 12.6 0C12.6 -0.331368 12.3314 -0.6 12 -0.6L0 -0.6C-0.331368 -0.6 -0.6 -0.331368 -0.6 0ZM1.4 4C1.4 4.33137 1.66863 4.6 2 4.6L10 4.6C10.3314 4.6 10.6 4.33137 10.6 4C10.6 3.66863 10.3314 3.4 10 3.4L2 3.4C1.66863 3.4 1.4 3.66863 1.4 4ZM3.4 8C3.4 8.33137 3.66863 8.6 4 8.6L8 8.6C8.33137 8.6 8.6 8.33137 8.6 8C8.6 7.66863 8.33137 7.4 8 7.4L4 7.4C3.66863 7.4 3.4 7.66863 3.4 8Z" fillRule="evenodd" transform="matrix(1 0 0 1 2 4)" fill="currentColor"/>
                      </g>
                    </svg>
                  </button>
                  
                  <WorkspaceFilter
                    isOpen={mobileWorkspaceFilterOpen}
                    onClose={handleMobileWorkspaceFilterClose}
                    onSortChange={handleMobileWorkspaceSortChange}
                    currentSort={mobileWorkspaceSortOrder}
                  />
                </div>
              </div>
              
              {/* Pinned Workspaces */}
              <div className="header__mobile-workspace-section">
                <div className="header__mobile-workspace-section-header">PINNED WORKSPACES</div>
                <div className="header__mobile-workspace-items">
                  {sortedMobilePinnedWorkspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className={`header__mobile-workspace-item header__mobile-workspace-item--pinned ${selectedWorkspace?.id === workspace.id ? 'header__mobile-workspace-item--selected' : ''}`}
                      onClick={() => handleMobileWorkspaceSelect(workspace)}
                    >
                      <div className="header__mobile-workspace-item-icon">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M9 1.5L11.5 6.5H16L12.5 10L14 15L9 12L4 15L5.5 10L2 6.5H6.5L9 1.5Z" fill="#6B7280"/>
                        </svg>
                      </div>
                      <div className="header__mobile-workspace-item-content">
                        <div className="header__mobile-workspace-item-name">{workspace.name}</div>
                        <div className="header__mobile-workspace-item-meta">Last updated {workspace.lastUpdated}</div>
                      </div>
                      <div className="header__mobile-workspace-item-actions">
                        <button
                          className="header__mobile-workspace-ellipsis-btn"
                          onClick={(e) => handleMobileEllipsisClick(e, workspace.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="currentColor"/>
                            <path d="M8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4Z" fill="currentColor"/>
                            <path d="M8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" fill="currentColor"/>
                          </svg>
                        </button>
                        {activeMobileEllipsisMenu === workspace.id && (
                          <div className="header__mobile-workspace-ellipsis-menu">
                            <button onClick={() => handleMobileMenuAction('rename', workspace)}>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M6.36 2.68L2.5 6.54V8.96H4.92L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Rename
                            </button>
                            <button onClick={() => handleMobileMenuAction('share', workspace)}>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M10.5 5.25C11.4665 5.25 12.25 4.4665 12.25 3.5C12.25 2.5335 11.4665 1.75 10.5 1.75C9.5335 1.75 8.75 2.5335 8.75 3.5C8.75 3.71 8.785 3.913 8.848 4.102L5.152 6.125C4.816 5.7525 4.336 5.25 3.5 5.25C2.5335 5.25 1.75 6.0335 1.75 7C1.75 7.9665 2.5335 8.75 3.5 8.75C4.336 8.75 4.816 8.2475 5.152 7.875L8.848 9.898C8.785 10.087 8.75 10.29 8.75 10.5C8.75 11.4665 9.5335 12.25 10.5 12.25C11.4665 12.25 12.25 11.4665 12.25 10.5C12.25 9.5335 11.4665 8.75 10.5 8.75C9.664 8.75 9.184 9.2525 8.848 9.625L5.152 7.602C5.215 7.413 5.25 7.21 5.25 7C5.25 6.79 5.215 6.587 5.152 6.398L8.848 4.375C9.184 4.7475 9.664 5.25 10.5 5.25Z" fill="currentColor"/>
                              </svg>
                              Share
                            </button>
                            <div className="header__mobile-workspace-menu-divider"></div>
                            <button onClick={() => handleMobilePinToggle(workspace)} className="header__mobile-workspace-menu-item--pin">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M8.75 1.75L5.25 1.75C4.9668 1.75 4.7332 1.9668 4.7332 2.25L4.7332 7L3.5 8.75L10.5 8.75L9.2668 7L9.2668 2.25C9.2668 1.9668 9.0332 1.75 8.75 1.75ZM7 12.25L7 9.625L7 12.25Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Unpin
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Workspaces */}
              <div className="header__mobile-workspace-section">
                <div className="header__mobile-workspace-section-header">WORKSPACES</div>
                <div className="header__mobile-workspace-items">
                  {sortedMobileWorkspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className={`header__mobile-workspace-item ${workspace.isActive ? 'header__mobile-workspace-item--active' : ''} ${selectedWorkspace?.id === workspace.id ? 'header__mobile-workspace-item--selected' : ''}`}
                      onClick={() => handleMobileWorkspaceSelect(workspace)}
                    >
                      <div className="header__mobile-workspace-item-content">
                        <div className="header__mobile-workspace-item-name">{workspace.name}</div>
                        <div className="header__mobile-workspace-item-meta">Last updated {workspace.lastUpdated}</div>
                      </div>
                      <div className="header__mobile-workspace-item-actions">
                        <button
                          className="header__mobile-workspace-ellipsis-btn"
                          onClick={(e) => handleMobileEllipsisClick(e, workspace.id)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="currentColor"/>
                            <path d="M8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4Z" fill="currentColor"/>
                            <path d="M8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" fill="currentColor"/>
                          </svg>
                        </button>
                        {activeMobileEllipsisMenu === workspace.id && (
                          <div className="header__mobile-workspace-ellipsis-menu">
                            <button onClick={() => handleMobileMenuAction('rename', workspace)}>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M6.36 2.68L2.5 6.54V8.96H4.92L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Rename
                            </button>
                            <button onClick={() => handleMobileMenuAction('share', workspace)}>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M10.5 5.25C11.4665 5.25 12.25 4.4665 12.25 3.5C12.25 2.5335 11.4665 1.75 10.5 1.75C9.5335 1.75 8.75 2.5335 8.75 3.5C8.75 3.71 8.785 3.913 8.848 4.102L5.152 6.125C4.816 5.7525 4.336 5.25 3.5 5.25C2.5335 5.25 1.75 6.0335 1.75 7C1.75 7.9665 2.5335 8.75 3.5 8.75C4.336 8.75 4.816 8.2475 5.152 7.875L8.848 9.898C8.785 10.087 8.75 10.29 8.75 10.5C8.75 11.4665 9.5335 12.25 10.5 12.25C11.4665 12.25 12.25 11.4665 12.25 10.5C12.25 9.5335 11.4665 8.75 10.5 8.75C9.664 8.75 9.184 9.2525 8.848 9.625L5.152 7.602C5.215 7.413 5.25 7.21 5.25 7C5.25 6.79 5.215 6.587 5.152 6.398L8.848 4.375C9.184 4.7475 9.664 5.25 10.5 5.25Z" fill="currentColor"/>
                              </svg>
                              Share
                            </button>
                            <div className="header__mobile-workspace-menu-divider"></div>
                            <button onClick={() => handleMobilePinToggle(workspace)} className="header__mobile-workspace-menu-item--pin">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M8.75 1.75L5.25 1.75C4.9668 1.75 4.7332 1.9668 4.7332 2.25L4.7332 7L3.5 8.75L10.5 8.75L9.2668 7L9.2668 2.25C9.2668 1.9668 9.0332 1.75 8.75 1.75ZM7 12.25L7 9.625L7 12.25Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Pin
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="header__right">
        {/* Search Input Field */}
        <div className="header__search-container header__search-container--always-open">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 19 21.9998" 
            className="header__search-icon"
          >
            <path d="M12.2802 16.0613C11.1516 16.6051 9.88398 16.9102 8.54432 16.9102C3.82543 16.9102 0 13.1248 0 8.45512C0 3.78548 3.82543 0 8.54432 0C13.2632 0 17.0886 3.78548 17.0886 8.45512C17.0886 10.6758 16.2235 12.6965 14.8086 14.2052L18.7011 19.5292C19.2107 20.2262 19.0528 21.1998 18.3485 21.704C17.6442 22.2082 16.6602 22.052 16.1507 21.355L12.2802 16.0613ZM14.7581 8.45504C14.7581 11.8511 11.976 14.6042 8.5441 14.6042C5.11218 14.6042 2.33005 11.8511 2.33005 8.45504C2.33005 5.05893 5.11218 2.30586 8.5441 2.30586C11.976 2.30586 14.7581 5.05893 14.7581 8.45504Z" fillRule="evenodd" transform="matrix(1 0 0 1 0 -0.000104904)" fill="rgb(196, 196, 196)"/>
          </svg>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyPress}
            placeholder="Search..."
            className="header__search-input"
          />
        </div>

        {/* Mobile Search Icon */}
        <button className="header__mobile-search-icon">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 19 21.9998"
          >
            <path d="M12.2802 16.0613C11.1516 16.6051 9.88398 16.9102 8.54432 16.9102C3.82543 16.9102 0 13.1248 0 8.45512C0 3.78548 3.82543 0 8.54432 0C13.2632 0 17.0886 3.78548 17.0886 8.45512C17.0886 10.6758 16.2235 12.6965 14.8086 14.2052L18.7011 19.5292C19.2107 20.2262 19.0528 21.1998 18.3485 21.704C17.6442 22.2082 16.6602 22.052 16.1507 21.355L12.2802 16.0613ZM14.7581 8.45504C14.7581 11.8511 11.976 14.6042 8.5441 14.6042C5.11218 14.6042 2.33005 11.8511 2.33005 8.45504C2.33005 5.05893 5.11218 2.30586 8.5441 2.30586C11.976 2.30586 14.7581 5.05893 14.7581 8.45504Z" fillRule="evenodd" transform="matrix(1 0 0 1 0 -0.000104904)" fill="currentColor"/>
          </svg>
        </button>

        {/* Mobile Settings Icon */}
        <button className="header__mobile-settings-icon">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
          >
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2583 9.77251 19.9887C9.5799 19.7191 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.74172 9.96512 4.01131 9.77251C4.28089 9.5799 4.48571 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="header__actions">
          {/* Help Icon with Menu */}
          <div className="help-container" ref={helpMenuRef}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              className="help-icon"
              onClick={handleHelpClick}
              style={{ cursor: 'pointer' }}
            >
              <defs>
                <clipPath id="clipPath5917372953-help">
                  <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                </clipPath>
              </defs>
              <g clipPath="url(#clipPath5917372953-help)">
                <path d="M3.59965 9.82892C3.23589 9.82892 2.94106 9.53386 2.94106 9.17032L2.94106 7.71878C2.94106 7.53767 3.0157 7.36446 3.14742 7.23976L5.2446 5.25981C5.65578 4.8326 5.8819 4.27148 5.8819 3.67787L5.8819 3.5995C5.8819 2.97888 5.63712 2.39844 5.19235 1.96509C4.7478 1.53173 4.16209 1.29969 3.53884 1.31813C2.31386 1.34974 1.31719 2.40283 1.31719 3.6658C1.31719 4.02956 1.02236 4.32439 0.658594 4.32439C0.29483 4.32439 0 4.02956 0 3.6658C0 1.69484 1.57228 0.051213 3.50482 0.00137955C4.48546 -0.0254032 5.41035 0.338579 6.11153 1.02176C6.81271 1.70516 7.19887 2.62061 7.19887 3.5995L7.19887 3.67787C7.19887 4.62076 6.83686 5.51227 6.17893 6.18799C6.17256 6.19457 6.16576 6.20116 6.15917 6.20753L4.25825 8.00263L4.25825 9.17032C4.25825 9.53409 3.96342 9.82892 3.59965 9.82892Z" fillRule="nonzero" transform="matrix(1 0 0 1 6.38889 3.86949)" fill="rgb(196, 196, 196)"/>
                <path d="M0.878125 1.75488C0.821047 1.75488 0.763969 1.75027 0.706891 1.73951C0.649813 1.72634 0.59493 1.71097 0.542243 1.68902C0.489555 1.66706 0.439063 1.63874 0.390766 1.60801C0.342469 1.57508 0.298563 1.53974 0.256852 1.49824C0.0943984 1.33557 0 1.10945 0 0.876752C0 0.819454 0.00658528 0.762376 0.0175625 0.705519C0.0285389 0.650636 0.046102 0.593556 0.0680548 0.540869C0.0900076 0.488182 0.116352 0.437689 0.147086 0.389392C0.180016 0.341095 0.217336 0.29719 0.256852 0.255698C0.298563 0.215963 0.342469 0.178643 0.390766 0.148128C0.439063 0.115198 0.489556 0.0888559 0.542243 0.0669014C0.59493 0.0449486 0.649813 0.0273846 0.706891 0.0166285C0.818851 -0.00554369 0.937398 -0.00554369 1.04936 0.0166285C1.10644 0.0276057 1.16132 0.045168 1.21401 0.0669014C1.26648 0.0890736 1.31719 0.115198 1.36527 0.148128C1.41356 0.178862 1.45747 0.216182 1.49918 0.255698C1.53869 0.29719 1.57601 0.341315 1.60894 0.389392C1.63968 0.437909 1.66602 0.48818 1.68776 0.540869C1.70993 0.593556 1.72749 0.650636 1.73825 0.705519C1.74923 0.762597 1.75581 0.819673 1.75581 0.876752C1.75581 1.10945 1.66119 1.33557 1.49896 1.49803C1.33475 1.66267 1.10863 1.75488 0.878125 1.75488Z" fillRule="nonzero" transform="matrix(1 0 0 1 9.11241 14.5718)" fill="rgb(196, 196, 196)"/>
                <path d="M9.87891 19.7578C4.43168 19.7578 0 15.3261 0 9.87891C0 4.43168 4.43168 0 9.87891 0C15.3261 0 19.7578 4.43168 19.7578 9.87891C19.7578 15.3261 15.3261 19.7578 9.87891 19.7578ZM9.87891 1.31719C5.15789 1.31719 1.31719 5.15789 1.31719 9.87891C1.31719 14.5999 5.15789 18.4406 9.87891 18.4406C14.5999 18.4406 18.4406 14.5999 18.4406 9.87891C18.4406 5.15789 14.5999 1.31719 9.87891 1.31719Z" fillRule="nonzero" transform="matrix(1 0 0 1 0.110677 0.109863)" fill="rgb(196, 196, 196)"/>
              </g>
            </svg>

            {/* Help Menu */}
            {showHelpMenu && (
              <div className="help-menu">
                <div className="help-menu__header">
                  <div className="help-menu__title">Help & Support</div>
                  <button className="help-menu__close" onClick={handleHelpClose}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                <div className="help-menu__content">
                  <button 
                    className="help-menu__item"
                    onClick={() => handleHelpMenuAction('billing')}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 4h12v12H4V4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="help-menu__item-content">
                      <div className="help-menu__item-title">Billing</div>
                      <div className="help-menu__item-description">Manage your subscription and billing</div>
                    </div>
                  </button>

                  <button 
                    className="help-menu__item"
                    onClick={() => handleHelpMenuAction('documentation')}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16l4-4h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="help-menu__item-content">
                      <div className="help-menu__item-title">Documentation</div>
                      <div className="help-menu__item-description">Browse guides and tutorials</div>
                    </div>
                  </button>

                  <button 
                    className="help-menu__item"
                    onClick={() => handleHelpMenuAction('submit-ticket')}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="help-menu__item-content">
                      <div className="help-menu__item-title">Submit a Ticket</div>
                      <div className="help-menu__item-description">Get help from our support team</div>
                    </div>
                  </button>

                  <button 
                    className="help-menu__item"
                    onClick={() => handleHelpMenuAction('contact-sales')}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M20 14.42v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 2.11 0h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L6.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 20 14.42z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="help-menu__item-content">
                      <div className="help-menu__item-title">Contact Sales</div>
                      <div className="help-menu__item-description">Speak with our sales team</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Notification Bell with Menu */}
          <div className="notification-container" ref={notificationMenuRef}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="22" 
              height="21" 
              viewBox="0 0 22 21" 
              className="user-icon notification-bell" 
              onClick={handleNotificationClick}
              style={{ cursor: 'pointer' }}
            >
              <defs>
                <clipPath id="clipPath6499479970-user">
                  <path d="M0 0L22 0L22 21L0 21L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
                </clipPath>
              </defs>
              <g clipPath="url(#clipPath6499479970-user)">
                <path 
                  d="M7.63522 3.64456C7.63522 5.65436 5.92241 7.28935 3.81749 7.28935C1.71257 7.28935 0 5.65436 0 3.64456C0 1.63499 1.71257 0 3.81749 0C5.9224 0 7.63522 1.63499 7.63522 3.64456Z" 
                  fillRule="nonzero" 
                  transform="matrix(1 0 0 1 12.8715 0.115356)" 
                  fill={hasNotifications ? "rgb(239, 68, 68)" : "transparent"}
                  stroke={hasNotifications ? "rgb(239, 68, 68)" : "rgb(156, 163, 175)"}
                  strokeWidth="1"
                />
                <path d="M3.27593 2.28295C1.74468 2.28295 0.4445 1.32265 0 0L6.55161 0C6.10711 1.32265 4.80693 2.28295 3.27593 2.28295Z" fillRule="nonzero" transform="matrix(1 0 0 1 7.06597 18.5781)" fill="rgb(136, 136, 136)"/>
                <path d="M17.6651 17.4101L0.0777579 17.4101Q-0.155076 17.4101 -0.322862 17.2496Q-0.5 17.0801 -0.5 16.8358Q-0.5 16.3044 -0.268012 15.8239Q-0.0373662 15.3461 0.38091 15.0054Q0.898681 14.5835 1.18198 13.9969Q1.46375 13.4135 1.46375 12.7699L1.46375 6.59368Q1.46375 5.1485 2.05044 3.82672Q2.61563 2.55336 3.64399 1.57174Q4.6699 0.592457 5.99773 0.0554499Q7.37117 -0.5 8.87141 -0.5Q10.0463 -0.5 11.1769 -0.146428L11.9066 0.0817828L11.405 0.658803Q10.8641 1.28107 10.5736 2.03354Q10.2736 2.8105 10.2736 3.64479Q10.2736 4.59444 10.6591 5.46312Q11.0328 6.30505 11.7153 6.95658Q12.4003 7.61046 13.2884 7.96966Q14.2098 8.34228 15.2183 8.34228Q15.4745 8.34228 15.7299 8.31704L16.2791 8.26277L16.2791 12.7697Q16.2791 13.4132 16.5608 13.9966Q16.8441 14.5831 17.3619 15.0053Q17.78 15.3462 18.0107 15.8236Q18.2428 16.3042 18.2428 16.8356Q18.2428 17.08 18.0656 17.2495Q17.8978 17.4101 17.6651 17.4101ZM17.6651 16.4101Q17.4965 16.4101 17.3744 16.5269Q17.2428 16.6527 17.2428 16.8356Q17.2428 16.5331 17.1102 16.2586Q16.9761 15.981 16.7299 15.7804Q16.0401 15.2179 15.6603 14.4315Q15.2791 13.642 15.2791 12.7697L15.2791 8.81462L15.7791 8.81462L15.8282 9.31219Q15.5238 9.34228 15.2183 9.34228Q14.0152 9.34228 12.9135 8.89671Q11.8481 8.46582 11.0248 7.67992Q10.1991 6.89167 9.74512 5.86878Q9.2736 4.80638 9.2736 3.64479Q9.2736 2.62416 9.64067 1.67337Q9.99433 0.757349 10.6503 0.00275466L11.0276 0.330779L10.8784 0.807985Q9.89361 0.5 8.87141 0.5Q7.56572 0.5 6.37266 0.982505Q5.22208 1.44783 4.33447 2.29509Q3.44932 3.14001 2.96445 4.23241Q2.46375 5.36046 2.46375 6.59368L2.46375 12.7699Q2.46375 13.6423 2.08246 14.4318Q1.70257 15.2184 1.01245 15.7808Q0.766532 15.9811 0.632532 16.2586Q0.5 16.5331 0.5 16.8358Q0.5 16.6528 0.368381 16.5269Q0.246197 16.4101 0.0777579 16.4101L17.6651 16.4101Z" fillRule="nonzero" transform="matrix(1 0 0 1 1.47049 0.115356)" fill="rgb(183, 183, 183)"/>
              </g>
            </svg>

            {/* Notification Menu */}
            {isNotificationMenuOpen && (
              <div className="notification-menu">
                {/* Header */}
                <div className="notification-menu__header">
                  <div className="notification-menu__title">Notifications</div>
                  <div className="notification-menu__count">{unreadCount}</div>
                  <div className="notification-menu__mark-read" onClick={handleMarkAllAsRead}>
                    Mark All as Read
                  </div>
                </div>

                {/* Notifications List */}
                <div className="notification-menu__content">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-menu__item ${notification.isUnread ? 'notification-menu__item--unread' : ''}`}
                    >
                      <div className="notification-menu__icon" style={{ background: notification.iconBg }}>
                        {notification.type === 'message' && (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M2 3h16v12H6l-4 4V3z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                        {notification.type === 'document' && (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16l4-4h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                        {notification.type === 'billing' && (
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <div className="notification-menu__details">
                        <div className="notification-menu__message">{notification.title}</div>
                        <div className="notification-menu__meta">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <circle cx="6" cy="6" r="5" stroke="#6B7280" strokeWidth="2"/>
                            <path d="M6 3v3l2 2" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="notification-menu__time">{notification.time}</span>
                          <svg width="7" height="16" viewBox="0 0 7 16" fill="none">
                            <path d="M1 4L6 8L1 12" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="notification-menu__category">{notification.category}</span>
                        </div>
                      </div>
                      <div className="notification-menu__actions">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 12A4 4 0 1 0 8 4a4 4 0 0 0 0 8zM8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2z" fill="#9CA3AF"/>
                          <path d="M8 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" fill="#9CA3AF"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="notification-menu__footer">
                  <div className="notification-menu__view-all">View all notifications</div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Icon with Dropdown */}
          <div className="profile-section" ref={profileDropdownRef}>
            <div 
              className="profile-icon"
              onClick={toggleProfileDropdown}
            />
            
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-content">
                  <div className="profile-info">
                    <div className="profile-avatar">
          <ProfileIcon />
                    </div>
                    <div className="profile-details">
                      <div className="profile-name">Demo User</div>
                      <div className="profile-email">demo@example.com</div>
                    </div>
                  </div>
                  <div className="profile-divider"></div>
                  <div className="profile-menu">
                    <button className="profile-menu-item">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M10 6a4 4 0 100-8 4 4 0 000 8zM10 12a8 8 0 00-8 8h16a8 8 0 00-8-8z" fill="currentColor"/>
                      </svg>
                      <span>Profile</span>
                    </button>
                    <button className="profile-menu-item" onClick={handleSettingsClick}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" fill="currentColor"/>
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" fill="currentColor"/>
                      </svg>
                      <span>Settings</span>
                    </button>
                    
                    {/* Theme Selection in Profile Menu */}
                    <div className="profile-menu-theme-section">
                      <div className="profile-menu-theme-label">Theme</div>
                      <div className="profile-menu-theme-dropdown" ref={themeDropdownRef}>
                        <button 
                          className="profile-menu-theme-trigger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsThemeDropdownOpen(!isThemeDropdownOpen);
                          }}
                        >
                          <span className="profile-menu-theme-text">{currentTheme}</span>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 20 20" 
                            className="profile-menu-theme-chevron"
                            style={{
                              transform: isThemeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease'
                            }}
                          >
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fill="currentColor"/>
                          </svg>
                        </button>
                        
                        {isThemeDropdownOpen && (
                          <div className="profile-menu-theme-options">
                            {themes.map((theme) => (
                              <div
                                key={theme}
                                className={`profile-menu-theme-option ${currentTheme === theme ? 'profile-menu-theme-option--selected' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleThemeSelect(theme);
                                }}
                              >
                                {theme}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <button className="profile-menu-item" onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path 
                          d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        <polyline 
                          points="16,17 21,12 16,7" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        <line 
                          x1="21" 
                          y1="12" 
                          x2="9" 
                          y2="12" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Settings Menu */}
          {showSettingsMenu && (
            <div className="settings-menu" ref={settingsMenuRef}>
              <div className="settings-menu-content">
                <div className="settings-menu-header">
                  <h3>Settings</h3>
                  <button className="settings-menu-close" onClick={handleSettingsClose}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                                 {/* Settings Tabs */}
                 <div className="settings-tabs">
                   <button 
                     className={`settings-tab ${activeSettingsTab === 'appearance' ? 'settings-tab--active' : ''}`}
                     onClick={() => setActiveSettingsTab('appearance')}
                   >
                     Appearance
                   </button>
                   <button 
                     className={`settings-tab ${activeSettingsTab === 'notifications' ? 'settings-tab--active' : ''}`}
                     onClick={() => setActiveSettingsTab('notifications')}
                   >
                     Notifications
                   </button>
                   <button 
                     className={`settings-tab ${activeSettingsTab === 'people' ? 'settings-tab--active' : ''}`}
                     onClick={() => setActiveSettingsTab('people')}
                   >
                     People
                   </button>

                 </div>

                {/* Appearance Tab Content */}
                {activeSettingsTab === 'appearance' && (
                  <div className="settings-tab-content">
                    {/* Appearance Section */}
                    <div className="settings-section">
                      <div className="settings-section-header">Appearance</div>
                      <div className="settings-item">
                        <div className="settings-item-label">Theme</div>
                        <div className="settings-toggle-group">
                          <button 
                            className={`settings-toggle-option ${appearanceMode === 'light' ? 'settings-toggle-option--active' : ''}`}
                            onClick={() => handleAppearanceModeChange('light')}
                          >
                            Light
                          </button>
                          <button 
                            className={`settings-toggle-option ${appearanceMode === 'dark' ? 'settings-toggle-option--active' : ''}`}
                            onClick={() => handleAppearanceModeChange('dark')}
                          >
                            Dark
                          </button>
                          <button 
                            className={`settings-toggle-option ${appearanceMode === 'auto' ? 'settings-toggle-option--active' : ''}`}
                            onClick={() => handleAppearanceModeChange('auto')}
                          >
                            Auto
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Time Section */}
                    <div className="settings-section">
                      <div className="settings-section-header">Time</div>
                      
                      <div className="settings-item">
                        <div className="settings-item-label">Start Week On</div>
                        <div className="settings-dropdown">
                          <select 
                            value={startWeekOn} 
                            onChange={(e) => handleStartWeekOnChange(e.target.value)}
                            className="settings-select"
                          >
                            <option value="Monday">Monday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                        </div>
                      </div>

                      <div className="settings-item">
                        <div className="settings-item-label">Set Timezone Automatically</div>
                        <div className="settings-toggle">
                          <button 
                            className={`settings-toggle-switch ${autoTimezone ? 'settings-toggle-switch--on' : ''}`}
                            onClick={handleAutoTimezoneToggle}
                          >
                            <div className="settings-toggle-switch-handle"></div>
                          </button>
                        </div>
                      </div>

                      <div className="settings-item">
                        <div className="settings-item-label">Timezone</div>
                        <div className="settings-input">
                          <input 
                            type="text" 
                            value={timezone}
                            onChange={handleTimezoneChange}
                            disabled={autoTimezone}
                            className="settings-input-field"
                            placeholder="Select timezone..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab Content */}
                {activeSettingsTab === 'notifications' && (
                  <div className="settings-tab-content">
                    {/* Notifications Section */}
                    <div className="settings-section">
                      <div className="settings-section-header">Notifications</div>
                      
                      {/* In-App Notifications */}
                      <div className="settings-subsection">
                        <div className="settings-subsection-header">In-App Notifications</div>
                        
                        <div className="settings-item">
                          <div className="settings-item-content">
                            <div className="settings-item-label">Workspaces or Projects Shared by Other Users</div>
                            <div className="settings-item-description">Receive alerts when a workspace or project is shared with you</div>
                          </div>
                          <div className="settings-toggle-switch">
                            <input
                              type="checkbox"
                              id="workspacesSharedByOthers"
                              checked={notificationSettings.workspacesSharedByOthers}
                              onChange={() => handleNotificationToggle('workspacesSharedByOthers')}
                              className="settings-toggle-input"
                            />
                            <label htmlFor="workspacesSharedByOthers" className="settings-toggle-label"></label>
                          </div>
                        </div>

                        <div className="settings-item">
                          <div className="settings-item-content">
                            <div className="settings-item-label">User Access Requests</div>
                            <div className="settings-item-description">Receive alerts when someone requests access to your workspaces or projects</div>
                          </div>
                          <div className="settings-toggle-switch">
                            <input
                              type="checkbox"
                              id="userAccessRequests"
                              checked={notificationSettings.userAccessRequests}
                              onChange={() => handleNotificationToggle('userAccessRequests')}
                              className="settings-toggle-input"
                            />
                            <label htmlFor="userAccessRequests" className="settings-toggle-label"></label>
                          </div>
                        </div>

                        <div className="settings-item">
                          <div className="settings-item-content">
                            <div className="settings-item-label">Ella App Updates</div>
                            <div className="settings-item-description">Receive notifications when new product features or major updates are released</div>
                          </div>
                          <div className="settings-toggle-switch">
                            <input
                              type="checkbox"
                              id="ellaAppUpdates"
                              checked={notificationSettings.ellaAppUpdates}
                              onChange={() => handleNotificationToggle('ellaAppUpdates')}
                              className="settings-toggle-input"
                            />
                            <label htmlFor="ellaAppUpdates" className="settings-toggle-label"></label>
                          </div>
                        </div>
                      </div>

                      {/* Email Notifications */}
                      <div className="settings-subsection">
                        <div className="settings-subsection-header">Email Notifications</div>
                        
                        <div className="settings-item">
                          <div className="settings-item-content">
                            <div className="settings-item-label">Activity in Your Workspace</div>
                            <div className="settings-item-description">Send emails for invites, reminders, and access requests</div>
                          </div>
                          <div className="settings-toggle-switch">
                            <input
                              type="checkbox"
                              id="activityInWorkspace"
                              checked={notificationSettings.activityInWorkspace}
                              onChange={() => handleNotificationToggle('activityInWorkspace')}
                              className="settings-toggle-input"
                            />
                            <label htmlFor="activityInWorkspace" className="settings-toggle-label"></label>
                          </div>
                        </div>

                        <div className="settings-item">
                          <div className="settings-item-content">
                            <div className="settings-item-label">Always Send Email Notifications</div>
                            <div className="settings-item-description">Send email updates even when you are active in-app</div>
                          </div>
                          <div className="settings-toggle-switch">
                            <input
                              type="checkbox"
                              id="alwaysSendEmail"
                              checked={notificationSettings.alwaysSendEmail}
                              onChange={() => handleNotificationToggle('alwaysSendEmail')}
                              className="settings-toggle-input"
                            />
                            <label htmlFor="alwaysSendEmail" className="settings-toggle-label"></label>
                          </div>
                        </div>

                        <div className="settings-item">
                          <div className="settings-item-content">
                            <div className="settings-item-label">Workspace Digest</div>
                            <div className="settings-item-description">Send digest emails summarizing workspace activity</div>
                          </div>
                          <div className="settings-toggle-switch">
                            <input
                              type="checkbox"
                              id="workspaceDigest"
                              checked={notificationSettings.workspaceDigest}
                              onChange={() => handleNotificationToggle('workspaceDigest')}
                              className="settings-toggle-input"
                            />
                            <label htmlFor="workspaceDigest" className="settings-toggle-label"></label>
                          </div>
                        </div>

                        <div className="settings-item">
                          <div className="settings-item-content">
                            <div className="settings-item-label">Announcements & Update Emails</div>
                            <div className="settings-item-description">Receive occasional product update emails from Ella AI</div>
                          </div>
                          <div className="settings-item-actions">
                            <div className="settings-toggle-switch">
                              <input
                                type="checkbox"
                                id="announcementsAndUpdates"
                                checked={notificationSettings.announcementsAndUpdates}
                                onChange={() => handleNotificationToggle('announcementsAndUpdates')}
                                className="settings-toggle-input"
                              />
                              <label htmlFor="announcementsAndUpdates" className="settings-toggle-label"></label>
                            </div>
                            <button className="settings-manage-link">
                              Manage settings
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* People Tab Content */}
                {activeSettingsTab === 'people' && (
                  <div className="settings-tab-content">
                    {/* People Management Section */}
                    <div className="settings-section">
                      <div className="settings-section-header">People Management</div>
                      
                      {/* Search Bar */}
                      <div className="people-search-container">
                        <div className="people-search-input-wrapper">
                          <svg className="people-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6.5 12C9.26142 12 11.5 9.76142 11.5 7C11.5 4.23858 9.26142 2 6.5 2C3.73858 2 1.5 4.23858 1.5 7C1.5 9.76142 3.73858 12 6.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12.5 12.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <input
                            type="text"
                            placeholder="Filter members by name or email..."
                            value={peopleSearchQuery}
                            onChange={handlePeopleSearchChange}
                            className="people-search-input"
                          />
                        </div>
                        <button className="people-add-user-btn" onClick={handleAddUserClick}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Add Users
                        </button>
                      </div>

                      {/* People Tabs */}
                      <div className="people-tabs">
                        <button 
                          className={`people-tab ${activePeopleTab === 'users' ? 'people-tab--active' : ''}`}
                          onClick={() => setActivePeopleTab('users')}
                        >
                          Users ({filteredUsers.length})
                        </button>
                        <button 
                          className={`people-tab ${activePeopleTab === 'guests' ? 'people-tab--active' : ''}`}
                          onClick={() => setActivePeopleTab('guests')}
                        >
                          Guests ({filteredGuests.length})
                        </button>
                      </div>

                      {/* People Table */}
                      <div className="people-table-container">
                        <div className="people-table">
                          {/* Table Header */}
                          <div className="people-table-header">
                            <div className="people-table-header-cell people-table-user">User</div>
                            <div className="people-table-header-cell people-table-workspaces">Workspaces</div>
                            <div className="people-table-header-cell people-table-projects">Projects</div>
                            <div className="people-table-header-cell people-table-role">Role</div>
                            <div className="people-table-header-cell people-table-actions">Actions</div>
                          </div>

                          {/* Table Body */}
                          <div className="people-table-body">
                            {(activePeopleTab === 'users' ? filteredUsers : filteredGuests).map((person) => (
                              <div key={person.id} className="people-table-row">
                                {/* User Column */}
                                <div className="people-table-cell people-table-user">
                                  <div className="people-user-info">
                                    <div className="people-user-avatar">
                                      {person.avatar}
                                    </div>
                                    <div className="people-user-details">
                                      <div className="people-user-name">{person.name}</div>
                                      <div className="people-user-email" title={person.email}>
                                        {person.email.length > 25 ? `${person.email.substring(0, 25)}...` : person.email}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Workspaces Column */}
                                <div className="people-table-cell people-table-workspaces">
                                  <div className="people-count-badge">
                                    <span className="people-count">{person.workspaces.length}</span>
                                    <div className="people-dropdown">
                                      <button className="people-dropdown-trigger">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      </button>
                                      <div className="people-dropdown-content">
                                        {person.workspaces.map((workspace, idx) => (
                                          <div key={idx} className="people-dropdown-item">{workspace}</div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Projects Column */}
                                <div className="people-table-cell people-table-projects">
                                  <div className="people-count-badge">
                                    <span className="people-count">{person.projects.length}</span>
                                    <div className="people-dropdown">
                                      <button className="people-dropdown-trigger">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      </button>
                                      <div className="people-dropdown-content">
                                        {person.projects.map((project, idx) => (
                                          <div key={idx} className="people-dropdown-item">{project}</div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Role Column */}
                                <div className="people-table-cell people-table-role">
                                  <select 
                                    value={person.role}
                                    onChange={(e) => activePeopleTab === 'users' 
                                      ? handleUserRoleChange(person.id, e.target.value)
                                      : handleGuestRoleChange(person.id, e.target.value)
                                    }
                                    className="people-role-select"
                                  >
                                    <option value="Admin">Admin</option>
                                    <option value="Workspace Owner">Workspace Owner</option>
                                    <option value="User">User</option>
                                    <option value="Guest">Guest</option>
                                  </select>
                                </div>

                                {/* Actions Column */}
                                <div className="people-table-cell people-table-actions">
                                  <div className="people-actions-dropdown">
                                    <button className="people-actions-trigger">
                                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4Z" fill="currentColor"/>
                                        <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" fill="currentColor"/>
                                        <path d="M8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" fill="currentColor"/>
                                      </svg>
                                    </button>
                                    <div className="people-actions-content">
                                      <button className="people-action-item">Edit Permissions</button>
                                      <button className="people-action-item">View Projects</button>
                                      <button className="people-action-item people-action-item--danger" 
                                        onClick={() => handleRemoveUser(person.id, activePeopleTab === 'guests')}>
                                        Remove User
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Empty State */}
                        {(activePeopleTab === 'users' ? filteredUsers : filteredGuests).length === 0 && (
                          <div className="people-empty-state">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                              <path d="M24 26C29.5228 26 34 21.5228 34 16C34 10.4772 29.5228 6 24 6C18.4772 6 14 10.4772 14 16C14 21.5228 18.4772 26 24 26Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M42 42C42 34.268 33.732 28 24 28C14.268 28 6 34.268 6 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <h3>No {activePeopleTab} found</h3>
                            <p>
                              {peopleSearchQuery 
                                ? `No ${activePeopleTab} match your search criteria.`
                                : `No ${activePeopleTab} have been added yet.`
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}


              </div>
            </div>
          )}
        </div>
      </div>
      <WorkspaceCreateModal
        isOpen={isCreateWorkspaceOpen}
        onClose={() => setIsCreateWorkspaceOpen(false)}
        onSubmit={(payload) => {
          console.log('Workspace created:', payload);
          setIsCreateWorkspaceOpen(false);
          
          // If user selected "Start building my Brand Bot Ellaments", open EllamentDrawer
          if (payload.setupPath === 'fresh') {
            setIsEllamentDrawerOpen(true);
          }
        }}
        orgBrandBots={orgBrandBots}
      />
      <EllamentDrawer
        isOpen={isEllamentDrawerOpen}
        onClose={() => setIsEllamentDrawerOpen(false)}
      />

      {/* Invite Users Modal */}
      <InviteUsersModal
        isOpen={isAddUserModalOpen}
        onClose={handleAddUserClose}
        onSendInvites={handleSendInvites}
        currentUserRole="Admin" // This would come from auth context
        availableWorkspaces={availableWorkspaces}
        availableProjects={availableProjects}
      />

      {/* Mobile Navigation Dropdown */}
      {isMobileNavOpen && (
        <div className="header__mobile-nav-dropdown" ref={mobileNavRef}>
          <div className="header__mobile-nav-overlay" onClick={handleMobileNavToggle} />
          <div className="header__mobile-nav-content">
            {mobileNavItems.map((item) => (
              <button
                key={item.id}
                className={`header__mobile-nav-item ${activeMobileNavItem === item.id ? 'header__mobile-nav-item--active' : ''}`}
                onClick={() => handleMobileNavItemClick(item.id)}
              >
                <div className="header__mobile-nav-icon">
                  {item.icon}
                </div>
                <span className="header__mobile-nav-label">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header; 