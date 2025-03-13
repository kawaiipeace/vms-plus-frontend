import React, { useState } from "react";
import Image from "next/image";
import ZeroRecord from "@/app/components/zeroRecord";
import ApproveFlow from "@/app/components/admin/approveFlow";
import KeyHandOver from "@/app/components/admin/keyHandOver";
import TravelTab from "@/app/components/admin/travelTab";
import CheckCar from "@/app/components/admin/checkCar";

export default function ApproveVehicleForAdminTabs() {
  const tabs = [
    {
      label: "ตรวจสอบคำขอ",
      content: <ApproveFlow />,
      badge: "4",
    },
    {
      label: "ให้กุญแจ",
      content: <KeyHandOver />,
    },
    {
      label: "เดินทาง",
      content: <TravelTab />,
    },
    {
      label: "ตรวจสอบยานพาหนะ",
      content: <CheckCar />,
    },
    {
      label: "เสร็จสิ้น",
      content: <div></div>,
    },
    {
      label: "ยกเลิก",
      content: <div></div>,
    },
  ];
  const [activeTab, setActiveTab] = useState(0);

  return (
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
      <div className="py-4">
        {tabs[activeTab].content}

        <div className="hidden">
          <ZeroRecord imgSrc="/assets/img/empty/create_request_empty state_vehicle.svg" title="ไม่พบคำขอใช้ยานพาหนะ" desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>} button="ล้างตัวกรอง" />
        </div>

        <div className="dt-table-emptyrecord hidden">
          <div className="emptystate">
            <Image src="/assets/img/empty/add_carpool.svg" width={100} height={100} alt="" />
            <div className="emptystate-title">ไม่มีกลุ่มยานพาหนะ</div>
            <div className="emptystate-text">เริ่มสร้างกลุ่มยานพาหนะกลุ่มแรก</div>
            <div className="emptystate-action">
              <button className="btn btn-primary">
                <i className="material-symbols-outlined">add</i>
                สร้างกลุ่มยานพาหนะ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
