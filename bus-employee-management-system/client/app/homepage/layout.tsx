/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import "@/styles/globals.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated (you'll need to implement this)
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/homepage');
    }
  }, []);

  return (
    <div className="app-wrapper">
      <Sidebar />
      <div className="layout-right">
        <Topbar />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  );
}