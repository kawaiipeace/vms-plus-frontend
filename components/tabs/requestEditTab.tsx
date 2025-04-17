import React, { useEffect, useState } from "react";
import RequestDetailForm from "@/components/flow/requestDetailForm";
import { LogType } from "@/app/types/log-type";
import LogListTable from "@/components/table/log-list-table";
import { PaginationType } from "@/app/types/request-action-type";
import { fetchLogs } from "@/services/masterService";
import PaginationControls from "../table/pagination-control";

interface Props {
  requestId: string;
}

export default function RequestEditTabs({ requestId }: Props) {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
  });
  const [requestUid] = useState(requestId);
  const [dataRequest, setDataRequest] = useState<LogType[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const handlePageChange = (newPage: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: newPage,
    }));
  };

  const handlePageSizeChange = (newLimit: string | number) => {
    const limit =
      typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
    setParams((prevParams) => ({
      ...prevParams,
      limit,
      page: 1,
    }));
  };


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetchLogs(requestUid, params);
        const requestList = response.data.logs;
        const { total, totalPages } = response.data;
  
        setDataRequest(requestList);
        setPagination({
          limit: params.limit,
          page: params.page,
          total,
          totalPages,
        });
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
  
    if (requestId) {
      fetchRequests();
    }
  }, [params, requestUid]);

  const tabs = [
    {
      label: "รายละเอียดคำขอ",
      content: <RequestDetailForm requestId={requestId} editable={true} />,
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
