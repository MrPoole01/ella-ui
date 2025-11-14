# Brand Bot Setup Modal Implementation Guide

## Overview

The `BrandBotSetupModal` is a 4-step, full-screen centered modal designed for established businesses to set up their Brand Bot. It replaces the previous `BrandBotPreviewDrawer` and provides a guided, progressive setup experience.

## Features

✅ **4-Step Progressive Flow**
1. Welcome / Intro - Friendly overview
2. Path Selection - Choose between Established Brand or New/Reimagined
3. Established Brand Intake - Collect URLs, files, and notes
4. Confirmation / Summary - Review and launch

✅ **Data Persistence** - Modal state automatically saves to localStorage and resumes where user left off

✅ **File Management**
- Drag-and-drop support
- Multi-file upload with progress tracking
- Supported formats: PDF, DOCX, PPTX, PNG, JPG, ZIP
- File size limit: 50MB per file

✅ **URL Handling**
- Auto-prefix `https://` to website URL
- Support for up to 10 competitor URLs
- Easy add/remove interface

✅ **Responsive Design** - Works on desktop, tablet, and mobile

✅ **Accessibility** - Full keyboard navigation and screen reader support

## Component Location

- **Component**: `/src/components/features/BrandBotSetupModal.jsx`
- **Styles**: `/src/styles/BrandBotSetupModal.scss`
- **Export**: Available from `/src/components/features/index.js`

## Usage

### Basic Implementation

```jsx
import { BrandBotSetupModal } from '../components/features';

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleComplete = (data) => {
    console.log('Setup complete:', data);
    // data = {
    //   mode: 'established' | 'new',
    //   websiteUrl: string (auto-prefixed),
    //   competitorUrls: string[],
    //   files: Array<{id, file, name, sizeLabel, type, status, error}>,
    //   notes: string
    // }
    
    // Trigger BrandBot build process
    launchBrandBotBuild(data);
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>Start Brand Bot</button>
      
      <BrandBotSetupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onComplete={handleComplete}
        persistedStateKey="brandbot-setup-state" // Optional: custom storage key
      />
    </>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | — | Controls modal visibility |
| `onClose` | function | — | Callback when user closes modal |
| `onComplete` | function | — | Callback with setup data when "Build My BrandBot" is clicked |
| `persistedStateKey` | string | `'brandbot-setup-state'` | localStorage key for state persistence |

### onComplete Data Structure

```typescript
interface SetupData {
  mode: 'established' | 'new';
  websiteUrl: string | null;          // null for 'new' mode
  competitorUrls: string[];
  files: UploadedFile[];
  notes: string | null;               // null for 'new' mode
}

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  sizeLabel: string;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error: string | null;
}
```

## Integration with EllamentDrawer

The modal is integrated into the EllamentDrawer component and activates when users click the "Play" button on the Brand Bot Playbook card.

```jsx
// In EllamentDrawer.jsx
const handleBrandBotSetupComplete = (data) => {
  const updated = {
    ...brandBotProgress,
    status: 'running',
    mode: data.mode,
    websiteUrl: data.websiteUrl,
    competitorUrls: data.competitorUrls,
    files: data.files,
    notes: data.notes
  };
  persistBrandBot(updated);
  window.dispatchEvent(new CustomEvent('brandbot:series_started', { detail: updated }));
  setShowBrandBotPreview(false);
};

<BrandBotSetupModal
  isOpen={showBrandBotPreview}
  onClose={() => setShowBrandBotPreview(false)}
  onComplete={handleBrandBotSetupComplete}
/>
```

## State Persistence

The modal automatically persists its state to localStorage using the key `'brandbot-setup-state'` (customizable via `persistedStateKey` prop).

**Persisted State:**
- `currentStep` - Current step in the flow (0-3)
- `mode` - Selected mode ('established' or 'new')
- `websiteUrl` - Website URL entered
- `competitorUrls` - Array of competitor URLs
- `notes` - Additional notes
- `files` - File metadata (excluding File objects)

**Limitations:**
- File objects themselves are not persisted (only metadata)
- On modal completion, persisted state is cleared

## Styling & Theming

The modal uses the existing Ella UI theme system via SCSS variables:

```scss
// Key theme variables used:
--theme-bg-primary      // Modal background
--theme-bg-secondary    // Secondary backgrounds
--theme-text-primary    // Primary text
--theme-text-secondary  // Secondary text
--theme-border-primary  // Borders
#F2B340                 // Primary CTA (yellow)
#1A1A1A                 // CTA text (black)
```

### Customization

To customize colors, override in your theme file:

```scss
.brandbot-setup-modal {
  --modal-primary-color: #your-color;
  --modal-text-color: #your-text-color;
}
```

## Step-by-Step Flow

### Step 0: Welcome
- Displays friendly overview
- Features list showing capabilities
- "Next" button to proceed

### Step 1: Path Selection
- Two cards: "Established Brand" and "New or Reimagining"
- Selection persists
- "New" path currently routes to separate ticket flow
- "Established" proceeds to intake step

### Step 2: Intake (Established Brand Only)
- **Website URL**: Required field, auto-prefixes `https://`
- **Competitor URLs**: Up to 10 optional URLs with add/remove
- **File Upload**: Drag-drop zone or click to browse
- **Notes**: Optional free-text field (max 1000 chars)
- Users can skip uploads and proceed with just URLs or notes

### Step 3: Summary
- Review of all entered data
- List of competitors added
- File count display
- Milestones preview (Company → Customers → Brand)
- Primary CTA: "Build My BrandBot"

## File Upload Details

### Supported File Types
- PDF
- Microsoft Word (DOC, DOCX)
- Microsoft PowerPoint (PPTX)
- Images (PNG, JPG, JPEG)
- Archives (ZIP)

### File Upload Process
1. Validation check (type & size)
2. Simulated upload with progress bar (0-100%)
3. Status indicators:
   - ✓ Completed (green)
   - × Error (red) with retry button
   - Progress bar during upload
4. Remove button available for all files

### Upload Simulation

The component simulates file uploads with realistic progress. For production:

```jsx
// Replace simulateUpload() with actual API call:
const handleUploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    // Update file status to 'completed'
  } catch (error) {
    // Set file status to 'error'
  }
};
```

## Accessibility

- Full keyboard navigation
- ARIA labels and descriptions
- Screen reader support
- Focus management
- High contrast text
- Error announcements via `aria-live="polite"`

## URL Auto-Prefix Logic

The website URL field automatically adds `https://` if the user enters a URL without a protocol:

```javascript
// Input: "example.com"
// Output: "https://example.com"

// Input: "http://example.com" (unchanged)
// Input: "https://example.com" (unchanged)
```

## Error Handling

### File Upload Errors
- File type not supported
- File size exceeds 50MB
- Retry button available

### Form Validation
- Website URL not required (can skip)
- At least one data point optional (URLs, files, or notes)
- No validation errors prevent "Next" on intake step

## Responsive Breakpoints

```scss
// Desktop: Full width modal (600px max)
// Tablet (max-width: 768px): 90vw width
// Mobile (max-width: 600px): 95vw width, adjusted spacing
// Small Mobile (max-width: 480px): Footer buttons wrap
```

## Known Limitations & Future Improvements

1. **New/Reimagined Flow**: Currently shows selection but routes to separate ticket flow
2. **File Persistence**: File objects cannot be stored in localStorage (metadata only)
3. **Upload Simulation**: Current implementation simulates uploads; needs backend integration
4. **Offline Support**: No offline queueing of uploads
5. **Localization**: Hardcoded English text (no i18n)

## Troubleshooting

### Modal Not Appearing
- Check `isOpen` prop is `true`
- Verify `persistedStateKey` is unique if multiple modals
- Check browser console for errors

### State Not Persisting
- Verify localStorage is enabled in browser
- Check for localStorage quota issues
- Clear localStorage and try again

### Files Not Uploading
- Check file size (max 50MB)
- Check file type (must be supported)
- Verify `handleFileInput` is working (check console)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- Uses `useCallback` for memoized handlers
- Progress bars update at 300ms intervals
- Lazy file validation
- Efficient state updates

## Security Notes

- File uploads are validated client-side and server-side (TODO)
- No sensitive data stored in localStorage by default
- Persisted state cleared after completion
- File objects not serialized in storage

## Future Enhancements

- [ ] Real backend file upload integration
- [ ] Drag-drop preview before upload
- [ ] Paste image from clipboard
- [ ] Multiple file selection with checkboxes
- [ ] Undo/redo functionality
- [ ] Step jump navigation
- [ ] Analytics tracking
- [ ] A/B testing variations
- [ ] Guided tour / Pendo integration
- [ ] New/Reimagined flow implementation

