"use client";
import { useState, useRef } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import KeyPickUp from "@/components/flow/keyPickUp";
import CancelRequestModal from "@/components/modal/cancelRequestModal";
import KeyPickUpDetailForm from "@/components/flow/keyPickUpDetailForm";
import KeyPickUpAppointment from "@/components/tabs/keyPickUpAppointment";
import ReceiveCarVehicleInUseTab from "@/components/tabs/receiveCarVehicleInUseTab";
import RecordTravelTab from "@/components/tabs/recordTravelTab";
import RecordFuelTab from "@/components/tabs/recordFuelTab";
import { usePathname } from "next/navigation";

const RequestNo = () => {
  const cancelRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const pathname = usePathname();
  const pathSegments = pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  const tabs = [
    {
      label: "รายละเอียดคำขอ",
      content: (
        <>
          {/* <KeyPickUpDetailForm /> */}
        </>
      ),
      badge: "",
    },
    {
      label: "การรับกุญแจ",
      content: (
        <>
          {/* <KeyPickUp status="detail" /> */}
        </>
      ),
      badge: "",
    },
    {
      label: "การรับยานพาหนะ",
      content: (
        <>
          <ReceiveCarVehicleInUseTab edit={lastSegment} />
        </>
      ),
      badge: "",
    },
    {
      label: "ข้อมูลการเดินทาง",
      content: (
        <>
          <RecordTravelTab />
        </>
      ),
      badge: "",
    },
    {
      label: "การเติมเชื้อเพลิง",
      content: (
        <>
          <RecordFuelTab />
        </>
      ),
      badge: "",
    },
    {
      label: "การนัดหมายเดินทาง",
      content: <KeyPickUpAppointment requestId={""} />,
      badge: "",
    },
    {
      label: "ประวัติการดำเนินการ",
      content: <div></div>,
      badge: "",
    },
  ];
  const [activeTab, setActiveTab] = useState(4);
  const { isPinned } = useSidebar();
  return (
    <div>
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
                  <li className="breadcrumb-item active" aria-current="page">
                    เลขที่คำขอ VA67RA000001
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">เลขที่คำขอ VA67RA000001</span>
                  <button className="text-sm">
                    <i className="material-symbols-outlined text-sm">content_copy</i>
                    คัดลอก
                  </button>

                  <span className="badge badge-pill-outline badge-info">รอรับกุญแจ</span>
                </div>

                <button className="btn btn-tertiary-danger bg-transparent shadow-none border-none" onClick={() => cancelRequestModalRef.current?.openModal()}>
                  ยกเลิกคำขอ
                </button>
                <button className="btn btn-secondary">
                  <i className="material-symbols-outlined">print</i>พิมพ์
                </button>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
            <div className="flex border-b tablist z-[10] w-[100vw] max-w-[100vw] overflow-auto">
                {tabs.map((tab, index) => (
                  <button key={index} className={`tab transition-colors duration-300 ease-in-out ${activeTab === index ? "active" : "text-gray-600"}`} onClick={() => setActiveTab(index)}>
                    <div className="flex gap-2 items-center">
                      {tab.label}
                      {tab.badge && <span className="badge badge-brand badge-pill-outline">4</span>}{" "}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {tabs[activeTab].content}
          </div>
        </div>
      </div>
      <CancelRequestModal id="" ref={cancelRequestModalRef} title="ยืนยันยกเลิกคำขอ?" desc="ยานพาหนะและพนักงานขับรถที่จองไว้จะถูกยกเลิก" confirmText="ยกเลิกคำขอ" />
    </div>
  );
};

export default RequestNo;
