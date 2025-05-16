"use client";

import React from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import DriverForm from "@/components/drivers-management/driverForm";

const CreateDriverPage = () => {
  const { isPinned } = useSidebar();
  return (
    <>
      <div className="main-container">
        <SideBar menuName="ข้อมูลพนักงานขับรถ" />
        <div className={`main-content ${isPinned ? "md:pl-[280px]" : "md:pl-[80px]"}`}>
          <Header />
          <div className="main-content-body">
            <div className="page-header">
              <div className="breadcrumbs text-sm">
                <ul>
                  <li className="breadcrumb-item">
                    <a>
                      <i className="material-symbols-outlined">home</i>
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <a>ข้อมูลพนักงานขับรถ</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <a>สร้างข้อมูลพนักงานขับรถ</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">สร้างข้อมูลพนักงานขับรถ</span>
                </div>
              </div>
            </div>

            <div className="w-full">
              <DriverForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateDriverPage;
