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
import { fetchRequestKeyDetail } from "@/services/masterService";
import { RequestDetailType } from "@/app/types/request-detail-type";
import AdminRecordFuelTab from "@/components/admin/tabs/adminRecordFuelTab";

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
  const [requestData, setRequestData] = useState<RequestDetailType>();
  const [loading, setLoading] = useState(true);

  const handlePageSizeChange = (newLimit: string | number) => {
    const limit =
      typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  };

  useEffect(() => {
    if (requestId) {
      loadLogs(requestId);

      const fetchRequestDetailfunc = async () => {
        try {
          const response = await fetchRequestKeyDetail(requestId);
          setRequestData(response.data);
        } catch (error) {
          console.error("Error fetching vehicle details:", error);
        } finally{
          setLoading(false);
        }
      };
      fetchRequestDetailfunc();
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
              content: <AdminRecordFuelTab requestId={requestId} />,
              badge: "",
            },
          ]
        : []),
      ...(displayReturnVehicle
        ? [
            {
              label: "การคืนยานพาหนะ",
              content: (
                <ReturnCarTab
                  displayOn="adminTab"
                  useBy="admin"
                  requestData={requestData}
                />
              ),
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
      <div className="flex border-b tablist z-[] w-[100vw] max-w-[100vw] overflow-auto sticky top-[200px] bg-white">
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
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-40vh)]">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#A80689]"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : (
        <div className="py-4 relative">{tabs[activeTab].content}</div>
      )}
    </div>
  );
}
