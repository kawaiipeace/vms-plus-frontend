"use client";
import { LogType } from "@/app/types/log-type";
import { PaginationType } from "@/app/types/request-action-type";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { RequestHistoryLog } from "@/data/requestHistory";
import { fetchLogs, fetchRequestKeyDetail } from "@/services/masterService";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReturnCarTab from "../admin/returnCarTab";
import KeyPickUp from "../flow/keyPickUp";
import KeyPickUpDetailForm from "../flow/keyPickUpDetailForm";
import LogListTable from "../table/log-list-table";
import PaginationControls from "../table/pagination-control";
import KeyPickUpAppointment from "./keyPickUpAppointment";
import ReceiveCarVehicleInUseTab from "./receiveCarVehicleInUseTab";
import RecordFuelTab from "./recordFuelTab";
import RecordTravelTab from "./recordTravelTab";

interface Props {
  requestId: string;
}

export default function VehiclePickupDetailTabs({ requestId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("activeTab");
  const returnedData = searchParams.get("edit-data-returned-tabs");
  const returnedImage = searchParams.get("edit-image-returned-tabs");
  const returnedCar = searchParams.get("returned-tabs");

  const [requestUid] = useState(requestId);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [requestData, setRequestData] = useState<RequestDetailType>();

  const [dataRequest, setDataRequest] = useState<LogType[]>([]);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
  });
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
    const fetchRequestDetailfunc = async () => {
      try {
        const response = await fetchRequestKeyDetail(requestId);
        const responseLog = await fetchLogs(requestUid, {
          page: 1,
          limit: 100,
        });
        const { total, totalPages } = responseLog.data;
        console.log('responseKey', response.data);

        setRequestData(response.data);
        setPagination({
          limit: params.limit,
          page: params.page,
          total,
          totalPages,
        });

        const requestList = responseLog.data.logs;
        const mapDataRequest: RequestHistoryLog[] = requestList.map((item: LogType) => {
          const dateTime = convertToBuddhistDateTime(item.created_at);
          return {
            dateTime: dateTime.date + "" + dateTime.time,
            operator: item.action_by_fullname,
            position: item.action_by_position,
            detail: item.action_detail,
            remark: item.log_remark,
          };
        });

        setLoading(false);
        setDataRequest(requestList);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    };

    setLoading(true);
    if (requestId) {
      fetchRequestDetailfunc();
    }
  }, [requestId, returnedCar, returnedData, returnedImage]);

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
        content: <ReceiveCarVehicleInUseTab requestId={requestId} role="user" displayOn="vehicle-in-use" />,
        constent: "",
        badge: "",
      },
      {
        label: "ข้อมูลการเดินทาง",
        content: (
          <>
            <RecordTravelTab requestId={requestId} data={requestData} role="userRecordTravel" />
          </>
        ),
        constent: "",
        badge: "",
      },
      {
        label: "การเติมเชื้อเพลิง",
        content: (
          <>
            <RecordFuelTab requestId={requestId} role="recordFuel" requestData={requestData} />
          </>
        ),
        constent: "",
        badge: "",
      },
      {
        label: "การคืนยานพาหนะ",
        content: (
          <>
            <ReturnCarTab displayOn="userTabs" useBy={"userTabs"} requestData={requestData} />
          </>
        ),
        constent: "",
        badge: "",
      },
      {
        label: "ประวัติการดำเนินการ",
        content: (
          <>
            {/* <TableComponent data={dataRequest} columns={requestHistoryLogColumns} /> */}
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
    [dataRequest, requestData, requestId]
  ).filter((tab) => {
    if (tab.label === "การนัดหมายเดินทาง" && requestData?.is_pea_employee_driver === "1") {
      return false;
    }
    return true;
  });

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
