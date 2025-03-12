import React, { useEffect, useState } from "react";
import Image from "next/image";
import ZeroRecord from "@/app/components/zeroRecord";
import RequestStatusBox from "@/app/components/requestStatusBox";
import ArpproveFlow from "@/app/components/approveFlow";
import { requestDetail, requests } from "@/app/services/bookingUser";
import { RequestData } from "@/app/data/requestData";

export default function RequestTabs() {
  const [dataRequest, setDataRequest] = useState<RequestData[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Step 1: Fetch the list of requests
        const response = await requests();
        if (response.status === 200) {
          const requestList = response.data; // Assuming response.data is an array
          console.log("requests", requestList);

          // Step 2: Extract IDs and fetch details
          const details = await Promise.all(
            requestList.map(async (req: { trn_request_uid: string }) => {
              try {
                const detailResponse = await requestDetail(req.trn_request_uid);
                if (detailResponse.status === 200) {
                  console.log('detailres',detailResponse);
                  return detailResponse.data; // Assuming this is the request detail
                }
              } catch (error) {
                console.error(`Error fetching details for ID ${req.trn_request_uid}:`, error);
                return null;
              }
            })
          );

          // Filter out any null values and update state
          setDataRequest(details.filter((detail) => detail !== null));
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const tabs = [
    {
      label: "กำลังดำเนินการ",
      content: <ArpproveFlow data={dataRequest} />,
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
          <RequestStatusBox iconName="schedule" status="info" title="รออนุมัติ" number={3} />
          <RequestStatusBox iconName="reply" status="warning" title="ถูกตีกลับ" number={1} />
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
