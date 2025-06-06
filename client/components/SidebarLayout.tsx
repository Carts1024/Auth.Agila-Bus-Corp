// 'use client';

// import { useState } from 'react';
// import Sidebar from './sidebar';
// import Topbar from './topbar';

// // This is the main layout component that wraps around pages. It accepts children (the inner content of each page).
// export default function SidebarLayout({ children }: { children: React.ReactNode }) {

//   // This sets up a state variable `isCollapsed` with initial value `false`.
//   // It's used to toggle the sidebar between collapsed and expanded.
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   return (
//     <>
//       <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
//       <div className={`main-content ${isCollapsed ? 'collapsed' : ''}`}>
//         <Topbar />
//         <div className="dashboard-content">
//           {children}
//         </div>
//       </div>
//     </>
//   );
// }