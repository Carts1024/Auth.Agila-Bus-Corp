import React from 'react';
import styles from './InformationModal.module.css';

interface DepartmentModalProps {
  isEdit: boolean;
  departmentName: string;
  setDepartmentName: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
}

const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isEdit,
  departmentName,
  setDepartmentName,
  onClose,
  onSubmit,
  isSubmitDisabled,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h1>{isEdit ? 'Edit Department' : 'Add Department'}</h1>
        <input
          type="text"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          className={styles.inputField}
          placeholder="Enter department name"
        />
        <div className={styles.buttonGroup}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className={styles.submitButton}
            disabled={isSubmitDisabled}
          >
            {isEdit ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;