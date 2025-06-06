/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { showSuccess, showWarning, showConfirmation, showError } from '@/app/utils/swal';

export const DepartmentLogic = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');

  const [departments, setDepartments] = useState([
    { name: 'Accounting', employees: 12 },
    { name: 'Human Resource', employees: 25 },
    { name: 'Inventory', employees: 48 },
    { name: 'Operations', employees: 67 },
  ]);

  const handleAdd = (newName: string) => {
    setDepartments([...departments, { name: newName, employees: 0 }]);
    showSuccess('Success', 'Department added successfully.');
  };

  const handleEdit = (updatedName: string) => {
    setDepartments((prev) =>
      prev.map((dept) =>
        dept.name === selectedDept ? { ...dept, name: updatedName } : dept
      )
    );
    showSuccess('Success', 'Department updated successfully.');
  };

  const handleDeleteRequest = async (deptName: string) => {
    const dept = departments.find((d) => d.name === deptName);
    if (dept && dept.employees > 0) {
      return showError('Error', 'This department cannot be deleted because it still contains employees.');
    }

    const result = await showConfirmation('Are you sure you want to delete this department?');
    if (result.isConfirmed) {
      setDepartments((prev) => prev.filter((d) => d.name !== deptName));
      showSuccess('Success', 'Department deleted successfully.');
    }
  };

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilter = true;

    if (employeeFilter) {
      const [min, max] = employeeFilter === '101+'
        ? [101, Infinity]
        : employeeFilter.split('-').map(Number);
      matchesFilter = dept.employees >= min && dept.employees <= max;
    }

    return matchesSearch && matchesFilter;
  });

  return {
    searchTerm,
    setSearchTerm,
    employeeFilter,
    setEmployeeFilter,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedDept,
    setSelectedDept,
    departments,
    filteredDepartments,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
  };
};