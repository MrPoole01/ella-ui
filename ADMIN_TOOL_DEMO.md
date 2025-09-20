# Admin Tool Create Flow Demo

## 🚀 How to Test the Create Entry Flow

### Prerequisites
1. Start the application: `npm start`
2. Login with admin credentials: `demo@example.com` / `password`
3. Click profile dropdown → "Admin Tool"

### 🧪 Test Cases

#### ✅ Happy Path - Template Creation
1. Navigate to Admin Tool → Templates
2. Click "Create Template" (primary yellow button)
3. **Expected:** Type Selector modal opens
4. Select "Template" option
5. Click "Continue"
6. **Expected:** Draft created, Create Drawer opens with template type
7. **Expected:** Draft ID visible in browser console

#### ✅ Happy Path - Playbook Creation
1. Click "Create Playbook" (secondary button)
2. Select "Playbook" option
3. Click "Continue"
4. **Expected:** Create Drawer opens with playbook type

#### ✅ Happy Path - Playbook Series Creation
1. Click "Create Playbook Series" (secondary button)
2. Select "Playbook Series" option
3. Click "Continue"
4. **Expected:** Create Drawer opens with group type

#### ✅ Cancel Flow
1. Click any Create button
2. Click "Cancel" in modal
3. **Expected:** Modal closes, no draft created

#### ✅ No Selection
1. Click any Create button
2. **Don't select any type**
3. **Expected:** Continue button remains disabled

#### ✅ Keyboard Navigation
1. Open Type Selector modal
2. Use Tab to navigate between options
3. Use Enter to select/continue
4. Use Esc to close modal
5. **Expected:** Full keyboard accessibility

### 🔍 What to Look For

#### Browser Console Output
- Telemetry events logged:
  - `admin_create_clicked`
  - `type_selector_opened`
  - `type_selected` (with selected type)
  - `create_draft_success` (with draft ID)
  - `create_drawer_opened` (with type)

#### Local Storage
- **ella-drafts**: Contains created draft objects
- **ella-telemetry**: Contains all telemetry events

#### Visual Feedback
- Modal animations (fade in/slide in)
- Button state changes (disabled/enabled)
- Loading states during draft creation
- Error states (simulated 10% failure rate)

### 🛠️ Draft Structure
Each draft contains:
```json
{
  "id": "draft_1234567890_abc123",
  "type": "template|playbook|group",
  "status": "draft",
  "created_by": "current_user_id",
  "created_at": "2024-01-01T00:00:00.000Z",
  "last_modified_at": "2024-01-01T00:00:00.000Z",
  "origin": "admin",
  "progress_step": "type_selected"
}
```

### 🚨 Error Testing
The mock API has a 10% chance of simulating server errors. If you get an error:
1. **Expected:** Error message appears in modal
2. **Expected:** Modal stays open for retry
3. Try clicking Continue again

### 🎯 RBAC Testing
1. Logout and login with non-admin credentials
2. **Expected:** Admin Tool option not visible in profile dropdown
3. If you manually navigate to `/admin/templates`
4. **Expected:** Redirected to main app (403 handling)

### 📱 Responsive Testing
1. Resize browser window to mobile size
2. **Expected:** Modal adapts to smaller screen
3. **Expected:** Buttons stack vertically on mobile

### ♿ Accessibility Testing
1. Use Tab key to navigate modal
2. Use screen reader (if available)
3. **Expected:** Proper focus management
4. **Expected:** ARIA labels and roles work correctly

## 🔧 Implementation Details

### Files Created/Modified
- **TypeSelectorModal.jsx** - Main modal component
- **TypeSelectorModal.scss** - Modal styling
- **CreateDrawer.jsx** - Stub drawer component
- **CreateDrawer.scss** - Drawer styling
- **AdminTool.jsx** - Integrated modal handlers

### Key Features Implemented
- ✅ Type selection with radio-card style options
- ✅ Draft creation with UUID generation
- ✅ Error handling (network, 403, 422)
- ✅ Full keyboard navigation
- ✅ Focus trap and accessibility
- ✅ Telemetry event logging
- ✅ Responsive design
- ✅ Loading states and animations
- ✅ RBAC protection

### Next Steps (Future Tickets)
- Implement actual Create Drawer content builders
- Add draft recovery/resume functionality
- Connect to real backend APIs
- Add more sophisticated error handling
- Implement scope/tag logic
- Add draft management in Templates list
