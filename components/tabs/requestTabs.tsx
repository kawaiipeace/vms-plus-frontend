import React, { useEffect, useRef, useState } from "react";
import ZeroRecord from "@/components/zeroRecord";
import ArpproveFlow from "@/components/approveFlow";
import { requests } from "@/services/bookingUser";
import { RequestListType, summaryType } from "@/app/types/request-list-type";
import CancelFlow from "@/components/flow/cancelFlow";
import ProcessIntroModal from "@/components/modal/processIntroModal";

export default function RequestTabs() {
  const [dataRequest, setDataRequest] = useState<RequestListType[]>([]);
  const [summary, setSummary] = useState<summaryType[]>([]);
  const processIntroModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [params] = useState({
    search: "",
    vehicle_owner_dept: "",
    car_type: "",
    category_code: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    processIntroModalRef.current?.openModal();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requests(params);
        const requestList = response.data.requests;
        const summaryData = response.data.summary;

        setSummary(summaryData);
        setDataRequest(requestList);
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
      content: <CancelFlow />,
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
                <span className="badge badge-brand badge-pill-outline">
                  {tab.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      <div className="py-4">
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
      <ProcessIntroModal ref={processIntroModalRef} />
    </div>
  );
}
