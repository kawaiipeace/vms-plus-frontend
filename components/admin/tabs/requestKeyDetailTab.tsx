import React, { useEffect, useState } from "react";
import RequestDetailForm from "@/components/admin/key-handover/requestDetailForm";
import LogListTable from "@/components/table/log-list-table";
import { useLogContext } from "@/contexts/log-context";
import PaginationControls from "@/components/table/pagination-control";
import KeyHandoverDetail from "@/components/admin/key-handover/key-handover-detail";
import ReceiveCarVehicleInUseTab from "@/components/tabs/receiveCarVehicleInUseTab";
import TravelInfoTab from "../travelInfoTab";

interface Props {
  requestId: string;
  displayKeyHandover?: boolean;
  displayVehiclePickup?: boolean;
  displayTravelRecord?: boolean;
  displayFuel?: boolean;
}

export default function RequestDetailTabs({ requestId,displayTravelRecord,displayFuel, displayKeyHandover, displayVehiclePickup }: Props) {
  const { dataRequest, pagination, params, setParams, loadLogs } = useLogContext();
  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newLimit: string | number) => {
    const limit = typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  };

  useEffect(() => {
    if (requestId) {
      loadLogs(requestId);
    }
  }, [params, requestId]);

    
  const tabs = [
    {
      label: "รายละเอียดคำขอ",
      content: <RequestDetailForm requestId={requestId} />,
      badge: "",
    },
    ...(displayKeyHandover
      ? [
          {
            label: "การรับกุญแจ",
            content: <KeyHandoverDetail editable={true} requestId={requestId} />,
            badge: "",
          },
        ]
      : []),

      ...(displayVehiclePickup
        ? [
            {
              label: "การรับยานพาหนะ",
              content: <ReceiveCarVehicleInUseTab displayOn="admin" role="admin" requestId={requestId} edit="edit" />,
              badge: "",
            },
          ]
        : []),
        ...(displayTravelRecord
          ? [
              {
                label: "ข้อมูลการเดินทาง",
                content: <TravelInfoTab reqId={requestId} requestType="เสร็จสิ้น"/>,
                badge: "",
              },
            ]
          : []),
          ...(displayFuel
            ? [
                {
                  label: "การเติมเชื้อเพลิง",
                  content: <ReceiveCarVehicleInUseTab requestId={requestId} edit="edit" />,
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

  const [activeTab, setActiveTab] = useState(0);

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
