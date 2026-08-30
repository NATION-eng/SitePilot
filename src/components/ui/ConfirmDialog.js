import React, { useEffect, useRef } from 'react';
import Icon from './Icon';
import styles from './ConfirmDialog.module.css';

const ConfirmDialog = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This will reset your current estimate and inputs.',
  confirmText = 'Reset',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger'
}) => {
  const dialogRef = useRef(null);
  const cancelBtnRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      cancelBtnRef.current?.focus();

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onCancel}
      role="presentation"
    >
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        onClick={(e) => e.stopPropagation()}
        ref={dialogRef}
      >
        <div className={styles.iconContainer}>
          <Icon name="warning" size={38} color="var(--warning, #FFB800)" />
        </div>
        <h3 id="dialog-title" className={styles.title}>{title}</h3>
        <p id="dialog-description" className={styles.message}>{message}</p>
        
        <div className={styles.actions}>
          <button
            ref={cancelBtnRef}
            type="button"
            className={styles.cancelBtn}
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={variant === 'danger' ? styles.dangerBtn : styles.confirmBtn}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
