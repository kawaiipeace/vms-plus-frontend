"use client";
import React, { useState } from 'react';
import SideBar from './sideBar';

export default function ToggleSidebar(){
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={`relative ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <button
        className="btn btn-icon btn-tertiary btn-toggle-sidebar block md:hidden"
        onClick={toggleSidebar}
      >
        <i className="material-symbols-outlined">menu</i>
      </button>

      {isSidebarOpen && (
        <>
          <div className="sidebar">
            {/* Sidebar content goes here */}
            <SideBar />
          
          </div>
          <div
            className="sidebar-backdrop"
            onClick={closeSidebar}
          />
        </>
      )}
    </div>
  );
};

