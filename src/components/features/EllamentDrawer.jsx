import React, { useState, useEffect } from 'react';
import BrandBotSelector from './BrandBotSelector';
import '../../styles/EllamentDrawer.scss';

// Mock data for ellaments
const mockEllaments = [
  {
    id: 1,
    title: 'Product Summary',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'product'
  },
  {
    id: 2,
    title: 'Product Guide',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'product'
  },
  {
    id: 3,
    title: 'Positioning',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'product'
  },
  {
    id: 4,
    title: 'Competitor Analysis',
    status: 'draft',
    lastUpdated: '2024-04-10',
    category: 'product'
  },
  {
    id: 5,
    title: 'Headwinds/Tailwinds',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'product'
  },
  {
    id: 6,
    title: 'Zeitgeist',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'product'
  },
  {
    id: 7,
    title: 'PESTLE',
    status: 'not_started',
    lastUpdated: '2024-04-10',
    category: 'product'
  },
  {
    id: 8,
    title: 'VPC (Value Proposition Canvas)',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'product'
  },
  {
    id: 9,
    title: 'Messaging',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'product'
  },
  {
    id: 10,
    title: 'CJM (Customer Journey Map)',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'product'
  },
  {
    id: 11,
    title: 'Moments',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'product'
  },
  {
    id: 12,
    title: 'ICP (Ideal Customer Profile)',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'persona'
  },
  {
    id: 13,
    title: 'Finalized Persona Exploration',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'persona'
  },
  {
    id: 14,
    title: 'ICP Persona Exploration',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'persona'
  },
  {
    id: 15,
    title: 'Blind Spot Persona Exploration',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'persona'
  },
  {
    id: 16,
    title: 'ICP 1 - Message Script',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'persona'
  },
  {
    id: 17,
    title: 'ICP 2 - Message Script',
    status: 'approved',
    lastUpdated: '2024-04-10',
    category: 'persona'
  }
];

const EllamentDrawer = ({ isOpen, onClose, onEllamentSelect }) => {
  // Persona dropdown options as state to support dynamic creation
  const [personaOptions, setPersonaOptions] = useState([
    { value: 'all', label: 'Select All' },
    { value: 'icp1', label: 'ICP 1' },
    { value: 'icp2', label: 'ICP 2' },
    { value: 'icp3', label: 'ICP 3' },
    { value: 'icp4', label: 'ICP 4' }
  ]);
  const [activeTab, setActiveTab] = useState('product');
  const [activeEllamentMenu, setActiveEllamentMenu] = useState(null);
  const [personaDropdownOpen, setPersonaDropdownOpen] = useState(false);
  const [selectedPersonas, setSelectedPersonas] = useState(['all']);
  const [selectedBrandBotId, setSelectedBrandBotId] = useState(null);
  const [activePersonaMenu, setActivePersonaMenu] = useState(null);
  const [editingPersona, setEditingPersona] = useState(null);
  const [editingPersonaName, setEditingPersonaName] = useState('');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeEllamentMenu && !event.target.closest('.ellament-drawer__card-menu-container')) {
        setActiveEllamentMenu(null);
      }
      if (personaDropdownOpen && !event.target.closest('.ellament-drawer__tab--persona')) {
        setPersonaDropdownOpen(false);
      }
      if (activePersonaMenu && !event.target.closest('.ellament-drawer__persona-menu-container')) {
        setActivePersonaMenu(null);
      }
    };

    if (activeEllamentMenu || personaDropdownOpen || activePersonaMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeEllamentMenu, personaDropdownOpen, activePersonaMenu]);

  const handleTabClick = (tab) => {
    if (tab === 'persona') {
      setActiveTab('persona');
      setPersonaDropdownOpen(false);
    } else {
      setActiveTab(tab);
      setPersonaDropdownOpen(false);
    }
  };

  const handlePersonaDropdownToggle = (e) => {
    e.stopPropagation();
    setPersonaDropdownOpen(!personaDropdownOpen);
  };

  const handlePersonaSelect = (value) => {
    if (value === 'all') {
      setSelectedPersonas(['all']);
    } else {
      setSelectedPersonas(prev => {
        const newSelected = prev.includes('all') ? [value] : 
          prev.includes(value) ? prev.filter(p => p !== value) : [...prev, value];
        return newSelected.length === 0 ? ['all'] : newSelected;
      });
    }
  };

  const handleCreateICP = () => {
    // Generate a unique ID for the new ICP
    const newIcpId = `icp${Date.now()}`;
    
    // Create new persona option with placeholder name
    const newPersona = {
      value: newIcpId,
      label: 'Untitled ICP'
    };
    
    // Add the new persona to the options
    setPersonaOptions(prev => [...prev, newPersona]);
    
    // Set the new persona to editing mode immediately
    setEditingPersona(newIcpId);
    setEditingPersonaName('Untitled ICP');
    
    // Keep dropdown open so user can see and edit the new option
    // setPersonaDropdownOpen(false); // Keep dropdown open
    
    console.log('Created new ICP:', newIcpId);
  };

  const handleEllamentMenuClick = (ellamentId, event) => {
    event.stopPropagation();
    setActiveEllamentMenu(activeEllamentMenu === ellamentId ? null : ellamentId);
  };

  const handleEllamentAction = (action, ellament) => {
    setActiveEllamentMenu(null);
    console.log(`${action} ellament:`, ellament);
    
    switch (action) {
      case 'edit':
        if (onEllamentSelect) {
          onEllamentSelect(ellament);
        }
        break;
      case 'share':
        console.log('Sharing ellament:', ellament);
        break;
      case 'archive':
        console.log('Archiving ellament:', ellament);
        break;
      case 'move':
        console.log('Moving ellament:', ellament);
        break;
      case 'delete':
        console.log('Deleting ellament:', ellament);
        break;
      default:
        break;
    }
  };

  // Persona menu handlers
  const handlePersonaMenuClick = (personaValue, event) => {
    event.stopPropagation();
    setActivePersonaMenu(activePersonaMenu === personaValue ? null : personaValue);
  };

  const handlePersonaRename = (personaValue) => {
    const persona = personaOptions.find(p => p.value === personaValue);
    if (persona) {
      setEditingPersona(personaValue);
      setEditingPersonaName(persona.label);
      setActivePersonaMenu(null);
    }
  };

  const handlePersonaRenameSubmit = (personaValue) => {
    if (editingPersonaName.trim()) {
      // Update the persona name in personaOptions state
      setPersonaOptions(prev => prev.map(option =>
        option.value === personaValue
          ? { ...option, label: editingPersonaName.trim() }
          : option
      ));
      console.log('Rename persona:', personaValue, 'to:', editingPersonaName.trim());
    }
    setEditingPersona(null);
    setEditingPersonaName('');
  };

  const handlePersonaRenameCancel = () => {
    // If canceling a newly created ICP that still has the default name, remove it
    if (editingPersona && editingPersonaName === 'Untitled ICP') {
      setPersonaOptions(prev => prev.filter(option => option.value !== editingPersona));
      setSelectedPersonas(prev => prev.filter(p => p !== editingPersona));
    }
    setEditingPersona(null);
    setEditingPersonaName('');
  };

  const handlePersonaArchive = (personaValue) => {
    console.log('Archive persona:', personaValue);
    setActivePersonaMenu(null);
  };

  const handlePersonaDelete = (personaValue) => {
    console.log('Delete persona:', personaValue);
    // Remove from personaOptions
    setPersonaOptions(prev => prev.filter(option => option.value !== personaValue));
    // Remove from selectedPersonas if selected
    setSelectedPersonas(prev => prev.filter(p => p !== personaValue));
    setActivePersonaMenu(null);
  };

  // Mock function to check if persona has associated files
  const personaHasFiles = (personaValue) => {
    // In real implementation, this would check if there are files associated with this ICP
    return personaValue === 'icp1' || personaValue === 'icp2'; // Mock: icp1 and icp2 have files
  };

  const handleEllamentClick = (ellament) => {
    if (onEllamentSelect) {
      onEllamentSelect(ellament);
    }
  };

  const handleBrandBotChange = (brandBotId, brandBot) => {
    setSelectedBrandBotId(brandBotId);
    console.log('Brand Bot changed to:', brandBot);
    // Here you would typically update the context or make an API call
    // to change the active brand bot for the session
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#16A34A';
      case 'draft':
        return '#E98B2D';
      case 'not_started':
        return '#EA2E2E';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'draft':
        return 'Draft';
      case 'not_started':
        return 'Not Started';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  };

  const filteredEllaments = mockEllaments.filter(ellament => {
    if (activeTab === 'all') return true;
    return ellament.category === activeTab;
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="ellament-drawer__backdrop" onClick={onClose} />
      
      {/* Drawer */}
      <div className={`ellament-drawer ${isOpen ? 'ellament-drawer--open' : ''}`}>
        {/* Header */}
        <div className="ellament-drawer__header">
          <div className="ellament-drawer__header-left">
            <div className="ellament-drawer__title">Ella-ments</div>
          </div>

          <div className="ellament-drawer__header-right">
            {/* Brand Bot Selector */}
            <BrandBotSelector
              selectedBrandBotId={selectedBrandBotId}
              onBrandBotChange={handleBrandBotChange}
              className="ellament-drawer__brandbot-selector"
            />

            {/* Close Button */}
            <button className="ellament-drawer__close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="ellament-drawer__subtitle">
          Select form the Ella-ments below to ...
        </div>

        {/* Tab Navigation */}
        <div className="ellament-drawer__tabs">
          <button 
            className={`ellament-drawer__tab ${activeTab === 'product' ? 'ellament-drawer__tab--active' : ''}`}
            onClick={() => handleTabClick('product')}
          >
            Company
          </button>
          <div className="ellament-drawer__tab ellament-drawer__tab--persona">
            <button 
              className={`ellament-drawer__tab-button ${activeTab === 'persona' ? 'ellament-drawer__tab-button--active' : ''}`}
              onClick={() => handleTabClick('persona')}
            >
              Customer
            </button>
            <button 
              className="ellament-drawer__dropdown-arrow"
              onClick={handlePersonaDropdownToggle}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {personaDropdownOpen && (
              <div className="ellament-drawer__persona-dropdown">
                {personaOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`ellament-drawer__persona-option ${
                      selectedPersonas.includes(option.value) ? 'ellament-drawer__persona-option--selected' : ''
                    }`}
                  >
                    <div className="ellament-drawer__persona-option-left" onClick={() => handlePersonaSelect(option.value)}>
                      <div className="ellament-drawer__persona-checkbox">
                        {selectedPersonas.includes(option.value) && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M8.5 2.5L3.5 7.5L1.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      {editingPersona === option.value ? (
                        <input
                          type="text"
                          value={editingPersonaName}
                          onChange={(e) => setEditingPersonaName(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handlePersonaRenameSubmit(option.value);
                            }
                            if (e.key === 'Escape') {
                              handlePersonaRenameCancel();
                            }
                          }}
                          onBlur={() => handlePersonaRenameCancel()}
                          className="ellament-drawer__persona-rename-input"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="ellament-drawer__persona-name">{option.label}</span>
                      )}
                    </div>
                    
                    {/* Skip ellipsis menu for 'all' option */}
                    {option.value !== 'all' && (
                      <div className="ellament-drawer__persona-menu-container">
                        <button
                          className="ellament-drawer__persona-menu-button"
                          onClick={(e) => handlePersonaMenuClick(option.value, e)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="2.5" r="1.5" fill="currentColor"/>
                            <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                            <circle cx="8" cy="13.5" r="1.5" fill="currentColor"/>
                          </svg>
                        </button>
                        
                        {activePersonaMenu === option.value && (
                          <div className="ellament-drawer__persona-menu">
                            <button
                              className="ellament-drawer__persona-menu-option"
                              onClick={() => handlePersonaRename(option.value)}
                            >
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M10.5 1.5L12.5 3.5L4.5 11.5L1.5 12.5L2.5 9.5L10.5 1.5Z" stroke="currentColor" strokeWidth="1.5"/>
                              </svg>
                              Rename
                            </button>
                            
                            {personaHasFiles(option.value) ? (
                              <button
                                className="ellament-drawer__persona-menu-option"
                                onClick={() => handlePersonaArchive(option.value)}
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M12.25 3.5L1.75 3.5L1.75 11.25C1.75 11.8 2.2 12.25 2.75 12.25L11.25 12.25C11.8 12.25 12.25 11.8 12.25 11.25L12.25 3.5ZM5.25 7L8.75 7M0.5 1.75L13.5 1.75C13.78 1.75 14 1.97 14 2.25L14 3.5L0 3.5L0 2.25C0 1.97 0.22 1.75 0.5 1.75Z" stroke="currentColor" strokeWidth="1.2"/>
                                </svg>
                                Archive
                              </button>
                            ) : (
                              <button
                                className="ellament-drawer__persona-menu-option ellament-drawer__persona-menu-option--danger"
                                onClick={() => handlePersonaDelete(option.value)}
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M1.75 3.5L12.25 3.5M5.25 3.5L5.25 2.25C5.25 1.7 5.7 1.25 6.25 1.25L7.75 1.25C8.3 1.25 8.75 1.7 8.75 2.25L8.75 3.5M10.5 3.5L10.5 11.25C10.5 11.8 10.05 12.25 9.5 12.25L4.5 12.25C3.95 12.25 3.5 11.8 3.5 11.25L3.5 3.5M5.75 6.25L5.75 9.5M8.25 6.25L8.25 9.5" stroke="currentColor" strokeWidth="1.2"/>
                                </svg>
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <button className="ellament-drawer__create-icp-button" onClick={handleCreateICP}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Create an ICP
                </button>
                <div className="ellament-drawer__persona-dropdown-footer">
                  <button className="ellament-drawer__persona-exit">Exit</button>
                  <button className="ellament-drawer__persona-select">Select</button>
                </div>
              </div>
            )}
          </div>
          <button 
            className={`ellament-drawer__tab ${activeTab === 'character' ? 'ellament-drawer__tab--active' : ''}`}
            onClick={() => handleTabClick('character')}
          >
            Brand
          </button>
          <button 
            className={`ellament-drawer__tab ${activeTab === 'special_edition' ? 'ellament-drawer__tab--active' : ''}`}
            onClick={() => handleTabClick('special_edition')}
          >
            Special Edition
          </button>
          <button 
            className={`ellament-drawer__tab ${activeTab === 'uploaded_files' ? 'ellament-drawer__tab--active' : ''}`}
            onClick={() => handleTabClick('uploaded_files')}
          >
            Uploaded Files
          </button>
          {/* HIDDEN: Custom Instructions tab - commented out but preserved */}
          {/* 
          <button 
            className={`ellament-drawer__tab ${activeTab === 'custom_instructions' ? 'ellament-drawer__tab--active' : ''}`}
            onClick={() => handleTabClick('custom_instructions')}
          >
            Custom Instructions
          </button>
          */}
        </div>

        {/* Content */}
        <div className="ellament-drawer__content">
          {filteredEllaments.length === 0 ? (
            <div className="ellament-drawer__empty">
              <div className="ellament-drawer__empty-icon">📄</div>
              <div className="ellament-drawer__empty-title">
                No ella-ments found
              </div>
              <div className="ellament-drawer__empty-text">
                No ella-ments available for this category
              </div>
            </div>
          ) : (
            <div className="ellament-drawer__grid">
              {filteredEllaments.map((ellament) => (
                <div 
                  key={ellament.id} 
                  className="ellament-drawer__card"
                  onClick={() => handleEllamentClick(ellament)}
                >
                  {/* Card Header */}
                  <div className="ellament-drawer__card-header">
                    <div className="ellament-drawer__card-title">
                      {ellament.title}
                    </div>
                    <div className="ellament-drawer__card-menu-container">
                      <button 
                        className="ellament-drawer__card-menu"
                        onClick={(e) => handleEllamentMenuClick(ellament.id, e)}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <circle cx="10" cy="4" r="2" fill="currentColor"/>
                          <circle cx="10" cy="10" r="2" fill="currentColor"/>
                          <circle cx="10" cy="16" r="2" fill="currentColor"/>
                        </svg>
                      </button>
                      
                      {activeEllamentMenu === ellament.id && (
                        <div className="ellament-drawer__document-dropdown">
                          <button 
                            className="ellament-drawer__document-dropdown-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEllamentAction('edit', ellament);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M6.36 2.68L2.5 6.54L2.5 8.96L4.92 8.96L8.78 5.1L6.36 2.68ZM8.78 1.46L9.82 2.5L8.78 3.54L7.74 2.5L8.78 1.46ZM1.5 5.54L8.78 -1.74C9.17 -2.13 9.81 -2.13 10.2 -1.74L11.24 -0.7C11.63 -0.31 11.63 0.33 11.24 0.72L3.96 7.96L1.5 8.96L1.5 5.54Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Edit
                          </button>
                          <button 
                            className="ellament-drawer__document-dropdown-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEllamentAction('share', ellament);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M11 9.5C10.59 9.5 10.22 9.65 9.93 9.88L4.69 7.26C4.73 7.09 4.75 6.91 4.75 6.75C4.75 6.59 4.73 6.41 4.69 6.24L9.93 3.62C10.22 3.85 10.59 4 11 4C12.1 4 13 3.1 13 2C13 0.9 12.1 0 11 0C9.9 0 9 0.9 9 2C9 2.16 9.02 2.34 9.06 2.51L3.82 5.13C3.53 4.9 3.16 4.75 2.75 4.75C1.65 4.75 0.75 5.65 0.75 6.75C0.75 7.85 1.65 8.75 2.75 8.75C3.16 8.75 3.53 8.6 3.82 8.37L9.06 10.99C9.02 11.16 9 11.34 9 11.5C9 12.6 9.9 13.5 11 13.5C12.1 13.5 13 12.6 13 11.5C13 10.4 12.1 9.5 11 9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Share
                          </button>
                          <button 
                            className="ellament-drawer__document-dropdown-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEllamentAction('archive', ellament);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M12.25 3.5L1.75 3.5L1.75 11.25C1.75 11.8 2.2 12.25 2.75 12.25L11.25 12.25C11.8 12.25 12.25 11.8 12.25 11.25L12.25 3.5ZM5.25 7L8.75 7M0.5 1.75L13.5 1.75C13.78 1.75 14 1.97 14 2.25L14 3.5L0 3.5L0 2.25C0 1.97 0.22 1.75 0.5 1.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Archive
                          </button>
                          <button 
                            className="ellament-drawer__document-dropdown-option"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEllamentAction('move', ellament);
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M2.5 1.75L11.5 1.75C12.05 1.75 12.5 2.2 12.5 2.75L12.5 4.75M1.5 5.75L10.5 5.75C11.05 5.75 11.5 6.2 11.5 6.75L11.5 11.25C11.5 11.8 11.05 12.25 10.5 12.25L1.5 12.25C0.95 12.25 0.5 11.8 0.5 11.25L0.5 6.75C0.5 6.2 0.95 5.75 1.5 5.75Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Move
                          </button>
                          <hr className="ellament-drawer__document-dropdown-divider" />
                          <button 
                            className="ellament-drawer__document-dropdown-option ellament-drawer__document-dropdown-option--danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEllamentAction('delete', ellament);
                            }}
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

                  {/* Card Content */}
                  <div className="ellament-drawer__card-content">
                    <div className="ellament-drawer__card-status">
                      <span className="ellament-drawer__status-label">Status:</span>
                      <span 
                        className="ellament-drawer__status-value"
                        style={{ color: getStatusColor(ellament.status) }}
                      >
                        {getStatusLabel(ellament.status)}
                      </span>
                    </div>
                    
                    <div className="ellament-drawer__card-meta">
                      <div className="ellament-drawer__card-date">
                        Updated {formatDate(ellament.lastUpdated)} @ {formatTime(ellament.lastUpdated)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ellament-drawer__footer">
          <button 
            className="ellament-drawer__cancel-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default EllamentDrawer;
