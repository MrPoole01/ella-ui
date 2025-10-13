import React, { useState } from 'react';
import { 
  PlaybookInputPanel, 
  PlaybookRunDrawer, 
  PlaybookRunnerDrawer 
} from '../components/features';

/**
 * Demo page showing the complete Playbook run workflow
 * 
 * Flow:
 * 1. Click "Run Playbook" → Opens Input Panel
 * 2. Fill in context (workspace, project, ICPs, etc.)
 * 3. Choose mode:
 *    - "Play with Ella" → Step-by-Step runner
 *    - "Auto-run Play" → Variable-based runner
 */
const PlaybookDemo = () => {
  const [showInputPanel, setShowInputPanel] = useState(false);
  const [showStepRunner, setShowStepRunner] = useState(false);
  const [showVariableRunner, setShowVariableRunner] = useState(false);
  const [runContext, setRunContext] = useState(null);
  
  // Mock playbook data
  const playbook = {
    id: 1,
    title: 'Post-Event Networking Follow-Up Series',
    description: 'A comprehensive playbook for following up with contacts after networking events',
    plays: [
      {
        id: 1,
        name: 'Voicemail Script',
        description: 'Create personalized voicemail scripts',
        steps: [
          {
            id: 1,
            name: 'Gather Event Context',
            description: 'Before we craft your voicemail, I need to understand the event context.',
            fields: [
              { id: 'event_name', label: 'Event Name', type: 'text', required: true },
              { id: 'event_date', label: 'Event Date', type: 'date', required: true }
            ]
          },
          {
            id: 2,
            name: 'Define Message Tone',
            description: 'Let\'s determine the right tone for your voicemail.',
            fields: [
              { 
                id: 'relationship', 
                label: 'Relationship Level', 
                type: 'select', 
                required: true, 
                options: ['First meeting', 'Brief conversation', 'Extended discussion'] 
              }
            ]
          }
        ],
        variables: [
          { id: 'event_name', label: 'Event Name', type: 'text', required: true },
          { id: 'event_date', label: 'Event Date', type: 'text', required: true },
          { id: 'relationship', label: 'Relationship Level', type: 'select', required: true, 
            options: ['First meeting', 'Brief conversation', 'Extended discussion'] }
        ]
      },
      {
        id: 2,
        name: 'Follow-Up Email',
        description: 'Draft personalized follow-up emails',
        steps: [
          {
            id: 1,
            name: 'Email Context',
            description: 'Let\'s gather the information needed for your email.',
            fields: [
              { id: 'topics', label: 'Key Topics Discussed', type: 'textarea', required: true }
            ]
          }
        ],
        variables: [
          { id: 'topics', label: 'Key Topics Discussed', type: 'textarea', required: true },
          { id: 'next_steps', label: 'Proposed Next Steps', type: 'textarea', required: false }
        ]
      }
    ]
  };

  // Current workspace context (would come from app state)
  const currentWorkspace = {
    id: 'ws1',
    name: 'Marketing Team'
  };

  const handleRunClick = () => {
    setShowInputPanel(true);
  };

  const handleInputPanelSubmit = (mode, context) => {
    console.log('🚀 Run submitted:', { mode, context });
    
    // Save context for runner
    setRunContext(context);
    
    // Close input panel
    setShowInputPanel(false);
    
    // Open appropriate runner based on mode
    if (mode === 'step-by-step') {
      console.log('📝 Opening Step-by-Step runner...');
      setShowStepRunner(true);
    } else if (mode === 'auto-run') {
      console.log('⚡ Opening Auto-run runner...');
      setShowVariableRunner(true);
    }
  };

  const handleBackToPreview = () => {
    console.log('← Back to preview');
    setShowInputPanel(false);
  };

  const handleRunnerClose = () => {
    setShowStepRunner(false);
    setShowVariableRunner(false);
    setRunContext(null);
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Inter, sans-serif'
    }}>
      <header style={{
        marginBottom: '40px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '24px'
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          Playbook Input Panel Demo
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          marginBottom: '24px'
        }}>
          Test the complete playbook run workflow with Input Panel + Runners
        </p>
      </header>

      {/* Demo Instructions */}
      <section style={{
        background: '#f3f4f6',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '32px'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          How to Test
        </h2>
        <ol style={{ 
          fontSize: '14px', 
          color: '#4b5563',
          lineHeight: '1.8',
          paddingLeft: '24px'
        }}>
          <li>Click "Run Playbook" below to open the Input Panel</li>
          <li>Select a workspace (defaults to current)</li>
          <li>Select or create a project</li>
          <li>Choose ICPs or select "All ICPs"</li>
          <li>Optionally add special instructions and files</li>
          <li>Choose your run mode:
            <ul style={{ marginTop: '8px', paddingLeft: '24px' }}>
              <li><strong>Play with Ella</strong> - Opens step-by-step runner with chat interface</li>
              <li><strong>Auto-run Play</strong> - Opens variable-based runner with batch generation</li>
            </ul>
          </li>
        </ol>
      </section>

      {/* Playbook Preview Card */}
      <section style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '32px',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: '#fef3c7',
            color: '#92400e',
            fontSize: '12px',
            fontWeight: '600',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '12px'
          }}>
            Playbook Preview
          </span>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px'
          }}>
            {playbook.title}
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            lineHeight: '1.6'
          }}>
            {playbook.description}
          </p>
        </div>

        {/* Plays List */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ 
            fontSize: '14px', 
            fontWeight: '600',
            color: '#4b5563',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Plays in this Playbook
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {playbook.plays.map((play, index) => (
              <div 
                key={play.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              >
                <span style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#e0e7ff',
                  color: '#4338ca',
                  fontSize: '12px',
                  fontWeight: '600',
                  borderRadius: '50%',
                  flexShrink: 0
                }}>
                  {index + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '2px'
                  }}>
                    {play.name}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6b7280'
                  }}>
                    {play.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Run Button */}
        <button
          onClick={handleRunClick}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: '#e6a429',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(230, 164, 41, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#d49323';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 8px rgba(230, 164, 41, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#e6a429';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(230, 164, 41, 0.2)';
          }}
        >
          Run Playbook
        </button>
      </section>

      {/* Status Display */}
      {runContext && (
        <section style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ 
            fontSize: '16px', 
            fontWeight: '600',
            color: '#15803d',
            marginBottom: '12px'
          }}>
            ✅ Run Context Captured
          </h3>
          <pre style={{
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '12px',
            overflow: 'auto',
            color: '#374151'
          }}>
            {JSON.stringify(runContext, null, 2)}
          </pre>
        </section>
      )}

      {/* Input Panel */}
      <PlaybookInputPanel
        isOpen={showInputPanel}
        onClose={() => setShowInputPanel(false)}
        onBackToPreview={handleBackToPreview}
        playbook={playbook}
        workspace={currentWorkspace}
        onSubmit={handleInputPanelSubmit}
        showICPs={true}
      />

      {/* Step-by-Step Runner */}
      <PlaybookRunDrawer
        isOpen={showStepRunner}
        onClose={handleRunnerClose}
        playbook={playbook}
        inputPanelData={runContext}
      />

      {/* Variable-based Runner */}
      <PlaybookRunnerDrawer
        isOpen={showVariableRunner}
        onClose={handleRunnerClose}
        playbook={playbook}
        inputPanelData={runContext}
      />
    </div>
  );
};

export default PlaybookDemo;

