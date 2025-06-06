/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from "react";
import styles from './employee.module.css';
import { EmployeeLogic } from './employeeLogic';
import EmployeeModal from '@/components/modal/information/EmployeeModal';
import FilterDropDown, { FilterSection } from '@/components/ui/filterDropdown';
import "@/styles/filters.css";
import "@/styles/pagination.css";

export default function EmployeePage() {
  const {
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedEmployee,
    setSelectedEmployee,
    handleAdd,
    handleEdit,
    handleDeleteRequest,
    isReadOnlyView,
    setIsReadOnlyView,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredEmployees,
    employees,
    filterSections,
    handleApplyFilters
  } = EmployeeLogic();

  return (
    <div className={styles.base}>
      <div className={styles.employeeContainer}>
        <h1 className={styles.title}>Employee List</h1>

        <div className={styles.headerSection}>
          {/* Status Filter */}
          <select
            className={styles.statusfilterDropdown}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
          </select>

          {/* Search */}
          <div className={styles.search}>
            <i className='ri-search-line'/>
            <input
              type="text"
              placeholder="Search here..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

           {/* Filter Button with Dropdown */}
          <div className="filter">
            <FilterDropDown
              sections={filterSections}
              onApply={handleApplyFilters}
            />
          </div>

          <button className={styles.addEmployeeButton} onClick={() => setShowAddModal(true)}>
            <i className="ri-add-line"/>
            Add Employee
          </button>
          <button className={styles.importButton}>
            <i className="ri-import-line"/>
            Import
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.employeeTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Status</th>
                <th>Name</th>
                <th>Date Hired</th>
                <th>Department</th>
                <th>Position</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, index) => (
                <tr key={`${emp.firstName}-${emp.lastName}-${index}`}>
                  <td className={styles.firstColumn}>{index + 1}</td>
                  <td>{emp.status}</td>
                  <td>{`${emp.firstName} ${emp.middleName} ${emp.lastName}`}</td>
                  <td>{emp.dateHired}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.viewButton}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setIsReadOnlyView(true);
                        setShowEditModal(true);
                      }}
                    > <i className="ri-eye-line"/>
                    </button>

                    <button
                      className={styles.editButton}
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setIsReadOnlyView(false);
                        setShowEditModal(true);
                      }}
                    > <i className="ri-edit-2-line"/> 
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteRequest(emp)}
                    > <i className="ri-delete-bin-line"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
            <button className="page-btn">
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <button className="page-btn">5</button>
            <button className="page-btn">
              <i className="ri-arrow-right-s-line"></i>
            </button>
        </div>

        {/* Modals */}
        {showAddModal && (
          <EmployeeModal
            isEdit={false}
            existingEmployees={employees}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAdd}
          />
        )}

        {showEditModal && selectedEmployee && (
          <EmployeeModal
            isEdit={true}
            defaultValue={selectedEmployee}
            existingEmployees={employees}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEdit}
          />
        )}

        {showEditModal && selectedEmployee && (
          <EmployeeModal
            isEdit={!isReadOnlyView}
            isReadOnly={isReadOnlyView}
            defaultValue={selectedEmployee}
            existingEmployees={employees}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEdit}
          />
        )}
        
      </div>
    </div>
  );
}