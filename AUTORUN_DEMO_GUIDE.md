# Variable-based (Auto-run) Runner — Demo Guide

## 🎬 How to Test the Implementation

### Step 1: Navigate to the Demo Page

```bash
# In your browser, navigate to:
http://localhost:3000/demo/playbook
# (or wherever your React app is running)
```

You should see:
```
┌─────────────────────────────────────────────────────┐
│  Playbook Input Panel Demo                          │
│                                                      │
│  Test the complete playbook run workflow            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  How to Test                                         │
│  1. Click "Run Playbook" below                      │
│  2. Select workspace (defaults to current)          │
│  3. Select or create a project                      │
│  4. Choose ICPs or "All ICPs"                       │
│  5. Optionally add instructions and files           │
│  6. Choose your run mode:                           │
│     • Play with Ella - Step-by-step (separate)     │
│     • Auto-run Play - Variable-based ⭐            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  📋 Playbook Preview                                │
│                                                      │
│  Post-Event Networking Follow-Up Series             │
│  A comprehensive playbook for following up...       │
│                                                      │
│  Plays in this Playbook:                            │
│  ① Voicemail Script                                 │
│  ② Follow-Up Email                                  │
│                                                      │
│  ┌─────────────────────────────────────────────┐  │
│  │         Run Playbook                        │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

### Step 2: Click "Run Playbook"

The **Input Panel** drawer opens on the right side:

```
┌────────────────────────────────────────────────────────┐
│  Post-Event Networking Follow-Up Series    [← Back][×]│
├────────────────────────────────────────────────────────┤
│                                                         │
│  Workspace *                                           │
│  [Marketing Team ▼]                                    │
│                                                         │
│  Project *                                             │
│  [Q4 Campaign ▼]  [+ Create new project]              │
│                                                         │
│  Audience (ICPs) *                                     │
│  ☐ All ICPs                                            │
│  ☑ Enterprise CMOs                                     │
│  ☐ SMB Marketing Managers                             │
│                                                         │
│  Special Instructions (optional)                       │
│  ┌─────────────────────────────────────────────┐     │
│  │ Focus on urgency and ROI                    │     │
│  │                                              │ 43  │
│  └─────────────────────────────────────────────┘2000 │
│                                                         │
│  Add Files (optional)                                  │
│  ┌─────────────────────────────────────────────┐     │
│  │  Drag & drop files here or browse          │     │
│  │  PDF, DOCX, PPTX, XLSX, TXT, PNG, JPG      │     │
│  └─────────────────────────────────────────────┘     │
│                                                         │
├────────────────────────────────────────────────────────┤
│           [Play with Ella]  [Auto-run Play] ⭐        │
└────────────────────────────────────────────────────────┘
```

**Action**: Fill in the required fields and click **"Auto-run Play"**

---

### Step 3: Variable-based Runner Opens

The runner opens at **Play 1** with the Variables Panel:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Post-Event Networking Follow-Up Series  [Auto-run Mode]              [×] │
│  Play 1 of 2 (Auto-run)                                        0% Complete │
│  [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━]   │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                    │
│  │ Play 1       │  │ Play 2       │  │              │                    │
│  │ Voicemail... │  │ Follow-Up... │  │              │                    │
│  │ ▶ 📁(0) ℹ   │  │ ▶ 📁(0) ℹ   │  │              │                    │
│  └──────────────┘  └──────────────┘  └──────────────┘                    │
│     ACTIVE          PENDING                                                │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ LEFT PANE (Output Viewer)           │ RIGHT PANE (Variables + Chat)       │
│                                     │                                      │
│  ┌─────────────────────────────┐   │  ┌────────────────────────────────┐ │
│  │  📄  Empty State             │   │  │ Variables for Voicemail Script │ │
│  │                              │   │  │ Play 1 of 2                    │ │
│  │       📄                     │   │  ├────────────────────────────────┤ │
│  │                              │   │  │ Event Name *                   │ │
│  │  Generated outputs will      │   │  │ [____________________]         │ │
│  │  appear here                 │   │  │                                │ │
│  │                              │   │  │ Contact Name *                 │ │
│  │  Run a play to see results   │   │  │ [____________________]         │ │
│  │                              │   │  │                                │ │
│  └─────────────────────────────┘   │  │ Event Date *                   │ │
│                                     │  │ [____/____/____]               │ │
│                                     │  │                                │ │
│                                     │  │ Urgency Level                  │ │
│                                     │  │ [Select an option ▼]           │ │
│                                     │  │                                │ │
│                                     │  │ ☐ Include Call-to-Action       │ │
│                                     │  └────────────────────────────────┘ │
│                                     │  ┌────────────────────────────────┐ │
│                                     │  │ Chat for Minor Edits           │ │
│                                     │  ├────────────────────────────────┤ │
│                                     │  │  After running this play,      │ │
│                                     │  │  you can request minor edits   │ │
│                                     │  │  here.                         │ │
│                                     │  └────────────────────────────────┘ │
├─────────────────────────────────────┴──────────────────────────────────────┤
│  [← Previous Play]                          [Run Play] ⭐                  │
└────────────────────────────────────────────────────────────────────────────┘
```

---

### Step 4: Fill Variables

**Action**: Fill in all required fields:
- Event Name: `Tech Summit 2024`
- Contact Name: `Sarah Chen`
- Event Date: `2024-12-15`
- Urgency Level: `High`
- Include Call-to-Action: `✓` (checked)

Notice: **"Run Play"** button becomes enabled when all required (*) fields are filled.

---

### Step 5: Click "Run Play"

The generation process starts:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ RIGHT PANE (Variables + Chat)                                              │
│                                                                             │
│  ┌────────────────────────────────┐                                       │
│  │ Variables for Voicemail Script │  (fields now disabled)                │
│  │ ...                            │                                       │
│  └────────────────────────────────┘                                       │
│  ┌────────────────────────────────┐                                       │
│  │ Chat for Minor Edits           │                                       │
│  ├────────────────────────────────┤                                       │
│  │  [E] Generating Voicemail      │  ← "Thinking" indicator               │
│  │      Script...                 │     (pulsing animation)               │
│  │                                │                                       │
│  └────────────────────────────────┘                                       │
└────────────────────────────────────────────────────────────────────────────┘
```

After ~2.5 seconds, the output appears:

```
┌─────────────────────────────────────┬──────────────────────────────────────┐
│ LEFT PANE (Output Viewer)           │ RIGHT PANE (Variables + Chat)       │
│                                     │                                      │
│  ┌─────────────────────────────┐   │  ┌────────────────────────────────┐ │
│  │ 📄 Voicemail_Script_123.docx│×  │  │ Variables for Voicemail Script │ │
│  ├─────────────────────────────┤   │  │ (fields re-enabled)            │ │
│  │                              │   │  └────────────────────────────────┘ │
│  │ # Voicemail Script           │   │  ┌────────────────────────────────┐ │
│  │                              │   │  │ Chat for Minor Edits           │ │
│  │ Generated at 12/20/24 2:30pm │   │  ├────────────────────────────────┤ │
│  │                              │   │  │  [E] ✓ Voicemail Script        │ │
│  │ ## Variables Used            │   │  │      generated successfully!   │ │
│  │ - event_name: Tech Summit    │   │  │      You can now review or     │ │
│  │ - contact_name: Sarah Chen   │   │  │      request minor edits.      │ │
│  │ - event_date: 2024-12-15     │   │  │                                │ │
│  │ - urgency: High              │   │  │  [________________][➤]         │ │
│  │ - include_cta: true          │   │  │  (chat input active)           │ │
│  │                              │   │  └────────────────────────────────┘ │
│  │ ## Output                    │   │                                      │
│  │                              │   │                                      │
│  │ Hi Sarah, this is [Name]...  │   │                                      │
│  │                              │   │                                      │
│  └─────────────────────────────┘   │                                      │
└─────────────────────────────────────┴──────────────────────────────────────┘

Notice the Play Card updates:
┌──────────────┐
│ Play 1       │
│ Voicemail... │
│ ↻ 📁(1) ℹ   │  ← Replay icon, file count = 1
└──────────────┘
   COMPLETED
```

Footer now shows:
```
│  [← Previous Play]    [Re-run Play]  [Next Play →] ⭐                      │
```

---

### Step 6: (Optional) Request Chat Edit

**Action**: Type in chat: `Make the tone more casual`

```
┌────────────────────────────────┐
│ Chat for Minor Edits           │
├────────────────────────────────┤
│  [E] ✓ Voicemail Script        │
│      generated successfully!   │
│                                │
│  [U] Make the tone more casual │  ← Your message
│                                │
│  [E] I've noted your feedback. │  ← Ella's response
│      The updated version will  │     (appears after ~800ms)
│      reflect these changes...  │
│                                │
│  [________________][➤]         │
└────────────────────────────────┘
```

**Action**: Click **"Re-run Play"** to apply edits (creates new output)

---

### Step 7: View File from Play Card

**Action**: Click the files badge `📁(1)` on Play 1 card

```
┌──────────────┐
│ Play 1       │
│ Voicemail... │
│ ↻ 📁(1) ℹ   │  ← Click here
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────┐
│ 👁 Voicemail_Script_123.docx  12 KB  │🗑  ← Hover shows actions
└──────────────────────────────────────┘
```

**Action**: Click the eye icon `👁` to preview file in left pane

---

### Step 8: Advance to Next Play

**Action**: Click **"Next Play →"**

The runner advances to Play 2:

```
┌────────────────────────────────────────────────────────────────────────────┐
│  Post-Event Networking Follow-Up Series  [Auto-run Mode]              [×] │
│  Play 2 of 2 (Auto-run)                                       50% Complete │
│  [━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━]   │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐                                       │
│  │ Play 1       │  │ Play 2       │                                       │
│  │ Voicemail... │  │ Follow-Up... │                                       │
│  │ ↻ 📁(1) ℹ   │  │ ▶ 📁(0) ℹ   │  ← Now active                         │
│  └──────────────┘  └──────────────┘                                       │
│    COMPLETED          ACTIVE                                               │
├─────────────────────────────────────┬──────────────────────────────────────┤
│ LEFT PANE                           │ RIGHT PANE                           │
│                                     │                                      │
│  (Previous Play 1 output still     │  ┌────────────────────────────────┐ │
│   visible in viewer)                │  │ Variables for Follow-Up Email  │ │
│                                     │  │ Play 2 of 2                    │ │
│                                     │  ├────────────────────────────────┤ │
│                                     │  │ Discussion Topics *            │ │
│                                     │  │ ┌────────────────────────────┐ │ │
│                                     │  │ │                            │ │ │
│                                     │  │ │                            │ │ │
│                                     │  │ └────────────────────────────┘ │ │
│                                     │  │                                │ │
│                                     │  │ Email Tone *                   │ │
│                                     │  │ [Select an option ▼]           │ │
│                                     │  │                                │ │
│                                     │  │ Proposed Next Steps            │ │
│                                     │  │ ┌────────────────────────────┐ │ │
│                                     │  │ │                            │ │ │
│                                     │  │ └────────────────────────────┘ │ │
│                                     │  └────────────────────────────────┘ │
└─────────────────────────────────────┴──────────────────────────────────────┘
```

---

### Step 9: Complete Play 2

**Action**: Fill variables → Click "Run Play"

After generation:
```
Footer now shows:
│  [← Previous Play]    [Re-run Play]  [Finish Playbook] ⭐                 │
                                        (Last play shows Finish)
```

---

### Step 10: Finish Playbook

**Action**: Click **"Finish Playbook"**

The runner closes and returns to the demo page. Console shows:
```javascript
Telemetry: playbook_run_completed {
  totalPlays: 2,
  completedPlays: 2,
  timestamp: "2024-12-20T14:35:00.000Z",
  playbookId: 1,
  mode: "auto_run"
}
```

---

## 🎯 Additional Features to Test

### Test Previous Play Navigation
1. Complete Play 1
2. Move to Play 2
3. Click **"← Previous Play"**
4. Verify: Returns to Play 1 with output still visible

### Test Play Card Direct Navigation
1. Complete Play 1
2. Move to Play 2
3. Click **Play 1 card** in the top strip
4. Verify: Jumps directly to Play 1

### Test Replay Action
1. Complete Play 1
2. Click the **↻ (replay icon)** on Play 1 card
3. Verify: Navigates to Play 1 and allows re-running

### Test File Deletion
1. Generate Play 1 (creates file)
2. Click files badge `📁(1)`
3. Click trash icon `🗑`
4. Confirm deletion
5. Verify: File removed, badge shows `📁(0)`

### Test Info Popover
1. Click **ℹ** icon on any Play card
2. Verify popover shows:
   - Play Title
   - Description
   - Estimated Time to Run

### Test Session Save
1. Complete Play 1
2. Start filling Play 2 variables (don't run)
3. Click **Close (×)**
4. Modal appears: "Save your progress?"
5. Click **"Save & Close"**
6. Verify: Drawer closes
7. Click "Run Playbook" → "Auto-run Play" again
8. (In real app, would restore session)

### Test Validation
1. Leave required field empty
2. Try to click **"Run Play"**
3. Verify: Button is disabled (grayed out)
4. Fill the field
5. Verify: Button becomes enabled

### Test Escape Key
1. Open runner
2. Press **Esc**
3. If no progress: Closes immediately
4. If progress: Shows confirmation modal

---

## 🐛 Known Demo Limitations

1. **Mock Data**: Uses simulated API calls (2.5s delay)
2. **File Content**: Files don't actually download (preview only)
3. **Session Recovery**: localStorage save works, but auto-restore not implemented in demo
4. **Permissions**: ACL checks are simulated (always allow)
5. **Real-time Updates**: No WebSocket integration

---

## 📸 Visual Reference

### Desktop (1400px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ◄─────────────────────── 55% ─────────────┤◄────── 45% ───────►           │
│  [           Output Viewer                  │  Variables + Chat  ]          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tablet/Small Desktop (< 1200px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [           Output Viewer                    ]  ▲                          │
│  ───────────────────────────────────────────────                            │
│  [           Variables + Chat                 ]  ▼                          │
└─────────────────────────────────────────────────────────────────────────────┘
```
(Switches to vertical stack)

---

## ✅ Testing Checklist

Use this checklist when testing the demo:

- [ ] Open demo page at `/demo/playbook`
- [ ] Click "Run Playbook"
- [ ] Fill Input Panel (workspace, project, ICPs)
- [ ] Click "Auto-run Play"
- [ ] Verify runner opens at Play 1
- [ ] Fill all required variables
- [ ] Verify "Run Play" enabled
- [ ] Click "Run Play"
- [ ] Verify output appears in left pane
- [ ] Verify file created (badge count = 1)
- [ ] Click files badge → view file
- [ ] Click files badge → delete file (confirm)
- [ ] Send chat message
- [ ] Click "Re-run Play"
- [ ] Click "Next Play"
- [ ] Verify Play 2 loads
- [ ] Fill Play 2 variables
- [ ] Click "Run Play"
- [ ] Click "Finish Playbook"
- [ ] Verify drawer closes
- [ ] Test "Previous Play" button
- [ ] Test Play card direct navigation
- [ ] Test info popover (ℹ)
- [ ] Test replay icon (↻)
- [ ] Test Escape key
- [ ] Test "Save & Close" modal
- [ ] Test keyboard navigation (Tab)
- [ ] Inspect console for telemetry events

---

## 🚀 Next Steps After Demo

1. **Backend Integration**:
   - Replace mock API calls with real endpoints
   - Implement file storage (S3/Azure)
   - Set up session persistence in database

2. **Testing**:
   - Write unit tests for component logic
   - Write integration tests for workflows
   - Write E2E tests with Cypress/Playwright

3. **Production**:
   - Feature flag deployment
   - Monitor telemetry events
   - Gather user feedback
   - Iterate on UX improvements

---

**Happy Testing!** 🎉

For questions or issues, refer to:
- **Full Guide**: `AUTORUN_PLAYBOOK_RUNNER_GUIDE.md`
- **Quick Ref**: `AUTORUN_QUICK_REFERENCE.md`
- **Architecture**: `AUTORUN_ARCHITECTURE.md`
- **Summary**: `AUTORUN_IMPLEMENTATION_SUMMARY.md`

