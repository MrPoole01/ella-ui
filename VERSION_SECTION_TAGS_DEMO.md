# Version, Section & Tags Selection Demo

## 🚀 How to Test the Version/Section/Tags Configuration

### Prerequisites
1. Start the application: `npm start`
2. Login with admin credentials: `demo@example.com` / `password`
3. Navigate to Admin Tool → Templates → Create
4. Select any type (Template/Playbook/Series) and click "Continue"

### 🧪 Test Cases

#### ✅ Version Selection Flow
1. **Initial State**: Version selector shows "Select version..." with red asterisk (required)
2. **Open Dropdown**: Click version selector to see all 6 options
3. **Option Details**: Each option shows label + description
4. **Selection**: Click any version to select it
5. **Expected**: Dropdown closes, selected version displays, secondary selectors appear

#### ✅ Ella Version Flow
1. Select "Ella (System)"
2. **Expected**: No secondary selectors appear (org/workspace/brandbot disabled)
3. **Expected**: Section dropdown shows Ella-specific sections:
   - Unassigned
   - Marketing
   - Sales  
   - Support
   - Operations

#### ✅ Special Edition Flow
1. Select "Special Edition"
2. **Expected**: Edition dropdown appears
3. Select "DTM Edition"
4. **Expected**: Section dropdown shows DTM-specific sections:
   - Unassigned
   - DTM Campaigns
   - DTM Analytics
5. Try "Partnernomics Edition"
6. **Expected**: Section dropdown shows Partnernomics sections:
   - Unassigned
   - Partner Onboarding
   - Partner Resources

#### ✅ Organization/Workspace/BrandBot Cascading Flow
1. Select "Organization", "Workspace", or "BrandBot"
2. **Expected**: Organization dropdown appears
3. Select "Acme Corp"
4. **Expected**: If Workspace/BrandBot selected, Workspace dropdown appears
5. Select "Creative Studio"
6. **Expected**: If BrandBot selected, BrandBot dropdown appears
7. Select "Brand Voice Bot"
8. **Expected**: All selections persist, sections show custom options

#### ✅ Global Version Flow
1. Select "Global"
2. **Expected**: No org/workspace pickers (applies to all workspaces)
3. **Expected**: Section dropdown shows global sections:
   - Unassigned
   - Global Templates
   - Global Workflows

#### ✅ Section Selection
1. After selecting any version, section dropdown appears
2. **Label**: "Assign to Section" with info icon tooltip
3. **Default**: Shows "Select section..."
4. **Options**: Vary based on selected version
5. **Selection**: Click any section to select it
6. **Expected**: Auto-saves to draft

#### ✅ Tags Integration
1. After version selection, tags section appears
2. **Input Field**: "Search and add tags..." placeholder
3. **Type to Search**: Start typing "mar" 
4. **Expected**: Suggestions dropdown shows matching tags
5. **Tag Types**: Each tag shows colored icon:
   - 🛡️ Blue: Ella tags (system, non-editable)
   - 🏢 Green: Workspace tags (editable)
   - 🌐 Purple: Global tags (editable)
6. **Add Tag**: Click suggestion to add
7. **Expected**: Tag appears as chip with type icon
8. **Remove Tag**: Click X on editable tags
9. **Expected**: Tag removes, non-editable tags have no X

#### ✅ Auto-Save & Recovery
1. Select version, section, add tags
2. Close drawer without clicking Save
3. Re-open Create flow with same type
4. **Expected**: All selections restored from draft
5. **Console**: Check for `draft_auto_saved` telemetry events

#### ✅ Progress Indicator
1. **Step 1**: "Type Selected" - Green checkmark (completed)
2. **Step 2**: "Configure Scope" - Yellow with pulse animation (current)
3. **Step 3**: "Build Content" - Gray (pending)
4. After selecting version: Step 2 becomes green checkmark
5. Continue button enabled: "Save & Continue"

### 🔍 **What to Look For**

#### **Visual Feedback:**
- Required field indicator (red asterisk)
- Dropdown animations (slide in/out)
- Tag animations (slide in when added)
- Progress step animations (pulse effect)
- Color-coded tag type icons
- Tooltip on section info icon

#### **Cascading Logic:**
- Edition selector only for Special Edition
- Org selector for Org/Workspace/BrandBot
- Workspace selector only after org selected
- BrandBot selector only after workspace selected
- Section options change based on version

#### **Browser Console Output:**
```
Telemetry Event: version_selected {version: "ella"}
Telemetry Event: draft_auto_saved {draft_id: "draft_123", version_type: "ella", has_section: true, tag_count: 2}
```

#### **Local Storage:**
- **ella-drafts**: Updated with version_type, section_id, tags array
- **ella-telemetry**: Contains selection events

### 🎯 **Mock Data Structure**

#### **Version Options:**
- `ella` - Ella (System)
- `edition` - Special Edition  
- `organization` - Organization
- `workspace` - Workspace
- `brandbot` - BrandBot
- `global` - Global

#### **Mock Editions:**
- DTM Edition
- Partnernomics Edition
- Enterprise Edition

#### **Mock Organizations:**
- Acme Corp
- TechStart Inc
- Global Solutions Ltd

#### **Mock Tags with Types:**
- **Ella Tags** (non-editable): Marketing, Sales, Support
- **Workspace Tags** (editable): Creative, Campaign
- **Global Tags** (editable): Urgent, Draft

#### **Draft Structure:**
```json
{
  "id": "draft_123",
  "type": "template",
  "version_type": "ella",
  "edition_id": null,
  "organization_id": null,
  "workspace_id": null,
  "brandbot_id": null,
  "section_id": "ella_marketing",
  "tags": [
    {"id": "ella_marketing", "name": "Marketing", "type": "ella", "editable": false},
    {"id": "ws_creative", "name": "Creative", "type": "workspace", "editable": true}
  ],
  "progress_step": "scope_selected"
}
```

### 🎨 **Visual Design Features**

#### **Form Layout:**
- Clean vertical form with 24px gaps
- Consistent dropdown styling
- Required field indicators
- Helpful tooltips and descriptions

#### **Dropdown Design:**
- Dark theme (#262626 background)
- Smooth animations (slide in/out)
- Hover states and focus indicators
- Selected state highlighting (#FFC700)

#### **Tag Chips:**
- Rounded chip design with type icons
- Color-coded by tag type
- Remove buttons for editable tags
- Smooth add/remove animations

#### **Progress Indicator:**
- Three-step visual progress
- Connected line between steps
- Color-coded states (gray/yellow/green)
- Pulsing animation for current step

### 📱 **Responsive Behavior**

#### **Desktop (> 768px):**
- Full form width with proper spacing
- Side-by-side tag chips
- Complete dropdown menus

#### **Mobile (< 768px):**
- Stacked form layout
- Full-width dropdowns
- Wrapped tag chips
- Adjusted spacing and font sizes

### ♿ **Accessibility Features**

#### **Keyboard Navigation:**
- Tab through all form elements
- Enter to open/select in dropdowns
- Arrow keys for dropdown navigation
- Escape to close dropdowns

#### **Screen Reader Support:**
- ARIA labels for all form elements
- Required field announcements
- Tag type descriptions
- Progress step status

#### **Visual Accessibility:**
- High contrast colors
- Clear focus indicators
- Icon + text combinations
- Tooltip descriptions

### 🔧 **Integration Points**

#### **Draft System:**
- Auto-saves on every selection
- Restores state on reopening
- Tracks progress through steps
- Persists in localStorage

#### **Telemetry Events:**
- `version_selected` - Version choice
- `draft_auto_saved` - Auto-save events
- All events include contextual data

#### **Type-Specific Logic:**
- Section options vary by version
- Cascading selectors based on version
- Tag filtering and suggestions
- Progress tracking per draft

## 🎯 **Future Enhancements**

The current implementation provides a complete foundation for:
- Real backend API integration for organizations/workspaces
- Dynamic section loading based on actual configuration
- Real tag management with CRUD operations
- Advanced tag filtering and search
- Bulk tag operations
- Custom section creation
- Role-based permission filtering
- Advanced cascading logic with real data relationships

The mock implementation demonstrates all required functionality and provides a production-ready foundation for version, section, and tags configuration with comprehensive auto-save, recovery, and user experience features.
