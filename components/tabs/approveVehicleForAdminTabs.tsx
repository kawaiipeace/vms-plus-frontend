import React, { useEffect, useState } from "react";
import { fetchMenus } from "@/services/bookingAdmin";
import { summaryType } from "@/app/types/request-list-type";
import AdminApproveFlow from "@/components/flow/adminApproveFlow";
import AdminKeyHandOverFlow from "@/components/flow/adminHandOverFlow";
import AdminVehiclePickupFlow from "../flow/adminVehiclePickupFlow";
import AdminVehicleInsFlow from "../flow/adminVehicleInsFlow";
import SuccessFlow from "../flow/successFlow";
import CancelAdminFlow from "../flow/cancelAdminFlow";

export default function ApproveVehicleForAdminTabs() {

     const [statusData, setStatusData] = useState<summaryType[]>([]);
  
      useEffect(() => {
        const fetchMenuFunc = async () => {
          try {
            const response = await fetchMenus();
            console.log('menu',response);
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
            case "30,31,40": 
            return <AdminApproveFlow />;
          case "50,51": 
            return <AdminKeyHandOverFlow />;
            case "60": 
            return <AdminVehiclePickupFlow />;
            case "70,71": // คืนยานพาหนะ
            return <AdminVehicleInsFlow />;
            case "80": // เสร็จสิ้น
              return <SuccessFlow />; // Replace with your component
            case "90": // ยกเลิก
              return <CancelAdminFlow />;
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
