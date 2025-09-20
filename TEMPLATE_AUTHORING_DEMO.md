# Template Authoring Form Demo

This document provides instructions for testing the new template authoring form in the Admin Tool.

## Prerequisites

1. **Admin Access**: Log in as `demo@example.com` to get admin privileges
2. **Navigation**: Access Admin Tool from the profile dropdown menu

## Testing the Template Authoring Flow

### 1. Access the Create Flow

1. Navigate to **Admin Tool** → **Templates**
2. Click the **"Create"** button
3. Select **"Template"** in the Type Selector modal
4. Click **"Continue"** to create a draft

### 2. Scope Configuration Step

1. **Version Selection**: Choose where the template should be available:
   - Ella (System): Global, platform-wide templates
   - Special Edition: Tied to edition (e.g., DTM, Partnernomics)
   - Organization: Customer-level organization
   - Workspace: Specific workspace
   - BrandBot: BrandBot-specific
   - Global: Across all workspaces within account

2. **Tags**: Search and add tags to categorize the template
   - System tags (Ella) are non-editable
   - Workspace and global tags can be added/removed

3. Click **"Continue to Form"** to proceed to the authoring step

### 3. Template Authoring Form

The form is organized into sections with a mini table of contents:

#### 📄 Basics Section
- **Title** (required): Template name (max 80 characters)
- **Preview** (required): Brief description for search results (max 160 characters)
- **Description** (optional): Detailed description (max 1,000 characters)
- **Thumbnail** (optional): Upload an image (recommended 400x300px)

#### ✏️ Prompt Section
- **System Prompt** (required): The AI prompt that will be executed (max 30,000 characters)
- Includes helpful tips for writing effective prompts
- Monospace font for better code readability
- Warning when approaching character limits

#### 🎯 ICP & Stage Section
- **ICP (Ideal Customer Profile)**: Dropdown with common options + "Other" for custom input
- **Stage/Moment**: Free text describing when the template would be used

#### 📝 Inputs Section
- **Dynamic Input Fields**: Add/remove input fields that users will fill at runtime
- **Field Types**: Short text, long text, number, boolean, single select, multi-select, date, file upload, URL
- **Field Configuration**:
  - Label (required): Display name for the field
  - Key (required): Unique identifier (auto-generated from label, editable)
  - Type: Field type selector
  - Placeholder: Hint text for users
  - Default Value: Pre-filled value
  - Required: Toggle for required fields
  - Help Text: Additional guidance for users
- **Options**: For select types, configure available choices
- **Reordering**: Move fields up/down with arrow buttons
- **Quick Add**: Buttons for common field types

#### 📎 Context Section
- **Context Attachments**: Upload files or add links for prompt context
- **Tags Display**: Read-only view of tags from the scope step
- Note: Context attachments are different from runtime file inputs

## Key Features

### ✅ **Validation**
- Real-time validation with error messages
- Character count indicators
- Required field enforcement
- Unique input key validation (snake_case, 2-40 characters)

### 💾 **Auto-save**
- Form data is automatically saved after 1 second of inactivity
- "Saved" indicator with timestamp appears after save
- Draft is preserved when closing and reopening the drawer

### 🔄 **Navigation**
- **Back to Scope**: Return to scope configuration step
- **Change Type**: Return to type selector (preserves draft)
- **Preview**: View template card and simulated intake form (coming soon)
- **Cancel**: Close with option to keep or discard draft

### 📱 **Responsive Design**
- Mobile-optimized layout
- Collapsible sections on small screens
- Touch-friendly controls

## Testing Scenarios

### Basic Template Creation
1. Fill out Basics section with title and preview
2. Add a simple prompt in the Prompt section
3. Verify validation prevents saving without required fields
4. Check auto-save functionality

### Complex Template with Inputs
1. Create a template with multiple input types
2. Add select options with labels and values
3. Test input reordering functionality
4. Verify key uniqueness validation

### Draft Persistence
1. Start creating a template
2. Close the drawer
3. Reopen and verify all data is preserved
4. Test navigation between steps

### Mobile Testing
1. Test on mobile viewport
2. Verify all sections are accessible
3. Check touch interactions work properly

## Error Handling

- **Network Errors**: Graceful fallback with retry options
- **Validation Errors**: Inline error messages with clear guidance
- **Auto-save Failures**: User notification with manual save option

## Demo Data

The form includes mock data for:
- Version options (Ella, Edition, Organization, etc.)
- ICP options (Enterprise, SMB, Startup, etc.)
- Tag types (System, Workspace, Global)

## Next Steps

- Preview modal implementation
- File upload functionality
- Rich text editor for prompts
- Template testing/validation
- Publishing workflow
