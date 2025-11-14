# Brand Bot Setup Modal - Flow Comparison

## Side-by-Side Comparison

### Step Progression

| Aspect | Established Brand | New/Reimagined Brand |
|--------|-------------------|----------------------|
| **Step 0** | Welcome (1/4) | Welcome (1/4) |
| **Step 1** | Path Selection (2/4) | Path Selection (2/4) |
| **Step 2** | Established Intake (3/4) | Guided Intake (3/4) |
| **Step 3** | Summary (4/4) | Confirmation (4/4) |
| **Total Steps** | 4 shared + mode-specific | 4 shared + mode-specific |

---

## Step-by-Step Breakdown

### Step 0: Welcome (1/4) - IDENTICAL

```
Title: "Turn Ella into Your Marketing Genius"
Subtitle: "In just a few minutes, we'll set up your personal Brand Bot..."

Features:
✓ Auto-crawl your website
✓ Analyze competitors
✓ Learn from your materials

CTA: Next button
```

---

### Step 1: Path Selection (2/4) - IDENTICAL

```
Title: "Who Are You?"
Subtitle: "We'll tailor your setup based on your situation."

Options:
┌──────────────────────┐  ┌──────────────────────┐
│ 📊 Established Brand  │  │ 🌱 New or Reimagining │
│                       │  │                       │
│ You have marketing    │  │ You're starting fresh │
│ materials, existing   │  │ or redefining your    │
│ messaging, or brand   │  │ brand. We'll guide    │
│ assets ready.         │  │ you through discovery.│
│                       │  │                       │
│ • Quick setup         │  │ • Guided interview    │
│ • Auto-run ready      │  │ • Discovery flow      │
│ • Data-driven         │  │ • Build as you go     │
└──────────────────────┘  └──────────────────────┘

CTA: Next button (enabled only after selection)
```

---

### Step 2: Intake Form (3/4) - DIFFERENT

#### Established Brand Intake

```
Title: "Share Your Brand Details"
Subtitle: "Upload materials and add links. Ella will analyze them..."

FORM FIELDS (All Optional):

1. Company Website
   └─ Auto-prefix https://
   └─ Helper: "Ella will auto-crawl your website"

2. Competitor URLs (up to 10)
   ├─ Multi-input interface
   ├─ Add another button
   ├─ Remove buttons
   └─ Helper: "Add up to 10 competitor URLs"

3. File Upload (drag-drop)
   ├─ Supported: PDF, DOCX, PPTX, PNG, JPG, ZIP
   ├─ Max size: 50MB per file
   ├─ Progress tracking
   ├─ Error handling with retry
   └─ Helper: "Drop files that describe your business..."

4. Additional Notes
   ├─ Textarea, max 1000 chars
   ├─ Character counter
   └─ Helper: "Share any other details..."

CTA: [← Back] [Next →]
```

#### New/Reimagined Brand Intake

```
Title: "Help Ella Learn About Your Company"
Subtitle: "Answer a few quick questions to get started. All fields optional."

FORM FIELDS (All Optional):

1. Company Website
   └─ Auto-prefix https://
   └─ Helper: "Ella can learn about your company from your website"

2. File Upload (drag-drop)
   ├─ Supported: PDF, DOCX, PPTX, PNG, JPG, ZIP
   ├─ Max size: 50MB per file
   ├─ Progress tracking
   ├─ Error handling with retry
   └─ Helper: "Share any documents, slides, or images..."

3. Discovery Questions (3 separate textareas)

   Q1: "What does your company do?"
   └─ Max 500 chars with counter
   
   Q2: "Who are your main customers or audiences?"
   └─ Max 500 chars with counter
   
   Q3: "What do you want people to feel about your brand?"
   └─ Max 500 chars with counter

CTA: [← Back] [Next →]
```

### Key Differences in Step 2

| Aspect | Established | New |
|--------|-------------|-----|
| **Number of Inputs** | 4 (URL, Competitors, Files, Notes) | 4 (URL, Files, 3 Questions) |
| **URLs** | Website + up to 10 competitors | Website only |
| **Text Field** | 1 free-form "notes" (1000 chars) | 3 structured questions (500 chars each) |
| **Focus** | Collecting existing materials | Gathering discovery insights |
| **Purpose** | Provide context for BrandBot build | Provide context for guided interview |

---

### Step 3: Summary/Confirmation (4/4) - DIFFERENT

#### Established Brand Summary

```
Title: "Ready to Build Your Brand Bot"
Subtitle: "Here's what we'll use to set up your Brand Bot."

SUMMARY BOX:
├─ Brand Type: 📊 Established Brand
├─ Website: (if provided)
├─ Competitors: (if provided, bulleted list)
├─ Uploaded Files: (file count)
└─ Notes: (if provided)

MILESTONES PREVIEW:
Next Steps:
[Company] [Customers] [Brand]

CTA: [← Back] [Build My BrandBot ▶]
```

#### New/Reimagined Brand Confirmation

```
Title: "You're Ready to Start"
Subtitle: "Let's begin your brand interview. Ella will ask you guided..."

CONFIRMATION BOX:
Your Input:
├─ ✓ Website provided (if yes)
├─ ✓ 2 files uploaded (if yes)
├─ ✓ Company description added (if yes)
├─ ✓ Audience described (if yes)
├─ ✓ Brand feeling shared (if yes)
└─ OR: "Ready to start from scratch" (if all empty)

MILESTONES PREVIEW:
Next Steps (The Guided Interview will walk you through):
[Company Discovery] [Customer Insights] [Brand Strategy]

CTA: [← Back] [Start Guided Interview ▶]
```

### Key Differences in Step 3

| Aspect | Established | New |
|--------|-------------|-----|
| **Title** | "Ready to Build..." | "You're Ready to Start" |
| **Content Focus** | What will be used for build | Checklist of provided input |
| **Milestones** | Company → Customers → Brand | Company Discovery → Customer Insights → Brand Strategy |
| **CTA Label** | "Build My BrandBot" | "Start Guided Interview" |
| **CTA Action** | Calls `onComplete(data)` | Dispatches `brandbot:launch_guided_interview` event |
| **Summary Style** | Detailed sections | Checklist format |

---

## Data Structure Comparison

### Established Brand Output
```javascript
{
  mode: 'established',
  websiteUrl: 'https://example.com',
  competitorUrls: [
    'https://comp1.com',
    'https://comp2.com'
  ],
  files: [
    { id, name, sizeLabel, type, status }
  ],
  notes: 'Additional notes about business...'
}
```

### New/Reimagined Brand Output
```javascript
{
  mode: 'new',
  websiteUrl: 'https://example.com',
  files: [
    { id, name, sizeLabel, type, status }
  ],
  companyDescription: 'What does your company do?',
  targetAudience: 'Who are your customers?',
  brandFeel: 'How should people feel about brand?'
}
```

### Differences
| Field | Established | New |
|-------|-------------|-----|
| `competitorUrls` | ✅ Array | ❌ Not present |
| `notes` | ✅ Single free-form field | ❌ Not present |
| `companyDescription` | ❌ Not present | ✅ Question 1 answer |
| `targetAudience` | ❌ Not present | ✅ Question 2 answer |
| `brandFeel` | ❌ Not present | ✅ Question 3 answer |

---

## Navigation Flow

### Established Brand Flow

```
Step 0: Welcome
    ↓ [Next]
Step 1: Path Selection
    ↓ [Next] (after selecting Established)
Step 2: Established Intake
    ├─ [Back] → Step 1
    └─ [Next] → Step 3
Step 3: Summary
    ├─ [Back] → Step 2 (can edit fields)
    ├─ [Cancel/Close] → Exit modal
    └─ [Build My BrandBot] → Call onComplete()
```

### New/Reimagined Brand Flow

```
Step 0: Welcome
    ↓ [Next]
Step 1: Path Selection
    ↓ [Next] (after selecting New)
Step 2: Guided Intake
    ├─ [Back] → Step 1
    └─ [Next] → Step 3
Step 3: Confirmation
    ├─ [Back] → Step 2 (can edit answers)
    ├─ [Cancel/Close] → Exit modal
    └─ [Start Guided Interview] → Dispatch event, close modal
```

---

## Modal Persistence

### Both Flows - localStorage Key
```
Key: 'brandbot-setup-state'
```

### Established Brand Persisted Fields
```javascript
{
  currentStep: 0-3,
  mode: 'established',
  websiteUrl: string,
  competitorUrls: string[],
  notes: string,
  files: Array<{metadata}>
}
```

### New/Reimagined Brand Persisted Fields
```javascript
{
  currentStep: 0-3,
  mode: 'new',
  websiteUrl: string,
  files: Array<{metadata}>,
  companyDescription: string,
  targetAudience: string,
  brandFeel: string
}
```

---

## Component Logic

### Mode-Aware Rendering

```jsx
// Step 2: Intake Form
{currentStep === 2 && (
  mode === 'established' ? (
    <EstablishedIntake />
  ) : (
    <GuidedIntake />
  )
)}

// Step 3: Summary/Confirmation
{currentStep === 3 && (
  mode === 'established' ? (
    <EstablishedSummary />
  ) : (
    <ConfirmationForm />
  )
)}
```

### Mode-Aware CTA

```jsx
// Primary button in footer
{currentStep === 3 ? (
  mode === 'established' ? (
    <button onClick={handleComplete}>
      Build My BrandBot
    </button>
  ) : (
    <button onClick={handleStartGuidedInterview}>
      Start Guided Interview
    </button>
  )
) : (
  <button onClick={handleNext}>
    Next
  </button>
)}
```

---

## User Experience Differences

### Established Brand UX

**Goal:** Collect existing marketing materials to accelerate BrandBot understanding

**User Mindset:** "I have resources. Let me provide them."

**Process:**
1. Quick intro
2. Select Established
3. Gather URLs and materials
4. Review what will be used
5. Launch build process immediately

**Speed:** Fastest (can skip all fields and proceed)

**Data Quality:** High (relies on real materials)

---

### New/Reimagined Brand UX

**Goal:** Gather discovery insights through guided questions

**User Mindset:** "I'm starting fresh. Help me define my brand."

**Process:**
1. Quick intro
2. Select New/Reimagined
3. Answer discovery questions
4. Optionally add materials
5. Confirm readiness
6. Enter guided interview playbook

**Speed:** Moderate (questions guide thoughtful input)

**Data Quality:** Structured (answers align with discovery framework)

---

## Testing Scenarios

### Scenario 1: Established Brand with Full Materials
```
1. Select Established
2. Enter: website + 3 competitors + 2 files + notes
3. Review complete summary
4. Click Build → onComplete fires
Result: ✅ All data captured and passed
```

### Scenario 2: Established Brand Minimal
```
1. Select Established
2. Enter: just website
3. Skip competitors, files, notes
4. Review summary
5. Click Build → onComplete fires
Result: ✅ Partial data captured, still valid
```

### Scenario 3: New Brand with Answers
```
1. Select New
2. Enter: website + 3 question answers
3. Skip file upload
4. Review checklist (3/5 items)
5. Click Start Interview → event fires
Result: ✅ Answers captured, ready for playbook
```

### Scenario 4: New Brand Starting From Scratch
```
1. Select New
2. Skip: website, files, all questions
3. Review checklist ("Ready to start from scratch")
4. Click Start Interview → event fires
Result: ✅ Clean slate for guided interview
```

### Scenario 5: Resumption (Both Flows)
```
1. Start flow (either established or new)
2. Fill some data
3. Close browser/modal
4. Reopen modal
5. Modal shows same step with all data preserved
6. Continue or edit
Result: ✅ State persisted and restored
```

---

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Modal Framework | ✅ Done | 4 steps, progress bar |
| Step 0: Welcome | ✅ Done | Shared |
| Step 1: Path Selection | ✅ Done | Shared |
| Step 2: Established Intake | ✅ Done | URLs, files, notes |
| Step 2: Guided Intake | ✅ Done | URL, files, 3 questions |
| Step 3: Established Summary | ✅ Done | Calls onComplete |
| Step 3: New Confirmation | ✅ Done | Dispatches event |
| State Persistence | ✅ Done | localStorage with restoration |
| Responsive Design | ✅ Done | Desktop/Tablet/Mobile |
| Accessibility | ✅ Done | WCAG AAA compliant |

---

## Future Enhancements

| Enhancement | Impact | Priority |
|-------------|--------|----------|
| Guided Interview Playbook integration | High | Next ticket |
| Backend file upload | High | Soon |
| Real API endpoints | High | Soon |
| Telemetry/Analytics | Medium | Later |
| Dark mode support | Low | Polish |
| Internationalization | Medium | Later |

---

**Last Updated:** November 2024  
**Implementation:** Complete ✅  
**Testing Ready:** Yes ✅  
**Documentation:** Complete ✅

