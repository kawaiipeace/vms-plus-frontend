import { RequestListType, summaryType } from "@/app/types/request-list-type";
import ArpproveFlow from "@/components/approveFlow";
import CancelFlow from "@/components/flow/cancelFlow";
import { fetchMenus, requests } from "@/services/bookingUser";
import { useEffect, useState } from "react";
import SuccessFlow from "../flow/successFlow";

export default function RequestTabs() {
  const [dataRequest, setDataRequest] = useState<RequestListType[]>([]);
  const [statusData, setStatusData] = useState<summaryType[]>([]);
  // const processIntroModalRef = useRef<{
  //   openModal: () => void;
  //   closeModal: () => void;
  // } | null>(null);

  const [params] = useState({
    search: "",
    vehicle_owner_dept: "",
    car_type: "",
    category_code: "",
    page: 1,
    limit: 10,
  });

  // useEffect(() => {
  //   processIntroModalRef.current?.openModal();
  // }, []);

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

    const fetchRequests = async () => {
      try {
        const response = await requests(params);
        const requestList = response.data.requests;
    
        setDataRequest(requestList);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
    fetchMenuFunc();
  }, [params]);

  const getTabContent = (code: string) => {
    switch (code) {
      case "20,21,30,31,40,41,50,51,60,70,71":
        return <ArpproveFlow />;
      case "80": // เสร็จสิ้น
        return <SuccessFlow />; // Replace with your component
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
              {tab.badge !== undefined && <span className="badge badge-brand badge-pill-outline">{tab.badge}</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="py-4">
        {tabs[activeTab]?.content}

        {/* {dataRequest?.length === 0 && (
          <ZeroRecord
            imgSrc="/assets/img/empty/create_request_empty state_vehicle.svg"
            title="ไม่พบคำขอใช้ยานพาหนะ"
            desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
            button="ล้างตัวกรอง"
          />
        )} */}
      </div>

      {/* <ProcessIntroModal ref={processIntroModalRef} /> */}
    </div>
  );
}
