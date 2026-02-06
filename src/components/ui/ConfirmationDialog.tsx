'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, X, Check, Info, ShieldAlert } from 'lucide-react';

export type ConfirmationVariant = 'danger' | 'warning' | 'info';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  initialFocus?: 'confirm' | 'cancel';
  size?: 'sm' | 'md' | 'lg';
}

const variantConfig = {
  danger: {
    icon: ShieldAlert,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    borderColor: 'border-red-200',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
    buttonColor: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    borderColor: 'border-amber-200',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    borderColor: 'border-blue-200',
  },
};

const sizeConfig = {
  sm: 'max-w-sm p-4',
  md: 'max-w-md p-6',
  lg: 'max-w-lg p-8',
};

export function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  variant = 'warning',
  isLoading = false,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  initialFocus = 'confirm',
  size = 'md',
}: ConfirmationDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const config = variantConfig[variant];
  const Icon = config.icon;
  const dialogSize = sizeConfig[size];

  // Save active element before dialog opens
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Set initial focus
      const timeout = setTimeout(() => {
        if (initialFocus === 'cancel' && cancelButtonRef.current) {
          cancelButtonRef.current.focus();
        } else if (confirmButtonRef.current) {
          confirmButtonRef.current.focus();
        }
      }, 100);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = '';
        clearTimeout(timeout);
      }
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, initialFocus]);

  // Focus trap and escape key handling
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }

      // Trap focus within dialog
      if (e.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const dialogRef = dialogRefValue;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onCancel]);

  // Ref to access dialog element in effects
  const dialogRefValue = useRef<HTMLDivElement>(null);

  const handleConfirm = useCallback(() => {
    if (!isLoading) {
      onConfirm();
    }
  }, [isLoading, onConfirm]);

  const handleCancel = useCallback(() => {
    if (!isLoading) {
      onCancel();
    }
  }, [isLoading, onCancel]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      handleCancel();
    }
  }, [closeOnOverlayClick, handleCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Dialog Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          ref={dialogRefValue}
          className={`relative bg-white rounded-xl shadow-xl w-full ${dialogSize} transform transition-all`}
          role="document"
        >
          {/* Icon */}
          <div className={`flex justify-center mb-4 ${config.bgColor} rounded-full w-16 h-16 mx-auto items-center`}>
            <Icon className={`w-8 h-8 ${config.iconColor}`} aria-hidden="true" />
          </div>

          {/* Title */}
          <h2
            id="dialog-title"
            className="text-xl font-bold text-gray-900 text-center mb-2"
          >
            {title}
          </h2>

          {/* Message */}
          <div
            id="dialog-message"
            className="text-gray-600 text-center mb-6"
          >
            {typeof message === 'string' ? <p>{message}</p> : message}
          </div>

          {/* Actions */}
          <div className="flex gap-3" role="group" aria-label="Dialog actions">
            <button
              ref={cancelButtonRef}
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-2 focus:ring-gray-300 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              aria-label={cancelText}
            >
              {cancelText}
            </button>
            <button
              ref={confirmButtonRef}
              onClick={handleConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2.5 text-white rounded-lg focus:ring-2 focus:ring-offset-2 ${config.buttonColor} transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center`}
              aria-label={confirmText}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  <span>Memproses...</span>
                </span>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" aria-hidden="true" />
                  {confirmText}
                </>
              )}
            </button>
          </div>

          {/* Keyboard hint for screen readers */}
          <p className="mt-4 text-xs text-center text-gray-400">
            Tekan <kbd className="px-1 py-0.5 bg-gray-100 rounded border">Esc</kbd> untuk membatalkan
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Convenience component for danger/confirmation dialogs
 * Useful for delete confirmations, destructive actions, etc.
 */
export function DangerDialog({
  isOpen,
  title = 'Apakah Anda yakin?',
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  itemName,
  ...props
}: Omit<ConfirmationDialogProps, 'variant'> & {
  itemName?: string;
}) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      variant="danger"
      title="Apakah Anda yakin?"
      confirmText="Ya, Hapus"
      message={
        itemName ? (
          <>
            Tindakan ini tidak dapat dibatalkan. <br />
            <strong>"{itemName}"</strong> akan dihapus secara permanen.
          </>
        ) : (
          message || 'Tindakan ini tidak dapat dibatalkan.'
        )
      }
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      {...props}
    />
  );
}

/**
 * Convenience component for warning dialogs
 * Useful for unsaved changes, leaving page, etc.
 */
export function WarningDialog({
  isOpen,
  title = 'Peringatan',
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  ...props
}: Omit<ConfirmationDialogProps, 'variant'>) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      variant="warning"
      title="Peringatan"
      message={message}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      {...props}
    />
  );
}

/**
 * Convenience component for info dialogs
 * Useful for confirmations, informational messages, etc.
 */
export function InfoDialog({
  isOpen,
  title = 'Informasi',
  message,
  onConfirm,
  onCancel,
  isLoading = false,
  ...props
}: Omit<ConfirmationDialogProps, 'variant'>) {
  return (
    <ConfirmationDialog
      isOpen={isOpen}
      variant="info"
      title="Informasi"
      message={message}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
      {...props}
    />
  );
}
