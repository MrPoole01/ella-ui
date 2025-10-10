import React, { useState, useEffect, useRef } from 'react';
import '../../styles/PlaybookRunDrawer.scss';

// Mock data structure for a playbook run
const mockPlaybook = {
  id: 1,
  title: 'Post-Event Networking Follow-Up Series',
  plays: [
    {
      id: 1,
      name: 'Voicemail Script',
      steps: [
        {
          id: 1,
          name: 'Gather Event Context',
          description: 'Before we craft your voicemail, I need to understand the event context and your networking goals.',
          fields: [
            { id: 'event_name', label: 'Event Name', type: 'text', required: true },
            { id: 'event_date', label: 'Event Date', type: 'date', required: true },
            { id: 'contact_role', label: 'Contact Role/Title', type: 'text', required: false }
          ]
        },
        {
          id: 2,
          name: 'Define Message Tone',
          description: 'Let\'s determine the right tone for your voicemail based on your relationship with the contact.',
          fields: [
            { id: 'relationship', label: 'Relationship Level', type: 'select', required: true, options: ['First meeting', 'Brief conversation', 'Extended discussion', 'Existing connection'] },
            { id: 'urgency', label: 'Urgency Level', type: 'select', required: false, options: ['Low', 'Medium', 'High'] }
          ]
        },
        {
          id: 3,
          name: 'Write Voicemail Script',
          description: 'Now I\'ll create a personalized voicemail script based on the context you\'ve provided.',
          fields: [],
          isOutput: true
        }
      ],
      documents: []
    },
    {
      id: 2,
      name: 'Follow-Up Email',
      steps: [
        {
          id: 1,
          name: 'Email Context',
          description: 'Let\'s gather the information needed for your follow-up email.',
          fields: [
            { id: 'conversation_topics', label: 'Key Topics Discussed', type: 'textarea', required: true },
            { id: 'next_steps', label: 'Proposed Next Steps', type: 'textarea', required: false }
          ]
        },
        {
          id: 2,
          name: 'Draft Email',
          description: 'I\'ll now draft your follow-up email.',
          fields: [],
          isOutput: true
        }
      ],
      documents: []
    },
    {
      id: 3,
      name: 'LinkedIn Message',
      steps: [
        {
          id: 1,
          name: 'LinkedIn Strategy',
          description: 'Let\'s craft a LinkedIn connection message that complements your other outreach.',
          fields: [
            { id: 'connection_status', label: 'Connection Status', type: 'select', required: true, options: ['Not connected', 'Pending', 'Already connected'] },
            { id: 'message_goal', label: 'Message Goal', type: 'select', required: true, options: ['Send connection request', 'Follow up on pending request', 'Send message to connection'] }
          ]
        },
        {
          id: 2,
          name: 'Write LinkedIn Message',
          description: 'I\'ll create your LinkedIn message now.',
          fields: [],
          isOutput: true
        }
      ],
      documents: []
    }
  ]
};

const PlaybookRunDrawer = ({ isOpen, onClose, playbook, inputPanelData }) => {
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepInputs, setStepInputs] = useState({});
  const [stepOutputs, setStepOutputs] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasExecuted, setHasExecuted] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [savedState, setSavedState] = useState(null);
  const [expandedPlayDocuments, setExpandedPlayDocuments] = useState({});
  const chatContainerRef = useRef(null);

  const currentPlaybook = playbook || mockPlaybook;
  const currentPlay = currentPlaybook.plays[currentPlayIndex];
  const currentStep = currentPlay?.steps[currentStepIndex];
  const nextStep = currentPlay?.steps[currentStepIndex + 1];
  const isLastStepInPlay = currentStepIndex === currentPlay?.steps.length - 1;
  const isLastPlay = currentPlayIndex === currentPlaybook.plays.length - 1;

  // Calculate progress
  const totalSteps = currentPlay?.steps.length || 0;
  const completedStepsInPlay = currentStepIndex;
  const progressPercent = totalSteps > 0 ? (completedStepsInPlay / totalSteps) * 100 : 0;

  // Calculate overall progress across all plays
  let totalStepsAllPlays = 0;
  let completedStepsAllPlays = 0;
  currentPlaybook.plays.forEach((play, playIdx) => {
    totalStepsAllPlays += play.steps.length;
    if (playIdx < currentPlayIndex) {
      completedStepsAllPlays += play.steps.length;
    } else if (playIdx === currentPlayIndex) {
      completedStepsAllPlays += currentStepIndex;
    }
  });
  const overallProgressPercent = totalStepsAllPlays > 0 ? (completedStepsAllPlays / totalStepsAllPlays) * 100 : 0;

  // Generate step key for tracking
  const getStepKey = (playIdx, stepIdx) => `play-${playIdx}-step-${stepIdx}`;
  const currentStepKey = getStepKey(currentPlayIndex, currentStepIndex);

  // Initialize chat with Ella's greeting when step changes
  useEffect(() => {
    if (isOpen && currentStep && !isCompleted) {
      const stepKey = currentStepKey;
      const existingMessages = chatMessages.filter(msg => msg.stepKey === stepKey);
      
      if (existingMessages.length === 0) {
        // Add Ella's initial message for this step
        const initialMessage = {
          id: Date.now(),
          sender: 'ella',
          text: currentStep.description,
          timestamp: new Date(),
          stepKey: stepKey
        };
        setChatMessages([initialMessage]);
        
        // Initialize expanded state for this step (default expanded on first view)
        if (expandedDescriptions[stepKey] === undefined) {
          setExpandedDescriptions(prev => ({ ...prev, [stepKey]: true }));
        }

        // Log telemetry
        console.log('Telemetry: playbook_step_started', {
          playbookId: currentPlaybook.id,
          playId: currentPlay.id,
          stepId: currentStep.id,
          playIndex: currentPlayIndex,
          stepIndex: currentStepIndex
        });
      }
    }
  }, [currentPlayIndex, currentStepIndex, isOpen, isCompleted]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Log drawer opened
  useEffect(() => {
    if (isOpen) {
      console.log('Telemetry: playbook_run_opened', {
        playbookId: currentPlaybook.id,
        inputData: inputPanelData
      });
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isCompleted) {
        setShowCloseConfirm(true);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, isCompleted]);

  // Check if current step has all required inputs
  const isStepValid = () => {
    if (!currentStep) return false;
    
    const inputs = stepInputs[currentStepKey] || {};
    const requiredFields = currentStep.fields.filter(f => f.required);
    
    return requiredFields.every(field => {
      const value = inputs[field.id];
      return value !== undefined && value !== null && value !== '';
    });
  };

  const handleInputChange = (fieldId, value) => {
    setStepInputs(prev => ({
      ...prev,
      [currentStepKey]: {
        ...(prev[currentStepKey] || {}),
        [fieldId]: value
      }
    }));
  };

  const handleRunStep = async () => {
    setIsExecuting(true);
    
    try {
      // Simulate API call to execute step
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock output
      const output = {
        content: `Output for ${currentStep.name}:\n\nThis is a generated result based on your inputs and our conversation. The step has been executed successfully.`,
        timestamp: new Date(),
        documentIds: currentStep.isOutput ? [Date.now()] : []
      };
      
      setStepOutputs(prev => ({
        ...prev,
        [currentStepKey]: output
      }));
      
      setHasExecuted(prev => ({
        ...prev,
        [currentStepKey]: true
      }));

      // Add output to chat
      const outputMessage = {
        id: Date.now(),
        sender: 'ella',
        text: output.content,
        timestamp: new Date(),
        stepKey: currentStepKey,
        isOutput: true
      };
      setChatMessages(prev => [...prev, outputMessage]);

      // If this step created documents, add them to the play
      if (currentStep.isOutput && output.documentIds.length > 0) {
        currentPlay.documents = currentPlay.documents || [];
        currentPlay.documents.push(...output.documentIds.map(id => ({
          id,
          name: `${currentStep.name} - ${new Date().toLocaleDateString()}`,
          playId: currentPlay.id,
          stepId: currentStep.id
        })));
      }

      // Log telemetry
      console.log('Telemetry: playbook_step_succeeded', {
        playbookId: currentPlaybook.id,
        playId: currentPlay.id,
        stepId: currentStep.id
      });

      // Auto-advance to next step after a brief delay
      setTimeout(() => {
        if (!isLastStepInPlay) {
          handleNextStep();
        } else if (isLastStepInPlay && !isLastPlay) {
          // Log play completion
          console.log('Telemetry: playbook_play_completed', {
            playbookId: currentPlaybook.id,
            playId: currentPlay.id
          });
        } else if (isLastStepInPlay && isLastPlay) {
          // All plays completed
          setIsCompleted(true);
          console.log('Telemetry: playbook_run_completed', {
            playbookId: currentPlaybook.id
          });
        }
      }, 1000);
      
    } catch (error) {
      console.error('Step execution failed:', error);
      console.log('Telemetry: playbook_step_failed', {
        playbookId: currentPlaybook.id,
        playId: currentPlay.id,
        stepId: currentStep.id,
        error: error.message
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReRunStep = async () => {
    // Re-run uses the same inputs but creates a new output instance
    await handleRunStep();
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else if (currentPlayIndex > 0) {
      // Go to previous play's last step
      setCurrentPlayIndex(prev => prev - 1);
      setCurrentStepIndex(currentPlaybook.plays[currentPlayIndex - 1].steps.length - 1);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < currentPlay.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleFinishPlay = () => {
    console.log('Telemetry: playbook_play_completed', {
      playbookId: currentPlaybook.id,
      playId: currentPlay.id
    });

    if (currentPlayIndex < currentPlaybook.plays.length - 1) {
      // Move to next play
      setCurrentPlayIndex(prev => prev + 1);
      setCurrentStepIndex(0);
    }
  };

  const handleFinishPlaybook = () => {
    setIsCompleted(true);
    console.log('Telemetry: playbook_run_completed', {
      playbookId: currentPlaybook.id
    });
  };

  const handleRunAgainPlay = () => {
    // Restart current play at step 1
    setCurrentStepIndex(0);
    // Clear outputs for this play but keep inputs
    const newOutputs = { ...stepOutputs };
    currentPlay.steps.forEach((step, idx) => {
      const key = getStepKey(currentPlayIndex, idx);
      delete newOutputs[key];
    });
    setStepOutputs(newOutputs);
    setHasExecuted({});
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date(),
      stepKey: currentStepKey
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate Ella's response
    setTimeout(() => {
      const ellaResponse = {
        id: Date.now() + 1,
        sender: 'ella',
        text: 'I understand. Let me help you with that.',
        timestamp: new Date(),
        stepKey: currentStepKey
      };
      setChatMessages(prev => [...prev, ellaResponse]);
    }, 1000);
  };

  const handleClose = () => {
    if (isCompleted || !hasExecuted[currentStepKey]) {
      // No confirmation needed
      onClose();
      console.log('Telemetry: playbook_run_aborted', {
        playbookId: currentPlaybook.id,
        playIndex: currentPlayIndex,
        stepIndex: currentStepIndex
      });
    } else {
      setShowCloseConfirm(true);
    }
  };

  const handleSaveAndClose = () => {
    const state = {
      currentPlayIndex,
      currentStepIndex,
      stepInputs,
      stepOutputs,
      chatMessages,
      hasExecuted,
      timestamp: new Date()
    };
    localStorage.setItem('playbook-run-state', JSON.stringify(state));
    setShowCloseConfirm(false);
    onClose();
  };

  const handleDiscardAndClose = () => {
    localStorage.removeItem('playbook-run-state');
    setShowCloseConfirm(false);
    onClose();
    console.log('Telemetry: playbook_run_aborted', {
      playbookId: currentPlaybook.id,
      playIndex: currentPlayIndex,
      stepIndex: currentStepIndex
    });
  };

  const handleExitPlaybook = () => {
    localStorage.removeItem('playbook-run-state');
    onClose();
  };

  const handleContinueChatting = () => {
    // This would open the main chat interface with full context
    console.log('Opening main chat with playbook context');
    // TODO: Implement navigation to main chat
  };

  const togglePlayDocuments = (playId) => {
    setExpandedPlayDocuments(prev => ({
      ...prev,
      [playId]: !prev[playId]
    }));
  };

  const handleOpenDocument = (documentId) => {
    console.log('Opening document:', documentId);
    // TODO: Implement document viewer in left pane
  };

  const toggleDescriptionExpanded = () => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [currentStepKey]: !prev[currentStepKey]
    }));
  };

  if (!isOpen) return null;

  // Render completion screen
  if (isCompleted) {
    return (
      <>
        <div className="playbook-run-drawer__backdrop" onClick={handleExitPlaybook} />
        <div className="playbook-run-drawer playbook-run-drawer--open">
          <div className="playbook-run-drawer__header">
            <div className="playbook-run-drawer__header-top">
              <h2 className="playbook-run-drawer__title">{currentPlaybook.title}</h2>
              <button className="playbook-run-drawer__close" onClick={handleExitPlaybook} aria-label="Close drawer">
                ×
              </button>
            </div>
          </div>

          <div className="playbook-run-drawer__completion">
            <div className="playbook-run-drawer__completion-icon">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="var(--theme-primary)" strokeWidth="4" fill="none"/>
                <path d="M20 32L28 40L44 24" stroke="var(--theme-primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="playbook-run-drawer__completion-title">Playbook Complete!</h3>
            <p className="playbook-run-drawer__completion-subtitle">All plays have been executed successfully.</p>

            <div className="playbook-run-drawer__completion-summary">
              <h4>Play Outputs</h4>
              {currentPlaybook.plays.map((play, idx) => {
                const lastStepKey = getStepKey(idx, play.steps.length - 1);
                const output = stepOutputs[lastStepKey];
                
                return (
                  <div key={play.id} className="playbook-run-drawer__completion-play">
                    <h5>{play.name}</h5>
                    {output ? (
                      <p>{output.content.substring(0, 150)}...</p>
                    ) : (
                      <p className="playbook-run-drawer__completion-no-output">No output generated</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="playbook-run-drawer__completion-actions">
              <button 
                className="playbook-run-drawer__btn playbook-run-drawer__btn--primary"
                onClick={handleContinueChatting}
              >
                Continue chatting with Ella
              </button>
              <button 
                className="playbook-run-drawer__btn playbook-run-drawer__btn--secondary"
                onClick={handleExitPlaybook}
              >
                Exit Playbook
              </button>
              <button 
                className="playbook-run-drawer__btn playbook-run-drawer__btn--ghost"
                onClick={() => console.log('View all outputs')}
              >
                View All Outputs in Project
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="playbook-run-drawer__backdrop" onClick={handleClose} />
      <div className="playbook-run-drawer playbook-run-drawer--open">
        {/* Header */}
        <div className="playbook-run-drawer__header">
          <div className="playbook-run-drawer__header-top">
            <h2 className="playbook-run-drawer__title">{currentPlaybook.title}</h2>
            <button className="playbook-run-drawer__close" onClick={handleClose} aria-label="Close drawer">
              ×
            </button>
          </div>
          
          {/* Overall Progress Bar */}
          <div className="playbook-run-drawer__progress">
            <div className="playbook-run-drawer__progress-info">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgressPercent)}%</span>
            </div>
            <div className="playbook-run-drawer__progress-bar">
              <div 
                className="playbook-run-drawer__progress-fill"
                style={{ width: `${overallProgressPercent}%` }}
              />
              {/* Tick marks for steps in current play */}
              {currentPlay.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`playbook-run-drawer__progress-tick ${idx < currentStepIndex ? 'playbook-run-drawer__progress-tick--completed' : ''}`}
                  style={{ left: `${(idx / totalSteps) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Play Cards */}
          <div className="playbook-run-drawer__play-cards">
            {currentPlaybook.plays.map((play, idx) => {
              const isActive = idx === currentPlayIndex;
              const isCompleted = idx < currentPlayIndex;
              const hasDocuments = play.documents && play.documents.length > 0;
              const isExpanded = expandedPlayDocuments[play.id];

              return (
                <div key={play.id} className="playbook-run-drawer__play-card-wrapper">
                  <div 
                    className={`playbook-run-drawer__play-card ${isActive ? 'playbook-run-drawer__play-card--active' : ''} ${isCompleted ? 'playbook-run-drawer__play-card--completed' : ''}`}
                  >
                    <div className="playbook-run-drawer__play-card-content">
                      <h4>{play.name}</h4>
                      {hasDocuments && (
                        <div className="playbook-run-drawer__play-docs">
                          <button 
                            className="playbook-run-drawer__play-docs-toggle"
                            onClick={() => togglePlayDocuments(play.id)}
                            aria-expanded={isExpanded}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M3 4.5L3 12.5C3 13.3284 3.67157 14 4.5 14L11.5 14C12.3284 14 13 13.3284 13 12.5L13 5.5L9.5 2L4.5 2C3.67157 2 3 2.67157 3 3.5Z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                              <path d="M9 2V5.5H13" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                            </svg>
                            <span>{play.documents.length}</span>
                            <svg 
                              className={`playbook-run-drawer__play-docs-chevron ${isExpanded ? 'playbook-run-drawer__play-docs-chevron--expanded' : ''}`}
                              width="12" height="12" viewBox="0 0 12 12" fill="none"
                            >
                              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded document list */}
                  {hasDocuments && isExpanded && (
                    <div className="playbook-run-drawer__play-docs-list">
                      {play.documents.map(doc => (
                        <button
                          key={doc.id}
                          className="playbook-run-drawer__play-doc-item"
                          onClick={() => handleOpenDocument(doc.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M2.5 3.5L2.5 11.5C2.5 12.0523 2.94772 12.5 3.5 12.5L10.5 12.5C11.0523 12.5 11.5 12.0523 11.5 11.5L11.5 4.5L8.5 1.5L3.5 1.5C2.94772 1.5 2.5 1.94772 2.5 2.5Z" stroke="currentColor" strokeWidth="1" fill="none"/>
                          </svg>
                          <span>{doc.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="playbook-run-drawer__body">
          {/* Step Panel (Pinned) */}
          <div className="playbook-run-drawer__step-panel">
            <div className="playbook-run-drawer__step-header">
              <div className="playbook-run-drawer__step-title">
                <span className="playbook-run-drawer__step-play">Play {currentPlayIndex + 1} of {currentPlaybook.plays.length} · {currentPlay.name}</span>
                <h3>Step {currentStepIndex + 1} of {totalSteps} — {currentStep?.name}</h3>
              </div>
              {nextStep && (
                <div className="playbook-run-drawer__step-next">
                  Next: {nextStep.name}
                </div>
              )}
            </div>

            {/* Step Description */}
            {currentStep?.description && (
              <div className="playbook-run-drawer__step-description">
                <button 
                  className="playbook-run-drawer__step-description-toggle"
                  onClick={toggleDescriptionExpanded}
                  aria-expanded={expandedDescriptions[currentStepKey]}
                >
                  <svg 
                    className={`playbook-run-drawer__step-description-chevron ${expandedDescriptions[currentStepKey] ? 'playbook-run-drawer__step-description-chevron--expanded' : ''}`}
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                  >
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Step details</span>
                </button>
                {expandedDescriptions[currentStepKey] && (
                  <p className="playbook-run-drawer__step-description-text">{currentStep.description}</p>
                )}
              </div>
            )}

            {/* Intake Fields */}
            {currentStep?.fields && currentStep.fields.length > 0 && (
              <div className="playbook-run-drawer__step-fields">
                {currentStep.fields.map(field => {
                  const value = stepInputs[currentStepKey]?.[field.id] || '';
                  
                  return (
                    <div key={field.id} className="playbook-run-drawer__field">
                      <label className="playbook-run-drawer__field-label">
                        {field.label}
                        {field.required && <span className="playbook-run-drawer__field-required">*</span>}
                      </label>
                      
                      {field.type === 'text' && (
                        <input
                          type="text"
                          className="playbook-run-drawer__field-input"
                          value={value}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.required}
                        />
                      )}
                      
                      {field.type === 'textarea' && (
                        <textarea
                          className="playbook-run-drawer__field-textarea"
                          value={value}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.required}
                          rows={4}
                        />
                      )}
                      
                      {field.type === 'date' && (
                        <input
                          type="date"
                          className="playbook-run-drawer__field-input"
                          value={value}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.required}
                        />
                      )}
                      
                      {field.type === 'select' && (
                        <select
                          className="playbook-run-drawer__field-select"
                          value={value}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.required}
                        >
                          <option value="">Select an option</option>
                          {field.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  );
                })}
                
                {!isStepValid() && (
                  <div className="playbook-run-drawer__field-hint">
                    Please fill in all required fields or provide the information via chat to continue.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Conversation Panel */}
          <div className="playbook-run-drawer__conversation">
            <div className="playbook-run-drawer__chat-messages" ref={chatContainerRef}>
              {chatMessages
                .filter(msg => msg.stepKey === currentStepKey)
                .map(msg => (
                  <div 
                    key={msg.id} 
                    className={`playbook-run-drawer__chat-message playbook-run-drawer__chat-message--${msg.sender} ${msg.isOutput ? 'playbook-run-drawer__chat-message--output' : ''}`}
                  >
                    {msg.sender === 'ella' && (
                      <div className="playbook-run-drawer__chat-avatar">E</div>
                    )}
                    <div className="playbook-run-drawer__chat-bubble">
                      <p>{msg.text}</p>
                      {msg.isOutput && (
                        <div className="playbook-run-drawer__output-badge">Output</div>
                      )}
                    </div>
                    {msg.sender === 'user' && (
                      <div className="playbook-run-drawer__chat-avatar playbook-run-drawer__chat-avatar--user">U</div>
                    )}
                  </div>
                ))}
            </div>

            {/* Chat Composer */}
            <div className="playbook-run-drawer__chat-composer">
              <input
                type="text"
                className="playbook-run-drawer__chat-input"
                placeholder="Message Ella..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                className="playbook-run-drawer__chat-send"
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                aria-label="Send message"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2 10L18 2L10 18L8 11L2 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="playbook-run-drawer__footer">
          <button 
            className="playbook-run-drawer__btn playbook-run-drawer__btn--secondary"
            onClick={handlePreviousStep}
            disabled={currentPlayIndex === 0 && currentStepIndex === 0}
          >
            Previous
          </button>

          <div className="playbook-run-drawer__footer-right">
            {hasExecuted[currentStepKey] && (
              <button 
                className="playbook-run-drawer__btn playbook-run-drawer__btn--ghost"
                onClick={handleReRunStep}
                disabled={isExecuting}
              >
                Re-run Step
              </button>
            )}

            {!hasExecuted[currentStepKey] ? (
              <button 
                className="playbook-run-drawer__btn playbook-run-drawer__btn--primary"
                onClick={handleRunStep}
                disabled={!isStepValid() || isExecuting}
              >
                {isExecuting ? 'Running...' : 'Run Step'}
              </button>
            ) : (
              <>
                {isLastStepInPlay && isLastPlay ? (
                  <button 
                    className="playbook-run-drawer__btn playbook-run-drawer__btn--primary"
                    onClick={handleFinishPlaybook}
                  >
                    Finish Playbook
                  </button>
                ) : isLastStepInPlay ? (
                  <button 
                    className="playbook-run-drawer__btn playbook-run-drawer__btn--primary"
                    onClick={handleFinishPlay}
                  >
                    Next Play
                  </button>
                ) : (
                  <button 
                    className="playbook-run-drawer__btn playbook-run-drawer__btn--primary"
                    onClick={handleNextStep}
                  >
                    Next
                  </button>
                )}
              </>
            )}

            {currentPlay.documents && currentPlay.documents.length > 0 && (
              <button 
                className="playbook-run-drawer__btn playbook-run-drawer__btn--ghost"
                onClick={handleRunAgainPlay}
              >
                Run Again (Create New)
              </button>
            )}
          </div>
        </div>

        {/* Close Confirmation Modal */}
        {showCloseConfirm && (
          <div className="playbook-run-drawer__modal-backdrop">
            <div className="playbook-run-drawer__modal">
              <h3>Save your progress?</h3>
              <p>You have work in progress. Would you like to save it before closing?</p>
              <div className="playbook-run-drawer__modal-actions">
                <button 
                  className="playbook-run-drawer__btn playbook-run-drawer__btn--primary"
                  onClick={handleSaveAndClose}
                >
                  Save & Close
                </button>
                <button 
                  className="playbook-run-drawer__btn playbook-run-drawer__btn--danger"
                  onClick={handleDiscardAndClose}
                >
                  Discard
                </button>
                <button 
                  className="playbook-run-drawer__btn playbook-run-drawer__btn--secondary"
                  onClick={() => setShowCloseConfirm(false)}
                >
                  Cancel
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

