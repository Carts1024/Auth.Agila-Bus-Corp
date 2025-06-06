'use client';

import React from 'react';
import styles from './ConfirmMessage.module.css';

interface ConfirmMessageProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmMessage: React.FC<ConfirmMessageProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonGroup}>
          <button onClick={onCancel} className={styles.cancelButton}>Cancel</button>
          <button onClick={onConfirm} className={styles.confirmButton}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMessage;
