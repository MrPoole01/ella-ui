# Step-by-Step ("Play with Ella") Playbook Runner — Complete Guide

## Overview

The **Step-by-Step ("Play with Ella") Playbook Runner** is a conversational, guided execution mode where Ella walks users through each Play → Step with contextual chat, inline input fields, and a working document pane. This mode emphasizes learning, exploration, and interactive refinement.

---

## Key Features

### 1. **Entry & Mode Selection**
- **Source**: From the Input Panel, users select **"Play with Ella"**
- **Preconditions**: 
  - Valid playbook (≥1 Play, each Play ≥1 Step)
  - Input Panel returns: `{workspaceId, projectId, icps|all, instructions, fileIds}`

### 2. **Drawer Structure**

#### Header
- **Playbook Title** + **"Step-by-Step"** badge
- **Progress Bar**: "Play X of N · Step Y of M" with percentage complete
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

**Left Pane (55%)**: Working Document Viewer
- Displays step outputs as they're generated
- Shows selected files from file dropdown
- Empty state: "Working document will appear here"

**Right Pane (45%)**: Conversational Interface
1. **Pinned Step Header** (always visible):
   - Play name
   - Step number (e.g., "Step 2 of 3")
   - Step title
   - Step description
   
2. **Input Fields** (below header):
   - Inline fields for step inputs
   - Supports: text, textarea, select, date, boolean, number, file, URL
   - Required fields marked with asterisk (*)
   
3. **Chat Conversation** (scrollable):
   - Messages from Ella (guidance, responses)
   - User messages (questions, clarifications)
   - Real-time chat interface

#### Footer: Contextual Actions
- **Previous Step**: Navigate to previous step (disabled on first step)
- **Run Step** (primary): Executes current step
  - Disabled until all required fields are filled
- **Re-run Step**: Available after step completion; generates new output
- **Next Step**: Manual advancement after successful step run
- **Finish Play** / **Finish Playbook**: On last step of play

---

## User Workflow

### Step-by-Step Flow

1. **Open Input Panel** → Select workspace, project, ICPs, add files/instructions
2. **Click "Play with Ella"** → Opens Step-by-Step Runner at Play 1 · Step 1
3. **Ella Greets** → Initial message in chat explaining the step
4. **Fill Fields** → Enter required information in inline fields
5. **Chat with Ella** → Ask questions, request clarification (optional)
6. **Click "Run Step"** → Ella executes the step:
   - Shows "Working on..." message (thinking indicator)
   - Generates output → displays in left pane
   - Success message in chat: "✓ Step completed!"
7. **Review Output** → Read generated content in left pane
8. **Click "Next Step"** → Ella introduces next step, updates header
9. **Repeat** steps 4-8 for each step in the Play
10. **Click "Finish Play"** → Moves to next Play's Step 1 (or completes if last Play)
11. **Complete Playbook** → All Plays finished

---

## Step Behavior

### Pinned Step Header
- **Always visible** above chat (doesn't scroll away)
- **Updates** when step changes (via Next Step or navigation)
- **Contains**:
  - Play name (e.g., "Voicemail Script")
  - Step number (e.g., "Step 2 of 3")
  - Step title (e.g., "Define Contact & Relationship")
  - Step description (e.g., "Tell me about the person you're reaching out to.")

### Input Fields
- **Inline fields** appear below step header
- **Field types**:
  - **text**: Single-line input
  - **textarea**: Multi-line input (e.g., discussion topics)
  - **select**: Dropdown with predefined options
  - **date**: Date picker
  - **boolean**: Checkbox (e.g., "Include Call-to-Action")
  - **number**: Numeric input (future)
  - **file**: File upload (future)
  - **URL**: URL input (future)
- **Validation**: Required fields must be filled before "Run Step" is enabled
- **Guidance**: Inline errors if fields are invalid

### Chat Conversation
- **Ella's role**: Guide, assistant, question-answerer
- **User's role**: Ask questions, provide context, request changes
- **Messages**:
  - Initial greeting when step loads
  - Thinking indicator while step runs
  - Success/error messages after step execution
  - Responses to user questions
- **Scroll behavior**: Auto-scrolls to latest message

### Execution
1. User fills required fields
2. "Run Step" button becomes enabled
3. User clicks "Run Step"
4. **Hidden prompt** sent to Ella with step's exact instructions (user doesn't see this)
5. Ella executes the step using provided inputs
6. Output rendered in left pane
7. Ella's response appears in chat

### Advancement
- **No auto-advance**: User must click "Next Step"
- **Last step of play**: Button becomes "Finish Play"
- **Last play**: Button becomes "Finish Playbook"
- **Reasoning**: Gives user time to review, re-run, or request changes

### Re-running
- **Re-run Step** button appears after first successful run
- **Behavior**:
  - Uses current field values (can be edited first)
  - Generates new output instance (replaces previous in left pane)
  - Increments file count if step creates files
- **Use cases**: Refine output, fix mistakes, try different inputs

---

## Play Flow & Documents

### Play Output
- **Author-defined**: Final step of play is flagged as `isPlayOutput: true`
- **Document creation**: When output step runs, a file is created and saved to Project
- **File metadata**:
  - Name: Auto-generated (e.g., `Voicemail_Script_1234567890.docx`)
  - Type: Based on play output (DOCX, PDF, etc.)
  - Size: Calculated from content
  - Created timestamp

### Document Linkage
- Files created by a play are **associated with that play's card**
- Files badge shows count (e.g., `📄 2`)
- Clicking badge opens dropdown with file list
- Each file can be viewed (left pane) or deleted (with confirmation)

### Repeat Runs
- Running same play multiple times creates multiple files
- Each file listed in play card's dropdown
- File count increments with each run
- All files saved to Project

---

## Play Cards (Shared Spec)

### Card Content
- **Play name** (title)
- **Primary action**:
  - ▶ (Play button) until play has been run at least once
  - ↻ (Replay icon) after first successful run
- **Files badge**: 📄 + count (e.g., "0", "2", "5")
- **Info icon**: ℹ with hover/click popover

### Play/Replay Action
- **Before first run**: ▶ icon
  - Clicking navigates to Play's Step 1
- **After first run**: ↻ icon (Replay)
  - Clicking navigates to Play's Step 1 and allows re-running from scratch

### Files Badge
- **Default**: Shows `0` (grayed out, no dropdown)
- **When > 0**: Badge highlights, clicking opens dropdown
- **Dropdown contents**:
  - List of files created by this play during this run session
  - Each row: filename, eye icon, trash icon
  - **Eye icon**: Loads file into left pane for preview
  - **Trash icon**: Deletes file (with confirmation; honors ACLs)

### Info Popover
- **Trigger**: Click ℹ icon
- **Contents**:
  - **Play Title**: Display name
  - **Description**: What this Play generates
  - **Estimated Time to Run**: E.g., "5 minutes"

---

## Navigation & Persistence

### Previous/Next Step
- **Previous Step**: Returns to prior step
  - Prior output visible if it exists
  - Can navigate across plays (e.g., from Play 2 Step 1 to Play 1 last step)
- **Next Step**: Advances to next step (user-driven, no auto-advance)
  - Must complete current step first (or skip if already completed)

### Play Navigation via Cards
- **Click any Play card** to jump to that Play's first step
- **Replay icon** restarts Play from Step 1

### Session Persistence
- **Active session**: Inputs and outputs persist while drawer open
- **Close mid-run**: Prompts "Save & Close" or "Discard"
  - **Save & Close**: Stores state to `localStorage` for 1-hour recovery
  - **Discard**: Clears all progress
- **Saved state includes**:
  - Current Play/Step index
  - Step inputs (all fields)
  - Completed steps set
  - Step outputs (all generated content)
  - Play files (all created documents)
  - Chat messages (full conversation)

### Recovery
- On next visit (within 1 hour), check `localStorage` for saved session
- Prompt: "You have an unfinished Playbook run. Resume or start fresh?"
- **Resume**: Restores to last Play/Step with all data intact

---

## Permissions & ACLs

### File Operations
- All file actions honor workspace/project permissions
- Delete operations check user ACLs:
  - **Owner**: Can always delete
  - **Editor**: Can delete if granted permission
  - **Viewer**: Cannot delete
- Failed operations show clear error messages

### Invalid Operations
Example errors:
- "You don't have permission to delete this file"
- "This file is locked by another user"
- "File not found or access denied"

---

## Accessibility

### Keyboard Operability
- **Tab Order**: Step fields → Chat input → Footer buttons → Play cards → Close
- **Escape Key**: Closes drawer (with confirmation if in-progress)
- **Enter Key**: 
  - In chat input: Sends message
  - In fields: Moves to next field (or triggers Run Step if last field)

### ARIA Attributes
- All buttons have `aria-label` for screen readers
- Progress bar has `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- Disabled buttons expose `aria-disabled="true"`
- Form fields have proper labels and `aria-describedby` for errors
- Step header uses semantic HTML (`<h3>` for title, `<p>` for description)

### Screen Reader Announcements
- **On step change**: "Now on Play [X], Step [Y]: [Step Name]"
- **On Run Step**: "Working on [Step Name]..."
- **On success**: "✓ [Step Name] completed!"
- **On error**: "✗ Failed to complete [Step Name]. Please try again."
- **On navigation**: "Moved to previous/next step"

---

## Telemetry Events

### Core Events
```javascript
// On drawer open
logTelemetry('playbook_run_opened', {
  mode: 'step_by_step',
  playbookName: string,
  playCount: number,
  inputData: object
});

// On step start
logTelemetry('playbook_step_started', {
  playId: string,
  playIndex: number,
  stepId: string,
  stepIndex: number,
  stepName: string
});

// On step success
logTelemetry('playbook_step_succeeded', {
  playId: string,
  playIndex: number,
  stepId: string,
  stepIndex: number
});

// On step failure
logTelemetry('playbook_step_failed', {
  playId: string,
  stepId: string,
  error: string
});

// On play completion
logTelemetry('playbook_play_completed', {
  playId: string,
  playIndex: number
});

// On playbook completion
logTelemetry('playbook_run_completed', {
  totalPlays: number,
  completedSteps: number
});

// On playbook abort
logTelemetry('playbook_run_aborted', {
  completedSteps: number
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
          name: 'Define Contact & Relationship',
          description: 'Tell me about the person you\'re reaching out to.',
          fields: [
            { id: 'contact_name', label: 'Contact Name', type: 'text', required: true },
            { 
              id: 'relationship', 
              label: 'Relationship Level', 
              type: 'select', 
              required: true, 
              options: ['First meeting', 'Brief conversation', 'Extended discussion'] 
            }
          ]
        },
        {
          id: 3,
          name: 'Craft Script',
          description: 'I\'ll now generate your personalized voicemail script.',
          fields: [
            { id: 'tone', label: 'Preferred Tone', type: 'select', required: false, 
              options: ['Professional', 'Casual', 'Enthusiastic'] },
            { id: 'include_cta', label: 'Include Call-to-Action', type: 'boolean', 
              required: false, defaultValue: true }
          ],
          isPlayOutput: true // Flagged as final output step
        }
      ]
    }
  ]
};
```

### Sample Chat Messages
```javascript
const chatMessages = [
  {
    id: 1,
    sender: 'ella',
    text: 'Welcome! I\'m Ella, and I\'ll guide you through "Post-Event Networking Follow-Up Series". Let\'s start with Voicemail Script. Before we craft your voicemail, I need to understand the event context.',
    timestamp: new Date(),
  },
  {
    id: 2,
    sender: 'user',
    text: 'What information do you need?',
    timestamp: new Date()
  },
  {
    id: 3,
    sender: 'ella',
    text: 'Please fill in the fields below: Event Name and Event Date. These will help me create a personalized script.',
    timestamp: new Date()
  },
  {
    id: 4,
    sender: 'ella',
    text: 'Working on Gather Event Context...',
    timestamp: new Date(),
    isThinking: true
  },
  {
    id: 5,
    sender: 'ella',
    text: '✓ Gather Event Context completed! Ready to move to the next step?',
    timestamp: new Date(),
    isSuccess: true
  }
];
```

---

## Component Props

### PlaybookRunDrawer (Step-by-Step)

```typescript
interface PlaybookRunDrawerProps {
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
  steps: Step[];
}

interface Step {
  id: string | number;
  name: string;
  description: string;
  fields: Field[];
  isPlayOutput?: boolean; // Flag for final output step
}

interface Field {
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
```scss
--background-primary: #ffffff
--background-secondary: #f8f9fa
--text-primary: #1a1a1a
--text-secondary: #666
--text-tertiary: #999
--border-primary: #e0e0e0
--accent-primary: #e6a429 (Ella gold)
--success-color: #28a745
--error-color: #dc3545
```

### Key Classes
- `.playbook-run-drawer`: Main container
- `.playbook-run-drawer--open`: Active state
- `.playbook-run-drawer__mode-badge--stepbystep`: Step-by-Step badge
- `.playbook-run-drawer__step-header`: Pinned header
- `.playbook-run-drawer__step-fields`: Input fields area
- `.playbook-run-drawer__chat-area--stepbystep`: Chat conversation
- `.playbook-run-drawer__play-card.active`: Active Play
- `.playbook-run-drawer__play-card.completed`: Completed Play

---

## Integration Example

### Basic Setup
```jsx
import React, { useState } from 'react';
import { PlaybookRunDrawer } from './components/features';

function MyApp() {
  const [showRunner, setShowRunner] = useState(false);
  const [runContext, setRunContext] = useState(null);

  const handleInputPanelSubmit = (mode, context) => {
    if (mode === 'step-by-step') {
      setRunContext(context);
      setShowRunner(true);
    }
  };

  return (
    <div>
      {/* Your app content */}
      
      <PlaybookRunDrawer
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
   - Fill step fields
   - Run Step
   - Verify output appears
   - Chat with Ella
   - Move to next step
   - Complete all plays

2. **Validation**:
   - Leave required field empty
   - Click "Run Step"
   - Verify button is disabled
   - Fill field
   - Verify button becomes enabled

3. **Navigation**:
   - Complete Step 1
   - Click "Next Step"
   - Click "Previous Step"
   - Verify outputs persist
   - Click Play card
   - Verify jumps to that Play

4. **File Operations**:
   - Complete play (creates file)
   - Click files badge
   - View file (eye icon)
   - Delete file (trash icon)
   - Verify confirmation dialog

5. **Replay**:
   - Complete Play 1
   - Click Replay icon
   - Verify returns to Step 1
   - Re-run with different inputs
   - Verify new file created

6. **Chat**:
   - Type message
   - Press Enter
   - Verify Ella responds
   - Check message ordering

7. **Session Persistence**:
   - Complete Step 1
   - Click Close
   - Choose "Save & Close"
   - Refresh page (within 1 hour)
   - Verify session restored

---

## Key Differences: Step-by-Step vs. Auto-run

| Feature | Step-by-Step | Auto-run |
|---------|--------------|----------|
| **Progression** | Step-by-step through each step | Play-by-play with consolidated variables |
| **Interface** | Conversational chat with Ella | Variables form + compact chat |
| **Inputs** | Inline fields per step + chat | All variables upfront |
| **Advancement** | Manual (user clicks Next Step) | Manual (user clicks Next Play) |
| **Chat Role** | Guidance & questions | Minor edits only |
| **Output** | Incremental per step | Full Play output immediately |
| **Use Case** | Learning, exploration, complex decisions | Known inputs, batch generation, repeat workflows |
| **Speed** | 🐢 Slower (conversational) | ⚡ Faster (batch) |

---

## Troubleshooting

### Common Issues

**Issue**: "Run Step" button remains disabled
- **Solution**: Check all required fields (*) are filled; look for inline errors

**Issue**: Output not appearing after "Run Step"
- **Solution**: Check console for API errors; verify step has fields configured

**Issue**: Files not showing in badge
- **Solution**: Verify step has `isPlayOutput: true` flag; check API creates files

**Issue**: Chat messages not appearing
- **Solution**: Check chat container is scrolling; verify message state updates

**Issue**: Step header not updating on navigation
- **Solution**: Verify `currentStepIndex` state changes; check header re-renders

---

## Support & Feedback

For questions, bug reports, or feature requests:
- **Slack**: #playbook-runner-support
- **Email**: playbook-team@company.com
- **Docs**: https://docs.company.com/playbook-runner/step-by-step

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Component**: PlaybookRunDrawer.jsx (Step-by-Step mode)

