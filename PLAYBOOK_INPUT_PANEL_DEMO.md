# Playbook Input Panel Implementation Guide

This document describes the **Playbook Input Panel** component and how to integrate it into the Playbook run workflow.

## Overview

The Playbook Input Panel is a reusable component that collects the minimum required information before starting a Playbook run. It provides two run modes:

1. **Play with Ella** → Opens the Step-by-Step runner (PlaybookRunDrawer)
2. **Auto-run Play** → Opens the Variable-based runner (PlaybookRunnerDrawer)

## Components Created

### 1. PlaybookInputPanel.jsx
**Location:** `/src/components/features/PlaybookInputPanel.jsx`

The main input panel component that gathers context before running a playbook.

**Props:**
- `isOpen` (boolean): Controls panel visibility
- `onClose` (function): Callback when panel is closed
- `onBackToPreview` (function): Callback to return to preview
- `playbook` (object): The playbook being run
- `workspace` (object): Initial workspace context (optional)
- `onSubmit` (function): Callback when user submits (mode, context)
- `showICPs` (boolean): Whether to show ICP selector (default: true)

**Features:**
- Workspace selection with auto-default
- Project selection with inline "Create New Project" 
- ICP multi-select with "All ICPs" option (mutually exclusive)
- Special instructions textarea (0-2000 chars with counter)
- File upload (drag & drop + picker) with validation
- Real-time validation with inline errors
- Full keyboard accessibility
- Telemetry tracking

### 2. PlaybookRunnerDrawer.jsx
**Location:** `/src/components/features/PlaybookRunnerDrawer.jsx`

Variable-based (Auto-run) runner that collects all variables upfront, then auto-generates each Play.

**Props:**
- `isOpen` (boolean): Controls drawer visibility
- `onClose` (function): Callback when drawer is closed
- `playbook` (object): The playbook to run
- `inputPanelData` (object): Context from the Input Panel

**Features:**
- Consolidated variable collection per Play
- Auto-generation with progress tracking
- Play navigation with state preservation
- Regeneration capability
- Close confirmation when work is in progress

### 3. PlaybookRunDrawer.jsx (Existing - Step-by-Step)
**Location:** `/src/components/features/PlaybookRunDrawer.jsx`

Existing Step-by-Step runner that guides users through each step with chat interface.

## Integration Flow

### Complete Workflow

```
Playbook Preview
      ↓ (Click "Run")
Input Panel (PlaybookInputPanel)
      ↓
  [User chooses mode]
      ↓
┌─────────────────┬──────────────────┐
│   Play with     │    Auto-run      │
│     Ella        │      Play        │
└─────────────────┴──────────────────┘
      ↓                    ↓
PlaybookRunDrawer    PlaybookRunnerDrawer
(Step-by-Step)       (Variable-based)
```

### Implementation Example

```jsx
import React, { useState } from 'react';
import { 
  PlaybookInputPanel, 
  PlaybookRunDrawer, 
  PlaybookRunnerDrawer 
} from './components/features';

function PlaybookPreviewDrawer() {
  const [showInputPanel, setShowInputPanel] = useState(false);
  const [showStepRunner, setShowStepRunner] = useState(false);
  const [showVariableRunner, setShowVariableRunner] = useState(false);
  const [runContext, setRunContext] = useState(null);
  
  const playbook = {
    id: 1,
    title: 'Post-Event Networking Follow-Up Series',
    // ... playbook data
  };
  
  const workspace = {
    id: 'ws1',
    name: 'Marketing Team'
  };

  const handleRunClick = () => {
    // Close preview and open input panel
    setShowInputPanel(true);
  };

  const handleInputPanelSubmit = (mode, context) => {
    console.log('Run mode:', mode);
    console.log('Context:', context);
    
    // Save context for runner
    setRunContext(context);
    
    // Close input panel
    setShowInputPanel(false);
    
    // Open appropriate runner
    if (mode === 'step-by-step') {
      setShowStepRunner(true);
    } else if (mode === 'auto-run') {
      setShowVariableRunner(true);
    }
  };

  const handleBackToPreview = () => {
    setShowInputPanel(false);
    // Show preview drawer again
  };

  return (
    <>
      {/* Playbook Preview Drawer */}
      <div className="preview-drawer">
        {/* ... preview content ... */}
        <button onClick={handleRunClick}>
          Run Playbook
        </button>
      </div>

      {/* Input Panel */}
      <PlaybookInputPanel
        isOpen={showInputPanel}
        onClose={() => setShowInputPanel(false)}
        onBackToPreview={handleBackToPreview}
        playbook={playbook}
        workspace={workspace}
        onSubmit={handleInputPanelSubmit}
        showICPs={true}
      />

      {/* Step-by-Step Runner */}
      <PlaybookRunDrawer
        isOpen={showStepRunner}
        onClose={() => setShowStepRunner(false)}
        playbook={playbook}
        inputPanelData={runContext}
      />

      {/* Variable-based Runner */}
      <PlaybookRunnerDrawer
        isOpen={showVariableRunner}
        onClose={() => setShowVariableRunner(false)}
        playbook={playbook}
        inputPanelData={runContext}
      />
    </>
  );
}

export default PlaybookPreviewDrawer;
```

## Data Structures

### Context Object (passed to runners)

```javascript
{
  workspace: {
    id: 'ws1',
    name: 'Marketing Team'
  },
  project: {
    id: 'proj1',
    name: 'Q4 Campaign',
    description: 'Marketing campaign'
  },
  audience: {
    type: 'icps',  // or 'all'
    icps: [
      { id: 'icp1', name: 'Enterprise CMOs' },
      { id: 'icp2', name: 'SMB Marketing Managers' }
    ]
  },
  specialInstructions: 'Focus on enterprise clients with urgent needs...',
  fileIds: [12345, 67890]  // IDs of uploaded files
}
```

### Playbook Object

```javascript
{
  id: 1,
  title: 'Post-Event Networking Follow-Up Series',
  description: 'A comprehensive playbook for...',
  plays: [
    {
      id: 1,
      name: 'Voicemail Script',
      // For step-by-step:
      steps: [
        {
          id: 1,
          name: 'Gather Context',
          description: 'Let\'s gather the necessary information...',
          fields: [
            { 
              id: 'event_name', 
              label: 'Event Name', 
              type: 'text', 
              required: true 
            }
          ]
        }
      ],
      // For variable-based:
      variables: [
        { 
          id: 'event_name', 
          label: 'Event Name', 
          type: 'text', 
          required: true 
        }
      ]
    }
  ]
}
```

## Validation Rules

### Input Panel Validation

1. **Workspace**: Required
2. **Project**: Required (can be created inline)
3. **ICPs** (if showICPs=true):
   - Must have ≥1 ICP selected OR "All ICPs" checked
   - "All ICPs" and individual ICPs are mutually exclusive
4. **Special Instructions**: Optional, max 2000 characters
5. **Files**: 
   - Optional
   - Accepted types: PDF, DOCX, PPTX, XLSX, TXT, PNG, JPG
   - Max size: 50MB per file
   - All files must be uploaded (no pending/error states)

### Enabling Submit Buttons

Both "Play with Ella" and "Auto-run Play" buttons share the same validation:
- Disabled until all required fields are valid
- Clicking a disabled button focuses first invalid field
- Shows inline error messages

## Accessibility Features

### Keyboard Navigation
- Full Tab order through all controls
- Enter/Space to activate buttons
- Escape to close panel (with confirmation if needed)
- Sticky footer reachable via Tab

### ARIA Attributes
- `aria-disabled` on buttons when validation fails
- `aria-describedby` linking errors to fields
- `aria-expanded` on dropdowns
- `aria-label` on icon-only buttons

### Screen Reader Support
- Announces validation failures with field names
- Announces success: "Opening Step-by-Step runner" or "Opening Auto-run runner"
- `.sr-only` class for visually hidden but screen-reader-accessible content

## Telemetry Events

The Input Panel logs the following events:

```javascript
// Panel opened
{
  event: 'input_panel_opened',
  playbookName: 'Playbook Title',
  hasWorkspace: true
}

// Field changed (debounced)
{
  event: 'input_panel_field_changed',
  field: 'workspace' | 'project' | 'special_instructions'
}

// Validation failed
{
  event: 'input_panel_validation_failed',
  first_error_field: 'workspace' | 'project' | 'icps' | 'files'
}

// Successfully submitted
{
  event: 'input_panel_submitted',
  mode: 'step_by_step' | 'auto_run',
  has_icps: boolean,
  icp_count: number,
  has_files: boolean,
  file_count: number
}

// Launch failed
{
  event: 'input_panel_launch_failed',
  mode: 'step_by_step' | 'auto_run',
  error_code: string
}
```

## Edge Cases & Empty States

### No Projects
- Shows "Create New Project" as primary action
- Dropdown shows create option first

### No ICPs
- Shows helper text: "No ICPs found — choose All ICPs or add later in the run"
- "All ICPs" option still available

### Workspace Change
- Clears Project and ICPs selections
- Shows message requiring re-selection

### File Upload Failures
- Shows inline error per file
- Provides "Retry" action
- Failed files excluded from context until resolved

### Pending Uploads
- Submit buttons disabled
- Shows progress bars
- Validation error if user tries to submit

## Styling

The components use the existing theme system with CSS variables:

```scss
@import 'themes/variables';

// Uses theme colors like:
--theme-bg-primary
--theme-bg-secondary
--theme-bg-tertiary
--theme-text-primary
--theme-text-secondary
--theme-text-muted
--theme-border-primary
--theme-primary
--theme-error
--theme-success
```

### Responsive Behavior

**Desktop (>768px):**
- Input Panel: 700px width
- Runners: 900px width
- Side-by-side footer buttons

**Mobile (≤768px):**
- Full-width panels
- Stacked footer buttons
- Adjusted padding and spacing

## File Locations

```
src/
├── components/
│   ├── features/
│   │   ├── PlaybookInputPanel.jsx         ← New
│   │   ├── PlaybookRunnerDrawer.jsx       ← New
│   │   ├── PlaybookRunDrawer.jsx          ← Existing (updated)
│   │   └── index.js                       ← Updated exports
│   └── ui/
│       └── Modal/
│           └── ProjectCreateModal.jsx     ← Used for inline project creation
└── styles/
    ├── PlaybookInputPanel.scss            ← New
    ├── PlaybookRunnerDrawer.scss          ← New
    └── PlaybookRunDrawer.scss             ← Existing
```

## API Integration Points

When connecting to real APIs, replace mock data with actual calls:

### 1. Fetch Workspaces
```javascript
const workspaces = await api.getWorkspaces();
```

### 2. Fetch Projects
```javascript
const projects = await api.getProjects(workspaceId);
```

### 3. Fetch ICPs
```javascript
const icps = await api.getICPs(workspaceId);
```

### 4. Create Project
```javascript
const newProject = await api.createProject({
  workspaceId,
  name,
  description
});
```

### 5. Upload Files
```javascript
const uploadedFile = await api.uploadFile(file, {
  projectId,
  workspaceId
});
```

### 6. Start Playbook Run
```javascript
const run = await api.startPlaybookRun(playbookId, {
  mode: 'step_by_step' | 'auto_run',
  context: {
    workspaceId,
    projectId,
    audience,
    specialInstructions,
    fileIds
  }
});
```

## Testing Checklist

- [ ] Panel opens when clicking "Run" from Preview
- [ ] Workspace defaults to current context when available
- [ ] Project dropdown shows projects for selected workspace
- [ ] "Create New Project" opens modal and auto-selects new project
- [ ] ICPs multi-select works correctly
- [ ] "All ICPs" is mutually exclusive with individual ICPs
- [ ] Special instructions counter updates correctly (max 2000)
- [ ] File drag & drop works
- [ ] File picker works
- [ ] File validation shows errors for invalid files
- [ ] File upload progress displays
- [ ] Completed files show checkmark
- [ ] Failed files show retry button
- [ ] Validation errors appear inline
- [ ] Submit buttons disabled when validation fails
- [ ] Clicking disabled button focuses first invalid field
- [ ] "Back to Preview" returns to preview state
- [ ] Changing workspace clears Project & ICPs
- [ ] "Play with Ella" opens Step-by-Step runner
- [ ] "Auto-run Play" opens Variable-based runner
- [ ] Context is passed correctly to runners
- [ ] Telemetry events fire correctly
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces properly
- [ ] Mobile responsive layout works

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Latest

## Performance Considerations

- File uploads are chunked for large files
- Dropdown lists are virtualized for >100 items
- Debounced field change telemetry (1000ms)
- Lazy loading of ICP data when workspace changes

## Future Enhancements

Potential improvements for future iterations:

1. **Saved Configurations**: Save common workspace/project/ICP combinations
2. **Templates**: Quick-fill with saved templates
3. **Recent Projects**: Show recently used projects first
4. **Bulk File Upload**: Upload entire folders
5. **File Preview**: Preview uploaded files before submitting
6. **Advanced Validation**: Custom validation rules per playbook
7. **Multi-workspace Support**: Run across multiple workspaces
8. **Scheduling**: Schedule playbook runs for later
9. **Notifications**: Email/Slack notifications on completion

## Support

For questions or issues with the Input Panel:
- Check this documentation
- Review existing examples in the codebase
- Check console for telemetry events
- Verify props are passed correctly

---

**Version:** 1.0  
**Last Updated:** October 2025  
**Author:** Ella UI Team

