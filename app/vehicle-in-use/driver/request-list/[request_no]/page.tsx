"use client";
import React from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import { DriverVIURequestDetail } from "@/components/driverVIURequestDetail";

const DriverRequestDetail = () => {
  const { isPinned } = useSidebar();
  return (
    <>
      <div className="main-container">
        <SideBar menuName="คำขอใช้ยานพาหนะ" />
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
                    <a>งานของฉัน</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <a>เลขที่คำขอ VA67RA000001</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">เลขที่คำขอ VA67RA000001</span>
                  {/* <span className="badge badge-outline badge-gray">95 กลุ่ม</span> */}
                </div>
              </div>
            </div>

            <div className="w-full">
              <DriverVIURequestDetail />
            </div>
          </div>
        </div>
        {/* <ReviewCarDriveModal ref={reviewCarDriveModalRef} /> */}
      </div>
    </>
  );
};

export default DriverRequestDetail;
