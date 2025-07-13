# AlertDialog Component

A reusable AlertDialog component built with Radix UI that replaces regular browser alerts and confirms with a modern, accessible dialog.

## Features

- **Multiple Types**: Support for info, success, warning, and error dialogs
- **Customizable**: Configurable titles, descriptions, and button text
- **Accessible**: Built on Radix UI primitives for full accessibility
- **Animated**: Smooth enter/exit animations
- **Responsive**: Works well on all screen sizes

## Usage

### Basic Setup

```tsx
import AlertDialog from '@/components/shared/AlertDialog';
import { useAlertDialog } from '@/hooks/useAlertDialog';

const MyComponent = () => {
  const alertDialog = useAlertDialog();

  return (
    <div>
      {/* Your component content */}
      
      <AlertDialog
        open={alertDialog.open}
        onOpenChange={alertDialog.onOpenChange}
        title={alertDialog.title}
        description={alertDialog.description}
        type={alertDialog.type}
        confirmText={alertDialog.confirmText}
        cancelText={alertDialog.cancelText}
        onConfirm={alertDialog.onConfirm}
        onCancel={alertDialog.onCancel}
        showCancel={alertDialog.showCancel}
      />
    </div>
  );
};
```

### Show Simple Alert

```tsx
// Success alert
alertDialog.showAlert('Success', 'Operation completed successfully', 'success');

// Error alert
alertDialog.showAlert('Error', 'Something went wrong', 'error');

// Info alert
alertDialog.showAlert('Information', 'Here is some information', 'info');

// Warning alert
alertDialog.showAlert('Warning', 'Please be careful', 'warning');
```

### Show Confirmation Dialog

```tsx
alertDialog.showConfirm(
  'Delete Item',
  'Are you sure you want to delete this item? This action cannot be undone.',
  () => {
    // Handle confirmation
    console.log('User confirmed deletion');
  },
  () => {
    // Handle cancellation (optional)
    console.log('User cancelled deletion');
  },
  'warning', // dialog type
  'Delete',  // confirm button text
  'Cancel'   // cancel button text
);
```

## API Reference

### useAlertDialog Hook

Returns an object with the following properties and methods:

#### Properties
- `open: boolean` - Whether the dialog is open
- `title: string` - Dialog title
- `description?: string` - Dialog description
- `type: 'info' | 'success' | 'warning' | 'error'` - Dialog type
- `confirmText: string` - Confirm button text
- `cancelText: string` - Cancel button text
- `showCancel: boolean` - Whether to show cancel button
- `onConfirm?: () => void` - Confirm callback
- `onCancel?: () => void` - Cancel callback

#### Methods
- `showAlert(title, description?, type?, confirmText?)` - Show a simple alert
- `showConfirm(title, description?, onConfirm?, onCancel?, type?, confirmText?, cancelText?)` - Show a confirmation dialog
- `closeDialog()` - Close the dialog
- `onOpenChange(open)` - Handle open state changes

### AlertDialog Component Props

- `open: boolean` - Whether the dialog is open
- `onOpenChange: (open: boolean) => void` - Handle open state changes
- `title: string` - Dialog title
- `description?: string` - Dialog description
- `type?: 'info' | 'success' | 'warning' | 'error'` - Dialog type (default: 'info')
- `confirmText?: string` - Confirm button text (default: 'OK')
- `cancelText?: string` - Cancel button text (default: 'Cancel')
- `onConfirm?: () => void` - Confirm callback
- `onCancel?: () => void` - Cancel callback
- `showCancel?: boolean` - Whether to show cancel button (default: true)

## Dialog Types

- **info**: Blue theme with info icon
- **success**: Green theme with checkmark icon
- **warning**: Yellow theme with warning icon
- **error**: Red theme with error icon

## Examples

### Replacing window.alert()

```tsx
// Before
alert('Operation successful!');

// After
alertDialog.showAlert('Success', 'Operation successful!', 'success');
```

### Replacing window.confirm()

```tsx
// Before
if (window.confirm('Are you sure?')) {
  // handle confirmation
}

// After
alertDialog.showConfirm(
  'Confirm Action',
  'Are you sure?',
  () => {
    // handle confirmation
  }
);
```

### Error Handling

```tsx
try {
  await someAsyncOperation();
  alertDialog.showAlert('Success', 'Operation completed successfully', 'success');
} catch (error) {
  alertDialog.showAlert('Error', 'Operation failed. Please try again.', 'error');
}
```

## Migration Guide

1. Import the AlertDialog component and useAlertDialog hook
2. Add the AlertDialog component to your JSX
3. Replace `alert()` calls with `alertDialog.showAlert()`
4. Replace `window.confirm()` calls with `alertDialog.showConfirm()`
5. Add success/error alerts to async operations 