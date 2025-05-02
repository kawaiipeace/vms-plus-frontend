import React, { useEffect, useState } from "react";
import Image from "next/image";
import ZeroRecord from "@/components/zeroRecord";
import ApproveFlow from "@/components/admin/approveFlow";
import KeyHandOver from "@/components/admin/keyHandOver";
import TravelTab from "@/components/admin/travelTab";
import CheckCar from "@/components/admin/checkCar";
import FinishTab from "@/components/admin/finishTab";
import { fetchMenus } from "@/services/bookingAdmin";
import { summaryType } from "@/app/types/request-list-type";
import AdminApproveFlow from "@/components/flow/adminApproveFlow";
import AdminKeyHandOverFlow from "@/components/flow/adminHandOverFlow";
import CancelFlow from "@/components/flow/cancelFlow";
import AdminVehiclePickupFlow from "../flow/adminVehiclePickupFlow";
import AdminVehicleInsFlow from "../flow/adminVehicleInsFlow";

export default function ApproveVehicleForAdminTabs() {
  // const tabs = [
  //   {
  //     label: "ตรวจสอบคำขอ",
  //     content: <ApproveFlow />,
  //     badge: "4",
  //   },
  //   {
  //     label: "ให้กุญแจ",
  //     content: <KeyHandOver />,
  //   },
  //   {
  //     label: "เดินทาง",
  //     content: <TravelTab />,
  //   },
  //   {
  //     label: "ตรวจสอบยานพาหนะ",
  //     content: <CheckCar />,
  //   },
  //   {
  //     label: "เสร็จสิ้น",
  //     content: <FinishTab />,
  //   },
  //   {
  //     label: "ยกเลิก",
  //     content: <div></div>,
  //   },
  // ];

     const [statusData, setStatusData] = useState<summaryType[]>([]);
  
      useEffect(() => {
        const fetchMenuFunc = async () => {
          try {
            const response = await fetchMenus();
            const result = response.data;
            console.log('adminressult',result);
            setStatusData(result);
          } catch (error) {
            console.error("Error fetching status data:", error);
          }
        };
        fetchMenuFunc();
      }, []);
  
        const getTabContent = (code: string) => {
          switch (code) {
            case "30,31": 
            return <AdminApproveFlow />;
          case "50,51": 
            return <AdminKeyHandOverFlow />;
            case "60": 
            return <AdminVehiclePickupFlow />;
            case "70,71": // คืนยานพาหนะ
            return <AdminVehicleInsFlow />;
            case "80": // เสร็จสิ้น
              return <div>เสร็จสิ้น</div>; // Replace with your component
            case "90": // ยกเลิก
              return <CancelFlow />;
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

      </div>
    </div>
  );
}
