'use client';

import React from "react";
import styles from './candidate.module.css';

export default function CandidateOverview() {
  return (
    <div className={styles.base}>
      <div className={styles.candidateContainer}>
        <h1 className={styles.title}>Candidate Overview</h1>

        {/* Status Filter */}
        <div className={styles.headerSection}>
          <select className={styles.statusfilterDropdown}>
            <option value="" defaultChecked disabled>Applicant Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Hired">Hired</option>
          </select>

          <select className={styles.statusfilterDropdown}>
            <option value="" defaultChecked disabled>Interview Status</option>
            <option value="notScheduled">Not scheduled</option>
            <option value="Scheduled">Scheduled</option>
          </select>

          {/* Search */}
          <div className={styles.search}>
            <i className='ri-search-line'/>
            <input
              type="text"
              placeholder="Search here..."
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className={styles.addCandidateButton}>
            <i className="ri-add-line"/>
            Add candidate
          </button>
        </div>

        {/* Candidate Overview Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.candidateTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Name</th>
                <th>Desired Position</th>
                <th>Source of Hire</th>
                <th>Application Date</th>
                <th>Department</th>
                <th>Application Status</th>
                <th>Interview Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.firstColumn}>1</td>
                <td>Juan Dela Cruz</td>
                <td>Driver</td>
                <td>Referral</td>
                <td>2023-01-15</td>
                <td>Operations</td>
                <td>Processing</td>
                <td>Scheduled</td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.viewButton}
                      onClick={() => {
                        // setSelectedEmployee(emp);
                        // setIsReadOnlyView(true);
                        // setShowEditModal(true);
                      }}
                    > <i className="ri-feedback-line"/>
                    </button>

                    <button
                      className={styles.editButton}
                      onClick={() => {
                        // setSelectedEmployee(emp);
                        // setIsReadOnlyView(false);
                        // setShowEditModal(true);
                      }}
                    > <i className="ri-edit-2-line"/> 
                    </button>
                    <button
                      className={styles.deleteButton}
                      // onClick={() => handleDeleteRequest(emp)}
                    > <i className="ri-delete-bin-line"/>
                    </button>
                </td>
              </tr>
              <tr>
                <td className={styles.firstColumn}>2</td>
                <td>Mark Reyes</td>
                <td>Supervisor</td>
                <td>Direct sourcing</td>
                <td>2023-03-10</td>
                <td>Human Resource</td>
                <td>Pending</td>
                <td>Not Scheduled</td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.viewButton}
                      onClick={() => {
                        // setSelectedEmployee(emp);
                        // setIsReadOnlyView(true);
                        // setShowEditModal(true);
                      }}
                    > <i className="ri-feedback-line"/>
                    </button>

                    <button
                      className={styles.editButton}
                      onClick={() => {
                        // setSelectedEmployee(emp);
                        // setIsReadOnlyView(false);
                        // setShowEditModal(true);
                      }}
                    > <i className="ri-edit-2-line"/> 
                    </button>
                    <button
                      className={styles.deleteButton}
                      // onClick={() => handleDeleteRequest(emp)}
                    > <i className="ri-delete-bin-line"/>
                    </button>
                </td>
              </tr>
              <tr>
                <td className={styles.firstColumn}>3</td>
                <td>Ana Santos</td>
                <td>Warehouse Staff</td>
                <td>Job boards</td>
                <td>2022-11-05</td>
                <td>Inventory</td>
                <td>Processing</td>
                <td>Not Scheduled</td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.viewButton}
                      onClick={() => {
                        // setSelectedEmployee(emp);
                        // setIsReadOnlyView(true);
                        // setShowEditModal(true);
                      }}
                    > <i className="ri-feedback-line"/>
                    </button>

                    <button
                      className={styles.editButton}
                      onClick={() => {
                        // setSelectedEmployee(emp);
                        // setIsReadOnlyView(false);
                        // setShowEditModal(true);
                      }}
                    > <i className="ri-edit-2-line"/> 
                    </button>
                    <button
                      className={styles.deleteButton}
                      // onClick={() => handleDeleteRequest(emp)}
                    > <i className="ri-delete-bin-line"/>
                    </button>
                </td>
              </tr>
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

      </div>
    </div>
  );
}