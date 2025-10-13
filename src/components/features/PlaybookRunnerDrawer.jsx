import React, { useState, useEffect, useRef } from 'react';
import '../../styles/PlaybookRunnerDrawer.scss';

// Variable-based (Auto-run) Playbook Runner
// User fills consolidated variables per Play, then auto-generates output
const PlaybookRunnerDrawer = ({ isOpen, onClose, playbook, inputPanelData }) => {
  // Core state
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [variables, setVariables] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlays, setGeneratedPlays] = useState({});
  const [playFiles, setPlayFiles] = useState({}); // { playId: [{ id, name, type, createdAt }] }
  const [selectedDocument, setSelectedDocument] = useState(null); // For left pane preview
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState({});
  const [chatInput, setChatInput] = useState('');
  
  // Play card UI state
  const [expandedFilesCard, setExpandedFilesCard] = useState(null);
  const [showInfoPopover, setShowInfoPopover] = useState(null);
  
  const chatContainerRef = useRef(null);

  // Mock playbook with full variable types
  const currentPlaybook = playbook || {
    id: 1,
    title: 'Post-Event Networking Follow-Up Series',
    plays: [
      {
        id: 1,
        name: 'Voicemail Script',
        description: 'Create a personalized voicemail script for post-event follow-up',
        estimatedTime: '5 minutes',
        variables: [
          { id: 'event_name', label: 'Event Name', type: 'text', required: true, placeholder: 'Enter event name' },
          { id: 'contact_name', label: 'Contact Name', type: 'text', required: true },
          { id: 'event_date', label: 'Event Date', type: 'date', required: true },
          { id: 'urgency', label: 'Urgency Level', type: 'select', required: false, options: ['Low', 'Medium', 'High'] },
          { id: 'include_cta', label: 'Include Call-to-Action', type: 'boolean', required: false, defaultValue: true }
        ]
      },
      {
        id: 2,
        name: 'Follow-Up Email',
        description: 'Draft a personalized follow-up email',
        estimatedTime: '8 minutes',
        variables: [
          { id: 'topics', label: 'Discussion Topics', type: 'textarea', required: true, placeholder: 'Key topics discussed...' },
          { id: 'tone', label: 'Email Tone', type: 'select', required: true, options: ['Professional', 'Casual', 'Enthusiastic'] },
          { id: 'next_steps', label: 'Proposed Next Steps', type: 'textarea', required: false },
          { id: 'attach_resources', label: 'Attach Resources', type: 'boolean', required: false }
        ]
      },
      {
        id: 3,
        name: 'LinkedIn Message',
        description: 'Craft a LinkedIn connection request or message',
        estimatedTime: '3 minutes',
        variables: [
          { id: 'connection_status', label: 'Connection Status', type: 'select', required: true, 
            options: ['Not connected', 'Pending', 'Already connected'] },
          { id: 'message_length', label: 'Message Length', type: 'select', required: true,
            options: ['Brief (< 200 chars)', 'Medium (200-500 chars)', 'Extended (500+ chars)'] }
        ]
      }
    ]
  };

  const currentPlay = currentPlaybook.plays[currentPlayIndex];
  const isLastPlay = currentPlayIndex === currentPlaybook.plays.length - 1;
  const hasGeneratedCurrentPlay = generatedPlays[currentPlay?.id];

  // Calculate progress
  const completedPlays = Object.keys(generatedPlays).length;
  const progressPercent = currentPlaybook.plays.length > 0 
    ? (completedPlays / currentPlaybook.plays.length) * 100 
    : 0;

  // Telemetry logging
  const logTelemetry = (event, data = {}) => {
    console.log(`Telemetry: ${event}`, {
      ...data,
      timestamp: new Date().toISOString(),
      playbookId: currentPlaybook.id,
      mode: 'auto_run'
    });
  };

  // Log on open
  useEffect(() => {
    if (isOpen) {
      logTelemetry('playbook_run_opened', {
        playbookName: currentPlaybook.title,
        playCount: currentPlaybook.plays.length,
        inputData: inputPanelData
      });
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Get current play variables
  const getCurrentPlayVariables = () => variables[currentPlay?.id] || {};

  // Check if current play has all required variables
  const isCurrentPlayValid = () => {
    if (!currentPlay) return false;
    const playVars = getCurrentPlayVariables();
    const requiredFields = currentPlay.variables.filter(v => v.required);
    
    return requiredFields.every(field => {
      const value = playVars[field.id];
      return value !== undefined && value !== null && value !== '';
    });
  };

  const handleVariableChange = (variableId, value) => {
    setVariables(prev => ({
      ...prev,
      [currentPlay.id]: {
        ...(prev[currentPlay.id] || {}),
        [variableId]: value
      }
    }));

    logTelemetry('variable_changed', {
      playId: currentPlay.id,
      playIndex: currentPlayIndex,
      variableId
    });
  };

  const handleRunPlay = async () => {
    setIsGenerating(true);
    logTelemetry('play_autorun_started', {
      playId: currentPlay.id,
      playIndex: currentPlayIndex,
      playName: currentPlay.name
    });

    try {
      // Add "thinking" message to chat
      const thinkingMessage = {
        id: Date.now(),
        sender: 'ella',
        text: `Generating ${currentPlay.name}...`,
        timestamp: new Date(),
        isThinking: true
      };
      setChatMessages(prev => ({
        ...prev,
        [currentPlay.id]: [...(prev[currentPlay.id] || []), thinkingMessage]
      }));

      // Simulate API call to generate play
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Generate mock output
      const output = {
        content: `# ${currentPlay.name}\n\nGenerated at ${new Date().toLocaleString()}\n\n## Variables Used\n${Object.entries(getCurrentPlayVariables()).map(([key, val]) => `- **${key}**: ${val}`).join('\n')}\n\n## Output\n\nThis is the auto-generated output for this play. In a real implementation, this would be the AI-generated content based on the variables you provided.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
        timestamp: new Date(),
        documentId: Date.now()
      };

      setGeneratedPlays(prev => ({
        ...prev,
        [currentPlay.id]: output
      }));

      // Create mock file
      const newFile = {
        id: Date.now(),
        name: `${currentPlay.name.replace(/\s+/g, '_')}_${Date.now()}.docx`,
        type: 'document',
        size: '12 KB',
        createdAt: new Date(),
        playId: currentPlay.id
      };

      setPlayFiles(prev => ({
        ...prev,
        [currentPlay.id]: [...(prev[currentPlay.id] || []), newFile]
      }));

      // Set as selected document
      setSelectedDocument({ ...newFile, content: output.content });

      // Remove thinking message and add success message
      setChatMessages(prev => ({
        ...prev,
        [currentPlay.id]: [
          ...(prev[currentPlay.id] || []).filter(m => !m.isThinking),
          {
            id: Date.now() + 1,
            sender: 'ella',
            text: `✓ ${currentPlay.name} generated successfully! You can now review the output or request minor edits via chat.`,
            timestamp: new Date(),
            isSuccess: true
          }
        ]
      }));

      logTelemetry('play_autorun_succeeded', {
        playId: currentPlay.id,
        playIndex: currentPlayIndex,
        playName: currentPlay.name
      });

      logTelemetry('playbook_play_completed', {
        playId: currentPlay.id,
        playIndex: currentPlayIndex
      });

    } catch (error) {
      console.error('Generation failed:', error);
      
      // Add error message to chat
      setChatMessages(prev => ({
        ...prev,
        [currentPlay.id]: [
          ...(prev[currentPlay.id] || []).filter(m => !m.isThinking),
          {
            id: Date.now() + 1,
            sender: 'ella',
            text: `✗ Failed to generate ${currentPlay.name}. Please try again.`,
            timestamp: new Date(),
            isError: true
          }
        ]
      }));

      logTelemetry('play_autorun_failed', {
        playId: currentPlay.id,
        playIndex: currentPlayIndex,
        error: error.message
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReRunPlay = async () => {
    // Re-run with current variables
    await handleRunPlay();
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => ({
      ...prev,
      [currentPlay.id]: [...(prev[currentPlay.id] || []), userMessage]
    }));
    
    setChatInput('');

    // Simulate Ella's response for minor edits
    setTimeout(() => {
      const ellaResponse = {
        id: Date.now() + 1,
        sender: 'ella',
        text: 'I\'ve noted your feedback. The updated version will reflect these changes. Would you like me to regenerate the output with these edits?',
        timestamp: new Date()
      };
      setChatMessages(prev => ({
        ...prev,
        [currentPlay.id]: [...(prev[currentPlay.id] || []), ellaResponse]
      }));
    }, 800);
  };

  const handlePreviousPlay = () => {
    if (currentPlayIndex > 0) {
      setCurrentPlayIndex(prev => prev - 1);
      logTelemetry('play_navigation', { direction: 'previous', fromIndex: currentPlayIndex, toIndex: currentPlayIndex - 1 });
    }
  };

  const handleNextPlay = () => {
    if (currentPlayIndex < currentPlaybook.plays.length - 1) {
      setCurrentPlayIndex(prev => prev + 1);
      logTelemetry('play_navigation', { direction: 'next', fromIndex: currentPlayIndex, toIndex: currentPlayIndex + 1 });
    }
  };

  const handleFinishPlaybook = () => {
    logTelemetry('playbook_run_completed', {
      totalPlays: currentPlaybook.plays.length,
      completedPlays: Object.keys(generatedPlays).length
    });
    onClose();
  };

  const handleClose = () => {
    if (Object.keys(generatedPlays).length > 0) {
      setShowCloseConfirm(true);
    } else {
      logTelemetry('playbook_run_aborted', { completedPlays: 0 });
      onClose();
    }
  };

  const handleSaveAndClose = () => {
    // Save to localStorage for 1-hour recovery
    const sessionState = {
      playbookId: currentPlaybook.id,
      currentPlayIndex,
      variables,
      generatedPlays,
      playFiles,
      chatMessages,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
    };
    localStorage.setItem('playbook-autorun-session', JSON.stringify(sessionState));
    
    logTelemetry('playbook_run_saved', { completedPlays: Object.keys(generatedPlays).length });
    setShowCloseConfirm(false);
    onClose();
  };

  const handleDiscardAndClose = () => {
    localStorage.removeItem('playbook-autorun-session');
    logTelemetry('playbook_run_aborted', { completedPlays: Object.keys(generatedPlays).length });
    setShowCloseConfirm(false);
    onClose();
  };

  // Play Card: Replay action
  const handleReplayPlay = (playId, playIndex) => {
    setCurrentPlayIndex(playIndex);
    logTelemetry('play_card_replay_clicked', { playId, playIndex });
  };

  // Play Card: Files dropdown
  const handleToggleFilesDropdown = (playId, e) => {
    e.stopPropagation();
    setExpandedFilesCard(expandedFilesCard === playId ? null : playId);
    if (expandedFilesCard !== playId) {
      logTelemetry('play_card_files_opened', { playId });
    }
  };

  // Play Card: Info popover
  const handleToggleInfo = (playId, e) => {
    e.stopPropagation();
    setShowInfoPopover(showInfoPopover === playId ? null : playId);
    if (showInfoPopover !== playId) {
      logTelemetry('play_card_info_opened', { playId });
    }
  };

  // File actions
  const handleViewFile = (file) => {
    setSelectedDocument({
      ...file,
      content: generatedPlays[file.playId]?.content || 'Document content...'
    });
    setExpandedFilesCard(null);
    logTelemetry('play_card_file_viewed', { fileId: file.id, playId: file.playId });
  };

  const handleDeleteFile = (file, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
      setPlayFiles(prev => ({
        ...prev,
        [file.playId]: (prev[file.playId] || []).filter(f => f.id !== file.id)
      }));
      
      if (selectedDocument?.id === file.id) {
        setSelectedDocument(null);
      }
      
      logTelemetry('play_card_file_deleted', { fileId: file.id, playId: file.playId });
    }
  };

  if (!isOpen) return null;

  const currentPlayFiles = playFiles[currentPlay?.id] || [];
  const currentChatMessages = chatMessages[currentPlay?.id] || [];

  return (
    <>
      <div className="playbook-runner-drawer__backdrop" onClick={handleClose} />
      <div className="playbook-runner-drawer playbook-runner-drawer--open">
        {/* Header */}
        <div className="playbook-runner-drawer__header">
          <div className="playbook-runner-drawer__header-top">
            <h2 className="playbook-runner-drawer__title">{currentPlaybook.title}</h2>
            <span className="playbook-runner-drawer__mode-badge">Auto-run Mode</span>
            <button 
              className="playbook-runner-drawer__close" 
              onClick={handleClose} 
              aria-label="Close drawer"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="playbook-runner-drawer__progress">
            <div className="playbook-runner-drawer__progress-info">
              <span>Play {currentPlayIndex + 1} of {currentPlaybook.plays.length} (Auto-run)</span>
              <span>{Math.round(progressPercent)}% Complete</span>
            </div>
            <div className="playbook-runner-drawer__progress-bar">
              <div 
                className="playbook-runner-drawer__progress-fill"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>

          {/* Play Cards */}
          <div className="playbook-runner-drawer__play-cards">
            {currentPlaybook.plays.map((play, idx) => {
              const isActive = idx === currentPlayIndex;
              const isCompleted = generatedPlays[play.id];
              const filesForPlay = playFiles[play.id] || [];
              const fileCount = filesForPlay.length;

              return (
                <div 
                  key={play.id}
                  className={`playbook-runner-drawer__play-card ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                >
                  <div className="playbook-runner-drawer__play-card-content">
                    <button
                      className="playbook-runner-drawer__play-card-main"
                      onClick={() => setCurrentPlayIndex(idx)}
                      aria-label={`Go to ${play.name}`}
                    >
                      <h4>{play.name}</h4>
                    </button>

                    <div className="playbook-runner-drawer__play-card-actions">
                      {/* Play/Replay button */}
                      {isCompleted ? (
                        <button
                          className="playbook-runner-drawer__play-action"
                          onClick={(e) => { e.stopPropagation(); handleReplayPlay(play.id, idx); }}
                          aria-label={`Replay ${play.name}`}
                          title="Replay this play"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 7C1 3.686 3.686 1 7 1C10.314 1 13 3.686 13 7C13 10.314 10.314 13 7 13C5.485 13 4.11 12.385 3.1 11.4M3 9V11.5H5.5" 
                              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      ) : (
                        <button
                          className="playbook-runner-drawer__play-action"
                          onClick={(e) => { e.stopPropagation(); setCurrentPlayIndex(idx); }}
                          aria-label={`Start ${play.name}`}
                          title="Start this play"
                        >
                          <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                            <path d="M1 1.5L11 7L1 12.5V1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}

                      {/* Files badge */}
                      <div className="playbook-runner-drawer__files-badge-container">
                        <button
                          className={`playbook-runner-drawer__files-badge ${fileCount > 0 ? 'has-files' : ''}`}
                          onClick={(e) => handleToggleFilesDropdown(play.id, e)}
                          aria-label={`${fileCount} files`}
                          title={`${fileCount} files`}
                          disabled={fileCount === 0}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M3 2.5V11.5C3 12.0523 3.44772 12.5 4 12.5H10C10.5523 12.5 11 12.0523 11 11.5V4.5L8 1.5H4C3.44772 1.5 3 1.94772 3 2.5Z" 
                              stroke="currentColor" strokeWidth="1.2" fill="none"/>
                            <path d="M8 1.5V4.5H11" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                          </svg>
                          {fileCount > 0 && <span className="playbook-runner-drawer__files-count">{fileCount}</span>}
                        </button>

                        {/* Files dropdown */}
                        {expandedFilesCard === play.id && fileCount > 0 && (
                          <div className="playbook-runner-drawer__files-dropdown">
                            {filesForPlay.map(file => (
                              <div key={file.id} className="playbook-runner-drawer__file-row">
                                <button
                                  className="playbook-runner-drawer__file-view"
                                  onClick={() => handleViewFile(file)}
                                  title="View file"
                                >
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M1 7C1 7 3 3 7 3C11 3 13 7 13 7C13 7 11 11 7 11C3 11 1 7 1 7Z" 
                                      stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                  </svg>
                                  <span className="playbook-runner-drawer__file-name">{file.name}</span>
                                  <span className="playbook-runner-drawer__file-size">{file.size}</span>
                                </button>
                                <button
                                  className="playbook-runner-drawer__file-delete"
                                  onClick={(e) => handleDeleteFile(file, e)}
                                  aria-label="Delete file"
                                  title="Delete file"
                                >
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 3H10M4 3V2C4 1.44772 4.44772 1 5 1H7C7.55228 1 8 1.44772 8 2V3M5 5.5V8.5M7 5.5V8.5M3 3H9V10C9 10.5523 8.55228 11 8 11H4C3.44772 11 3 10.5523 3 10V3Z" 
                                      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Info button */}
                      <div className="playbook-runner-drawer__info-container">
                        <button
                          className="playbook-runner-drawer__info-button"
                          onClick={(e) => handleToggleInfo(play.id, e)}
                          aria-label="Play info"
                          title="Play information"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                            <path d="M7 10V6.5M7 4.5V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>

                        {/* Info popover */}
                        {showInfoPopover === play.id && (
                          <div className="playbook-runner-drawer__info-popover">
                            <h5>{play.name}</h5>
                            {play.description && <p>{play.description}</p>}
                            <div className="playbook-runner-drawer__info-meta">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                <path d="M6 3V6L8 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                              </svg>
                              <span>{play.estimatedTime || 'N/A'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body: Split Pane */}
        <div className="playbook-runner-drawer__body">
          {/* Left Pane: Output/Document Viewer */}
          <div className="playbook-runner-drawer__left-pane">
            {selectedDocument ? (
              <div className="playbook-runner-drawer__document-viewer">
                <div className="playbook-runner-drawer__document-header">
                  <div className="playbook-runner-drawer__document-title">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 2.5V13.5C3 14.0523 3.44772 14.5 4 14.5H12C12.5523 14.5 13 14.0523 13 13.5V5.5L10 2.5H4C3.44772 2.5 3 2.94772 3 3.5Z" 
                        stroke="currentColor" strokeWidth="1.2" fill="none"/>
                    </svg>
                    <span>{selectedDocument.name}</span>
                  </div>
                  <button
                    className="playbook-runner-drawer__document-close"
                    onClick={() => setSelectedDocument(null)}
                    aria-label="Close document"
                  >
                    ×
                  </button>
                </div>
                <div className="playbook-runner-drawer__document-content">
                  <pre>{selectedDocument.content}</pre>
                </div>
              </div>
            ) : (
              <div className="playbook-runner-drawer__empty-viewer">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="12" y="16" width="40" height="48" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <line x1="20" y1="28" x2="44" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="20" y1="36" x2="44" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="20" y1="44" x2="36" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p>Generated outputs will appear here</p>
                <span>Run a play to see the results</span>
              </div>
            )}
          </div>

          {/* Right Pane: Variables + Chat */}
          <div className="playbook-runner-drawer__right-pane">
            {/* Variables Panel */}
            <div className="playbook-runner-drawer__variables-panel">
              <div className="playbook-runner-drawer__panel-header">
                <h3>Variables for {currentPlay?.name}</h3>
                <span className="playbook-runner-drawer__play-indicator">
                  Play {currentPlayIndex + 1} of {currentPlaybook.plays.length}
                </span>
              </div>

              <div className="playbook-runner-drawer__variables-form">
                {currentPlay?.variables.map(variable => {
                  const value = getCurrentPlayVariables()[variable.id] ?? (variable.defaultValue || '');
                  
                  return (
                    <div key={variable.id} className="playbook-runner-drawer__field">
                      <label className="playbook-runner-drawer__field-label">
                        {variable.label}
                        {variable.required && <span className="playbook-runner-drawer__field-required"> *</span>}
                      </label>
                      
                      {variable.type === 'text' && (
                        <input
                          type="text"
                          className="playbook-runner-drawer__field-input"
                          value={value}
                          onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                          placeholder={variable.placeholder}
                          required={variable.required}
                          disabled={isGenerating}
                        />
                      )}
                      
                      {variable.type === 'textarea' && (
                        <textarea
                          className="playbook-runner-drawer__field-textarea"
                          value={value}
                          onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                          placeholder={variable.placeholder}
                          required={variable.required}
                          rows={4}
                          disabled={isGenerating}
                        />
                      )}
                      
                      {variable.type === 'select' && (
                        <select
                          className="playbook-runner-drawer__field-select"
                          value={value}
                          onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                          required={variable.required}
                          disabled={isGenerating}
                        >
                          <option value="">Select an option</option>
                          {variable.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}

                      {variable.type === 'date' && (
                        <input
                          type="date"
                          className="playbook-runner-drawer__field-input"
                          value={value}
                          onChange={(e) => handleVariableChange(variable.id, e.target.value)}
                          required={variable.required}
                          disabled={isGenerating}
                        />
                      )}

                      {variable.type === 'boolean' && (
                        <label className="playbook-runner-drawer__checkbox-label">
                          <input
                            type="checkbox"
                            checked={value === true || value === 'true'}
                            onChange={(e) => handleVariableChange(variable.id, e.target.checked)}
                            disabled={isGenerating}
                          />
                          <span>Enable this option</span>
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Area */}
            <div className="playbook-runner-drawer__chat-area">
              <div className="playbook-runner-drawer__chat-header">
                <h4>Chat for Minor Edits</h4>
              </div>
              
              <div 
                className="playbook-runner-drawer__chat-messages"
                ref={chatContainerRef}
              >
                {currentChatMessages.length === 0 ? (
                  <div className="playbook-runner-drawer__chat-empty">
                    <p>After running this play, you can request minor edits here.</p>
                  </div>
                ) : (
                  currentChatMessages.map(msg => (
                    <div 
                      key={msg.id}
                      className={`playbook-runner-drawer__chat-message ${msg.sender} ${msg.isThinking ? 'thinking' : ''} ${msg.isSuccess ? 'success' : ''} ${msg.isError ? 'error' : ''}`}
                    >
                      {msg.sender === 'ella' && (
                        <div className="playbook-runner-drawer__chat-avatar">E</div>
                      )}
                      <div className="playbook-runner-drawer__chat-bubble">
                        {msg.text}
                      </div>
                      {msg.sender === 'user' && (
                        <div className="playbook-runner-drawer__chat-avatar user">U</div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {hasGeneratedCurrentPlay && (
                <div className="playbook-runner-drawer__chat-input-area">
                  <input
                    type="text"
                    className="playbook-runner-drawer__chat-input"
                    placeholder="Request minor edits..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    disabled={isGenerating}
                  />
                  <button
                    className="playbook-runner-drawer__chat-send"
                    onClick={handleSendChatMessage}
                    disabled={!chatInput.trim() || isGenerating}
                    aria-label="Send message"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M1 9L17 1L9 17L7 10L1 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Contextual Actions */}
        <div className="playbook-runner-drawer__footer">
          <button 
            className="playbook-runner-drawer__btn playbook-runner-drawer__btn--secondary"
            onClick={handlePreviousPlay}
            disabled={currentPlayIndex === 0}
          >
            ← Previous Play
          </button>

          <div className="playbook-runner-drawer__footer-right">
            {!hasGeneratedCurrentPlay ? (
              <button 
                className="playbook-runner-drawer__btn playbook-runner-drawer__btn--primary"
                onClick={handleRunPlay}
                disabled={!isCurrentPlayValid() || isGenerating}
                aria-disabled={!isCurrentPlayValid() || isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Run Play'}
              </button>
            ) : (
              <>
                <button 
                  className="playbook-runner-drawer__btn playbook-runner-drawer__btn--ghost"
                  onClick={handleReRunPlay}
                  disabled={isGenerating}
                >
                  Re-run Play
                </button>
                
                {isLastPlay ? (
                  <button 
                    className="playbook-runner-drawer__btn playbook-runner-drawer__btn--primary"
                    onClick={handleFinishPlaybook}
                  >
                    Finish Playbook
                  </button>
                ) : (
                  <button 
                    className="playbook-runner-drawer__btn playbook-runner-drawer__btn--primary"
                    onClick={handleNextPlay}
                  >
                    Next Play →
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Close Confirmation Modal */}
        {showCloseConfirm && (
          <div className="playbook-runner-drawer__modal-backdrop">
            <div className="playbook-runner-drawer__modal">
              <h3>Save your progress?</h3>
              <p>You have generated content. Would you like to save your session for later or discard it?</p>
              <div className="playbook-runner-drawer__modal-actions">
                <button 
                  className="playbook-runner-drawer__btn playbook-runner-drawer__btn--secondary"
                  onClick={() => setShowCloseConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="playbook-runner-drawer__btn playbook-runner-drawer__btn--danger"
                  onClick={handleDiscardAndClose}
                >
                  Discard
                </button>
                <button 
                  className="playbook-runner-drawer__btn playbook-runner-drawer__btn--primary"
                  onClick={handleSaveAndClose}
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PlaybookRunnerDrawer;
