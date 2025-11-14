# Brand Bot Setup Modal Demo Guide

## Overview

This guide demonstrates the new **Brand Bot Setup Modal** - a 4-step, full-screen centered modal that replaces the previous input panel for established businesses setting up their Brand Bot.

## How to Access the Modal

### Trigger Point
The modal activates when a user clicks the **Play button** on the Brand Bot Playbook card in the Ella-ment Drawer.

**Navigation Path:**
1. Open Ella-ment Drawer (from sidebar)
2. Look for "Brand Bot Playbook" card in the header section
3. Click the **Play** button (triangle icon)
4. Modal opens with Welcome step

### Alternative: Direct Component Usage

```jsx
import { BrandBotSetupModal } from './components/features';

<BrandBotSetupModal
  isOpen={true}
  onClose={() => {}}
  onComplete={(data) => console.log(data)}
/>
```

## Modal Features Demo

### Step 1: Welcome (Intro Screen)

**What You See:**
- 🚀 Large emoji icon
- "Turn Ella into Your Marketing Genius" headline
- Friendly introduction text
- Feature checklist:
  - ✓ Auto-crawl your website
  - ✓ Analyze competitors
  - ✓ Learn from your materials

**Actions:**
- Click "Next" to proceed to Path Selection
- Click "Close" or backdrop to cancel

**Key Points:**
- Sets expectations for the flow
- No required fields
- Progress shows 1/4

---

### Step 2: Path Selection (Who Are You?)

**What You See:**
- Two selectable mode cards:
  1. **📊 Established Brand** - For existing marketing materials
  2. **🌱 New or Reimagining** - For fresh starts/rebranding

**Card Details:**
- Icon and title
- Description text
- Feature badges (Quick setup, Auto-run ready, etc.)
- Border highlights on selection with yellow (#F2B340)

**Actions:**
- Click either card to select
- Click "Next" to proceed (enabled only after selection)
- Click "Back" to return to Welcome

**Interaction Details:**
- Cards show hover state with yellow border
- Selected card has yellow border and subtle background
- Only "Next" button is active after selection

**Important Notes:**
- Selection persists if user navigates back
- **New/Reimagining** path routes to separate ticket flow (currently logs message)
- **Established Brand** proceeds to Intake step

---

### Step 3: Intake Form (Share Your Brand Details)

**This step only appears if "Established Brand" was selected.**

**Form Fields:**

#### 1. Company Website
- Input field with placeholder "https://example.com"
- **Auto-prefix Logic:** If user enters "example.com", system converts to "https://example.com"
- Helper text: "Ella will auto-crawl your website in the background"
- Not required but recommended

#### 2. Competitor URLs (Optional)
- Multi-input system with "Add another" button
- Can add up to 10 competitor URLs
- Remove button (×) appears after first URL
- Each input has placeholder like "https://competitor1.com"
- Helper text: "Add up to 10 competitor URLs"

**Try This:**
- Add 2-3 competitor URLs
- Click "Add another" multiple times
- Try removing a URL
- Try exceeding 10 URLs (Add button hides)

#### 3. File Upload (Optional)
- **Drag & Drop Zone**
  - Dashed border, hover state shows yellow highlight
  - Supports drag-over indication
  - Upload icon (arrow pointing up)
  
- **Supported Formats:**
  - PDF, DOCX, PPTX, PNG, JPG, ZIP
  - Max 50MB per file

- **Upload Process:**
  1. Drag files or click to browse
  2. Files appear in list below
  3. Progress bar shows 0-100%
  4. Completion checkmark (✓) in green
  5. Error state shows red × with retry button
  6. Remove button (×) available

**Try This:**
- Drag a file into the zone (or click to select)
- Watch progress bar animate 0-100%
- See completion checkmark appear
- Try adding another file
- Try removing a file

#### 4. Additional Notes (Optional)
- Textarea field
- Max 1000 characters
- Character counter shown below (e.g., "245 / 1000")
- Placeholder: "Share any other details about your business, market, or goals..."

**Try This:**
- Type some notes
- Watch character counter update
- Approach 1000 characters
- Try typing beyond limit (blocked)

**Navigation:**
- All fields optional - "Next" always enabled
- Click "Next" to proceed to Summary
- Click "Back" to return to Path Selection

**Progress Indicator:**
- Shows 3/4 at top

---

### Step 4: Summary & Confirmation

**What You See:**
- Review box with collected data organized by section
- **Brand Type:** Shows selected mode (📊 Established Brand or 🌱 New)
- **Website:** Displays entered URL
- **Competitors:** Bulleted list of URLs
- **Uploaded Files:** Shows count (e.g., "2 files")
- **Notes:** Displays entered text

**Milestones Preview:**
- Three yellow badges showing the flow:
  - Company
  - Customers
  - Brand

**Actions:**
- Click "Build My BrandBot" to complete setup
  - Triggers `onComplete` callback with full data
  - Clears persisted state
  - Modal closes
  - Backend process should initialize

- Click "Back" to edit any information
- Click "Close" to cancel without saving

**Progress Indicator:**
- Shows 4/4

---

## State Persistence Demo

### How It Works
- Modal state auto-saves to localStorage
- If user closes mid-way, state is preserved

### Try This:
1. Open modal
2. Complete Step 1 (Welcome) → click Next
3. Select "Established Brand" → click Next
4. Fill in website URL: "example.com"
5. Add a competitor URL
6. **Refresh page or close modal**
7. Open modal again
8. **Notice:** You're back at Step 3 with your entries preserved!

### Clearing Persisted State
- Automatic: When user clicks "Build My BrandBot"
- Manual: `localStorage.removeItem('brandbot-setup-state')`

---

## Visual Design Elements

### Color Scheme
- **Primary CTA (Yellow):** #F2B340
- **CTA Text (Black):** #1A1A1A
- **Success (Green):** #16A34A
- **Error (Red):** #EA4444
- **Background:** Uses theme variables

### Spacing & Layout
- Modal: 600px max width (90vw on mobile)
- 4:3 aspect ratio roughly
- Rounded corners: 20px (modal), 8px (inputs)
- 24px padding content, 16px form groups

### Typography
- **Title:** 24px, 600 weight
- **Subtitle:** 14px, secondary color
- **Labels:** 14px, 600 weight
- **Helper text:** 12px, secondary color

---

## Responsive Behavior

### Desktop (> 768px)
- Full modal visibility
- 600px max width
- Two-column mode selection cards

### Tablet (768px to 480px)
- 90vw width
- Single column layout
- Adjusted padding

### Mobile (< 480px)
- 95vw width
- Full-height responsive
- Footer buttons wrap and stack
- Single-column everything

**Try This:**
- Resize browser window to test responsive behavior
- Test on actual mobile device

---

## Keyboard Navigation

### Supported Keys
- **Tab:** Navigate between fields
- **Shift+Tab:** Navigate backwards
- **Enter:** Submit button or trigger action
- **Escape:** Close modal
- **Space:** Select mode cards or toggle checkboxes

### Try This:
- Tab through form fields
- Select mode card with arrow keys + Enter
- Trigger button actions with Enter
- Close modal with Escape

---

## Error Scenarios

### File Upload Errors

1. **Unsupported File Type**
   - Attempt to upload .exe, .zip (without zip in supported list)
   - Red error message: "File type not supported"
   - Retry button available

2. **File Too Large**
   - Attempt to upload > 50MB file
   - Red error message: "File size too large (max 50MB)"
   - Retry button available

3. **Upload Failure**
   - After upload completes, simulate failure (demo uses random success)
   - Red error message with retry option

### Try This:
- Attempt to upload an unsupported file
- See error appear immediately
- Click Retry
- Remove file

---

## Data Output Example

When user clicks "Build My BrandBot", the following data is passed to `onComplete` callback:

```javascript
{
  mode: "established",
  websiteUrl: "https://example.com",
  competitorUrls: [
    "https://competitor1.com",
    "https://competitor2.com"
  ],
  files: [
    {
      id: "brandguide.pdf-1699564800000-0.123",
      file: File object,
      name: "brandguide.pdf",
      sizeLabel: "2.5 MB",
      type: "PDF",
      status: "completed",
      error: null
    },
    {
      id: "product-overview.pptx-1699564810000-0.456",
      file: File object,
      name: "product-overview.pptx",
      sizeLabel: "5.2 MB",
      type: "PPTX",
      status: "completed",
      error: null
    }
  ],
  notes: "We're a B2B SaaS company focused on marketing automation..."
}
```

---

## Testing Checklist

### Functionality
- [ ] Modal opens on Play button click
- [ ] Progress bar updates 1/4 → 2/4 → 3/4 → 4/4
- [ ] Next/Back buttons work correctly
- [ ] Mode selection persists across steps
- [ ] File upload progress animates
- [ ] Character counter updates in real-time
- [ ] Auto-prefix applies to website URL
- [ ] Competitor URL add/remove works
- [ ] Summary shows all entered data correctly
- [ ] "Build My BrandBot" callback fires with correct data

### Persistence
- [ ] State saves to localStorage
- [ ] State restores after page refresh
- [ ] State clears after completion
- [ ] Can resume mid-flow

### Responsiveness
- [ ] Modal displays correctly on desktop
- [ ] Modal displays correctly on tablet
- [ ] Modal displays correctly on mobile
- [ ] Buttons stack on small screens
- [ ] Form fields are touch-friendly

### Accessibility
- [ ] Keyboard navigation works (Tab/Shift+Tab)
- [ ] Modal closes with Escape key
- [ ] Buttons are focusable
- [ ] Screen reader announces step progress
- [ ] Error messages announced live

### Visual
- [ ] Yellow (#F2B340) primary color visible
- [ ] Selected mode card highlights yellow
- [ ] Progress bar fills correctly
- [ ] File icons display
- [ ] Milestones badges show in summary

---

## Known Issues & Limitations

1. **New/Reimagined Flow**
   - Currently just shows selection
   - Actual flow routing in separate ticket
   - Console logs: "New/Reimagined flow - should be handled in separate ticket"

2. **File Upload Simulation**
   - Uses random progress for demo
   - Real implementation needs backend
   - Files persist in component state only (not localStorage)

3. **No Backend Integration**
   - Setup data is logged but not sent to server
   - "Build My BrandBot" doesn't actually build yet
   - Needs API endpoint implementation

---

## Quick Tips

- **Fastest Path:** Company Website → Next → Summary → Build
- **Full Demo:** Add URLs, upload files, add notes → Summary → Build
- **Edit:** Use Back buttons at any step to modify entries
- **Reset:** Close modal and clear localStorage if needed
- **Debug:** Open DevTools → Application → Storage → LocalStorage → check 'brandbot-setup-state'

---

## Next Steps (Ticketed Features)

- [ ] New/Reimagined path implementation
- [ ] Backend file upload integration
- [ ] API endpoint for BrandBot creation
- [ ] Pendo guide overlay integration
- [ ] Analytics/telemetry tracking
- [ ] Email notifications on completion
- [ ] Multiple project support

