import React, { useEffect, useState } from "react";
import {
  requestHistoryLog,
  requestHistoryLogColumns,
} from "@/data/requestHistory";
import TableComponent from "@/components/table";
import RequestDetailForm from "@/components/booking-final/requestDetailForm";
import LogListTable from "../table/log-list-table";
import PaginationControls from "../table/pagination-control";
import { useLogContext } from "@/contexts/log-context";

interface Props {
  requestId: string;
}

export default function RequestDetailTabs({ requestId }: Props) {

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
      constent: "",
      badge: "",
    },
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
    <div className="w-full overflow-hidden">
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
              {tab.badge && (
                <span className="badge badge-brand badge-pill-outline">4</span>
              )}{" "}
            </div>
          </button>
        ))}
      </div>
      <div className="py-4 relative">{tabs[activeTab].content}</div>
    </div>
  );
}
