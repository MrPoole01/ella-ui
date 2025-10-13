# Variable-based (Auto-run) Runner — Architecture & Component Design

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Playbook Ecosystem                          │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ User clicks "Run"
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      PLAYBOOK INPUT PANEL                           │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 1. Select Workspace & Project                                 │ │
│  │ 2. Choose ICPs or "All ICPs"                                  │ │
│  │ 3. Add Special Instructions                                   │ │
│  │ 4. Upload Files (optional)                                    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Footer Actions:                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐               │
│  │  Play with Ella      │  │  Auto-run Play       │ ◄── THIS FLOW │
│  │  (Step-by-Step)      │  │  (Variable-based)    │               │
│  └──────────────────────┘  └──────────────────────┘               │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ onSubmit('auto-run', context)
                                   ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   PLAYBOOK RUNNER DRAWER (Auto-run)                 │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ HEADER                                                        │  │
│  │ • Title + "Auto-run Mode" badge                              │  │
│  │ • Progress: "Play X of N (Auto-run)" | X% Complete          │  │
│  │ • Close button (Esc support)                                 │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ PLAY CARDS (Horizontal Strip)                                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │  │
│  │  │ Play 1   │  │ Play 2   │  │ Play 3   │  ...              │  │
│  │  │ ▶ 📁 ℹ  │  │ ↻ 📁(2) ℹ│  │ ▶ 📁 ℹ  │                   │  │
│  │  └──────────┘  └──────────┘  └──────────┘                   │  │
│  │    Active       Completed      Pending                        │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌────────────────────────────┬────────────────────────────────┐  │
│  │ LEFT PANE (55%)            │ RIGHT PANE (45%)               │  │
│  │                            │                                │  │
│  │  ┌──────────────────────┐ │  ┌──────────────────────────┐ │  │
│  │  │ Output/Doc Viewer    │ │  │ VARIABLES PANEL          │ │  │
│  │  │                      │ │  │                          │ │  │
│  │  │ • Generated output   │ │  │ Play 1 Variables:        │ │  │
│  │  │ • Selected file      │ │  │  ┌────────────────────┐ │ │  │
│  │  │   preview            │ │  │  │ Event Name *       │ │ │  │
│  │  │                      │ │  │  │ [____________]     │ │ │  │
│  │  │ Empty state:         │ │  │  └────────────────────┘ │ │  │
│  │  │  "Generated outputs  │ │  │  ┌────────────────────┐ │ │  │
│  │  │   will appear here"  │ │  │  │ Event Date *       │ │ │  │
│  │  │                      │ │  │  │ [____/____/____]   │ │ │  │
│  │  └──────────────────────┘ │  │  └────────────────────┘ │ │  │
│  │                            │  │  ...                     │ │  │
│  │                            │  └──────────────────────────┘ │  │
│  │                            │  ┌──────────────────────────┐ │  │
│  │                            │  │ CHAT AREA                │ │  │
│  │                            │  │                          │ │  │
│  │                            │  │  💬 Messages             │ │  │
│  │                            │  │  [_________________][➤] │ │  │
│  │                            │  └──────────────────────────┘ │  │
│  └────────────────────────────┴────────────────────────────────┘  │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ FOOTER (Contextual Actions)                                  │  │
│  │  ┌────────────────┐    ┌────────────┐ ┌──────────────────┐ │  │
│  │  │ ← Previous Play│    │ Re-run Play│ │ Next Play →      │ │  │
│  │  └────────────────┘    └────────────┘ └──────────────────┘ │  │
│  │                        or: Run Play (primary, before 1st)    │  │
│  │                        or: Finish Playbook (on last play)    │  │
│  └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
PlaybookRunnerDrawer
├── Backdrop (click to close)
└── Drawer Container
    ├── Header
    │   ├── Title + Badge
    │   ├── Close Button
    │   ├── Progress Bar
    │   └── Play Cards Strip
    │       └── Play Card (for each play)
    │           ├── Play/Replay Button
    │           ├── Files Badge + Dropdown
    │           │   └── File Row (for each file)
    │           │       ├── View Button (eye icon)
    │           │       └── Delete Button (trash icon)
    │           └── Info Button + Popover
    │               └── Title, Description, ETA
    ├── Body (Split Pane)
    │   ├── Left Pane (Output Viewer)
    │   │   ├── Document Viewer
    │   │   │   ├── Document Header
    │   │   │   │   ├── Title + Icon
    │   │   │   │   └── Close Button
    │   │   │   └── Document Content
    │   │   └── Empty State
    │   └── Right Pane
    │       ├── Variables Panel
    │       │   ├── Panel Header (Play name + indicator)
    │       │   └── Variables Form
    │       │       └── Field (for each variable)
    │       │           ├── Label (+ required *)
    │       │           └── Input (text/textarea/select/date/checkbox)
    │       └── Chat Area
    │           ├── Chat Header
    │           ├── Chat Messages
    │           │   └── Message (user/ella/thinking/success/error)
    │           │       ├── Avatar
    │           │       └── Bubble
    │           └── Chat Input Area
    │               ├── Input Field
    │               └── Send Button
    ├── Footer
    │   ├── Previous Play Button
    │   └── Action Buttons (right)
    │       ├── Run Play (before generation)
    │       ├── Re-run Play (after generation)
    │       └── Next Play / Finish Playbook
    └── Modal (Close Confirmation)
        ├── Title + Message
        └── Actions
            ├── Cancel
            ├── Discard
            └── Save & Close
```

---

## Data Flow

### 1. **Input Panel → Runner** (Initialization)

```javascript
// User submits Input Panel with "Auto-run Play"
onSubmit('auto-run', {
  workspace: { id: 'ws1', name: 'Marketing Team' },
  project: { id: 'proj1', name: 'Q4 Campaign' },
  audience: { type: 'icps', icps: [{ id: 'icp1', name: 'Enterprise CMOs' }] },
  specialInstructions: 'Focus on urgency and ROI',
  fileIds: ['file123', 'file456']
});

// Runner opens with this context
<PlaybookRunnerDrawer
  isOpen={true}
  playbook={playbookData}
  inputPanelData={context}
/>
```

### 2. **State Management** (Within Runner)

```javascript
// Core state
const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
const [variables, setVariables] = useState({
  // Structure: { [playId]: { [varId]: value } }
  1: { event_name: 'Tech Summit', event_date: '2024-12-15' },
  2: { topics: 'AI transformation' }
});
const [generatedPlays, setGeneratedPlays] = useState({
  // Structure: { [playId]: { content, timestamp, documentId } }
  1: { content: '...', timestamp: Date, documentId: 123 }
});
const [playFiles, setPlayFiles] = useState({
  // Structure: { [playId]: [{ id, name, type, size, createdAt }] }
  1: [{ id: 'f1', name: 'Script.docx', type: 'document', size: '12 KB' }]
});
const [chatMessages, setChatMessages] = useState({
  // Structure: { [playId]: [{ id, sender, text, timestamp, ...flags }] }
  1: [{ id: 1, sender: 'ella', text: '✓ Generated!', timestamp: Date }]
});
```

### 3. **User Actions → State Updates**

```javascript
// User fills variable
handleVariableChange('event_name', 'Tech Summit')
→ setVariables(prev => ({ ...prev, [currentPlayId]: { ...prev[currentPlayId], event_name: 'Tech Summit' } }))
→ logTelemetry('variable_changed', { playId, variableId })

// User clicks "Run Play"
handleRunPlay()
→ setIsGenerating(true)
→ Add "thinking" message to chat
→ Call API to generate Play
→ setGeneratedPlays(prev => ({ ...prev, [playId]: output }))
→ Create file → setPlayFiles(prev => ({ ...prev, [playId]: [...files, newFile] }))
→ setSelectedDocument(newFile)
→ Add success message to chat
→ logTelemetry('play_autorun_succeeded', { playId })
→ setIsGenerating(false)

// User clicks "Next Play"
handleNextPlay()
→ setCurrentPlayIndex(prev => prev + 1)
→ logTelemetry('play_navigation', { direction: 'next' })
```

### 4. **Play Card Actions**

```javascript
// Click files badge
handleToggleFilesDropdown(playId)
→ setExpandedFilesCard(playId)
→ logTelemetry('play_card_files_opened', { playId })

// Click eye icon on file
handleViewFile(file)
→ setSelectedDocument({ ...file, content })
→ setExpandedFilesCard(null) // close dropdown
→ logTelemetry('play_card_file_viewed', { fileId, playId })

// Click trash icon on file
handleDeleteFile(file)
→ Show confirmation dialog
→ setPlayFiles(prev => filter out file)
→ if selected, setSelectedDocument(null)
→ logTelemetry('play_card_file_deleted', { fileId, playId })
```

---

## State Lifecycle

### Play Execution Flow

```
┌──────────────┐
│ Empty State  │
│ (no output)  │
└──────┬───────┘
       │ User fills variables
       ↓
┌──────────────┐
│ Ready to Run │
│ (valid vars) │
└──────┬───────┘
       │ Click "Run Play"
       ↓
┌──────────────┐
│ Generating   │  ← Show "thinking" in chat
│ (API call)   │  ← Disable inputs
└──────┬───────┘
       │ API success
       ↓
┌──────────────┐
│ Output Ready │  ← Display in left pane
│ (generated)  │  ← Create file
└──────┬───────┘  ← Enable "Re-run" & "Next Play"
       │
       ├─→ User requests chat edit → Stay in "Output Ready"
       │
       ├─→ User clicks "Re-run Play" → Back to "Generating"
       │
       └─→ User clicks "Next Play" → Move to next Play's "Empty State"
```

### Session Lifecycle

```
┌─────────────┐
│ Panel Opens │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Play 1      │ ─→ Fill vars → Run → Output → Next
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Play 2      │ ─→ Fill vars → Run → Output → Next
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ ...         │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Last Play   │ ─→ Fill vars → Run → Output → Finish
└──────┬──────┘
       │
       ├─→ Click "Finish Playbook" → Close (save files to project)
       │
       └─→ Click Close mid-run → Confirmation Modal
           ├─→ "Save & Close" → Save to localStorage (1hr recovery)
           └─→ "Discard" → Clear all state
```

---

## API Integration Points

### Expected API Calls

```javascript
// 1. Generate Play output
POST /api/playbooks/{playbookId}/plays/{playId}/generate
Request: {
  variables: { event_name: 'Tech Summit', ... },
  context: { workspace, project, audience, instructions, fileIds }
}
Response: {
  content: string,           // Generated output
  documentId: string,        // Created document ID
  fileUrl: string,          // URL to download
  metadata: { ... }
}

// 2. Create document file
POST /api/projects/{projectId}/documents
Request: {
  name: string,
  content: string,
  type: 'docx' | 'pdf' | ...,
  playbookRunId: string,
  playId: string
}
Response: {
  id: string,
  name: string,
  url: string,
  size: number,
  createdAt: string
}

// 3. Delete file
DELETE /api/documents/{documentId}
Response: { success: boolean }

// 4. Save session state
POST /api/playbook-runs/save-session
Request: {
  playbookId: string,
  state: { currentPlayIndex, variables, generatedPlays, ... }
}
Response: { sessionId: string, expiresAt: string }

// 5. Restore session
GET /api/playbook-runs/restore-session/{sessionId}
Response: {
  state: { ... },
  isValid: boolean
}
```

### Mock API Implementation (Current)

```javascript
// Simulated API call in component
const handleRunPlay = async () => {
  setIsGenerating(true);
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock response
    const output = {
      content: `Generated content for ${currentPlay.name}...`,
      timestamp: new Date(),
      documentId: Date.now()
    };
    
    // Update state
    setGeneratedPlays(prev => ({ ...prev, [currentPlay.id]: output }));
    
    // Mock file creation
    const newFile = {
      id: Date.now(),
      name: `${currentPlay.name.replace(/\s+/g, '_')}_${Date.now()}.docx`,
      type: 'document',
      size: '12 KB',
      createdAt: new Date(),
      playId: currentPlay.id
    };
    setPlayFiles(prev => ({ ...prev, [currentPlay.id]: [...(prev[currentPlay.id] || []), newFile] }));
    
  } catch (error) {
    console.error('Generation failed:', error);
  } finally {
    setIsGenerating(false);
  }
};
```

---

## Performance Considerations

### 1. **Large Playbooks**
- **Issue**: Many plays (10+) can make play cards strip crowded
- **Solution**: Horizontal scroll with visual indicators; consider collapsible groups

### 2. **File Operations**
- **Issue**: Listing many files per play can be slow
- **Solution**: Lazy load file metadata; paginate file dropdown

### 3. **Chat History**
- **Issue**: Long chat threads consume memory
- **Solution**: Limit messages per play (e.g., last 50); load on demand

### 4. **Session Persistence**
- **Issue**: localStorage quota (~5-10MB)
- **Solution**: Compress state; exclude large file content; warn on quota exceeded

### 5. **Re-renders**
- **Issue**: Frequent state updates can cause jank
- **Solution**: Use React.memo for play cards; debounce variable changes

---

## Security & Permissions

### Access Control Matrix

| Action | Owner | Editor | Viewer | Guest |
|--------|-------|--------|--------|-------|
| View playbook | ✅ | ✅ | ✅ | ❌ |
| Run playbook | ✅ | ✅ | ❌ | ❌ |
| View files | ✅ | ✅ | ✅ | ❌ |
| Delete files | ✅ | ✅ | ❌ | ❌ |
| Edit variables | ✅ | ✅ | ❌ | ❌ |
| Save session | ✅ | ✅ | ❌ | ❌ |

### File ACLs
```javascript
// Example ACL check before file deletion
const canDeleteFile = (file, user) => {
  const userRole = getUserProjectRole(user, file.projectId);
  return ['owner', 'editor'].includes(userRole) && 
         (file.createdBy === user.id || userRole === 'owner');
};

// In component
const handleDeleteFile = (file, e) => {
  if (!canDeleteFile(file, currentUser)) {
    toast.error('You don\'t have permission to delete this file');
    return;
  }
  // proceed with deletion...
};
```

---

## Testing Strategy

### Unit Tests
```javascript
// PlaybookRunnerDrawer.test.jsx
describe('PlaybookRunnerDrawer', () => {
  it('renders header with playbook title', () => { ... });
  it('displays play cards for each play', () => { ... });
  it('disables Run Play when variables invalid', () => { ... });
  it('enables Run Play when all required variables filled', () => { ... });
  it('generates output on Run Play click', () => { ... });
  it('creates file and updates badge count', () => { ... });
  it('navigates to next play on Next Play click', () => { ... });
  it('shows confirmation modal on close mid-run', () => { ... });
});
```

### Integration Tests
```javascript
// playbook-flow.test.jsx
describe('Playbook Auto-run Flow', () => {
  it('completes full 2-play playbook', async () => {
    // 1. Open Input Panel → select context → click Auto-run Play
    // 2. Verify runner opens at Play 1
    // 3. Fill variables → click Run Play
    // 4. Wait for output → verify file created
    // 5. Click Next Play
    // 6. Fill variables → click Run Play
    // 7. Click Finish Playbook
    // 8. Verify all files saved to project
  });
});
```

### E2E Tests (Cypress/Playwright)
```javascript
describe('Auto-run Playbook E2E', () => {
  it('user can run playbook from preview to completion', () => {
    cy.visit('/playbooks/123');
    cy.get('[data-testid="run-playbook"]').click();
    // ... full flow
  });
});
```

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Core drawer | ✅ | ✅ | ✅ | ✅ |
| Split pane | ✅ | ✅ | ✅ | ✅ |
| File upload | ✅ | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ | ✅ |
| Date picker | ✅ | ✅ | ⚠️ (needs polyfill) | ✅ |
| Flexbox | ✅ | ✅ | ✅ | ✅ |

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] File storage (S3/Azure) set up
- [ ] Authentication flow tested
- [ ] Permission matrix enforced
- [ ] Telemetry pipeline active
- [ ] Error tracking (Sentry/Rollbar)
- [ ] Performance monitoring
- [ ] Accessibility audit passed
- [ ] Browser compatibility tested
- [ ] Mobile responsive verified
- [ ] Documentation updated
- [ ] Team training completed

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained By**: Playbook Team

