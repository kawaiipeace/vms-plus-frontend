import { LogType } from "@/app/types/log-type";
import { PaginationType } from "@/app/types/request-action-type";
import LogListTable from "@/components/table/log-list-table";
import { fetchLogs } from "@/services/masterService";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import KeyPickUp from "../flow/keyPickUp";
import KeyPickUpDetailForm from "../flow/keyPickUpDetailForm";
import PaginationControls from "../table/pagination-control";
import KeyPickUpAppointment from "./keyPickUpAppointment";
import ReceiveCarVehicleInUseTab from "./receiveCarVehicleInUseTab";

interface Props {
  requestId: string;
}

export default function VehiclePickupDetailTabs({ requestId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("activeTab");

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
  });
  const [requestUid] = useState(requestId);
  const [activeTab, setActiveTab] = useState(1);
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
    const limit = typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
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
  }, [params, requestId, requestUid]);

  const createQueryString = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("activeTab", value);

      return params.toString();
    },
    [searchParams]
  );

  const tabs = useMemo(
    () => [
      {
        label: "รายละเอียดคำขอ",
        content: <KeyPickUpDetailForm requestId={requestId} />,
        constent: "",
        badge: "",
      },
      {
        label: "การรับกุญแจ",
        content: <KeyPickUp requestId={requestId} />,
        constent: "",
        badge: "",
      },
      {
        label: "การนัดหมายเดินทาง",
        content: <KeyPickUpAppointment requestId={requestId} />,
        constent: "",
        badge: "",
      },
      {
        label: "การรับยานพาหนะ",
        content: <ReceiveCarVehicleInUseTab requestId={requestId} edit="" />,
        constent: "",
        badge: "",
      },
      {
        label: "ข้อมูลการเดินทาง",
        content: <></>,
        constent: "",
        badge: "",
      },
      {
        label: "การเติมเชื้อเพลิง",
        content: <></>,
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
    ],
    [dataRequest, pagination, requestId]
  );

  useEffect(() => {
    if (active) {
      const findActiveTab = tabs.findIndex((tab) => tab.label === active);
      setActiveTab(findActiveTab);
    }
  }, [active, tabs]);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex border-b tablist z-[10] w-[100vw] max-w-[100vw] overflow-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab transition-colors duration-300 ease-in-out ${
              activeTab === index ? "active" : "text-gray-600"
            }`}
            onClick={() => {
              setActiveTab(index);
              router.push(pathname + "?" + createQueryString(tab.label));
            }}
          >
            <div className="flex gap-2 items-center">
              {tab.label}
              {tab.badge && <span className="badge badge-brand badge-pill-outline">4</span>}{" "}
            </div>
          </button>
        ))}
      </div>
      <div className="py-4 relative">{tabs[activeTab].content}</div>
    </div>
  );
}
