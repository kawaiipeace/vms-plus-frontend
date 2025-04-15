import React, { useEffect, useState } from "react";
import Image from "next/image";
import ZeroRecord from "@/components/zeroRecord";
import FirstApproveFlow from "@/components/flow/firstApproveFlow";
import { fetchMenus } from "@/services/bookingApprover";
import { summaryType } from "@/app/types/request-list-type";


export default function ApproveVehicleTabs() {

  // const tabs = [
  //   {
  //     label: "คำขอใช้ยานพาหนะ",
  //     content: <FirstApproveFlow />,
  //     badge: "4",
  //   },
  //   {
  //     label: "ใบอนุญาตขับขี่",
  //     content: <div></div>,
  //   },
  // ];

    const [statusData, setStatusData] = useState<summaryType[]>([]);

    useEffect(() => {
      const fetchMenuFunc = async () => {
        try {
          const response = await fetchMenus();
          const result = response.data;
          setStatusData(result);
        } catch (error) {
          console.error("Error fetching status data:", error);
        }
      };
      fetchMenuFunc();
    }, []);

      const getTabContent = (code: string) => {
        switch (code) {
          case "20": 
          return <FirstApproveFlow />;
          case "50": // รับกุญแจ
          case "60": // เดินทาง
          case "70": // คืนยานพาหนะ
            return "";
          case "80": // เสร็จสิ้น
            return <div>เสร็จสิ้น</div>; // Replace with your component
          case "90": // ยกเลิก
            return <div></div>;
          default:
            return <div></div>;
        }
      };
    
      const tabs = statusData.map((item) => ({
        label: item.ref_request_status_name,
        badge: item.count > 0 ? item.count : undefined,
        content: getTabContent(item.ref_request_status_code),
      }));
    
      const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
   <div className="flex border-b tablist z-[10] w-[100vw] max-w-[100vw] overflow-auto">
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
              {tab.badge !== undefined && (
                <span className="badge badge-brand badge-pill-outline">
                  {tab.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      <div className="py-4">

      {tabs[activeTab]?.content}

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
