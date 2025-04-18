import React, { useState } from "react";
import Image from "next/image";
import ZeroRecord from "@/components/zeroRecord";
import RequestStatusBox from "@/components/requestStatusBox";
import ArpproveFlow from "@/components/approveFlow";
import { RequestData } from "@/data/requestData";


export default function ApproveVehicleTabs() {
  const [dataRequest, setDataRequest] = useState<RequestData[]>([]);
  const tabs = [
    {
      label: "คำขอใช้ยานพาหนะ",
      content: <ArpproveFlow />,
      badge: "4",
    },
    {
      label: "ใบอนุญาตขับขี่",
      content: <div></div>,
    },
  ];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex border-b tablist">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab transition-colors duration-300 ease-in-out ${
              activeTab === index ? "active" : "text-gray-600"
            }`}
            onClick={() => setActiveTab(index)}
          >
            <div className="flex gap-2 items-center">
              {tab.label}
              {tab.badge && (
                <span className="badge badge-brand badge-pill-outline">4</span>
              )}{" "}
            </div>
          </button>
        ))}
      </div>
      <div className="py-4">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <RequestStatusBox
            iconName="schedule"
            status="info"
            title="รออนุมัติ"
            number={3}
          />
          <RequestStatusBox
            iconName="reply"
            status="warning"
            title="ตีกลับคำขอ"
            number={1}
          />
             <RequestStatusBox
            iconName="check"
            status="success"
            title="อนุมัติ"
            number={1}
          />
             <RequestStatusBox
            iconName="delete"
            status="default"
            title="ยกเลิกคำขอ"
            number={1}
          />
        </div>

        {tabs[activeTab].content}

        <div className="hidden">
          <ZeroRecord
            imgSrc="/assets/img/empty/create_request_empty state_vehicle.svg"
            title="ไม่พบคำขอใช้ยานพาหนะ"
            desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
            button="ล้างตัวกรอง"
          />
        </div>

        <div className="dt-table-emptyrecord hidden">
          <div className="emptystate">
            <Image
              src="/assets/img/empty/add_carpool.svg"
              width={100}
              height={100}
              alt=""
            />
            <div className="emptystate-title">ไม่มีกลุ่มยานพาหนะ</div>
            <div className="emptystate-text">
              เริ่มสร้างกลุ่มยานพาหนะกลุ่มแรก
            </div>
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
