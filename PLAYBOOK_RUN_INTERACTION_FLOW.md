# Playbook Run - Interaction Flow Diagram

## Visual Flow Sequence

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

STEP 1: User Views Playbook Preview
═══════════════════════════════════════════════════════════════════════════
    ┌──────────────────────────────────────────┐
    │      PlaybookPreviewDrawer               │
    │      (Preview Stage)                     │
    │                                          │
    │  Title: Post-Event Networking...         │
    │  Description: Follow-up Series           │
    │  Plays: 2                                │
    │  Est. Time: 6-12 min                     │
    │                                          │
    │  ┌────────────────────────────────────┐ │
    │  │ [Run Playbook]  [Auto-run]        │ │
    │  └────────────────────────────────────┘ │
    └──────────────────────────────────────────┘
                      │
                      │ Click "Run Playbook"
                      ▼

STEP 2: User Enters Input Details  
═══════════════════════════════════════════════════════════════════════════
    ┌──────────────────────────────────────────┐
    │      PlaybookPreviewDrawer               │
    │      (Input Panel Stage)                 │
    │                                          │
    │  Workspace:  [Select ▼] Marketing Team  │
    │  Project:    [Select ▼] Q4 Campaign     │
    │  ICPs:       ☑ All ICPs / ☐ Enterprise │
    │  Files:      [Upload area]              │
    │  Notes:      [Text area]                │
    │                                          │
    │  ┌────────────────────────────────────┐ │
    │  │ [Cancel]              [Next →]     │ │
    │  └────────────────────────────────────┘ │
    └──────────────────────────────────────────┘
                      │
                      │ Click "Next"
                      │ (after validation passes)
                      ▼

STEP 3: Form Data Submitted via Callback
═══════════════════════════════════════════════════════════════════════════

    PlaybookPreviewDrawer.jsx
    ┌─────────────────────────────────────────────────────────────┐
    │ onClick={() => {                                            │
    │   if (!validate()) return;  // Must pass validation        │
    │   const context = {                                        │
    │     workspace,     // User selected workspace              │
    │     project,       // User selected project                │
    │     audience,      // User selected ICPs                   │
    │     files,         // User uploaded files                  │
    │     ...            // Other form data                      │
    │   };                                                       │
    │   onStart('step-by-step', context);  // ← TRIGGER!       │
    │ }}                                                         │
    └─────────────────────────────────────────────────────────────┘
                      │
                      │ onStart callback fires
                      ▼

STEP 4: Workspace.jsx Processes Callback
═══════════════════════════════════════════════════════════════════════════

    Workspace.jsx
    ┌─────────────────────────────────────────────────────────────┐
    │ const handleStartFromPreview = (mode, context) => {         │
    │   setIsPlaybookPreviewOpen(false);    // Close preview      │
    │   const runPayload = {                                     │
    │     playbook: playbookPreviewData.playbook,               │
    │     inputPanelData: context                               │
    │   };                                                       │
    │   if (mode === 'step-by-step') {                          │
    │     setPlaybookRunData(runPayload);                        │
    │     setIsPlaybookRunDrawerOpen(true);  // ← OPEN DRAWER   │
    │   }                                                        │
    │ }                                                          │
    └─────────────────────────────────────────────────────────────┘
                      │
                      │ State updated:
                      │ isPlaybookPreviewOpen = false
                      │ isPlaybookRunDrawerOpen = true
                      ▼

STEP 5: PlaybookRunDrawer Opens with Context
═══════════════════════════════════════════════════════════════════════════

    ┌──────────────────────────────────────────────────────────────┐
    │                  PlaybookRunDrawer                           │
    │                  (Step-by-Step Mode)                         │
    │                                                              │
    │  ┌─────────────────────────────────────────────────────────┐│
    │  │ Post-Event Networking Follow-Up Series [Step-by-Step] ×││
    │  │ Play 1 of 2 · Step 1 of 3              0% Complete      ││
    │  │ ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
    │  │                                                          ││
    │  │ ┌─ Play 1: Voicemail Script ────────────────────────┐  ││
    │  │ │ [►] [📄] [ℹ]                                     │  ││
    │  │ └────────────────────────────────────────────────────┘  ││
    │  │ ┌─ Play 2: Follow-Up Email ─────────────────────────┐  ││
    │  │ │ [►] [📄] [ℹ]                                     │  ││
    │  │ └────────────────────────────────────────────────────┘  ││
    │  └─────────────────────────────────────────────────────────┘│
    │                                                              │
    │  ┌─ Left Pane ──────┐  ┌─ Right Pane ────────────────────┐ │
    │  │ (Document)       │  │ Step 1 of 3: Gather Context   │ │
    │  │                  │  │ Before we craft your voicemail │ │
    │  │ 📄 icon          │  │                                │ │
    │  │ Working document │  │ Event Name *  [____________]  │ │
    │  │ will appear here │  │ Event Date *  [____________]  │ │
    │  │                  │  │                                │ │
    │  │                  │  │ E: Welcome! I'm Ella...        │ │
    │  │                  │  │ [Chat input area...]           │ │
    │  │                  │  │                                │ │
    │  │                  │  │ ← Previous      [Run Step]     │ │
    │  └──────────────────┘  └────────────────────────────────┘ │
    │                                                              │
    └──────────────────────────────────────────────────────────────┘
                      │
                      │ User can now:
                      │ • Fill step fields
                      │ • Chat with Ella
                      │ • Run steps
                      │ • Navigate between plays
                      ▼

COMPLETE! PlaybookRunDrawer is now active and running.
```

## State Transitions

```
                    WORKSPACE STATE
                    ═══════════════════════════════════════

isPlaybookPreviewOpen = true       →  false
isPlaybookRunDrawerOpen = false    →  true
playbookRunData = null             →  { playbook, inputPanelData }

                    PLAYBOOK PREVIEW DRAWER STATE
                    ═══════════════════════════════════════

isInputStep = false    →  true  (show form)
isInputStep = true     →  false (show preview)
runMode = undefined    →  'step-by-step' or 'auto-run'

                    PLAYBOOK RUN DRAWER STATE
                    ═══════════════════════════════════════

isOpen = false         →  true
playbook = null        →  { id, title, plays: [...] }
inputPanelData = null  →  { workspace, project, ... }
currentPlayIndex = 0
currentStepIndex = 0
```

## Data Transformation During Flow

```
User Input (PlaybookPreviewDrawer)
│
├── workspace selection
│   │ { id: 'ws1', name: 'Marketing Team' }
│   │
├── project selection  
│   │ { id: 'proj1', name: 'Q4 Campaign', workspaceId: 'ws1' }
│   │
├── ICP selection
│   │ [{ id: 'icp1', name: 'Enterprise CMOs' }, ...]
│   │
├── files upload (optional)
│   │ [{ id: 'file-1', name: 'doc.pdf', status: 'completed' }, ...]
│   │
└── special instructions (optional)
    │ 'Make it more concise...'
    │
    ▼
context = {
  workspace: {...},
  project: {...},
  audience: { type: 'icps', icps: [...] },
  fileIds: [...],
  specialInstructions: '...'
}
    │
    ├─ Passed to: onStart('step-by-step', context)
    │
    ├─ Received by: handleStartFromPreview(mode, context)
    │
    └─ Wrapped as: runPayload = {
         playbook: {...},
         inputPanelData: context
       }
           │
           └─ Passed to: <PlaybookRunDrawer 
                           playbook={...}
                           inputPanelData={...}
                         />
```

## Key Integration Points

```
FILE: src/components/features/PlaybookPreviewDrawer.jsx
─────────────────────────────────────────────────────────
Line 438-444:  "Run Playbook" button with onClick handler
Line 441:      setIsInputStep(true) - shows input form
Line 470:      onStart() callback - triggers state change in parent
Line 195-211:  validate() function - form validation logic

FILE: src/pages/Workspace.jsx
──────────────────────────────────
Line 111-114:  State declarations for playbook drawers
Line 159-172:  handleStartFromPreview() handler function
Line 1305-1312: PlaybookPreviewDrawer component render
Line 1314-1320: PlaybookRunDrawer component render
Line 1311:     onStart={(mode, context) => handleStartFromPreview(mode, context)}

FILE: src/components/features/PlaybookRunDrawer.jsx
────────────────────────────────────────────────────
Line 8:        Component receives { isOpen, onClose, playbook, inputPanelData }
Line 122:      Uses provided playbook or falls back to mock data
```

## Error Handling

```
Form Validation Failures (Validation prevents submission)
──────────────────────────────────────────────────────────
✗ Workspace not selected
  → Error: "Please select a workspace"
  → "Next" button disabled

✗ Project not selected  
  → Error: "Please select or create a project"
  → "Next" button disabled

✗ No ICPs selected
  → Error: "Please select at least one ICP or choose All ICPs"
  → "Next" button disabled

✗ Files uploading/errored
  → Error: "Please wait for files to finish or remove failed files"
  → "Next" button disabled

✗ Special instructions too long
  → Error: "Too long (max 2000 characters)"
  → "Next" button disabled

If validate() returns false:
  onStart() is NOT called
  PlaybookRunDrawer stays closed
```

## Browser DevTools Debugging

```javascript
// Check state in React DevTools
$r.props.isOpen                    // Is drawer open?
$r.state                           // Current component state
$r.props.playbook                  // Playbook data
$r.props.inputPanelData            // Input form data

// Check if callback fires
// Add to PlaybookPreviewDrawer.jsx before onStart() call:
console.log('onStart called with:', mode, context);

// Check parent state
// Search for Workspace component in React DevTools
// Look for:
// - isPlaybookRunDrawerOpen
// - isPlaybookPreviewOpen  
// - playbookRunData

// Check if handleStartFromPreview fires
// Add to Workspace.jsx:
const handleStartFromPreview = (mode, context) => {
  console.log('🎬 handleStartFromPreview called:', { mode, context });
  // ... rest of function
};

// Network inspection (if using real API)
// Look for XHR/fetch calls to playbook endpoints
// Verify response includes: { playbook, inputPanelData }
```

## Testing Checklist

```
✓ Can open playbook preview from template
✓ "Run Playbook" button exists and is clickable
✓ Clicking "Run Playbook" shows input form
✓ Workspace dropdown populated with options
✓ Project dropdown updates when workspace changes
✓ ICP selection works (individual or "All ICPs")
✓ File upload accepts valid file types
✓ "Next" button disabled until form valid
✓ Clicking "Next" closes preview drawer
✓ PlaybookRunDrawer opens immediately after
✓ Run drawer receives correct playbook data
✓ Run drawer receives correct input panel data
✓ Ella greeting message appears in chat
✓ Play cards visible in header
✓ Progress bar initialized at 0%
✓ Can fill step fields
✓ Can run first step
```

## Performance Metrics

- Button click to form display: < 100ms
- Form validation per field: < 50ms
- Form submission to drawer open: < 200ms
- Total time from preview to running: < 500ms
