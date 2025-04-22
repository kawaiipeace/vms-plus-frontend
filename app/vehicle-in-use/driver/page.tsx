"use client";
import React, { useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import DriverProgressTab from "@/components/tabs/driverProgressTab";
import DriverSoonTab from "@/components/tabs/driverSoonTab";
import DriverFinishTab from "@/components/tabs/driverFinishTab";
import DriverCancelTab from "@/components/tabs/driverCancelTab";

export default function DriverMain() {
  const dataProgress: number[] = [1];
  const dataSoon: [] = [];
  const dataFinish: [] = [];
  const dataCancel: [] = [];
  const tabs = [
    {
      label: "กำลังดำเนินการ",
      content: (
        <>
          <DriverProgressTab data={dataProgress} />
        </>
      ),
      badge: "4",
    },
    {
      label: "กำลังมาถึง",
      content: (
        <>
          <DriverSoonTab data={dataSoon} />
        </>
      ),
      badge: "3",
    },
    {
      label: "เสร็จสิ้น",
      content: (
        <>
          <DriverFinishTab data={dataFinish} />
        </>
      ),
    },
    {
      label: "ยกเลิก",
      content: (
        <>
          <DriverCancelTab data={dataCancel} />
        </>
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState(0);
  const { isPinned } = useSidebar();

  //   const reviewCarDriveModalRef = useRef<{
  //     openModal: () => void;
  //     closeModal: () => void;
  //   } | null>(null);

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
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">งานของฉัน</span>
                  {/* <span className="badge badge-outline badge-gray">95 กลุ่ม</span> */}
                </div>
              </div>
            </div>

            <div className="w-full">
            <div className="flex border-b tablist z-[10] w-[100vw] max-w-[100vw] overflow-auto">
                {tabs.map((tab, index) => (
                  <button key={index} className={`tab transition-colors duration-300 ease-in-out ${activeTab === index ? "active" : "text-gray-600"}`} onClick={() => setActiveTab(index)}>
                    <div className="flex gap-2 items-center">
                      {tab.label}
                      {tab.badge && <span className="badge badge-brand badge-pill-outline">{tab.badge}</span>}{" "}
                    </div>
                  </button>
                ))}
              </div>

              {tabs[activeTab].content}
            </div>
          </div>
        </div>
        {/* <ReviewCarDriveModal ref={reviewCarDriveModalRef} /> */}
      </div>
    </>
  );
}
