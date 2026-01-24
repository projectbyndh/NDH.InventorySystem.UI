# Global Button Components Documentation

This document describes the standardized button components available in the inventory application. Use these components for consistent UI/UX across all pages.

## Components Overview

### 1. **ActionButton** (`/Ui/ActionButton.jsx`)
**Purpose:** Primary page-level actions like "Add Vendor", "Add Warehouse", "Add Unit"

**Usage:**
```jsx
import ActionButton from "../UI/ActionButton";
import { Plus, Upload, Download } from "lucide-react";

// Primary action (default)
<ActionButton onClick={startCreate}>
  Add Vendor
</ActionButton>

// With custom icon
<ActionButton onClick={handleExport} icon={Download}>
  Export Data
</ActionButton>

// Secondary variant
<ActionButton onClick={handleImport} icon={Upload} variant="secondary">
  Import Data
</ActionButton>
```

**Props:**
- `children` - Button text
- `onClick` - Click handler
- `icon` - Lucide icon component (default: Plus)
- `disabled` - Boolean
- `variant` - "primary" | "secondary"
- `className` - Additional CSS classes

---

### 2. **FormButton** (`/Ui/FormButton.jsx`)
**Purpose:** Form submission buttons (Create/Update/Cancel)

**Usage:**
```jsx
import FormButton from "../UI/FormButton";

// Submit button with loading state
<FormButton
  type="submit"
  variant="primary"
  loading={loading}
  loadingText="Saving..."
>
  {editingId ? "Update Vendor" : "Create Vendor"}
</FormButton>

// Cancel button
<FormButton
  type="button"
  variant="secondary"
  onClick={cancelForm}
>
  Cancel
</FormButton>

// Delete confirmation
<FormButton
  variant="danger"
  loading={loading}
  loadingText="Deleting..."
  onClick={confirmDelete}
>
  Delete
</FormButton>
```

**Props:**
- `children` - Button text
- `type` - "button" | "submit"
- `variant` - "primary" | "secondary" | "danger"
- `loading` - Boolean (shows spinner)
- `loadingText` - Text to show when loading
- `disabled` - Boolean
- `onClick` - Click handler
- `fullWidth` - Boolean (default: false, uses flex-1)
- `className` - Additional CSS classes

---

### 3. **BackButton** (`/Ui/BackButton.jsx`)
**Purpose:** Navigation back button for form pages

**Usage:**
```jsx
import BackButton from "../UI/BackButton";

// Icon only (default)
<BackButton onClick={cancelForm} />

// With label
<BackButton onClick={cancelForm} showLabel label="Back to List" />
```

**Props:**
- `onClick` - Click handler
- `label` - Aria label / visible text
- `showLabel` - Boolean (show text label)
- `className` - Additional CSS classes

---

### 4. **IconActionButton** (`/Ui/IconActionButton.jsx`)
**Purpose:** Small icon buttons for table actions (Edit, Delete, View)

**Usage:**
```jsx
import IconActionButton from "../UI/IconActionButton";
import { Edit2, Trash2, Eye } from "lucide-react";

// Edit button
<IconActionButton
  icon={Edit2}
  variant="edit"
  onClick={() => startEdit(item)}
  ariaLabel="Edit"
/>

// Delete button
<IconActionButton
  icon={Trash2}
  variant="delete"
  onClick={() => openDelete(item)}
  ariaLabel="Delete"
/>

// View button
<IconActionButton
  icon={Eye}
  variant="view"
  onClick={() => viewDetails(item)}
  ariaLabel="View Details"
/>
```

**Props:**
- `icon` - Lucide icon component
- `onClick` - Click handler
- `variant` - "default" | "edit" | "delete" | "view" | "info"
- `disabled` - Boolean
- `ariaLabel` - Accessibility label
- `size` - "sm" | "md" | "lg"
- `className` - Additional CSS classes

---

### 5. **Button** (`/Ui/Button.jsx`)
**Purpose:** General-purpose button for various use cases

**Usage:**
```jsx
import Button from "../UI/Button";
import { Save, Download } from "lucide-react";

// Primary button
<Button variant="primary" onClick={handleSave}>
  Save Changes
</Button>

// With icon
<Button variant="primary" icon={Save} onClick={handleSave}>
  Save
</Button>

// Icon on right
<Button variant="outline" icon={Download} iconPosition="right" onClick={handleDownload}>
  Download
</Button>

// Loading state
<Button variant="primary" loading onClick={handleSubmit}>
  Submit
</Button>

// Full width
<Button variant="success" fullWidth onClick={handleConfirm}>
  Confirm
</Button>
```

**Props:**
- `children` - Button text
- `variant` - "primary" | "secondary" | "danger" | "success" | "outline" | "ghost"
- `size` - "sm" | "md" | "lg"
- `type` - "button" | "submit"
- `onClick` - Click handler
- `disabled` - Boolean
- `loading` - Boolean (shows spinner)
- `icon` - Lucide icon component
- `iconPosition` - "left" | "right"
- `fullWidth` - Boolean
- `className` - Additional CSS classes

---

## Migration Guide

### Before (Old Pattern):
```jsx
// List page - Add button
<button
  onClick={startCreate}
  className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold
             hover:bg-black transition-all flex items-center gap-2 shadow-lg"
>
  <Plus className="w-6 h-6" />
  Add Vendor
</button>

// Form page - Submit button
<button
  type="submit"
  disabled={loading}
  className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl font-bold text-lg
             hover:bg-black disabled:opacity-50 transition-all
             flex items-center justify-center gap-2 shadow-lg"
>
  {loading ? (
    <>
      <Spinner size={6} className="inline-block mr-2" />
      Saving...
    </>
  ) : (
    <>{editingId ? "Update Vendor" : "Create Vendor"}</>
  )}
</button>

// Form page - Cancel button
<button
  type="button"
  onClick={cancelForm}
  disabled={loading}
  className="flex-1 border-2 border-slate-300 text-slate-700 py-3.5 rounded-xl font-bold text-lg
             hover:bg-slate-50 disabled:opacity-50 transition-all"
>
  Cancel
</button>
```

### After (New Pattern):
```jsx
import ActionButton from "../UI/ActionButton";
import FormButton from "../UI/FormButton";
import BackButton from "../UI/BackButton";

// List page - Add button
<ActionButton onClick={startCreate}>
  Add Vendor
</ActionButton>

// Form page - Back button
<BackButton onClick={cancelForm} />

// Form page - Submit and Cancel buttons
<div className="flex gap-4 pt-8">
  <FormButton
    type="submit"
    variant="primary"
    loading={loading}
    loadingText="Saving..."
  >
    {editingId ? "Update Vendor" : "Create Vendor"}
  </FormButton>
  
  <FormButton
    type="button"
    variant="secondary"
    onClick={cancelForm}
    disabled={loading}
  >
    Cancel
  </FormButton>
</div>
```

---

## Benefits

✅ **Consistency** - Same look and feel across all pages  
✅ **Maintainability** - Update styles in one place  
✅ **Accessibility** - Built-in ARIA labels and keyboard support  
✅ **Loading States** - Automatic spinner and disabled state  
✅ **Type Safety** - Clear prop definitions  
✅ **Flexibility** - Customizable with className prop  
✅ **Performance** - Optimized re-renders  

---

## Design System

All buttons follow the application's design system:

- **Primary Color:** `slate-900` → `black` on hover
- **Border Radius:** `rounded-xl` (12px)
- **Font Weight:** `font-bold` for action buttons, `font-semibold` for general buttons
- **Shadows:** `shadow-lg` for primary actions, `shadow-md` for secondary
- **Transitions:** `transition-all` with `active:scale-95` for tactile feedback
- **Disabled State:** `opacity-50` with `cursor-not-allowed`
