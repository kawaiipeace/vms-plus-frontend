import React, { useEffect, useState } from "react";
import RequestDetailForm from "@/components/admin/key-handover/requestDetailForm";
import LogListTable from "@/components/table/log-list-table";
import { useLogContext } from "@/contexts/log-context";
import PaginationControls from "@/components/table/pagination-control";
import KeyHandoverDetail from "@/components/admin/key-handover/key-handover-detail";
import ReceiveCarVehicleInUseTab from "@/components/tabs/receiveCarVehicleInUseTab";
import TravelInfoTab from "../travelInfoTab";
import ReturnCarTab from "@/components/admin/returnCarTab";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react"; 
import RecordFuelTab from "@/components/tabs/recordFuelTab";

interface Props {
  requestId: string;
  displayKeyHandover?: boolean;
  displayVehiclePickup?: boolean;
  displayTravelRecord?: boolean;
  displayFuel?: boolean;
  displayReturnVehicle?: boolean;
}

export default function RequestDetailTabs({
  requestId,
  displayTravelRecord,
  displayFuel,
  displayKeyHandover,
  displayVehiclePickup,
  displayReturnVehicle,
}: Props) {
  const { dataRequest, pagination, params, setParams, loadLogs } =
    useLogContext();
  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };
    const searchParams = useSearchParams();
    const activeTabName = searchParams.get("active-tab");

  const handlePageSizeChange = (newLimit: string | number) => {
    const limit =
      typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  };

  useEffect(() => {
    if (requestId) {
      loadLogs(requestId);
    }
  }, [params, requestId]);

  


  const tabs = useMemo(() => {
    return [
      {
        label: "รายละเอียดคำขอ",
        content: <RequestDetailForm requestId={requestId} />,
        badge: "",
      },
      ...(displayKeyHandover
        ? [
            {
              label: "การรับกุญแจ",
              content: (
                <KeyHandoverDetail editable={true} requestId={requestId} />
              ),
              badge: "",
            },
          ]
        : []),
      ...(displayVehiclePickup
        ? [
            {
              label: "การรับยานพาหนะ",
              content: (
                <ReceiveCarVehicleInUseTab
                  displayOn="admin"
                  role="admin"
                  requestId={requestId}
                  edit="edit"
                />
              ),
              badge: "",
            },
          ]
        : []),
      ...(displayTravelRecord
        ? [
            {
              label: "ข้อมูลการเดินทาง",
              content: (
                <TravelInfoTab reqId={requestId} requestType="เสร็จสิ้น" />
              ),
              badge: "",
            },
          ]
        : []),
      ...(displayFuel
        ? [
            {
              label: "การเติมเชื้อเพลิง",
              content: (
                <RecordFuelTab requestId={requestId} role="admin" />
              ),
              badge: "",
            },
          ]
        : []),
      ...(displayReturnVehicle
        ? [
            {
              label: "การคืนยานพาหนะ",
              content: <ReturnCarTab displayOn="adminTab" />,
              badge: "",
            },
          ]
        : []),
      {
        label: "ประวัติการดำเนินการ",
        content: (
          <>
            <LogListTable defaultData={dataRequest} pagination={pagination} />
            {dataRequest.length > 0 && (
              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        ),
        badge: "",
      },
    ];
  }, [
    requestId,
    displayKeyHandover,
    displayVehiclePickup,
    displayTravelRecord,
    displayFuel,
    displayReturnVehicle,
    dataRequest,
    pagination,
  ]);
  

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (activeTabName) {
      const index = tabs.findIndex((tab) => tab.label === activeTabName);
      if (index !== -1) {
        setActiveTab(index);
      }
    }
  }, [activeTabName, tabs]);


  return (
    <div className="w-full">
      <div className="flex border-b tablist z-[40] w-[100vw] max-w-[100vw] overflow-auto sticky top-[200px] bg-white">
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
                <span className="badge badge-brand badge-pill-outline">4</span>
              )}
            </div>
          </button>
        ))}
      </div>
      <div className="py-4 relative">{tabs[activeTab].content}</div>
  
    </div>
  );
}
