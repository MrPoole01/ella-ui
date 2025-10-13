# Variable-based (Auto-run) Runner — Quick Reference

## 🚀 Quick Start

```jsx
import { PlaybookRunnerDrawer } from './components/features';

<PlaybookRunnerDrawer
  isOpen={true}
  onClose={() => console.log('Closed')}
  playbook={myPlaybook}
  inputPanelData={runContext}
/>
```

---

## 📋 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | ✅ | Controls drawer visibility |
| `onClose` | function | ✅ | Called when drawer closes |
| `playbook` | object | ✅ | Playbook with plays and variables |
| `inputPanelData` | object | ✅ | Context from Input Panel |

---

## 🎯 Key Features at a Glance

| Feature | Description | Access |
|---------|-------------|--------|
| **Split Pane** | Output viewer (left) + Variables/Chat (right) | Auto layout |
| **Play Cards** | Top strip with play/replay, files, info | Header |
| **Variables Panel** | Consolidated inputs per Play | Right pane (top) |
| **Chat Area** | Request minor edits after generation | Right pane (bottom) |
| **File Management** | View/delete files via badge dropdown | Play cards |
| **Session Save** | 1-hour recovery on close | Auto on exit |

---

## 🔄 User Flow

```mermaid
Input Panel → Auto-run Play → Variables → Run Play → Output → Chat Edits → Next Play → Repeat → Finish
```

1. **Fill Variables** → 2. **Click "Run Play"** → 3. **Review Output** → 4. **Optional: Chat Edits** → 5. **Next Play**

---

## 🎨 Styling Hooks

### CSS Classes
```scss
.playbook-runner-drawer              // Main container
.playbook-runner-drawer--open        // Active state
.playbook-runner-drawer__left-pane   // Output viewer (55%)
.playbook-runner-drawer__right-pane  // Variables + chat (45%)
.playbook-runner-drawer__play-card   // Play card
.playbook-runner-drawer__play-card.active      // Active
.playbook-runner-drawer__play-card.completed   // Completed
```

### CSS Variables
```css
--accent-primary: #4a90e2;
--success-color: #28a745;
--error-color: #dc3545;
```

---

## 📦 Playbook Data Structure

### Minimal Example
```javascript
{
  id: 1,
  title: 'My Playbook',
  plays: [
    {
      id: 1,
      name: 'Play 1',
      description: 'First play',
      estimatedTime: '5 minutes',
      variables: [
        { 
          id: 'field1', 
          label: 'Field 1', 
          type: 'text', 
          required: true 
        }
      ]
    }
  ]
}
```

### Variable Types
- `text` - Single-line input
- `textarea` - Multi-line input
- `select` - Dropdown (requires `options: []`)
- `date` - Date picker
- `boolean` - Checkbox
- `number` - Numeric input (future)
- `file` - File upload (future)
- `url` - URL input (future)

---

## 🔔 Telemetry Cheat Sheet

```javascript
// Drawer lifecycle
'playbook_run_opened'
'playbook_run_completed'
'playbook_run_aborted'
'playbook_run_saved'

// Play execution
'play_autorun_started'
'play_autorun_succeeded'
'play_autorun_failed'
'playbook_play_completed'

// Play cards
'play_card_info_opened'
'play_card_replay_clicked'
'play_card_files_opened'
'play_card_file_viewed'
'play_card_file_deleted'

// User actions
'variable_changed'
'play_navigation'
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Close drawer (with confirmation) |
| `Tab` | Navigate through controls |
| `Enter` | Send chat message (when in chat input) |

---

## ♿ Accessibility

### ARIA Attributes
- All buttons have `aria-label`
- Progress bar has `role="progressbar"`
- Disabled buttons expose `aria-disabled="true"`
- Form fields have proper labels

### Screen Reader Announcements
- ✅ "✓ [Play Name] generated successfully!"
- ⚠️ "✗ Failed to generate [Play Name]"
- 🔄 "Generating [Play Name]..."

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Button disabled | Fill all required fields (*) |
| Output not showing | Check console for API errors |
| Chat not working | Chat only enabled after Play generation |
| Session not restoring | Check localStorage quota & 1-hour expiry |
| Files not appearing | Verify API creates files correctly |

---

## 📁 File Structure

```
src/
├── components/features/
│   ├── PlaybookInputPanel.jsx       // Entry point
│   └── PlaybookRunnerDrawer.jsx     // Auto-run runner ⭐
├── styles/
│   ├── PlaybookInputPanel.scss
│   └── PlaybookRunnerDrawer.scss    // Styles ⭐
└── pages/
    └── PlaybookDemo.jsx              // Demo page
```

---

## 🧪 Test Checklist

- [ ] Fill variables and run Play
- [ ] Verify output appears in left pane
- [ ] Click files badge → view/delete file
- [ ] Send chat message
- [ ] Navigate to next Play
- [ ] Click "Previous Play"
- [ ] Click Play card to jump
- [ ] Click "Finish Playbook"
- [ ] Close mid-run → "Save & Close"
- [ ] Refresh page → verify session restored
- [ ] Tab through all controls
- [ ] Press Escape to close
- [ ] Test with screen reader

---

## 🔗 Related Components

| Component | Purpose |
|-----------|---------|
| `PlaybookInputPanel` | Gathers run context before launching |
| `PlaybookRunDrawer` | Step-by-Step runner (separate mode) |
| `PlaybookDemo` | Demo page for testing |

---

## 📞 Support

- **Docs**: `/AUTORUN_PLAYBOOK_RUNNER_GUIDE.md` (full guide)
- **Demo**: Navigate to `/demo/playbook` in your app
- **Slack**: #playbook-runner-support

---

## 🎯 Key Differences: Auto-run vs. Step-by-Step

| Feature | Auto-run | Step-by-Step |
|---------|----------|--------------|
| **Input** | Consolidated variables | Guided step-by-step |
| **Chat** | After generation (edits) | During steps (guidance) |
| **Output** | Immediate full Play | Incremental per step |
| **Use Case** | Fast batch generation | Interactive refinement |

---

**Version**: 1.0.0  
**Last Updated**: December 2024

