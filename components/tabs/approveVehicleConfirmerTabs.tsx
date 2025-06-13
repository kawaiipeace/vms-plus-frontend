import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // <-- Import this if using Next.js 13+
import FirstApproveFlow from "@/components/flow/firstApproveFlow";
import { fetchConfirmerMenus } from "@/services/bookingApprover";
import { summaryType } from "@/app/types/request-list-type";
import DriverLicConfirmerFlow from "@/components/flow/driverLicConfirmerFlow";


export default function ApproveVehicleConfirmerTabs() {
  const [statusData, setStatusData] = useState<summaryType[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const searchParams = useSearchParams(); // <-- Get query params

  const activeTabLabel = decodeURIComponent(
    searchParams.get("activeTab") || ""
  );

  useEffect(() => {

    const fetchMenuFunc = async () => {
      try {
        const response = await fetchConfirmerMenus();

        console.log('menu response', response.data);

        const result = response.data;
        setStatusData(result);

        // Find the tab index based on label match
        const index = result.findIndex(
          (item: { ref_request_status_name: string }) =>
            item.ref_request_status_name === activeTabLabel
        );
        if (index !== -1) {
          setActiveTab(index);
        }
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };
    fetchMenuFunc();
  }, [activeTabLabel]);

  const getTabContent = (code: string) => {
    switch (code) {
      case "20,21,30":
        return <FirstApproveFlow />;
      case "00":
        return <DriverLicConfirmerFlow />;
      case "90":
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
      <div className="py-4">{tabs[activeTab]?.content}</div>
    </div>
  );
}
