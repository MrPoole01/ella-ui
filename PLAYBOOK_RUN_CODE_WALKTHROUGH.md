# Playbook Run - Code Walkthrough

## Complete Code Flow Explanation

This document walks through the exact code execution when a user clicks "Run Playbook" and the drawer opens.

## Step 1: User Clicks "Run Playbook" Button

**File:** `src/components/features/PlaybookPreviewDrawer.jsx` (Lines 438-444)

```javascript
<button
  className="playbook-preview-drawer__btn playbook-preview-drawer__btn--primary"
  title="Guide me step-by-step and chat per step."
  onClick={() => { 
    setRunMode('step-by-step');      // ← Store mode for later
    setIsInputStep(true);             // ← Show input form instead of preview
  }}
>
  Run Playbook
</button>
```

**What Happens:**
- `setRunMode('step-by-step')` → Saves "step-by-step" to component state
- `setIsInputStep(true)` → Triggers re-render to show input form instead of preview
- Component updates immediately, user sees the input form

**State Change in Component:**
```javascript
// Before click:
[isInputStep, setIsInputStep] = [false, function]
[runMode, setRunMode] = [undefined, function]

// After click:
[isInputStep, setIsInputStep] = [true, function]
[runMode, setRunMode] = ['step-by-step', function]
```

---

## Step 2: User Fills Form and Clicks "Next"

**File:** `src/components/features/PlaybookPreviewDrawer.jsx` (Lines 454-478)

```javascript
{isInputStep && (
  <div className="playbook-preview-drawer__actions">
    <button className="playbook-preview-drawer__btn playbook-preview-drawer__btn--ghost" 
      onClick={() => setIsInputStep(false)}>
      Cancel
    </button>
    
    <button
      className="playbook-preview-drawer__btn playbook-preview-drawer__btn--primary"
      aria-disabled={!isStartEnabled}
      onClick={() => {
        // VALIDATION STEP
        if (!validate()) {
          // Show errors, don't proceed
          console.log('Validation failed');
          return;
        }

        // COLLECT FORM DATA
        const context = {
          workspace,                    // { id, name }
          project,                      // { id, name, workspaceId }
          audience: allICPsSelected 
            ? { type: 'all' } 
            : { type: 'icps', icps: selectedICPs },
          specialInstructions,          // string
          fileIds: files
            .filter(f => f.status === 'completed')
            .map(f => f.id)             // [fileId, ...]
        };

        // LOG TELEMETRY
        logTelemetry('input_panel_submitted', { 
          mode: 'step_by_step',
          has_icps: !allICPsSelected,
          icp_count: selectedICPs.length,
          has_files: files.length > 0,
          file_count: files.filter(f => f.status === 'completed').length
        });

        // CALL PARENT CALLBACK
        try {
          onStart && onStart('step-by-step', context);
        } catch (e) {
          logTelemetry('input_panel_launch_failed', { 
            mode: runMode,
            error_code: 'launch_error'
          });
        }
      }}
    >
      Next
    </button>
  </div>
)}
```

**What Happens:**

1. **Validation (`validate()`)**
   - Checks if workspace is selected
   - Checks if project is selected
   - Checks if ICP(s) selected (if `showICPs={true}`)
   - Checks no files uploading/errored
   - Checks special instructions ≤ 2000 chars
   - If any fail, stops execution here

2. **Data Collection**
   - Gathers workspace (required)
   - Gathers project (required)
   - Gathers audience (ICPs or all)
   - Gathers special instructions (optional)
   - Gathers file IDs from completed uploads (optional)

3. **Logging**
   - Records telemetry event for analytics

4. **Callback Trigger**
   - Calls `onStart('step-by-step', context)`
   - This is a **prop function** passed from parent (Workspace.jsx)

**Data Example:**
```javascript
context = {
  workspace: {
    id: 'ws1',
    name: 'Marketing Team'
  },
  project: {
    id: 'proj1',
    name: 'Q4 Campaign',
    workspaceId: 'ws1'
  },
  audience: {
    type: 'icps',
    icps: [
      { id: 'icp1', name: 'Enterprise CMOs', workspaceId: 'ws1' },
      { id: 'icp2', name: 'SMB Marketing Managers', workspaceId: 'ws1' }
    ]
  },
  specialInstructions: 'Make it more concise and focused on Q4 goals.',
  fileIds: ['file-123', 'file-456']
}
```

---

## Step 3: Parent Component (Workspace.jsx) Receives Callback

**File:** `src/pages/Workspace.jsx` (Lines 1305-1312)

When PlaybookPreviewDrawer is rendered, it receives the callback:

```javascript
<PlaybookPreviewDrawer
  isOpen={isPlaybookPreviewOpen}
  onClose={() => { 
    setIsPlaybookPreviewOpen(false); 
    setPlaybookPreviewData(null); 
  }}
  workspaceName={typeof document !== 'undefined' 
    ? (document.querySelector('.header__workspace-text')?.textContent || 'Workspace') 
    : 'Workspace'}
  documentContext={playbookPreviewData?.documentContext || null}
  playbook={playbookPreviewData?.playbook || null}
  onStart={(mode, context) => handleStartFromPreview(mode, context)}
  // ↑ This function is called when "Next" button is clicked!
/>
```

**The onStart Callback:**
```javascript
onStart={(mode, context) => handleStartFromPreview(mode, context)}
```

This means when PlaybookPreviewDrawer calls:
```javascript
onStart && onStart('step-by-step', context);
```

It's actually calling:
```javascript
handleStartFromPreview('step-by-step', context);
```

---

## Step 4: handleStartFromPreview Function Executes

**File:** `src/pages/Workspace.jsx` (Lines 159-172)

```javascript
const handleStartFromPreview = (mode, context) => {
  // STEP 1: Close the preview drawer
  setIsPlaybookPreviewOpen(false);
  // State: isPlaybookPreviewOpen = false (triggers re-render)

  // STEP 2: Prepare data payload for run drawer
  const runPayload = {
    playbook: playbookPreviewData?.playbook,        // Playbook object
    inputPanelData: context                         // Form data from preview
  };

  // STEP 3: Route based on mode
  if (mode === 'auto-run') {
    // Auto-run mode: open PlaybookRunnerDrawer
    setPlaybookRunnerData(runPayload);
    setIsPlaybookRunnerDrawerOpen(true);
  } else {
    // Step-by-step mode (our case)
    setPlaybookRunData(runPayload);                 // ← Set data
    setIsPlaybookRunDrawerOpen(true);               // ← Open drawer
  }
};
```

**What Happens:**

1. **Close Preview Drawer**
   - `setIsPlaybookPreviewOpen(false)`
   - PlaybookPreviewDrawer re-renders with `isOpen={false}`
   - Drawer visibly disappears

2. **Prepare Payload**
   - Extracts playbook from component state
   - Includes form context from input panel
   - Creates `runPayload` object

3. **Route to Step-by-Step Mode**
   - Since `mode === 'step-by-step'`:
     - `setPlaybookRunData(runPayload)` → Stores data in Workspace state
     - `setIsPlaybookRunDrawerOpen(true)` → Opens run drawer

**State Changes in Workspace Component:**
```javascript
// Before:
[isPlaybookPreviewOpen, setIsPlaybookPreviewOpen] = [true, function]
[playbookRunData, setPlaybookRunData] = [null, function]
[isPlaybookRunDrawerOpen, setIsPlaybookRunDrawerOpen] = [false, function]

// After:
[isPlaybookPreviewOpen, setIsPlaybookPreviewOpen] = [false, function]
[playbookRunData, setPlaybookRunData] = [
  {
    playbook: {...},
    inputPanelData: {...}
  },
  function
]
[isPlaybookRunDrawerOpen, setIsPlaybookRunDrawerOpen] = [true, function]
```

---

## Step 5: PlaybookRunDrawer Renders with New Props

**File:** `src/pages/Workspace.jsx` (Lines 1314-1320)

```javascript
<PlaybookRunDrawer
  isOpen={isPlaybookRunDrawerOpen}           // Now: true
  onClose={handleClosePlaybookRunDrawer}
  playbook={playbookRunData?.playbook || null}         // Playbook object
  inputPanelData={playbookRunData?.inputPanelData || null}  // Form data
/>
```

**Props Passed to PlaybookRunDrawer:**
```javascript
{
  isOpen: true,
  onClose: function,
  playbook: {
    id: 1,
    title: 'Post-Event Networking Follow-Up Series',
    plays: [
      {
        id: 1,
        name: 'Voicemail Script',
        steps: [
          { id: 1, name: 'Gather Event Context', ... },
          { id: 2, name: 'Define Contact & Relationship', ... },
          { id: 3, name: 'Craft Script', ... }
        ]
      },
      {
        id: 2,
        name: 'Follow-Up Email',
        steps: [...]
      }
    ]
  },
  inputPanelData: {
    workspace: { id: 'ws1', name: 'Marketing Team' },
    project: { id: 'proj1', name: 'Q4 Campaign' },
    audience: { type: 'icps', icps: [...] },
    specialInstructions: '...',
    fileIds: [...]
  }
}
```

---

## Step 6: PlaybookRunDrawer Component Initialization

**File:** `src/components/features/PlaybookRunDrawer.jsx` (Lines 1-30, 574-612)

```javascript
const PlaybookRunDrawer = ({ isOpen, onClose, playbook, inputPanelData }) => {
  // Core state (initialized on component mount)
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepInputs, setStepInputs] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [stepOutputs, setStepOutputs] = useState({});
  const [playFiles, setPlayFiles] = useState({});
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Play card UI state
  const [expandedFilesCard, setExpandedFilesCard] = useState(null);
  const [showInfoPopover, setShowInfoPopover] = useState(null);

  // Milestone state
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(null);
  const [userProgress, setUserProgress] = useState({ 
    acknowledgedMilestones: [] 
  });

  // Effect: On component open, initialize chat
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

  // Use provided playbook or mock
  const currentPlaybook = playbook || mockPlaybook;
  const currentPlay = currentPlaybook.plays[currentPlayIndex];
  const currentStep = currentPlay?.steps[currentStepIndex];

  // ... rest of component
};

// Check if should render
if (!isOpen) return null;

// Render the drawer
return (
  <>
    <div className="playbook-run-drawer__backdrop" onClick={handleClose} />
    <div className="playbook-run-drawer playbook-run-drawer--open">
      {/* Header */}
      <div className="playbook-run-drawer__header">
        <div className="playbook-run-drawer__header-top">
          <h2 className="playbook-run-drawer__title">
            {currentPlaybook.title}
          </h2>
          <span className="playbook-run-drawer__mode-badge playbook-run-drawer__mode-badge--stepbystep">
            Step-by-Step
          </span>
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
            <span>
              Play {currentPlayIndex + 1} of {currentPlaybook.plays.length} · 
              Step {currentStepIndex + 1} of {currentPlay?.steps.length}
            </span>
            <span>{Math.round(progressPercent)}% Complete</span>
          </div>
          <div className="playbook-run-drawer__progress-bar">
            <div 
              className="playbook-run-drawer__progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Play Cards */}
        <div className="playbook-run-drawer__play-cards">
          {/* Renders all plays with play/replay buttons */}
        </div>
      </div>

      {/* Body: Split Pane */}
      <div className="playbook-run-drawer__body">
        {/* Left Pane: Document Viewer */}
        <div className="playbook-run-drawer__left-pane">
          {/* Shows step outputs */}
        </div>

        {/* Right Pane: Chat + Step Fields */}
        <div className="playbook-run-drawer__right-pane">
          {/* Step header + input fields + chat area */}
        </div>
      </div>

      {/* Footer: Navigation */}
      <div className="playbook-run-drawer__footer">
        {/* Previous/Next buttons */}
      </div>
    </div>
  </>
);
```

**What Happens at Render:**
1. `isOpen={true}` → Component doesn't return null, renders
2. `useEffect` with `[isOpen]` dependency fires
3. Ella's greeting is added to chat: "Welcome! I'm Ella, and I'll guide you through..."
4. Current play: Play 1 (Voicemail Script)
5. Current step: Step 1 (Gather Event Context)
6. Progress shows: "Play 1 of 2 · Step 1 of 3" and "0% Complete"
7. Form fields render for Event Name and Event Date

---

## Complete Code Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE EXECUTION FLOW                      │
└─────────────────────────────────────────────────────────────────┘

[1] User clicks "Run Playbook"
    └─ PlaybookPreviewDrawer.jsx, Line 441
       setRunMode('step-by-step')
       setIsInputStep(true)
       ✓ Input form appears

[2] User fills form, clicks "Next"
    └─ PlaybookPreviewDrawer.jsx, Line 470
       validate()                              ✓ or ✗
       onStart('step-by-step', context)

[3] Callback executes in Workspace
    └─ Workspace.jsx, Line 159
       handleStartFromPreview(mode='step-by-step', context)
       
       ✓ setIsPlaybookPreviewOpen(false)    → Preview hides
       ✓ setPlaybookRunData(runPayload)     → Data stored
       ✓ setIsPlaybookRunDrawerOpen(true)   → Drawer opens

[4] PlaybookRunDrawer receives new props
    └─ Workspace.jsx, Lines 1315-1320
       <PlaybookRunDrawer
         isOpen={true}
         playbook={...}
         inputPanelData={...}
       />

[5] PlaybookRunDrawer initializes
    └─ PlaybookRunDrawer.jsx, Lines 1-30
       useEffect fires (isOpen changed to true)
       
       ✓ currentPlayIndex = 0           → Play 1
       ✓ currentStepIndex = 0           → Step 1
       ✓ setChatMessages([...])         → Ella greeting
       ✓ Drawer fully rendered

[6] User sees PlaybookRunDrawer
    └─ Drawer displays:
       ✓ Header with playbook title
       ✓ Play cards
       ✓ Progress bar (0%)
       ✓ Left pane (empty - waiting for step output)
       ✓ Right pane (step fields + chat)
       ✓ Footer (navigation buttons)

[7] User fills first step fields
    └─ PlaybookRunDrawer.jsx, Line 204
       handleFieldChange(fieldId, value)

[8] User clicks "Run Step"
    └─ PlaybookRunDrawer.jsx, Line 949
       handleRunStep()
       
       ✓ API call (simulated 2.5s)
       ✓ Generate step output
       ✓ Create document file
       ✓ Update progress
       ✓ Mark step as completed
```

---

## Key State Snapshots

### Before "Run Playbook" Click
```javascript
// PlaybookPreviewDrawer state
isInputStep: false
runMode: undefined

// Workspace state
isPlaybookPreviewOpen: true
isPlaybookRunDrawerOpen: false
playbookRunData: null
```

### After "Run Playbook" Click
```javascript
// PlaybookPreviewDrawer state (local)
isInputStep: true          // ← Form now visible
runMode: 'step-by-step'

// Workspace state
isPlaybookPreviewOpen: true    // ← Still open (form is inside)
isPlaybookRunDrawerOpen: false
playbookRunData: null
```

### After "Next" Button Click (Before Callback)
```javascript
// PlaybookPreviewDrawer validates and calls onStart
// (no state change yet in preview)

// Workspace state (not yet updated)
isPlaybookPreviewOpen: true
isPlaybookRunDrawerOpen: false
playbookRunData: null
```

### After Callback Executes
```javascript
// Workspace state (updated!)
isPlaybookPreviewOpen: false    // ← Preview closes
isPlaybookRunDrawerOpen: true   // ← Run drawer opens
playbookRunData: {
  playbook: { ... },
  inputPanelData: { ... }
}

// PlaybookRunDrawer state (initialized)
currentPlayIndex: 0
currentStepIndex: 0
chatMessages: [{ sender: 'ella', text: 'Welcome!...' }]
```

---

## Error Scenarios

### Scenario 1: Validation Fails (Missing Workspace)
```javascript
// User clicks "Next" without selecting workspace
[PlaybookPreviewDrawer.jsx Line 459]
if (!validate()) {
  // validate() returns false because workspace is null
  setErrors({ workspace: 'Please select a workspace' })
  
  // STOPS HERE - onStart NOT called
  return;
}

// Result: PlaybookRunDrawer stays closed
```

### Scenario 2: Files Still Uploading
```javascript
// User clicks "Next" while files uploading
[PlaybookPreviewDrawer.jsx Line 104]
const isStartEnabled = useMemo(() => {
  const hasUploadingOrError = files.some(
    f => f.status === 'uploading' || f.status === 'error'
  );
  if (hasUploadingOrError) return false;  // ← Disables button
  return true;
});

// Result: "Next" button is disabled, can't click
```

### Scenario 3: onStart Not Passed from Parent
```javascript
// If parent forgot to pass onStart prop
[PlaybookPreviewDrawer.jsx Line 470]
onStart && onStart('step-by-step', context);
// ↑ onStart is undefined
// ↑ "&&" short-circuits, function not called

// Result: No error, but drawer doesn't open (silent fail)
// Solution: Check console for missing props warning in development
```

---

## Performance Notes

- **Button click to form**: ~50ms (React re-render)
- **Form validation**: ~10ms per field
- **Callback to drawer open**: ~100ms (state updates + re-render)
- **Total**: ~200ms from preview to runner visible
- **Memory**: Drawer component unmounts when `isOpen={false}`

---

## Testing

To test this flow manually:

```javascript
// 1. Add console logs to verify flow
// In PlaybookPreviewDrawer.jsx, Line 470:
console.log('🎬 onStart called:', 'step-by-step', context);

// 2. In Workspace.jsx, Line 159:
const handleStartFromPreview = (mode, context) => {
  console.log('✓ handleStartFromPreview called:', mode);
  // ... rest of function
};

// 3. In browser console, look for:
// 🎬 onStart called: step-by-step {...}
// ✓ handleStartFromPreview called: step-by-step

// 4. Verify PlaybookRunDrawer renders:
// Check React DevTools for PlaybookRunDrawer component with isOpen={true}
```
