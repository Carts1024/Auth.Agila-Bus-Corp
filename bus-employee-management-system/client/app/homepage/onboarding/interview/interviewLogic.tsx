/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { showSuccess, showConfirmation } from '@/app/utils/swal';
import { Employee } from '@/components/modal/information/EmployeeModalLogic';
import { FilterSection } from '@/components/ui/filterDropdown';

export const InterviewLogic = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [isReadOnlyView, setIsReadOnlyView] = useState(false);


  const [employees, setEmployees] = useState<Employee[]>([
    {
      status: 'Active',
      firstName: 'Juan',
      middleName: 'Cruz',
      lastName: 'Dela',
      birthdate: '1995-05-10',
      contact: '09171234567',
      dateHired: '2023-01-15',
      department: 'Operations',
      position: 'Driver',
      email: 'juan.dela@example.com',
      address: '123 Main Street'
    },
    {
      status: 'On Leave',
      firstName: 'Mark',
      middleName: 'Antonio',
      lastName: 'Reyes',
      birthdate: '1990-02-20',
      contact: '09181234567',
      dateHired: '2023-03-10',
      department: 'Human Resource',
      position: 'Supervisor',
      email: 'mark.reyes@example.com',
      address: '456 Second Street'
    },
    {
      status: 'Active',
      firstName: 'Ana',
      middleName: 'Liza',
      lastName: 'Santos',
      birthdate: '1992-08-12',
      contact: '09221234567',
      dateHired: '2022-11-05',
      department: 'Inventory',
      position: 'Warehouse Staff',
      email: 'analiza@gmail.com',
      address: '199 Commonwealth Quezon City'
    },
    {
      status: "Active",
      firstName: "Roberto",
      middleName: "Sy",
      lastName: "Chua",
      birthdate: "1993-08-14",
      contact: "09179988776",
      dateHired: "2023-05-20",
      department: "Operations",
      position: "Dispatcher",
      email: "robertochua1@gmail.com",
      address: "Villonco St. Quezon City"
    },
    {
      status: "Active",
      firstName: "Theresa",
      middleName: "Reyes",
      lastName: "Cruz",
      birthdate: "1991-02-28",
      contact: "09201234567",
      dateHired: "2022-11-01",
      department: "Accounting",
      position: "Billing Clerk",
      email: "thescruz0228@gmail.com",
      address: "Tandang Sora. Quezon City"
    },
    {
      status: "Active",
      firstName: "Daniel",
      middleName: "Perez",
      lastName: "Mercado",
      birthdate: "1987-06-05",
      contact: "09998765432",
      dateHired: "2021-09-15",
      department: "Inventory",
      position: "Warehouse Manager",
      email: "daniel_mercado@gmail.com",
      address: "Visayas Ave. Quezon City"
    },
    {
      status: "On Leave",
      firstName: "Joyce",
      middleName: "Lim",
      lastName: "Santos",
      birthdate: "1996-04-18",
      contact: "09185544332",
      dateHired: "2024-01-01",
      department: "Human Resource",
      position: "Recruitment Specialist",
      email: "j0ycesant05@gmail.com",
      address: "Cabuyao, Laguna"
    },
    {
      "status": "Active",
      "firstName": "Mark",
      "middleName": "Gonzales",
      "lastName": "David",
      "birthdate": "1989-12-03",
      "contact": "09176789012",
      "dateHired": "2020-07-25",
      "department": "Operations",
      "position": "Logistics Coordinator",
      email: "markdavid@gmail.com",
      address: "5th Ave. Cubao, Quezon City"
    }
  ]);

  // Filter sections
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);

  const uniqueDepartments = Array.from(new Set(employees.map(emp => emp.department)));
  const uniquePositions = Array.from(new Set(employees.map(emp => emp.position)));

  const filterSections: FilterSection[] = [
    {
      id: "dateRange",
      title: "Date Range",
      type: "dateRange",
      defaultValue: { from: "", to: "" }
    },
    // {
    //   id: "department",
    //   title: "Department",
    //   type: "checkbox",
    //   options: uniqueDepartments.map(dept => ({ id: dept.toLowerCase(), label: dept }))
    // },
    {
      id: "position",
      title: "Position",
      type: "checkbox",
      options: uniquePositions.map(pos => ({ id: pos.toLowerCase(), label: pos }))
    },
    {
      id: "sortBy",
      title: "Sort By",
      type: "radio",
      options: [
        { id: "name", label: "Name" },
        { id: "date", label: "Date Hired" }
      ],
      defaultValue: "name"
    },
    {
      id: "order",
      title: "Order",
      type: "radio",
      options: [
        { id: "asc", label: "Ascending" },
        { id: "desc", label: "Descending" }
      ],
      defaultValue: "asc"
    }
  ];

  const handleApplyFilters = (filterValues: Record<string, any>) => {
    let newData = [...employees];

    // Status
    if (filterValues.status && filterValues.status.length > 0) {
      newData = newData.filter(item => filterValues.status.includes(item.status));
    }

    // Department
    if (filterValues.department && filterValues.department.length > 0) {
      newData = newData.filter(item => filterValues.department.includes(item.department.toLowerCase()));
    }

    // Position
    if (filterValues.position && filterValues.position.length > 0) {
      newData = newData.filter(item => filterValues.position.includes(item.position.toLowerCase()));
    }

    // Date range
    const fromDate = filterValues.dateRange?.from ? new Date(filterValues.dateRange.from) : null;
    const toDate = filterValues.dateRange?.to ? new Date(filterValues.dateRange.to) : null;
    if (fromDate || toDate) {
      newData = newData.filter(item => {
        const hiredDate = new Date(item.dateHired);
        return (!fromDate || hiredDate >= fromDate) && (!toDate || hiredDate <= toDate);
      });
    }

    // Sorting
    const sortBy = filterValues.sortBy;
    const sortOrder = filterValues.order === 'desc' ? -1 : 1;
    if (sortBy === 'name') {
      newData.sort((a, b) => `${a.lastName}, ${a.firstName}`.localeCompare(`${b.lastName}, ${b.firstName}`) * sortOrder);
    } else if (sortBy === 'date') {
      newData.sort((a, b) => (new Date(a.dateHired).getTime() - new Date(b.dateHired).getTime()) * sortOrder);
    }

    setFilteredEmployees(newData);
  };

  const filteredByText = filteredEmployees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.middleName} ${emp.lastName}`.toLowerCase();
    return (
      (!statusFilter || emp.status === statusFilter) &&
      (!departmentFilter || emp.department === departmentFilter) &&
      (!positionFilter || emp.position === positionFilter) &&
      (!searchTerm || fullName.includes(searchTerm.toLowerCase()))
    );
  });

  const handleAdd = (newEmployee: Employee) => {
    const updatedList = [...employees, newEmployee];
    setEmployees(updatedList);
    setFilteredEmployees(updatedList);
    showSuccess('Success', 'Employee added successfully.');
  };

  const handleEdit = (updatedEmployee: Employee) => {
    if (!selectedEmployee) return;
    const updatedList = employees.map(emp =>
      emp.firstName === selectedEmployee.firstName &&
      emp.middleName === selectedEmployee.middleName &&
      emp.lastName === selectedEmployee.lastName
        ? updatedEmployee
        : emp
    );
    setEmployees(updatedList);
    setFilteredEmployees(updatedList);
    showSuccess('Success', 'Employee updated successfully.');
  };

  const handleDeleteRequest = async (employee: Employee) => {
    const result = await showConfirmation('Are you sure you want to delete this employee?');
    if (result.isConfirmed) {
      const updatedList = employees.filter(
        emp => emp.firstName !== employee.firstName ||
               emp.middleName !== employee.middleName ||
               emp.lastName !== employee.lastName
      );
      setEmployees(updatedList);
      setFilteredEmployees(updatedList);
      showSuccess('Success', 'Employee deleted successfully.');
    }
  };

  return {
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedEmployee,
    setSelectedEmployee,
    employees,
    filteredEmployees: filteredByText,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    departmentFilter,
    setDepartmentFilter,
    positionFilter,
    setPositionFilter,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    isReadOnlyView,
    setIsReadOnlyView,
    filterSections,
    handleApplyFilters,
  };
};