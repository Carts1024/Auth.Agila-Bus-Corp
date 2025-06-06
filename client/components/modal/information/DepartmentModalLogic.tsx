/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import React, { useState, useEffect } from 'react';
import DepartmentModalUI from '@/components/modal/information/DepartmentModal';
import { showError, showConfirmation, showSuccess } from '@/app/utils/swal';

interface DepartmentModalLogicProps {
  isEdit: boolean;
  defaultValue?: string;
  existingDepartments: string[];
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const DepartmentModalLogic: React.FC<DepartmentModalLogicProps> = ({
  isEdit,
  defaultValue = '',
  existingDepartments,
  onClose,
  onSubmit,
}) => {
  const [departmentName, setDepartmentName] = useState(defaultValue);
  const [error, setError] = useState('');

  useEffect(() => {
    setDepartmentName(defaultValue);
    setError('');
  }, [defaultValue]);

  const validateInput = () => {
    const trimmed = departmentName.trim();

    if (!trimmed) {
      setError('Department name is required.');
      return false;
    }

    const isDuplicate = existingDepartments
      .filter((name) => name !== defaultValue)
      .some((name) => name.toLowerCase() === trimmed.toLowerCase());

    if (isDuplicate) {
      showError('Error', 'Department name already exists.');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateInput()) return;

    onSubmit(departmentName.trim());
    showSuccess('Success', isEdit ? 'Department updated successfully.' : 'Department added successfully.');
    onClose();
  };

  const handleUpdateConfirm = async () => {
    if (!validateInput()) return;

    const result = await showConfirmation('Are you sure you want to update this department?');
    if (result.isConfirmed) {
      handleSubmit();
    }
  };

  return (
    <DepartmentModalUI
      isEdit={isEdit}
      departmentName={departmentName}
      setDepartmentName={setDepartmentName}
      onClose={onClose}
      onSubmit={isEdit ? handleUpdateConfirm : handleSubmit}
      isSubmitDisabled={!departmentName.trim()}
    />
  );
};

export default DepartmentModalLogic;