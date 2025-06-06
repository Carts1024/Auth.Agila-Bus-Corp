/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import "@/styles/sidebar.css";
// import { useRouter } from 'next/navigation';
import { logout } from '@/app/utils/logout';

const Sidebar = () => {
    const pathname = usePathname();
    // const router = useRouter();
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const [expandedMenus, setExpandedMenus] = useState({
        attendance: false,
        employee: false,
        requests: false
    });

    // Menu structure data
    const menuItems = [
        {
            path: '/homepage',
            name: 'Dashboard',
            icon: 'ri-dashboard-line',
            key: 'dashboard'
        },
        {
            name: 'Onboarding',
            icon: 'ri-user-add-line',
            key: 'onboarding',
            subItems: [
                { path: '/homepage/onboarding/candidate', name: 'Candidate Overview', key: 'candidate-overview' },
                { path: '/homepage/onboarding/interview', name: 'Interview Scheduling', key: 'interview-scheduling' }
            ]
        },
        {
            name: 'Attendance',
            icon: 'ri-time-line',
            key: 'attendance',
            subItems: [
                { path: '/homepage/attendance/time-in-out', name: 'Time-in/Time-out', key: 'time-in-out' },
                { path: '/homepage/attendance/daily-report', name: 'Daily Attendance Report', key: 'daily-report' }
            ]
        },
        {
            name: 'Information',
            icon: 'ri-team-line',
            key: 'employee',
            subItems: [
                { path: '/homepage/information/employee', name: 'Employee List', key: 'employee-list' },
                { path: '/homepage/information/department', name: 'Department List', key: 'departments' }
            ]
        },
        {
            name: 'Requests',
            icon: 'ri-file-list-line',
            key: 'requests',
            subItems: [
                { path: '/requests/leave', name: 'Leave', key: 'leave' },
                { path: '/requests/resignation', name: 'Resignation', key: 'resignation' }
            ]
        },
        {
            path: '/homepage/documents/orgfiles',
            name: 'Documents',
            icon: 'ri-folder-line',
            key: 'documents'
        },
        {
            path: '/authentication/new-password',
            name: 'Settings',
            icon: 'ri-settings-line',
            key: 'settings'
        }
    ];

    // Set active item and expand menus based on current route
    useEffect(() => {
        // Find active main menu item
        const active = menuItems.find(item => 
            item.path === pathname || 
            item.subItems?.some(subItem => subItem.path === pathname)
        );
        
        // Find active sub-item
        const activeSubItem = menuItems
            .flatMap(item => item.subItems || [])
            .find(subItem => subItem.path === pathname);
    
        setActiveItem(activeSubItem?.key || active?.key || null);
    
        // Auto-expand parent menus when sub-item is active
        setExpandedMenus({
            attendance: menuItems[2].subItems?.some(item => pathname.startsWith(item.path)) || false,
            employee: menuItems[3].subItems?.some(item => pathname.startsWith(item.path)) || false,
            requests: menuItems[4].subItems?.some(item => pathname.startsWith(item.path)) || false
        });
    }, [pathname]);

    const toggleMenu = (menuKey: string) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuKey]: !prev[menuKey as keyof typeof prev]
        }));
    };

    const handleLogout = async () => {
        await logout();
        window.location.href = '/authentication/login'; // Ensures middleware and browser see the cookie is gone
    };


    return (
        <div className="sidebar shadow-lg">
            <div className="sidebar-content">
                <div className="logo-img">
                    <img src="/assets/images/agila logo.png" alt="logo" />
                </div>

                <div className="nav-links">
                    {menuItems.map((item) => (
                        <div key={item.key} className="nav-parent">
                            {item.path ? (
                                // Regular menu item with direct link
                                <Link
                                    href={item.path}
                                    className={`nav-item ${activeItem === item.key ? 'active' : ''}`}
                                >
                                    <i className={item.icon} />
                                    <span>{item.name}</span>
                                </Link>
                            ) : (
                                // Menu item with sub-items
                                <>
                                    <div 
                                        className={`nav-item ${item.subItems?.some(subItem => activeItem === subItem.key) ? 'active' : ''}`}
                                        onClick={() => toggleMenu(item.key)}
                                    >
                                        <i className={item.icon} />
                                        <span>{item.name}</span>
                                        <i className={`ri-arrow-down-s-line dropdown-icon ${expandedMenus[item.key as keyof typeof expandedMenus] ? 'rotate' : ''}`} />
                                    </div>
                                    
                                    {expandedMenus[item.key as keyof typeof expandedMenus] && (
                                        <div className="sub-menu">
                                            {item.subItems?.map((subItem) => (
                                                <Link
                                                    key={subItem.key}
                                                    href={subItem.path}
                                                    className={`sub-item ${activeItem === subItem.key ? 'active' : ''}`}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>

                <div className="logout">
                    <button onClick={handleLogout} className="nav-item logout-btn">
                        <i className="ri-logout-box-r-line" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;