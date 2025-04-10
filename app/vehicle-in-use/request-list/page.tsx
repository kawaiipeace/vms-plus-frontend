"use client";
import React, { useState, useRef } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import MobileFileBackCard from "@/components/card/mobileFileBackCard";
import MobileWaitForKeyCard from "@/components/card/mobileWaitForKeyCard";
import MobileWaitingCard from "@/components/card/mobileWaitingCard";

import TableComponent from "@/components/table";
import { RequestData, requestDataColumns } from "@/data/requestData";
import MobileRecordTravelCard from "@/components/card/mobileRecordTravelCard";
import ReviewCarDriveModal from "@/components/modal/reviewCarDriveModal";
import ReturnCarAddModal from "@/components/modal/returnCarAddModal";
import VehicleFinishTab from "@/components/tabs/vehicleFinishTab";

export default function RequestList() {
    const [dataRequest, setDataRequest] = useState<RequestData[]>([]);
  const vehicleFinish: [] = [];
  const tabs = [
    {
      label: "กำลังดำเนินการ",
      content: (
        <>
          <MobileFileBackCard />
          <MobileWaitForKeyCard />
          <MobileWaitingCard />
          <MobileRecordTravelCard reviewCarDrive={() => reviewCarDriveModalRef.current?.openModal()} returnCarAdd={() => returnCarAddModalRef.current?.openModal()} />
        </>
      ),
      badge: "4",
    },
    {
      label: "เสร็จสิ้น",
      content: (
        <>
          <VehicleFinishTab data={vehicleFinish} />
        </>
      ),
    },
    {
      label: "ยกเลิก",
      content: (
        <>
          {dataRequest.length > 0 ? (
            <TableComponent data={dataRequest} columns={requestDataColumns} />
          ) : (
            <div className="flex justify-center items-center h-[300px]">
              <div className="text-center">
                <p className="text-lg font-semibold">ไม่พบข้อมูล</p>
                <p className="text-sm text-gray-500">ไม่มีข้อมูลคำขอใช้ยานพาหนะที่ถูกยกเลิก</p>
              </div>
            </div>
          )}
        </>
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState(0);
  const { isPinned } = useSidebar();

  const reviewCarDriveModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const returnCarAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

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
                    <a>คำขอใช้ยานพาหนะ</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">คำขอใช้ยานพาหนะ</span>
                  {/* <span className="badge badge-outline badge-gray">95 กลุ่ม</span> */}
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex border-b tablist">
                {tabs.map((tab, index) => (
                  <button key={index} className={`tab transition-colors duration-300 ease-in-out ${activeTab === index ? "active" : "text-gray-600"}`} onClick={() => setActiveTab(index)}>
                    <div className="flex gap-2 items-center">
                      {tab.label}
                      {tab.badge && <span className="badge badge-brand badge-pill-outline">4</span>}{" "}
                    </div>
                  </button>
                ))}
              </div>

              {tabs[activeTab].content}
            </div>
          </div>
        </div>
        <ReviewCarDriveModal ref={reviewCarDriveModalRef} />
        <ReturnCarAddModal ref={returnCarAddModalRef} />
      </div>
    </>
  );
}
