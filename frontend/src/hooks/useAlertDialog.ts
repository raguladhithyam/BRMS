import { useState, useCallback } from 'react';

interface AlertDialogState {
  open: boolean;
  title: string;
  description?: string;
  type: 'info' | 'success' | 'warning' | 'error';
  confirmText: string;
  cancelText: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel: boolean;
}

export const useAlertDialog = () => {
  const [state, setState] = useState<AlertDialogState>({
    open: false,
    title: '',
    description: '',
    type: 'info',
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: true,
  });

  const showAlert = useCallback((
    title: string,
    description?: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    confirmText: string = 'OK'
  ) => {
    setState({
      open: true,
      title,
      description,
      type,
      confirmText,
      cancelText: 'Cancel',
      onConfirm: undefined,
      onCancel: undefined,
      showCancel: false,
    });
  }, []);

  const showConfirm = useCallback((
    title: string,
    description?: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    type: 'info' | 'success' | 'warning' | 'error' = 'warning',
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel'
  ) => {
    setState({
      open: true,
      title,
      description,
      type,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      showCancel: true,
    });
  }, []);

  const closeDialog = useCallback(() => {
    setState(prev => ({ ...prev, open: false }));
  }, []);

  return {
    ...state,
    showAlert,
    showConfirm,
    closeDialog,
    onOpenChange: (open: boolean) => {
      if (!open) {
        closeDialog();
      }
    },
  };
}; 