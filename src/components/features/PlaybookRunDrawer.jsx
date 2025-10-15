import React, { useState, useEffect, useRef } from 'react';
import '../../styles/PlaybookRunDrawer.scss';

// Step-by-Step ("Play with Ella") Playbook Runner
// Guides user through each Play → Step with conversational interface
const PlaybookRunDrawer = ({ isOpen, onClose, playbook, inputPanelData }) => {
  // Core state
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepInputs, setStepInputs] = useState({}); // { playId: { stepId: { fieldId: value } } }
  const [completedSteps, setCompletedSteps] = useState(new Set()); // Set of "playId-stepId"
  const [stepOutputs, setStepOutputs] = useState({}); // { playId: { stepId: { content, timestamp } } }
  const [playFiles, setPlayFiles] = useState({}); // { playId: [{ id, name, type, size, createdAt }] }
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Play card UI state
  const [expandedFilesCard, setExpandedFilesCard] = useState(null);
  const [showInfoPopover, setShowInfoPopover] = useState(null);

  const chatContainerRef = useRef(null);

  // Mock playbook with steps
  const mockPlaybook = {
    id: 1,
    title: 'Post-Event Networking Follow-Up Series',
    plays: [
      {
        id: 1,
        name: 'Voicemail Script',
        description: 'Create a personalized voicemail script for post-event follow-up',
        estimatedTime: '5 minutes',
        steps: [
          {
            id: 1,
            name: 'Gather Event Context',
            description: 'Before we craft your voicemail, I need to understand the event context.',
            fields: [
              { id: 'event_name', label: 'Event Name', type: 'text', required: true, placeholder: 'e.g., Tech Summit 2024' },
              { id: 'event_date', label: 'Event Date', type: 'date', required: true }
            ]
          },
          {
            id: 2,
            name: 'Define Contact & Relationship',
            description: 'Tell me about the person you\'re reaching out to.',
            fields: [
              { id: 'contact_name', label: 'Contact Name', type: 'text', required: true },
              { 
                id: 'relationship', 
                label: 'Relationship Level', 
                type: 'select', 
                required: true, 
                options: ['First meeting', 'Brief conversation', 'Extended discussion', 'Existing relationship'] 
              }
            ]
          },
          {
            id: 3,
            name: 'Craft Script',
            description: 'I\'ll now generate your personalized voicemail script.',
            fields: [
              { id: 'tone', label: 'Preferred Tone', type: 'select', required: false, 
                options: ['Professional', 'Casual', 'Enthusiastic', 'Urgent'] },
              { id: 'include_cta', label: 'Include Call-to-Action', type: 'boolean', required: false, defaultValue: true }
            ],
            isPlayOutput: true // Flagged as final output step
          }
        ]
      },
      {
        id: 2,
        name: 'Follow-Up Email',
        description: 'Draft a personalized follow-up email',
        estimatedTime: '8 minutes',
        steps: [
          {
            id: 1,
            name: 'Email Context',
            description: 'Let\'s gather the information needed for your email.',
            fields: [
              { id: 'topics', label: 'Key Topics Discussed', type: 'textarea', required: true, 
                placeholder: 'What did you talk about?' }
            ]
          },
          {
            id: 2,
            name: 'Draft Email',
            description: 'I\'ll create a personalized follow-up email.',
            fields: [
              { id: 'email_tone', label: 'Email Tone', type: 'select', required: true, 
                options: ['Professional', 'Casual', 'Enthusiastic'] },
              { id: 'next_steps', label: 'Proposed Next Steps', type: 'textarea', required: false }
            ],
            isPlayOutput: true
          }
        ]
      }
    ]
  };

  // Prefer provided playbook only if it contains valid plays with steps
  const hasValidProvidedPlaybook = (
    playbook &&
    Array.isArray(playbook.plays) &&
    playbook.plays.length > 0 &&
    playbook.plays.every(p => Array.isArray(p.steps) && p.steps.length > 0)
  );

  const currentPlaybook = hasValidProvidedPlaybook ? playbook : mockPlaybook;

  const currentPlay = currentPlaybook.plays[currentPlayIndex];
  const currentStep = currentPlay?.steps[currentStepIndex];
  const isLastStep = currentStepIndex === (currentPlay?.steps.length - 1);
  const isLastPlay = currentPlayIndex === (currentPlaybook.plays.length - 1);
  const stepKey = `${currentPlay?.id}-${currentStep?.id}`;
  const hasCompletedCurrentStep = completedSteps.has(stepKey);

  // Calculate progress
  const totalSteps = currentPlaybook.plays.reduce((sum, play) => sum + ((play.steps || []).length), 0);
  const completedStepsCount = completedSteps.size;
  const progressPercent = totalSteps > 0 ? (completedStepsCount / totalSteps) * 100 : 0;

  // Has the current play been run at least once?
  const hasRunCurrentPlay = (currentPlay?.steps || []).some(step => completedSteps.has(`${currentPlay.id}-${step.id}`));

  // Telemetry logging
  const logTelemetry = (event, data = {}) => {
    console.log(`Telemetry: ${event}`, {
      ...data,
      timestamp: new Date().toISOString(),
      playbookId: currentPlaybook.id,
      mode: 'step_by_step'
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

      // Initial greeting from Ella
      setChatMessages([{
        id: Date.now(),
        sender: 'ella',
        text: `Welcome! I'm Ella, and I'll guide you through "${currentPlaybook.title}". Let's start with ${currentPlay.name}. ${currentStep?.description}`,
        timestamp: new Date()
      }]);
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

  // Get current step inputs
  const getCurrentStepInputs = () => {
    return stepInputs[currentPlay?.id]?.[currentStep?.id] || {};
  };

  // Check if current step has all required fields
  const isCurrentStepValid = () => {
    if (!currentStep) return false;
    const inputs = getCurrentStepInputs();
    const requiredFields = currentStep.fields.filter(f => f.required);
    
    return requiredFields.every(field => {
      const value = inputs[field.id];
      return value !== undefined && value !== null && value !== '';
    });
  };

  const handleFieldChange = (fieldId, value) => {
    setStepInputs(prev => ({
      ...prev,
      [currentPlay.id]: {
        ...(prev[currentPlay.id] || {}),
        [currentStep.id]: {
          ...(prev[currentPlay.id]?.[currentStep.id] || {}),
          [fieldId]: value
        }
      }
    }));
  };

  const handleRunStep = async () => {
    setIsRunning(true);
    
    logTelemetry('playbook_step_started', {
      playId: currentPlay.id,
      playIndex: currentPlayIndex,
      stepId: currentStep.id,
      stepIndex: currentStepIndex,
      stepName: currentStep.name
    });

    try {
      // Add "thinking" message
      const thinkingMessage = {
        id: Date.now(),
        sender: 'ella',
        text: `Working on ${currentStep.name}...`,
        timestamp: new Date(),
        isThinking: true
      };
      setChatMessages(prev => [...prev, thinkingMessage]);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Generate mock output
      const output = {
        content: `# ${currentStep.name}\n\nGenerated at ${new Date().toLocaleString()}\n\n## Step Inputs\n${Object.entries(getCurrentStepInputs()).map(([key, val]) => `- **${key}**: ${val}`).join('\n')}\n\n## Output\n\n${currentStep.isPlayOutput ? `This is the final output for ${currentPlay.name}.\n\n` : ''}Based on your inputs, here's what I've generated:\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. This is the step output that would be generated by Ella based on your inputs and the step's instructions.\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`,
        timestamp: new Date()
      };

      setStepOutputs(prev => ({
        ...prev,
        [currentPlay.id]: {
          ...(prev[currentPlay.id] || {}),
          [currentStep.id]: output
        }
      }));

      // Mark step as completed
      setCompletedSteps(prev => new Set([...prev, stepKey]));

      // Set as selected document
      setSelectedDocument({
        id: Date.now(),
        name: `${currentStep.name.replace(/\s+/g, '_')}.txt`,
        content: output.content,
        stepName: currentStep.name
      });

      // If this is the play output step, create a file
      if (currentStep.isPlayOutput) {
        const newFile = {
          id: Date.now(),
          name: `${currentPlay.name.replace(/\s+/g, '_')}_${Date.now()}.docx`,
          type: 'document',
          size: '15 KB',
          createdAt: new Date(),
          playId: currentPlay.id,
          content: output.content
        };

        setPlayFiles(prev => ({
          ...prev,
          [currentPlay.id]: [...(prev[currentPlay.id] || []), newFile]
        }));
      }

      // Remove thinking message and add success
      setChatMessages(prev => [
        ...prev.filter(m => !m.isThinking),
        {
          id: Date.now() + 1,
          sender: 'ella',
          text: `✓ ${currentStep.name} completed! ${isLastStep ? `Great work! This completes ${currentPlay.name}.` : 'Ready to move to the next step?'}`,
          timestamp: new Date(),
          isSuccess: true
        }
      ]);

      logTelemetry('playbook_step_succeeded', {
        playId: currentPlay.id,
        playIndex: currentPlayIndex,
        stepId: currentStep.id,
        stepIndex: currentStepIndex
      });

      // If last step of play, mark play as completed
      if (isLastStep) {
        logTelemetry('playbook_play_completed', {
          playId: currentPlay.id,
          playIndex: currentPlayIndex
        });
      }

    } catch (error) {
      console.error('Step execution failed:', error);
      
      setChatMessages(prev => [
        ...prev.filter(m => !m.isThinking),
        {
          id: Date.now() + 1,
          sender: 'ella',
          text: `✗ Something went wrong with ${currentStep.name}. Please try again.`,
          timestamp: new Date(),
          isError: true
        }
      ]);

      logTelemetry('playbook_step_failed', {
        playId: currentPlay.id,
        stepId: currentStep.id,
        error: error.message
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReRunStep = async () => {
    await handleRunStep();
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      // Move to previous step in same play
      setCurrentStepIndex(prev => prev - 1);
      
      const prevStep = currentPlay.steps[currentStepIndex - 1];
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'ella',
        text: `Going back to ${prevStep.name}. ${prevStep.description}`,
        timestamp: new Date()
      }]);
    } else if (currentPlayIndex > 0) {
      // Move to last step of previous play
      const prevPlay = currentPlaybook.plays[currentPlayIndex - 1];
      setCurrentPlayIndex(prev => prev - 1);
      setCurrentStepIndex(prevPlay.steps.length - 1);
      
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'ella',
        text: `Returning to ${prevPlay.name}.`,
        timestamp: new Date()
      }]);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < currentPlay.steps.length - 1) {
      // Move to next step in same play
      setCurrentStepIndex(prev => prev + 1);
      
      const nextStep = currentPlay.steps[currentStepIndex + 1];
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'ella',
        text: `Let's move on to ${nextStep.name}. ${nextStep.description}`,
        timestamp: new Date()
      }]);
    }
  };

  const handleFinishPlay = () => {
    if (currentPlayIndex < currentPlaybook.plays.length - 1) {
      // Move to first step of next play
      setCurrentPlayIndex(prev => prev + 1);
      setCurrentStepIndex(0);
      
      const nextPlay = currentPlaybook.plays[currentPlayIndex + 1];
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'ella',
        text: `Excellent! Now let's work on ${nextPlay.name}. ${nextPlay.steps[0].description}`,
        timestamp: new Date()
      }]);
    } else {
      // Finished entire playbook
      logTelemetry('playbook_run_completed', {
        totalPlays: currentPlaybook.plays.length,
        completedSteps: completedSteps.size
      });
      onClose();
    }
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate Ella's response
    setTimeout(() => {
      const ellaResponse = {
        id: Date.now() + 1,
        sender: 'ella',
        text: 'I understand. Let me help you with that. Please fill in the fields below, then click "Run Step" to continue.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, ellaResponse]);
    }, 800);
  };

  const handleClose = () => {
    if (completedSteps.size > 0) {
      setShowCloseConfirm(true);
    } else {
      logTelemetry('playbook_run_aborted', { completedSteps: 0 });
      onClose();
    }
  };

  const handleSaveAndClose = () => {
    const sessionState = {
      playbookId: currentPlaybook.id,
      currentPlayIndex,
      currentStepIndex,
      stepInputs,
      completedSteps: Array.from(completedSteps),
      stepOutputs,
      playFiles,
      chatMessages,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    };
    localStorage.setItem('playbook-stepbystep-session', JSON.stringify(sessionState));
    
    logTelemetry('playbook_run_saved', { completedSteps: completedSteps.size });
    setShowCloseConfirm(false);
    onClose();
  };

  const handleDiscardAndClose = () => {
    localStorage.removeItem('playbook-stepbystep-session');
    logTelemetry('playbook_run_aborted', { completedSteps: completedSteps.size });
    setShowCloseConfirm(false);
    onClose();
  };

  // Play Card: Replay action (restart play from step 1)
  const handleReplayPlay = (playId, playIndex) => {
    setCurrentPlayIndex(playIndex);
    setCurrentStepIndex(0);
    
    const play = currentPlaybook.plays[playIndex];
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'ella',
      text: `Replaying ${play.name} from the beginning. ${play.steps[0].description}`,
      timestamp: new Date()
    }]);
    
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
      content: file.content || 'Document content...'
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

  return (
    <>
      <div className="playbook-run-drawer__backdrop" onClick={handleClose} />
      <div className="playbook-run-drawer playbook-run-drawer--open">
        {/* Header */}
        <div className="playbook-run-drawer__header">
          <div className="playbook-run-drawer__header-top">
            <h2 className="playbook-run-drawer__title">{currentPlaybook.title}</h2>
            <span className="playbook-run-drawer__mode-badge playbook-run-drawer__mode-badge--stepbystep">Step-by-Step</span>
            <button 
              className="playbook-run-drawer__close" 
              onClick={handleClose} 
              aria-label="Close drawer"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="playbook-run-drawer__progress">
            <div className="playbook-run-drawer__progress-info">
              <span>Play {currentPlayIndex + 1} of {currentPlaybook.plays.length} · Step {currentStepIndex + 1} of {currentPlay?.steps.length}</span>
              <span>{Math.round(progressPercent)}% Complete</span>
            </div>
            <div className="playbook-run-drawer__progress-bar">
              <div 
                className="playbook-run-drawer__progress-fill"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>

          {/* Play Cards */}
          <div className="playbook-run-drawer__play-cards">
            {currentPlaybook.plays.map((play, idx) => {
              const isActive = idx === currentPlayIndex;
              const hasRun = play.steps.some(step => 
                completedSteps.has(`${play.id}-${step.id}`)
              );
              const filesForPlay = playFiles[play.id] || [];
              const fileCount = filesForPlay.length;

              return (
                <div 
                  key={play.id}
                  className={`playbook-run-drawer__play-card ${isActive ? 'active' : ''} ${hasRun ? 'completed' : ''}`}
                >
                  <div className="playbook-run-drawer__play-card-content">
                    <button
                      className="playbook-run-drawer__play-card-main"
                      onClick={() => handleReplayPlay(play.id, idx)}
                      aria-label={`Go to ${play.name}`}
                    >
                      <h4>{play.name}</h4>
                    </button>

                    <div className="playbook-run-drawer__play-card-actions">
                      {/* Play/Replay button */}
                      {hasRun ? (
                        <button
                          className="playbook-run-drawer__play-action"
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
                          className="playbook-run-drawer__play-action"
                          onClick={(e) => { e.stopPropagation(); handleReplayPlay(play.id, idx); }}
                          aria-label={`Start ${play.name}`}
                          title="Start this play"
                        >
                          <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                            <path d="M1 1.5L11 7L1 12.5V1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}

                      {/* Files badge */}
                      <div className="playbook-run-drawer__files-badge-container">
                        <button
                          className={`playbook-run-drawer__files-badge ${fileCount > 0 ? 'has-files' : ''}`}
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
                          {fileCount > 0 && <span className="playbook-run-drawer__files-count">{fileCount}</span>}
                        </button>

                        {/* Files dropdown */}
                        {expandedFilesCard === play.id && fileCount > 0 && (
                          <div className="playbook-run-drawer__files-dropdown">
                            {filesForPlay.map(file => (
                              <div key={file.id} className="playbook-run-drawer__file-row">
                                <button
                                  className="playbook-run-drawer__file-view"
                                  onClick={() => handleViewFile(file)}
                                  title="View file"
                                >
                                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M1 7C1 7 3 3 7 3C11 3 13 7 13 7C13 7 11 11 7 11C3 11 1 7 1 7Z" 
                                      stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                                  </svg>
                                  <span className="playbook-run-drawer__file-name">{file.name}</span>
                                  <span className="playbook-run-drawer__file-size">{file.size}</span>
                                </button>
                                <button
                                  className="playbook-run-drawer__file-delete"
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
                      <div className="playbook-run-drawer__info-container">
                        <button
                          className="playbook-run-drawer__info-button"
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
                          <div className="playbook-run-drawer__info-popover">
                            <h5>{play.name}</h5>
                            {play.description && <p>{play.description}</p>}
                            <div className="playbook-run-drawer__info-meta">
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
        <div className="playbook-run-drawer__body">
          {/* Left Pane: Working Document Viewer */}
          <div className="playbook-run-drawer__left-pane">
            {selectedDocument ? (
              <div className="playbook-run-drawer__document-viewer">
                <div className="playbook-run-drawer__document-header">
                  <div className="playbook-run-drawer__document-title">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 2.5V13.5C3 14.0523 3.44772 14.5 4 14.5H12C12.5523 14.5 13 14.0523 13 13.5V5.5L10 2.5H4C3.44772 2.5 3 2.94772 3 3.5Z" 
                        stroke="currentColor" strokeWidth="1.2" fill="none"/>
                    </svg>
                    <span>{selectedDocument.name}</span>
                  </div>
                  <button
                    className="playbook-run-drawer__document-close"
                    onClick={() => setSelectedDocument(null)}
                    aria-label="Close document"
                  >
                    ×
                  </button>
                </div>
                <div className="playbook-run-drawer__document-content">
                  <pre>{selectedDocument.content}</pre>
                </div>
              </div>
            ) : (
              <div className="playbook-run-drawer__empty-viewer">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <rect x="12" y="16" width="40" height="48" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <line x1="20" y1="28" x2="44" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="20" y1="36" x2="44" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="20" y1="44" x2="36" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p>Working document will appear here</p>
                <span>Step outputs will be displayed as you progress</span>
              </div>
            )}
          </div>

          {/* Right Pane: Step Header + Chat */}
          <div className="playbook-run-drawer__right-pane playbook-run-drawer__right-pane--stepbystep">
            {/* Pinned Step Header */}
            <div className="playbook-run-drawer__step-header">
              <div className="playbook-run-drawer__step-header-top">
                <span className="playbook-run-drawer__play-name">{currentPlay?.name}</span>
                <span className="playbook-run-drawer__step-number">Step {currentStepIndex + 1} of {currentPlay?.steps.length}</span>
              </div>
              <h3 className="playbook-run-drawer__step-title">{currentStep?.name}</h3>
              <p className="playbook-run-drawer__step-description">{currentStep?.description}</p>
            </div>

            {/* Input Fields (if any) */}
            {currentStep?.fields && currentStep.fields.length > 0 && (
              <div className="playbook-run-drawer__step-fields">
                {currentStep.fields.map(field => {
                  const value = getCurrentStepInputs()[field.id] ?? (field.defaultValue || '');
                  
                  return (
                    <div key={field.id} className="playbook-run-drawer__field">
                      <label className="playbook-run-drawer__field-label">
                        {field.label}
                        {field.required && <span className="playbook-run-drawer__field-required"> *</span>}
                      </label>
                      
                      {field.type === 'text' && (
                        <input
                          type="text"
                          className="playbook-run-drawer__field-input"
                          value={value}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          disabled={isRunning}
                        />
                      )}
                      
                      {field.type === 'textarea' && (
                        <textarea
                          className="playbook-run-drawer__field-textarea"
                          value={value}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          rows={3}
                          disabled={isRunning}
                        />
                      )}
                      
                      {field.type === 'select' && (
                        <select
                          className="playbook-run-drawer__field-select"
                          value={value}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          required={field.required}
                          disabled={isRunning}
                        >
                          <option value="">Select an option</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}

                      {field.type === 'date' && (
                        <input
                          type="date"
                          className="playbook-run-drawer__field-input"
                          value={value}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          required={field.required}
                          disabled={isRunning}
                        />
                      )}

                      {field.type === 'boolean' && (
                        <label className="playbook-run-drawer__checkbox-label">
                          <input
                            type="checkbox"
                            checked={value === true || value === 'true'}
                            onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                            disabled={isRunning}
                          />
                          <span>Enable this option</span>
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Chat Conversation */}
            <div className="playbook-run-drawer__chat-area playbook-run-drawer__chat-area--stepbystep">
              <div 
                className="playbook-run-drawer__chat-messages"
                ref={chatContainerRef}
              >
                {chatMessages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`playbook-run-drawer__chat-message ${msg.sender} ${msg.isThinking ? 'thinking' : ''} ${msg.isSuccess ? 'success' : ''} ${msg.isError ? 'error' : ''}`}
                  >
                    {msg.sender === 'ella' && (
                      <div className="playbook-run-drawer__chat-avatar">E</div>
                    )}
                    <div className="playbook-run-drawer__chat-bubble">
                      {msg.text}
                    </div>
                    {msg.sender === 'user' && (
                      <div className="playbook-run-drawer__chat-avatar user">U</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="playbook-run-drawer__chat-input-area">
                <input
                  type="text"
                  className="playbook-run-drawer__chat-input"
                  placeholder="Chat with Ella..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                  disabled={isRunning}
                />
                <button
                  className="playbook-run-drawer__chat-send"
                  onClick={handleSendChatMessage}
                  disabled={!chatInput.trim() || isRunning}
                  aria-label="Send message"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M1 9L17 1L9 17L7 10L1 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Step Navigation */}
        <div className="playbook-run-drawer__footer">
          <button 
            className="playbook-run-drawer__btn playbook-run-drawer__btn--secondary"
            onClick={handlePreviousStep}
            disabled={currentPlayIndex === 0 && currentStepIndex === 0}
          >
            ← Previous Step
          </button>

          <div className="playbook-run-drawer__footer-right">
            {!hasCompletedCurrentStep ? (
              <button 
                className="playbook-run-drawer__btn playbook-run-drawer__btn--primary"
                onClick={handleRunStep}
                disabled={!isCurrentStepValid() || isRunning}
                aria-disabled={!isCurrentStepValid() || isRunning}
                title={!isCurrentStepValid() ? 'Please fill all required fields' : 'Run this step'}
              >
                {isRunning ? 'Running...' : 'Run Step'}
              </button>
            ) : (
              <>
                <button 
                  className="playbook-run-drawer__btn playbook-run-drawer__btn--ghost"
                  onClick={handleReRunStep}
                  disabled={isRunning}
                >
                  Re-run Step
                </button>
                
                {isLastStep ? (
                  <button 
                    className="playbook-run-drawer__btn playbook-run-drawer__btn--primary"
                    onClick={handleFinishPlay}
                  >
                    {isLastPlay ? 'Finish Playbook' : 'Finish Play'}
                  </button>
                ) : (
                  <button 
                    className="playbook-run-drawer__btn playbook-run-drawer__btn--primary"
                    onClick={handleNextStep}
                  >
                    Next Step →
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Close Confirmation Modal */}
        {showCloseConfirm && (
          <div className="playbook-run-drawer__modal-backdrop">
            <div className="playbook-run-drawer__modal">
              <h3>Save your progress?</h3>
              <p>You've completed {completedSteps.size} step{completedSteps.size !== 1 ? 's' : ''}. Would you like to save your session for later or discard it?</p>
              <div className="playbook-run-drawer__modal-actions">
                <button 
                  className="playbook-run-drawer__btn playbook-run-drawer__btn--secondary"
                  onClick={() => setShowCloseConfirm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="playbook-run-drawer__btn playbook-run-drawer__btn--danger"
                  onClick={handleDiscardAndClose}
                >
                  Discard
                </button>
                <button 
                  className="playbook-run-drawer__btn playbook-run-drawer__btn--primary"
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

export default PlaybookRunDrawer;
