'use client';

import { useState } from 'react';
import { showConfirmation, showSuccess, showError } from '@/app/utils/swal';

export interface Employee {
  firstName: string;
  middleName: string;
  lastName: string;
  birthdate: string;
  email: string;
  contact: string;
  address: string;
  status: string;
  dateHired: string;
  department: string;
  position: string;
}

const isAtLeast18 = (birthdate: string) => {
  const birth = new Date(birthdate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  return age > 18 || (age === 18 && m >= 0);
};

const isValidEmail = (email: string) => /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email);
const isValidContact = (contact: string) => /^\d{11}$/.test(contact);
const isValidPhilippineContact = (contact: string) => /^(09)\d{9}$/.test(contact);
const isValidDateHired = (date: string) => new Date(date) <= new Date();

export const useEmployeeModal = (
  isEdit: boolean,
  defaultValue: Employee | undefined,
  existingEmployees: Employee[],
  onSubmit: (employee: Employee) => void,
  onClose: () => void
) => {
  const [employee, setEmployee] = useState<Employee>({
    firstName: '', middleName: '', lastName: '', birthdate: '',
    email: '', contact: '', address: '', status: '', dateHired: '',
    department: '', position: '', ...defaultValue,
  });

  const [fieldErrors, setFieldErrors] = useState<{ [key in keyof Employee]?: string }>({});

  const validateInput = () => {
    const errors: typeof fieldErrors = {};
    if (!employee.firstName.trim()) errors.firstName = 'Required';
    if (!employee.lastName.trim()) errors.lastName = 'Required';
    if (!employee.birthdate || !isAtLeast18(employee.birthdate)) errors.birthdate = 'Invalid';
    if (!employee.email || !isValidEmail(employee.email)) errors.email = 'Invalid';
    if (!isValidContact(employee.contact) || !isValidPhilippineContact(employee.contact)) errors.contact = 'Invalid';
    if (!employee.address) errors.address = 'Required';
    if (!employee.status) errors.status = 'Required';
    if (!employee.dateHired || !isValidDateHired(employee.dateHired)) errors.dateHired = 'Invalid';
    if (!employee.department) errors.department = 'Required';
    if (!employee.position.trim()) errors.position = 'Required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isDuplicateEmployee = () => {
    return existingEmployees.some(emp =>
      `${emp.firstName}${emp.middleName}${emp.lastName}`.toLowerCase() ===
      `${employee.firstName}${employee.middleName}${employee.lastName}`.toLowerCase() &&
      (!isEdit ||
        `${emp.firstName}${emp.middleName}${emp.lastName}`.toLowerCase() !==
        `${defaultValue?.firstName}${defaultValue?.middleName}${defaultValue?.lastName}`.toLowerCase())
    );
  };

  const handleChange = (field: keyof Employee, value: string) => {
    setEmployee(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    if (!validateInput()) return;
    if (isDuplicateEmployee()) {
      showError('Oops!', 'Employee already exists.');
      return;
    }
    onSubmit(employee);
    showSuccess('Success', isEdit ? 'Employee updated successfully.' : 'Employee added successfully.');
    onClose();
  };

  const handleUpdateConfirm = async () => {
    if (!validateInput()) return;
    if (isDuplicateEmployee()) {
      showError('Oops!', 'Employee already exists.');
      return;
    }
    const result = await showConfirmation('Are you sure you want to update this employee?');
    if (result.isConfirmed) {
      onSubmit(employee);
      showSuccess('Success', 'Employee updated successfully.');
      onClose();
    }
  };

  return {
    employee,
    fieldErrors,
    handleChange,
    handleSubmit,
    handleUpdateConfirm
  };
};