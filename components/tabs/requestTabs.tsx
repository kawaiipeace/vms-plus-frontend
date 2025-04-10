import React, { useEffect, useState } from "react";
import ZeroRecord from "@/components/zeroRecord";
import RequestStatusBox from "@/components/requestStatusBox";
import ArpproveFlow from "@/components/approveFlow";
import { requests } from "@/services/bookingUser";
import { RequestListType, summaryType } from "@/app/types/request-list-type";

export default function RequestTabs() {
  const [dataRequest, setDataRequest] = useState<RequestListType[]>([]);
  const [summary, setSummary] = useState<summaryType[]>([]);

 const [params, setParams] = useState({
      search: "",
      vehicle_owner_dept: "",
      car_type: "",
      category_code: "",
      page: 1,
      limit: 10,
    });
    
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requests(params);
        if (response.status === 200) {
          const requestList = response.data.requests;
          const summaryData = response.data.summary;
          setSummary(summaryData);
          setDataRequest(requestList);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [params]);

  const tabs = [
    {
      label: "กำลังดำเนินการ",
      content: <ArpproveFlow />,
      badge: dataRequest.length,
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

  const getCountByStatus = (statusName: string) => {
    const found = summary.find(
      (item) => item.ref_request_status_name === statusName
    );
    return found ? found.count : 0;
  };

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
                <span className="badge badge-brand badge-pill-outline">{tab.badge}</span>
              )}
            </div>
          </button>
        ))}
      </div>
      <div className="py-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <RequestStatusBox iconName="schedule" status="info" title="รออนุมัติ"  number={getCountByStatus("รออนุมัติ")} />
          <RequestStatusBox iconName="reply" status="warning" title="ถูกตีกลับ" number={getCountByStatus("ถูกตีกลับ")} />
        </div>

        {tabs[activeTab].content}

        {dataRequest.length === 0 && (
          <ZeroRecord
            imgSrc="/assets/img/empty/create_request_empty state_vehicle.svg"
            title="ไม่พบคำขอใช้ยานพาหนะ"
            desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
            button="ล้างตัวกรอง"
          />
        )}
      </div>
    </div>
  );
}
