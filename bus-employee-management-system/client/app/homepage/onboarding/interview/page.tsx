/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from "react";
import styles from './interview.module.css';
import { InterviewLogic } from './interviewLogic';
// import InterviewModal from '@/components/modal/onboarding/InterviewModal';
import FilterDropdown from "@/components/ui/filterDropdown";
import "@/styles/filters.css";
import "@/styles/pagination.css";

export default function InterviewScheduling() {
  
  return (
    <div className={styles.base}>
      <div className={styles.interviewContainer}>
        <h1 className={styles.title}>Interview Schedules</h1>

        {/* Status Filter */}
        <div className={styles.headerSection}>
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

           {/* Filter Button with Dropdown */}
          <div className="filter">
            {/* <FilterDropDown
              sections={filterSections}
              onApply={handleApplyFilters}
            /> */}
          </div>

          <button className={styles.scheduleInterviewButton}>
            <i className="ri-calendar-schedule-line"/>
            Schedule Interview
            </button>
        </div>

        {/* Interview Schedules Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.interviewTable}>
            <thead>
              <tr>
                <th className={styles.firstColumn}>No.</th>
                <th>Interview Status</th>
                <th>Name</th>
                <th>Desired Position</th>
                <th>Interview Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.firstColumn}>1</td>
                <td>Scheduled</td>
                <td>Juan Dela Cruz</td>
                <td>Driver</td>
                <td>2023-01-15</td>
                <td className={styles.actionCell}>
                  <button className={styles.editButton}>
                    <i className="ri-edit-2-line"/>
                  </button>
                  <button className={styles.deleteButton}>
                    <i className="ri-delete-bin-line"/>
                  </button>
                </td>
              </tr>
              <tr>
                <td className={styles.firstColumn}>2</td>
                <td>Not Scheduled</td>
                <td>Mark Reyes</td>
                <td>Supervisor</td>
                <td>2023-03-10</td>
                <td className={styles.actionCell}>
                  <button className={styles.editButton}>
                    <i className="ri-edit-2-line"/>
                  </button>
                  <button className={styles.deleteButton}>
                    <i className="ri-delete-bin-line"/>
                  </button>
                </td>
              </tr>
              <tr>
                <td className={styles.firstColumn}>3</td>
                <td>Not Scheduled</td>
                <td>Ana Santos</td>
                <td>Warehouse Staff</td>
                <td>2022-11-05</td>
                <td className={styles.actionCell}>
                  <button className={styles.editButton}>
                    <i className="ri-edit-2-line"/>
                  </button>
                  <button className={styles.deleteButton}>
                    <i className="ri-delete-bin-line"/>
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