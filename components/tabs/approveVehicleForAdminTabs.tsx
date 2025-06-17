import React, { useEffect, useState } from "react";
import { fetchMenus } from "@/services/bookingAdmin";
import { summaryType } from "@/app/types/request-list-type";
import AdminApproveFlow from "@/components/flow/adminApproveFlow";
import AdminKeyHandOverFlow from "@/components/flow/adminHandOverFlow";
import AdminVehiclePickupFlow from "../flow/adminVehiclePickupFlow";
import AdminVehicleInsFlow from "../flow/adminVehicleInsFlow";
import CancelAdminFlow from "../flow/cancelAdminFlow";
import SuccessAdminFlow from "../flow/successAdminFlow";

export default function ApproveVehicleForAdminTabs() {
  const [statusData, setStatusData] = useState<summaryType[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchMenuFunc = async () => {
      try {
        const response = await fetchMenus();
        const result = response.data;
        setStatusData(result);
      } catch (error) {
        console.error("Error fetching status data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch
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
      case "70,71":
        return <AdminVehicleInsFlow />;
      case "80":
        return <SuccessAdminFlow />;
      case "90":
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex border-b tablist w-[100vw] max-w-[100vw] overflow-auto">
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
