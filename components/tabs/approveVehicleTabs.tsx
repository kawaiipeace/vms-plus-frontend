import React, { useEffect, useState } from "react";
import Image from "next/image";
import ZeroRecord from "@/components/zeroRecord";
import FirstApproveFlow from "@/components/flow/firstApproveFlow";
import { fetchMenus } from "@/services/bookingApprover";
import { summaryType } from "@/app/types/request-list-type";


export default function ApproveVehicleTabs() {

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
          case "20,21,30": 
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

      </div>
    </div>
  );
}
