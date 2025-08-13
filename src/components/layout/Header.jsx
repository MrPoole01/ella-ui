import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRightIcon,
  ProfileIcon
} from '../icons';
import { useTheme } from '../../context';
import WorkspaceDropdown from '../features/WorkspaceDropdown';
import EllamentDrawer from '../features/EllamentDrawer';
import { WorkspaceCreateModal } from '../ui/Modal';
import '../../styles/Header.scss';
import { ReactComponent as EllaTextLogo } from '../icons/ella_ai_text_logo.svg';

const Header = () => {
  const navigate = useNavigate();
  const { currentTheme, themes, setTheme } = useTheme();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true); // Show notifications by default
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);
  const [isEllamentDrawerOpen, setIsEllamentDrawerOpen] = useState(false);
  const [orgBrandBots, setOrgBrandBots] = useState([]);
  const themeDropdownRef = useRef(null);
  const workspaceDropdownRef = useRef(null);
  const notificationMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const profileDropdownRef = useRef(null);

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

  const handleThemeSelect = (theme) => {
    setTheme(theme);
    setIsThemeDropdownOpen(false);
  };

  const handleWorkspaceClick = () => {
    setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen);
  };

  const handleWorkspaceDropdownClose = () => {
    setIsWorkspaceDropdownOpen(false);
  };

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus the search input when opening
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      // Clear search when closing
      setSearchQuery('');
    }
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
      // Close search on escape
      setIsSearchOpen(false);
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
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(event.target)) {
        setIsWorkspaceDropdownOpen(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setIsNotificationMenuOpen(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(event.target) && !event.target.classList.contains('share-icon')) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="header close-ella-search">
      <div className="header__left">
        <div className="header__logo-section">
          <svg xmlns="http://www.w3.org/2000/svg" width="21.7344" height="20" viewBox="0 0 20 24" className="nav-toggle">
            <path d="M19.0199 21.9997L2.7159 21.9997C1.21683 21.9997 0 20.7687 0 19.2521L0 2.74761C0 1.2315 1.21683 0 2.7159 0L19.0199 0C20.519 0 21.7358 1.2315 21.7358 2.74761L21.7358 19.2521C21.7358 20.7687 20.519 21.9997 19.0199 21.9997ZM7.24845 20.166L7.24845 1.83373L3.16576 1.83373C2.41827 1.83373 1.81166 2.44742 1.81166 3.20364L1.81166 18.7961C1.81166 19.5523 2.41826 20.166 3.16576 20.166L7.24845 20.166ZM18.5701 1.83373L9.06057 1.83373L9.06057 20.166L18.5701 20.166C19.3176 20.166 19.9242 19.5523 19.9242 18.7961L19.9242 3.20364C19.9242 2.44742 19.3176 1.83373 18.5701 1.83373Z" fillRule="evenodd" transform="matrix(1 0 0 1 9.53674e-07 -9.53674e-05)" fill="rgb(0, 0, 0)"/>
            <path d="M3.09328 6.25924L0 3.12985L3.09328 0L4.3749 1.29658L2.56278 3.12985L4.3749 4.96312L3.09328 6.25924Z" fillRule="evenodd" transform="matrix(1 0 0 1 2.34285 7.8455)" fill="rgb(0, 0, 0)"/>
          </svg>
          <EllaTextLogo width={50} height={19} style={{ marginLeft: 8, marginRight: 8 }} />
          <div 
            className="header__workspace-container" 
            ref={workspaceDropdownRef}
            onClick={handleWorkspaceClick}
          >
          <div className="header__workspace-text">Workspace</div>
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
              onWorkspaceCreated={(ws) => {
                // TODO: propagate to global state; for now, log
                console.log('Workspace created:', ws);
              }}
              onOpenCreateWorkspace={({ orgBrandBots: bots }) => {
                setOrgBrandBots(bots || []);
                setIsCreateWorkspaceOpen(true);
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="header__center">
        <div className="theme-dropdown" ref={themeDropdownRef}>
          <button 
            className="theme-dropdown__trigger"
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
          >
            <span className="theme-dropdown__text">{currentTheme}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20.3672" 
              height="20.3647" 
              viewBox="0 0 20.3672 20.3647" 
              className="chevron-down-icon"
              style={{
                transform: isThemeDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <defs>
                <clipPath id="clipPath7611540475-theme">
                  <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(0.999831 0.0184092 -0.0184092 0.999831 0.368187 -2.47955e-05)"/>
                </clipPath>
              </defs>
              <g clipPath="url(#clipPath7611540475-theme)">
                <path d="M-0.662913 -0.662913C-1.02903 -0.296799 -1.02903 0.296799 -0.662913 0.662913L4.96209 6.28791Q5.09395 6.41977 5.26623 6.49114Q5.43852 6.5625 5.625 6.5625Q5.81148 6.5625 5.98377 6.49114Q6.15605 6.41977 6.28791 6.28791L11.9129 0.662913C12.279 0.296799 12.279 -0.296799 11.9129 -0.662913C11.5468 -1.02903 10.9532 -1.02903 10.5871 -0.662912L5.625 4.29918L0.662913 -0.662913C0.296799 -1.02903 -0.296799 -1.02903 -0.662913 -0.662913Z" fillRule="evenodd" transform="matrix(0.999831 0.0184092 -0.0184092 0.999831 4.61013 7.2668)" fill="rgb(156, 163, 175)"/>
              </g>
            </svg>
          </button>
          
          {isThemeDropdownOpen && (
            <div className="theme-dropdown__menu">
              {themes.map((theme) => (
                <div
                  key={theme}
                  className={`theme-dropdown__item ${currentTheme === theme ? 'theme-dropdown__item--selected' : ''}`}
                  onClick={() => handleThemeSelect(theme)}
                >
                  {theme}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="header__right">
        {/* Search Input Field */}
        <div className={`header__search-container ${isSearchOpen ? 'header__search-container--open' : ''}`}>
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
        
        <div className="header__actions">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="19" 
            height="21.9998" 
            viewBox="0 0 19 21.9998" 
            className="share-icon"
            onClick={handleSearchClick}
            style={{ cursor: 'pointer' }}
          >
            <path d="M12.2802 16.0613C11.1516 16.6051 9.88398 16.9102 8.54432 16.9102C3.82543 16.9102 0 13.1248 0 8.45512C0 3.78548 3.82543 0 8.54432 0C13.2632 0 17.0886 3.78548 17.0886 8.45512C17.0886 10.6758 16.2235 12.6965 14.8086 14.2052L18.7011 19.5292C19.2107 20.2262 19.0528 21.1998 18.3485 21.704C17.6442 22.2082 16.6602 22.052 16.1507 21.355L12.2802 16.0613ZM14.7581 8.45504C14.7581 11.8511 11.976 14.6042 8.5441 14.6042C5.11218 14.6042 2.33005 11.8511 2.33005 8.45504C2.33005 5.05893 5.11218 2.30586 8.5441 2.30586C11.976 2.30586 14.7581 5.05893 14.7581 8.45504Z" fillRule="evenodd" transform="matrix(1 0 0 1 0 -0.000104904)" fill="rgb(196, 196, 196)"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" className="settings-icon">
            <defs>
              <clipPath id="clipPath5917372953-settings">
                <path d="M0 0L20 0L20 20L0 20L0 0Z" fillRule="nonzero" transform="matrix(1 0 0 1 0 0)"/>
              </clipPath>
            </defs>
            <g clipPath="url(#clipPath5917372953-settings)">
              <path d="M3.59965 9.82892C3.23589 9.82892 2.94106 9.53386 2.94106 9.17032L2.94106 7.71878C2.94106 7.53767 3.0157 7.36446 3.14742 7.23976L5.2446 5.25981C5.65578 4.8326 5.8819 4.27148 5.8819 3.67787L5.8819 3.5995C5.8819 2.97888 5.63712 2.39844 5.19235 1.96509C4.7478 1.53173 4.16209 1.29969 3.53884 1.31813C2.31386 1.34974 1.31719 2.40283 1.31719 3.6658C1.31719 4.02956 1.02236 4.32439 0.658594 4.32439C0.29483 4.32439 0 4.02956 0 3.6658C0 1.69484 1.57228 0.051213 3.50482 0.00137955C4.48546 -0.0254032 5.41035 0.338579 6.11153 1.02176C6.81271 1.70516 7.19887 2.62061 7.19887 3.5995L7.19887 3.67787C7.19887 4.62076 6.83686 5.51227 6.17893 6.18799C6.17256 6.19457 6.16576 6.20116 6.15917 6.20753L4.25825 8.00263L4.25825 9.17032C4.25825 9.53409 3.96342 9.82892 3.59965 9.82892Z" fillRule="nonzero" transform="matrix(1 0 0 1 6.38889 3.86949)" fill="rgb(196, 196, 196)"/>
              <path d="M0.878125 1.75488C0.821047 1.75488 0.763969 1.75027 0.706891 1.73951C0.649813 1.72634 0.59493 1.71097 0.542243 1.68902C0.489555 1.66706 0.439063 1.63874 0.390766 1.60801C0.342469 1.57508 0.298563 1.53974 0.256852 1.49824C0.0943984 1.33557 0 1.10945 0 0.876752C0 0.819454 0.00658528 0.762376 0.0175625 0.705519C0.0285389 0.650636 0.046102 0.593556 0.0680548 0.540869C0.0900076 0.488182 0.116352 0.437689 0.147086 0.389392C0.180016 0.341095 0.217336 0.29719 0.256852 0.255698C0.298563 0.215963 0.342469 0.178643 0.390766 0.148128C0.439063 0.115198 0.489556 0.0888559 0.542243 0.0669014C0.59493 0.0449486 0.649813 0.0273846 0.706891 0.0166285C0.818851 -0.00554369 0.937398 -0.00554369 1.04936 0.0166285C1.10644 0.0276057 1.16132 0.045168 1.21401 0.0669014C1.26648 0.0890736 1.31719 0.115198 1.36527 0.148128C1.41356 0.178862 1.45747 0.216182 1.49918 0.255698C1.53869 0.29719 1.57601 0.341315 1.60894 0.389392C1.63968 0.437909 1.66602 0.48818 1.68776 0.540869C1.70993 0.593556 1.72749 0.650636 1.73825 0.705519C1.74923 0.762597 1.75581 0.819673 1.75581 0.876752C1.75581 1.10945 1.66119 1.33557 1.49896 1.49803C1.33475 1.66267 1.10863 1.75488 0.878125 1.75488Z" fillRule="nonzero" transform="matrix(1 0 0 1 9.11241 14.5718)" fill="rgb(196, 196, 196)"/>
              <path d="M9.87891 19.7578C4.43168 19.7578 0 15.3261 0 9.87891C0 4.43168 4.43168 0 9.87891 0C15.3261 0 19.7578 4.43168 19.7578 9.87891C19.7578 15.3261 15.3261 19.7578 9.87891 19.7578ZM9.87891 1.31719C5.15789 1.31719 1.31719 5.15789 1.31719 9.87891C1.31719 14.5999 5.15789 18.4406 9.87891 18.4406C14.5999 18.4406 18.4406 14.5999 18.4406 9.87891C18.4406 5.15789 14.5999 1.31719 9.87891 1.31719Z" fillRule="nonzero" transform="matrix(1 0 0 1 0.110677 0.109863)" fill="rgb(196, 196, 196)"/>
            </g>
          </svg>
          
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
              style={{
                backgroundImage: "url('https://static.motiffcontent.com/private/resource/image/197f74679c4b11d-5b3004e6-a320-424c-8459-52e22ff76e2e.svg')",
                width: '25px',
                height: '25px',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                cursor: 'pointer'
              }}
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
                    <button className="profile-menu-item">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" fill="currentColor"/>
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" fill="currentColor"/>
                      </svg>
                      <span>Settings</span>
                    </button>
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
    </div>
  );
};

export default Header; 