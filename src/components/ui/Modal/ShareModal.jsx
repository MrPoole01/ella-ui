import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './ShareModal.scss';

const ShareModal = ({
  isOpen,
  onClose,
  onSavePermissions,
  contextType = 'workspace', // 'workspace', 'project', 'chat', 'document'
  contextName = '',
  contextId = '',
  currentPermissions = [],
  organizationMembers = [],
  inheritedFrom = null // { type: 'workspace', name: 'Workspace Name', id: 'workspace-123' }
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const searchInputRef = useRef(null);

  // Available roles
  const roles = [
    { value: 'viewer', label: 'Viewer', description: 'Can view and comment' },
    { value: 'editor', label: 'Editor', description: 'Can view, comment, and edit' },
    { value: 'domain', label: 'Domain', description: 'Full access including sharing' }
  ];

  // Reset modal state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setPermissions([...currentPermissions]);
      setIsProcessing(false);
      setHasChanges(false);
      // Focus search input after modal opens
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, currentPermissions]);

  // Track changes
  useEffect(() => {
    const hasPermissionChanges = JSON.stringify(permissions) !== JSON.stringify(currentPermissions);
    setHasChanges(hasPermissionChanges);
  }, [permissions, currentPermissions]);

  // Filter organization members based on search
  const filteredMembers = organizationMembers.filter(member => {
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
  });

  // Get members who don't have explicit permissions
  const availableMembers = filteredMembers.filter(member => 
    !permissions.find(perm => perm.userId === member.id)
  );

  // Handle adding a user
  const handleAddUser = (member) => {
    const newPermission = {
      userId: member.id,
      userName: member.name,
      userEmail: member.email,
      userAvatar: member.avatar,
      role: 'viewer',
      isInherited: false,
      inheritedFrom: null
    };
    
    setPermissions(prev => [...prev, newPermission]);
    setSearchQuery('');
  };

  // Handle role change
  const handleRoleChange = (userId, newRole) => {
    setPermissions(prev => 
      prev.map(perm => 
        perm.userId === userId 
          ? { ...perm, role: newRole, isInherited: false, inheritedFrom: null }
          : perm
      )
    );
  };

  // Handle removing a user
  const handleRemoveUser = (userId) => {
    setPermissions(prev => prev.filter(perm => perm.userId !== userId));
  };

  // Sort permissions to show editors first
  const getSortedPermissions = () => {
    return [...permissions].sort((a, b) => {
      // Priority order: editor > domain > viewer
      const roleOrder = { editor: 0, domain: 1, viewer: 2 };
      const aOrder = roleOrder[a.role] ?? 3;
      const bOrder = roleOrder[b.role] ?? 3;
      
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      
      // If same role, prioritize non-inherited over inherited
      if (a.isInherited !== b.isInherited) {
        return a.isInherited ? 1 : -1;
      }
      
      // Finally, sort alphabetically by name
      return a.userName.localeCompare(b.userName);
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!hasChanges || isProcessing) return;

    setIsProcessing(true);
    
    try {
      const result = await onSavePermissions({
        contextType,
        contextId,
        permissions
      });
      
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get context display info
  const getContextInfo = () => {
    const contextTypes = {
      workspace: { icon: '🏢', label: 'Workspace' },
      project: { icon: '📁', label: 'Project' },
      chat: { icon: '💬', label: 'Chat' },
      document: { icon: '📄', label: 'Document' }
    };
    
    return contextTypes[contextType] || contextTypes.workspace;
  };

  const contextInfo = getContextInfo();
  const sortedPermissions = getSortedPermissions();

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="share-modal__backdrop" onClick={(e) => {
        e.stopPropagation();
        onClose();
      }} />
      <div className="share-modal">
        <div className="share-modal__header">
          <div className="share-modal__title-section">
            <h2 className="share-modal__title">
              Share {contextInfo.label.toLowerCase()}
            </h2>
            <div className="share-modal__context">
              <span className="share-modal__context-icon">{contextInfo.icon}</span>
              <span className="share-modal__context-name">{contextName}Context info will go here...</span>
            </div>
          </div>
          <button className="share-modal__close" onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="share-modal__content">
          {/* Search/Add Users */}
          <div className="share-modal__search-section">
            <div className="share-modal__search-container">
              <svg className="share-modal__search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667zM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Add people by name or email..."
                className="share-modal__search-input"
              />
            </div>
            
            {/* Search Results */}
            {searchQuery && availableMembers.length > 0 && (
              <div className="share-modal__search-results">
                {availableMembers.slice(0, 5).map(member => (
                  <button
                    key={member.id}
                    className="share-modal__search-result"
                    onClick={() => handleAddUser(member)}
                  >
                    <div className="share-modal__user-avatar">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} />
                      ) : (
                        <span>{member.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="share-modal__user-info">
                      <div className="share-modal__user-name">{member.name}</div>
                      <div className="share-modal__user-email">{member.email}</div>
                    </div>
                  </button>
                ))}
                {availableMembers.length > 5 && (
                  <div className="share-modal__search-more">
                    +{availableMembers.length - 5} more results
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Current Permissions */}
          <div className="share-modal__permissions-section">
            <div className="share-modal__permissions-header">
              <h3>People with access</h3>
              <span className="share-modal__permissions-count">
                {sortedPermissions.length} {sortedPermissions.length === 1 ? 'person' : 'people'}
              </span>
            </div>

            {/* Inheritance Info */}
            {inheritedFrom && (
              <div className="share-modal__inheritance-info">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>
                  Permissions are inherited from {inheritedFrom.type} "{inheritedFrom.name}"
                </span>
              </div>
            )}

            <div className="share-modal__permissions-list">
              {sortedPermissions.map(permission => (
                <div key={permission.userId} className="share-modal__permission-item">
                  <div className="share-modal__permission-user">
                    <div className="share-modal__user-avatar">
                      {permission.userAvatar ? (
                        <img src={permission.userAvatar} alt={permission.userName} />
                      ) : (
                        <span>{permission.userName.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="share-modal__user-info">
                      <div className="share-modal__user-name">{permission.userName}</div>
                      <div className="share-modal__user-email">{permission.userEmail}</div>
                      {permission.isInherited && permission.inheritedFrom && (
                        <div className="share-modal__inherited-label">
                          Inherited from {permission.inheritedFrom.type}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="share-modal__permission-controls">
                    <select
                      value={permission.role}
                      onChange={(e) => handleRoleChange(permission.userId, e.target.value)}
                      className="share-modal__role-select"
                      disabled={permission.isInherited}
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    
                    {!permission.isInherited && (
                      <button
                        className="share-modal__remove-user"
                        onClick={() => handleRemoveUser(permission.userId)}
                        title="Remove access"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {sortedPermissions.length === 0 && (
                <div className="share-modal__empty-state">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div className="share-modal__empty-title">No one has access yet</div>
                  <div className="share-modal__empty-description">
                    Search for people above to give them access to this {contextInfo.label.toLowerCase()}.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Role Descriptions */}
          <div className="share-modal__role-descriptions">
            <h4>Access levels</h4>
            {roles.map(role => (
              <div key={role.value} className="share-modal__role-description">
                <strong>{role.label}</strong>: {role.description}
              </div>
            ))}
          </div>
        </div>

        <div className="share-modal__footer">
          <button className="share-modal__cancel" onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}>
            Cancel
          </button>
          <button 
            className={`share-modal__save ${!hasChanges || isProcessing ? 'share-modal__save--disabled' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            disabled={!hasChanges || isProcessing}
          >
            {isProcessing ? (
              <>
                <svg className="share-modal__spinner" width="16" height="16" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="37.7" strokeDashoffset="37.7">
                    <animate attributeName="stroke-dashoffset" dur="1s" values="37.7;0" repeatCount="indefinite"/>
                  </circle>
                </svg>
                Saving...
              </>
            ) : (
              'Save changes'
            )}
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ShareModal;
