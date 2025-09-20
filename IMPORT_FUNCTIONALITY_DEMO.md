# Excel Import Functionality Demo

## 🚀 How to Test the Excel Import Feature

### Prerequisites
1. Start the application: `npm start`
2. Login with admin credentials: `demo@example.com` / `password`
3. Navigate to Admin Tool → Templates
4. Click "Create" button

### 🧪 Test Cases

#### ✅ Import Flow - Template Import
1. Click "Create" button
2. Select "Template" option
3. **Expected:** "Import from Excel" button appears on the left
4. Click "Import from Excel"
5. **Expected:** Import modal opens with template-specific instructions
6. Select an Excel/CSV file (.xlsx, .xls, .csv)
7. Click "Import"
8. **Expected:** Processing animation, then success/error results

#### ✅ Import Flow - Playbook Import  
1. Click "Create" button
2. Select "Playbook" option
3. Click "Import from Excel"
4. **Expected:** Import modal shows playbook-specific column requirements
5. Upload file and import
6. **Expected:** Shows grouped playbook creation logic

#### ✅ Import Flow - Playbook Series Import
1. Click "Create" button
2. Select "Playbook Series" option
3. Click "Import from Excel"
4. **Expected:** Import modal shows series hierarchy requirements
5. Upload file and import
6. **Expected:** Shows series → playbooks → plays creation

#### ✅ File Validation Tests
1. Try uploading a non-Excel file (e.g., .txt, .pdf)
2. **Expected:** Error message about file type
3. Try uploading a file > 10MB
4. **Expected:** Error message about file size
5. Upload valid Excel/CSV file
6. **Expected:** File accepted, shows file name and size

#### ✅ Error Handling Tests
1. Upload valid file and click Import
2. **Expected:** ~10% chance of simulated errors in results
3. **Expected:** Error list shows specific row issues
4. **Expected:** Success count shows items created despite errors

### 🎯 **Import Requirements by Type**

#### **Template Import Columns:**
- `Name` (required) - Template name
- `Section` (optional) - Template category  
- `Tags` (optional) - Comma-separated tags
- `Description/Preview` (required) - Template description
- `Input Fields` (optional) - JSON array of input definitions
- `Instruction/Prompt Text` (required) - The template prompt

#### **Playbook Import Columns:**
- `Playbook ID` (optional) - Groups plays into playbooks
- `Play Title` (required) - Individual play name
- `Play Instructions/Prompt` (required) - Play content
- `Tags` (optional) - Comma-separated tags
- `Description` (optional) - Playbook description
- `Order` (optional) - Play order within playbook

#### **Playbook Series Import Columns:**
- `Series ID` (optional) - Groups playbooks into series
- `Series Title` (required if Series ID provided) - Series name
- `Playbook ID` (required) - Individual playbook identifier
- `Play Title` (required) - Individual play name
- `Play Instructions/Prompt` (required) - Play content
- `Series Order` (optional) - Playbook order within series
- `Play Order` (optional) - Play order within playbook

### 🔍 **What to Look For**

#### **UI Behavior:**
- Import button only appears after type selection
- Import button has Excel icon and blue styling
- Modal shows type-specific instructions
- File upload shows drag/drop styling
- Processing shows spinner animation
- Success shows green checkmark with counts
- Errors show red warning with specific messages

#### **Browser Console Output:**
```
Telemetry Event: import_excel_clicked {type: "template"}
Telemetry Event: import_started {type: "template", filename: "templates.xlsx", fileSize: 12345}
Telemetry Event: import_success {type: "template", itemsCreated: 5, errorsCount: 1}
Telemetry Event: import_completed {type: "template", itemCount: 5}
```

#### **Local Storage:**
- **ella-telemetry**: Contains import-related events
- **ella-drafts**: May contain imported items (mock implementation)

#### **Mock Results:**
- 3-12 successful imports per file
- 0-2 random errors per file
- Different success counts based on type:
  - Templates: Direct 1:1 mapping
  - Playbooks: Groups plays (e.g., 6 plays → 3 playbooks)
  - Series: Creates hierarchy (e.g., 9 plays → 1 series with 3 playbooks)

### 🎨 **Visual Design Features**

#### **Import Button:**
- Blue background (#4A90E2)
- Excel icon in light green
- Only visible after type selection
- Positioned on left side of footer

#### **Import Modal:**
- Larger than type selector (700px vs 600px)
- Higher z-index (1002 vs 1000)
- File upload with dashed border
- Type-specific instruction sections
- Color-coded success (green) and error (red) sections

#### **File Upload:**
- Drag/drop visual styling
- File type validation
- Shows selected file with size
- Excel icon for selected files
- Upload cloud icon for placeholder

### 🛠️ **Mock Implementation Details**

#### **File Processing:**
- Simulates 2-second processing time
- Generates 3-12 mock successful items
- Generates 0-2 mock error messages
- File validation for .xlsx, .xls, .csv types
- 10MB file size limit

#### **Error Simulation:**
- Row-specific error messages
- Missing required field errors
- Duplicate name warnings
- Invalid format notifications

#### **Success Results:**
- Type-specific item counting
- Hierarchical grouping for playbooks/series
- Immediate UI feedback
- Telemetry event logging

### 📱 **Responsive Testing**

#### **Desktop (> 768px):**
- Side-by-side footer layout
- Import button on left, Continue/Cancel on right
- Full modal width (700px)

#### **Mobile (< 768px):**
- Stacked footer layout
- Import button above Continue/Cancel
- Full-width buttons
- Smaller file upload area

### ♿ **Accessibility Features**

#### **Keyboard Navigation:**
- Tab through all interactive elements
- Enter to activate buttons
- Escape to close modals
- Focus management between modals

#### **Screen Reader Support:**
- ARIA labels for file input
- Role attributes for modals
- Semantic heading structure
- Error announcements

#### **Visual Accessibility:**
- High contrast error/success colors
- Clear visual hierarchy
- Icon + text combinations
- Focus indicators

### 🔧 **Integration Points**

#### **Type Selector Modal:**
- Import button appears after type selection
- Button styling matches modal theme
- Proper modal layering (import modal on top)

#### **Create Flow:**
- Import completes the create flow
- Closes both modals on success
- Could integrate with template list refresh
- Maintains telemetry event chain

#### **Error Handling:**
- File type validation
- File size validation
- Processing error handling
- Network error simulation
- User-friendly error messages

## 🎯 **Future Enhancements**

The current implementation provides a complete foundation for:
- Real Excel/CSV parsing (using libraries like SheetJS)
- Actual backend API integration
- Real validation logic based on column headers
- Template list refresh after import
- Draft creation for imported items
- Batch operations and conflict resolution
- Progress indicators for large files
- Preview before import confirmation

The mock implementation demonstrates all the required functionality and provides a solid base for production enhancement.
