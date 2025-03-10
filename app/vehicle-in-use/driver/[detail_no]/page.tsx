"use client";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/app/contexts/sidebarContext";
import Header from "@/app/components/header";
import SideBar from "@/app/components/sideBar";
import DriverDetailContent from "@/app/components/driverDetail";
import { useSearchParams } from "next/navigation";

const DriverDetail = () => {
  const { isPinned } = useSidebar();
  const searchParams = useSearchParams();
  const progressTypeUrl = searchParams.get("progressType");
  const [progressType, setProgressType] = useState("บันทึกการเดินทาง");
  useEffect(() => {
    if (progressTypeUrl) {
      setProgressType(progressTypeUrl);
    }
  }, [progressTypeUrl]);
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
                    <a>{progressType}</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">{progressType}</span>
                  {/* <span className="badge badge-outline badge-gray">95 กลุ่ม</span> */}
                </div>
              </div>
            </div>

            <div className="w-full">
              <DriverDetailContent progressType={progressType} />
            </div>
          </div>
        </div>
        {/* <ReviewCarDriveModal ref={reviewCarDriveModalRef} /> */}
      </div>
    </>
  );
};

export default DriverDetail;
