# Playbook Run Flow - Complete Integration Guide

## Overview

The **"Run Playbook" button** in the **PlaybookPreviewDrawer** is fully integrated with the **PlaybookRunDrawer**. When clicked, it initiates a multi-step flow that ultimately opens the PlaybookRunDrawer with all necessary data.

## Architecture Flow

```
PlaybookPreviewDrawer (Preview Stage)
    ↓
"Run Playbook" button clicked
    ↓
PlaybookPreviewDrawer (Input Panel Stage)
    ↓
User fills: Workspace, Project, ICPs, Files
    ↓
"Next" button clicked
    ↓
onStart() callback triggered
    ↓
handleStartFromPreview() in Workspace.jsx
    ↓
PlaybookRunDrawer opens
```

## Component Hierarchy

```
Workspace.jsx
├── PlaybookPreviewDrawer
│   ├── Props:
│   │   ├── isOpen (boolean)
│   │   ├── onClose (function)
│   │   ├── playbook (object)
│   │   ├── documentContext (object)
│   │   ├── workspaceName (string)
│   │   └── onStart (function) ← KEY CALLBACK
│   │
│   └── Flow:
│       1. Preview stage shows playbook details
│       2. "Run Playbook" button → sets isInputStep = true
│       3. Input panel shows form fields
│       4. "Next" button → calls onStart('step-by-step', context)
│
└── PlaybookRunDrawer
    ├── Props:
    │   ├── isOpen (boolean)
    │   ├── onClose (function)
    │   ├── playbook (object)
    │   └── inputPanelData (object)
    │
    └── Features:
        ├── Play cards navigation
        ├── Step-by-step guidance
        ├── Chat interface
        └── Document viewer
```

## Key Code Connections

### 1. PlaybookPreviewDrawer Button Click Handler

**File:** `src/components/features/PlaybookPreviewDrawer.jsx` (Line 438-444)

```javascript
<button
  className="playbook-preview-drawer__btn playbook-preview-drawer__btn--primary"
  title="Guide me step-by-step and chat per step."
  onClick={() => { 
    setRunMode('step-by-step'); 
    setIsInputStep(true);  // Shows input form
  }}
>
  Run Playbook
</button>
```

### 2. Input Form Submission

**File:** `src/components/features/PlaybookPreviewDrawer.jsx` (Line 456-477)

```javascript
<button
  className="playbook-preview-drawer__btn playbook-preview-drawer__btn--primary"
  aria-disabled={!isStartEnabled}
  onClick={() => {
    if (!validate()) return;
    const context = {
      workspace,
      project,
      audience: allICPsSelected ? { type: 'all' } : { type: 'icps', icps: selectedICPs },
      specialInstructions,
      fileIds: files.filter(f => f.status === 'completed').map(f => f.id)
    };
    // Trigger the callback!
    onStart && onStart('step-by-step', context);
  }}
>
  Next
</button>
```

### 3. Workspace.jsx Callback Handler

**File:** `src/pages/Workspace.jsx` (Line 159-172)

```javascript
const handleStartFromPreview = (mode, context) => {
  setIsPlaybookPreviewOpen(false);  // Close preview drawer
  const runPayload = {
    playbook: playbookPreviewData?.playbook,
    inputPanelData: context
  };
  if (mode === 'auto-run') {
    setPlaybookRunnerData(runPayload);
    setIsPlaybookRunnerDrawerOpen(true);
  } else {
    // For 'step-by-step' mode
    setPlaybookRunData(runPayload);
    setIsPlaybookRunDrawerOpen(true);  // ← Opens PlaybookRunDrawer
  }
};
```

### 4. Props Connection

**File:** `src/pages/Workspace.jsx` (Line 1304-1320)

```javascript
{/* Playbook Preview Drawer */}
<PlaybookPreviewDrawer
  isOpen={isPlaybookPreviewOpen}
  onClose={() => { 
    setIsPlaybookPreviewOpen(false); 
    setPlaybookPreviewData(null); 
  }}
  workspaceName={...}
  documentContext={playbookPreviewData?.documentContext || null}
  playbook={playbookPreviewData?.playbook || null}
  onStart={(mode, context) => handleStartFromPreview(mode, context)}
/>

{/* Playbook Run Drawer */}
<PlaybookRunDrawer
  isOpen={isPlaybookRunDrawerOpen}
  onClose={handleClosePlaybookRunDrawer}
  playbook={playbookRunData?.playbook || null}
  inputPanelData={playbookRunData?.inputPanelData || null}
/>
```

## Data Flow Example

### When "Run Playbook" → "Next" is clicked:

1. **PlaybookPreviewDrawer** collects:
   ```javascript
   {
     workspace: { id: 'ws1', name: 'Marketing Team' },
     project: { id: 'proj1', name: 'Q4 Campaign', workspaceId: 'ws1' },
     audience: { type: 'icps', icps: [{ id: 'icp1', name: 'Enterprise CMOs' }] },
     specialInstructions: 'Make it concise...',
     fileIds: ['file-123', 'file-456']
   }
   ```

2. **Calls:** `onStart('step-by-step', context)`

3. **Workspace.jsx receives:**
   - `mode = 'step-by-step'`
   - `context = { ...above data }`

4. **Updates state:**
   ```javascript
   setPlaybookRunData({
     playbook: { ...playbookData },
     inputPanelData: context
   })
   setIsPlaybookRunDrawerOpen(true)
   ```

5. **PlaybookRunDrawer opens** with:
   - `isOpen={true}`
   - `playbook={playbookRunData.playbook}`
   - `inputPanelData={playbookRunData.inputPanelData}`

## Modes Supported

### 1. Step-by-Step Mode (Default)
- **Button:** "Run Playbook"
- **Flow:** Preview → Input Form → PlaybookRunDrawer (Step-by-Step)
- **Opens:** PlaybookRunDrawer component
- **Experience:** User goes through each play/step with Ella

### 2. Auto-Run Mode
- **Button:** "Auto-run Playbook"  
- **Flow:** Preview → Input Form → PlaybookRunnerDrawer (Auto-Run)
- **Opens:** PlaybookRunnerDrawer component
- **Experience:** User fills variables once, Ella generates all outputs automatically

## Testing the Flow

### To test the complete flow:

1. **Open a playbook preview** (via template or create drawer)
2. **Click "Run Playbook"** button
3. **Verify:**
   - PlaybookPreviewDrawer shows input form
   - Form fields are visible (Workspace, Project, ICPs, etc.)
4. **Fill the form:**
   - Select a workspace
   - Select or create a project
   - Select ICPs or choose "All ICPs"
5. **Click "Next"**
6. **Verify:**
   - PlaybookPreviewDrawer closes
   - PlaybookRunDrawer opens with play cards
   - Chat area shows greeting from Ella
   - Progress bar shows 0% complete

## Troubleshooting

### Issue: PlaybookRunDrawer doesn't open

**Check:**
1. Verify `isPlaybookRunDrawerOpen` state is true in browser DevTools
2. Verify `onStart` callback is being called:
   ```javascript
   // Add to PlaybookPreviewDrawer.jsx before onStart() call
   console.log('onStart called with:', mode, context);
   ```
3. Check that `handleStartFromPreview` is receiving the callback:
   ```javascript
   // Add to Workspace.jsx
   const handleStartFromPreview = (mode, context) => {
     console.log('handleStartFromPreview called:', mode, context);
     // ... rest of function
   };
   ```

### Issue: Input form shows validation errors

**Check:**
1. Workspace is required (select one from dropdown)
2. Project is required (select or create one)
3. At least one ICP must be selected (or check "All ICPs")
4. All files must finish uploading (no error status)
5. Special instructions must be ≤ 2000 characters

### Issue: "Next" button is disabled

**Reasons:**
- Missing workspace or project
- No ICPs selected (if `showICPs={true}`)
- Files still uploading
- Files with errors
- Special instructions too long

## CSS Classes Reference

### PlaybookPreviewDrawer Button
```css
.playbook-preview-drawer__btn--primary  /* "Run Playbook" button */
.playbook-preview-drawer__btn--secondary /* "Auto-run Playbook" button */
.playbook-preview-drawer__actions        /* Button container */
```

### PlaybookRunDrawer Classes
```css
.playbook-run-drawer--open              /* Open state */
.playbook-run-drawer__header             /* Header section */
.playbook-run-drawer__play-cards         /* Play cards */
.playbook-run-drawer__chat-area          /* Chat interface */
.playbook-run-drawer__step-fields        /* Input fields */
```

## Performance Notes

- Input form validation runs on each field change
- Playbook data is memoized in PlaybookPreviewDrawer
- Chat auto-scrolls when new messages arrive
- File upload simulation uses setTimeout

## Related Files

- `src/components/features/PlaybookPreviewDrawer.jsx` - Preview & input form
- `src/components/features/PlaybookRunDrawer.jsx` - Step-by-step runner
- `src/components/features/PlaybookRunnerDrawer.jsx` - Auto-run runner
- `src/pages/Workspace.jsx` - State management & orchestration
- `src/styles/PlaybookPreviewDrawer.scss` - Styles for preview
- `src/styles/PlaybookRunDrawer.scss` - Styles for runner

## Version History

- **v1.0** - Initial step-by-step runner integration
- **Current** - "Run Playbook" button fully integrated with PlaybookRunDrawer
