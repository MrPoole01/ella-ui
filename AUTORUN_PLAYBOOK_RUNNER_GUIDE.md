# Variable-based (Auto-run) Playbook Runner — Complete Guide

## Overview

The **Variable-based (Auto-run) Playbook Runner** is a streamlined execution mode where users fill consolidated variables per Play and receive immediate auto-generated outputs. This mode emphasizes efficiency: gather inputs once, generate output instantly, optionally refine via chat, then move to the next Play.

---

## Key Features

### 1. **Entry & Mode Selection**
- **Source**: From the Input Panel, users select **"Auto-run Play"**
- **Preconditions**: 
  - Valid playbook (≥1 Play, each Play ≥1 Step)
  - Input Panel returns: `{workspaceId, projectId, icps|all, instructions, fileIds}`

### 2. **Drawer Structure**

#### Header
- **Playbook Title** + **"Auto-run Mode"** badge
- **Progress Bar**: "Play X of N (Auto-run)" with percentage complete
- **Close Button**: Esc key support with confirmation if in-progress

#### Play Cards (Top Strip)
Each Play card displays:
- **Play/Replay Action**: ▶ icon (before first run) → Replay icon (after first run)
- **Files Badge**: Shows count of files created by this Play
  - Click to open dropdown with file list
  - Each file row has:
    - **Eye icon**: Preview file in left pane
    - **Trash icon**: Delete file (with confirmation; honors ACLs)
- **Info Icon** (ℹ): Popover showing:
  - Play Title
  - Description
  - Estimated Time to Run

#### Body: Split Pane Layout

**Left Pane (55%)**: Output/Document Viewer
- Displays generated output from current Play
- Shows selected files from file dropdown
- Empty state: "Generated outputs will appear here"

**Right Pane (45%)**: Two-section vertical split
1. **Variables Panel** (top, scrollable):
   - Consolidated inputs for current Play
   - Supports field types: text, textarea, select, date, boolean, number, file, URL
   - Required fields marked with asterisk (*)
   - Real-time validation
   
2. **Chat Area** (bottom, fixed ~280px):
   - Compact chat interface for minor edits
   - Shows messages after Play generation
   - User can request tweaks without re-running variables
   - Ella responds with edit confirmations

#### Footer: Contextual Actions
- **Previous Play**: Navigate to previous Play (disabled on first Play)
- **Run Play** (primary): Generates output for current Play
  - Disabled until all required variables are valid
- **Re-run Play**: Available after first run; uses current variable values
- **Next Play** / **Finish Playbook**: 
  - Enabled after successful Play run
  - Last Play shows "Finish Playbook"

---

## User Workflow

### Step-by-Step Flow

1. **Open Input Panel** → Select workspace, project, ICPs, add files/instructions
2. **Click "Auto-run Play"** → Opens Variable-based Runner at Play 1
3. **Fill Variables** → Enter all required fields for Play 1
4. **Click "Run Play"** → Ella generates output:
   - Shows "thinking" indicator in chat
   - Renders output in left pane
   - Creates document file (added to Play card's files badge)
   - Chat shows success message: "✓ Play generated successfully!"
5. **Review Output** → Read generated content in left pane
6. **Optional: Request Edits** → Type in chat: "Make the tone more casual"
   - Ella responds with edit confirmation
   - Can re-run Play to apply changes
7. **Click "Next Play"** → Advances to Play 2
8. **Repeat** for each Play until completion
9. **Click "Finish Playbook"** → Closes runner, saves all outputs

### Variables & Validation

**Supported Field Types**:
- **Text**: Single-line input
- **Textarea**: Multi-line input (e.g., discussion topics)
- **Select**: Dropdown with predefined options
- **Date**: Date picker
- **Boolean**: Checkbox (e.g., "Include Call-to-Action")
- **Number**: Numeric input (future)
- **File**: File upload (future)
- **URL**: URL input (future)

**Validation Rules**:
- Required fields must be filled before "Run Play" is enabled
- Inline error display for invalid inputs
- Clicking disabled "Run Play" button focuses first invalid field

### Chat for Minor Edits

- **When Available**: After Play generation
- **Purpose**: Request small tweaks without changing variable values
- **Examples**:
  - "Make the introduction shorter"
  - "Add a call-to-action at the end"
  - "Change the tone to be more formal"
- **Behavior**:
  - Chat history persists per Play
  - Edits apply to current output instance
  - Re-running Play creates a new output instance

---

## Play Cards — Shared Behavior

### Play/Replay Action
- **Before First Run**: ▶ icon (play button)
- **After First Run**: Circular arrow icon (replay)
- **Behavior**: Clicking replay navigates to that Play and allows re-running with existing variables

### Files Badge
- **Default**: 0 files (grayed out)
- **After Generation**: Count increments (e.g., "1", "2")
- **Dropdown**:
  - Click badge to open file list
  - Each file row shows: name, size, view/delete actions
  - Eye icon: Loads file content into left pane
  - Trash icon: Deletes file (with confirmation; honors ACLs)

### Info Popover
- **Trigger**: Click ℹ icon
- **Contents**:
  - **Play Title**: Display name
  - **Description**: What this Play generates
  - **Estimated Time to Run**: E.g., "5 minutes"

---

## Files & Persistence

### File Creation
- Each Auto-run generates one or more documents
- Files are saved to the selected Project (from Input Panel)
- File metadata:
  - Name: Auto-generated (e.g., `Voicemail_Script_1234567890.docx`)
  - Type: Based on Play output (PDF, DOCX, etc.)
  - Size: Calculated from content
  - Created timestamp

### Session Persistence
- **Active Session**: Variables and outputs persist while drawer is open
- **Save & Close**: 
  - Stores session state to `localStorage`
  - Recoverable for 1 hour in same browser session
  - Includes: variables, generated plays, files, chat messages
- **Discard**: Clears all progress (with confirmation)

### Recovery
- On next visit (within 1 hour), check `localStorage` for saved session
- Prompt: "You have an unfinished Playbook run. Resume or start fresh?"
- Resume: Restores to last Play with all data intact

---

## Navigation & State Management

### Play Navigation
- **Previous Play**: Returns to earlier Play; prior output visible
- **Next Play**: Advances to next Play; can return later
- **Play Cards**: Click any card to jump to that Play

### State Transitions
```
Empty → Filling Variables → Running → Output Ready → (Chat Edits) → Next Play
                            ↑                                        ↓
                            └────────────── Re-run Play ─────────────┘
```

### Re-running Plays
- **Re-run Play** button appears after first successful run
- Uses current variable values (can be edited before re-running)
- Creates a new output instance (old output replaced in left pane)
- File count increments (new file added to Play card)

---

## Accessibility

### Keyboard Operability
- **Tab Order**: Variables form → Chat input → Footer buttons → Play cards
- **Escape Key**: Closes drawer (with confirmation if in-progress)
- **Enter Key**: Submits chat message (when chat input is focused)

### ARIA Attributes
- All buttons have `aria-label` for screen readers
- Progress bar has `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Disabled buttons expose `aria-disabled="true"`
- Form fields have proper labels and `aria-describedby` for errors

### Screen Reader Announcements
- **On Run Play**: "Generating [Play Name]..."
- **On Success**: "✓ [Play Name] generated successfully!"
- **On Error**: "✗ Failed to generate [Play Name]. Please try again."
- **On Navigation**: "Moved to Play [N]: [Play Name]"

---

## Telemetry Events

### Core Events
```javascript
// On drawer open
logTelemetry('playbook_run_opened', {
  mode: 'auto_run',
  playbookName: string,
  playCount: number,
  inputData: object
});

// On Play start
logTelemetry('play_autorun_started', {
  playId: string,
  playIndex: number,
  playName: string
});

// On Play success
logTelemetry('play_autorun_succeeded', {
  playId: string,
  playIndex: number,
  playName: string
});

// On Play failure
logTelemetry('play_autorun_failed', {
  playId: string,
  playIndex: number,
  error: string
});

// On Play completion (any outcome)
logTelemetry('playbook_play_completed', {
  playId: string,
  playIndex: number
});

// On playbook completion
logTelemetry('playbook_run_completed', {
  totalPlays: number,
  completedPlays: number
});

// On playbook abort
logTelemetry('playbook_run_aborted', {
  completedPlays: number
});
```

### Play Card Events
```javascript
// Play card info opened
logTelemetry('play_card_info_opened', { playId: string });

// Play card replay clicked
logTelemetry('play_card_replay_clicked', { playId: string, playIndex: number });

// Play card files dropdown opened
logTelemetry('play_card_files_opened', { playId: string });

// File viewed from card
logTelemetry('play_card_file_viewed', { fileId: string, playId: string });

// File deleted from card
logTelemetry('play_card_file_deleted', { fileId: string, playId: string });
```

### Variable & Navigation Events
```javascript
// Variable changed
logTelemetry('variable_changed', {
  playId: string,
  playIndex: number,
  variableId: string
});

// Play navigation
logTelemetry('play_navigation', {
  direction: 'previous' | 'next',
  fromIndex: number,
  toIndex: number
});

// Session saved
logTelemetry('playbook_run_saved', { completedPlays: number });
```

---

## Permissions & ACLs

### File Operations
- All file actions honor workspace/project permissions
- Delete operations check user ACLs:
  - Owner: Can always delete
  - Editor: Can delete if granted permission
  - Viewer: Cannot delete
- Failed operations show clear error messages

### Invalid Operations
Example errors:
- "You don't have permission to delete this file"
- "This file is locked by another user"
- "File not found or access denied"

---

## Example Mock Data

### Sample Playbook
```javascript
const playbook = {
  id: 1,
  title: 'Post-Event Networking Follow-Up Series',
  plays: [
    {
      id: 1,
      name: 'Voicemail Script',
      description: 'Create a personalized voicemail script for post-event follow-up',
      estimatedTime: '5 minutes',
      variables: [
        { id: 'event_name', label: 'Event Name', type: 'text', required: true },
        { id: 'contact_name', label: 'Contact Name', type: 'text', required: true },
        { id: 'event_date', label: 'Event Date', type: 'date', required: true },
        { id: 'urgency', label: 'Urgency Level', type: 'select', required: false, 
          options: ['Low', 'Medium', 'High'] },
        { id: 'include_cta', label: 'Include Call-to-Action', type: 'boolean', 
          required: false, defaultValue: true }
      ]
    },
    {
      id: 2,
      name: 'Follow-Up Email',
      description: 'Draft a personalized follow-up email',
      estimatedTime: '8 minutes',
      variables: [
        { id: 'topics', label: 'Discussion Topics', type: 'textarea', required: true },
        { id: 'tone', label: 'Email Tone', type: 'select', required: true, 
          options: ['Professional', 'Casual', 'Enthusiastic'] },
        { id: 'next_steps', label: 'Proposed Next Steps', type: 'textarea', required: false }
      ]
    }
  ]
};
```

### Sample Generated Output
```javascript
const generatedOutput = {
  content: `# Voicemail Script

Generated at 12/20/2024, 2:30 PM

## Variables Used
- **event_name**: Tech Summit 2024
- **contact_name**: Sarah Chen
- **event_date**: 2024-12-15
- **urgency**: High
- **include_cta**: true

## Output

Hi Sarah, this is [Your Name] from [Your Company]. We met at Tech Summit 2024 last week, and I really enjoyed our conversation about AI transformation in marketing. 

I wanted to follow up on the ideas we discussed...

[Call to Action]
I'd love to schedule a 15-minute call this week to explore how we can help...`,
  timestamp: new Date('2024-12-20T14:30:00'),
  documentId: 1734712200000
};
```

---

## Component Props

### PlaybookRunnerDrawer

```typescript
interface PlaybookRunnerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  playbook: {
    id: string | number;
    title: string;
    plays: Play[];
  };
  inputPanelData: {
    workspace: { id: string; name: string };
    project: { id: string; name: string };
    audience: { type: 'all' } | { type: 'icps'; icps: ICP[] };
    specialInstructions: string;
    fileIds: string[];
  };
}

interface Play {
  id: string | number;
  name: string;
  description: string;
  estimatedTime: string;
  variables: Variable[];
}

interface Variable {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'boolean' | 'number' | 'file' | 'url';
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select type
  defaultValue?: any;
}
```

---

## Styling

### SCSS Variables
The component uses CSS custom properties for theming:
```scss
--background-primary: #ffffff
--background-secondary: #f8f9fa
--background-tertiary: #e8e8e8
--text-primary: #1a1a1a
--text-secondary: #666
--text-tertiary: #999
--border-primary: #e0e0e0
--accent-primary: #4a90e2
--accent-secondary: #6ba3e8
--success-color: #28a745
--error-color: #dc3545
```

### Key Classes
- `.playbook-runner-drawer`: Main container
- `.playbook-runner-drawer--open`: Active state
- `.playbook-runner-drawer__left-pane`: Output viewer (55% width)
- `.playbook-runner-drawer__right-pane`: Variables + chat (45% width)
- `.playbook-runner-drawer__play-card`: Individual Play card
- `.playbook-runner-drawer__play-card.active`: Active Play
- `.playbook-runner-drawer__play-card.completed`: Completed Play

---

## Integration Example

### Basic Setup
```jsx
import React, { useState } from 'react';
import { PlaybookRunnerDrawer } from './components/features';

function MyApp() {
  const [showRunner, setShowRunner] = useState(false);
  const [runContext, setRunContext] = useState(null);

  const handleInputPanelSubmit = (mode, context) => {
    if (mode === 'auto-run') {
      setRunContext(context);
      setShowRunner(true);
    }
  };

  return (
    <div>
      {/* Your app content */}
      
      <PlaybookRunnerDrawer
        isOpen={showRunner}
        onClose={() => setShowRunner(false)}
        playbook={myPlaybook}
        inputPanelData={runContext}
      />
    </div>
  );
}
```

---

## Testing the Component

### Demo Page
Use the provided `PlaybookDemo` page to test:
```bash
# Navigate to /demo/playbook in your app
```

### Test Scenarios
1. **Happy Path**:
   - Fill all required variables
   - Run Play
   - Verify output appears
   - Request chat edit
   - Move to next Play
   - Complete playbook

2. **Validation**:
   - Leave required field empty
   - Click "Run Play"
   - Verify button is disabled
   - Fill field
   - Verify button becomes enabled

3. **File Operations**:
   - Generate Play
   - Click files badge
   - View file (eye icon)
   - Delete file (trash icon)
   - Verify confirmation dialog

4. **Navigation**:
   - Complete Play 1
   - Click "Next Play"
   - Click "Previous Play"
   - Click Play 1 card directly
   - Verify output persists

5. **Session Persistence**:
   - Complete Play 1
   - Click Close
   - Choose "Save & Close"
   - Refresh page (within 1 hour)
   - Verify session restored

6. **Accessibility**:
   - Tab through all controls
   - Press Escape to close
   - Use screen reader
   - Verify ARIA announcements

---

## Future Enhancements

### Planned Features
1. **Real-time Collaboration**: Multiple users in same Playbook run
2. **Version History**: Track output changes per Play
3. **Export Options**: Download all outputs as ZIP
4. **Template Library**: Save variable sets as templates
5. **Bulk Operations**: Run same Playbook for multiple ICPs
6. **Conditional Logic**: Skip Plays based on variable values
7. **Rich Text Editor**: Format output directly in left pane
8. **File Upload Variables**: Allow file uploads as variable inputs
9. **API Integration**: Connect external data sources for variables
10. **Analytics Dashboard**: View completion rates, time spent, etc.

---

## Troubleshooting

### Common Issues

**Issue**: "Run Play" button remains disabled
- **Solution**: Check all required fields are filled; look for inline error messages

**Issue**: Output not appearing after "Run Play"
- **Solution**: Check console for API errors; verify playbook has valid variables

**Issue**: Files not showing in badge
- **Solution**: Verify API is creating files correctly; check network tab

**Issue**: Chat messages not sending
- **Solution**: Ensure Play has been generated first; chat is only enabled after output

**Issue**: Session not restoring after refresh
- **Solution**: Check localStorage quota; verify session timestamp is within 1 hour

---

## Support & Feedback

For questions, bug reports, or feature requests:
- **Slack**: #playbook-runner-support
- **Email**: playbook-team@company.com
- **Docs**: https://docs.company.com/playbook-runner

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Component**: PlaybookRunnerDrawer.jsx

