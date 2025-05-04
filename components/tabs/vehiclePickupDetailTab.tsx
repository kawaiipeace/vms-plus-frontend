"use client";
import { LogType } from "@/app/types/log-type";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { RequestHistoryLog, requestHistoryLogColumns } from "@/data/requestHistory";
import { fetchLogs, fetchRequestKeyDetail } from "@/services/masterService";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReturnCarTab from "../admin/returnCarTab";
import KeyPickUp from "../flow/keyPickUp";
import KeyPickUpDetailForm from "../flow/keyPickUpDetailForm";
import TableComponent from "../tableKeyPickUp";
import KeyPickUpAppointment from "./keyPickUpAppointment";
import ReceiveCarVehicleInUseTab from "./receiveCarVehicleInUseTab";
import RecordFuelTab from "./recordFuelTab";
import RecordTravelTab from "./recordTravelTab";
// import ReturnCarTab from "./returnCarTab";

interface Props {
  requestId: string;
}

export default function VehiclePickupDetailTabs({ requestId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("activeTab");

  const [requestUid] = useState(requestId);
  const [activeTab, setActiveTab] = useState(1);
  const [dataRequest, setDataRequest] = useState<RequestHistoryLog[]>([]);
  const [requestData, setRequestData] = useState<RequestDetailType>();

  useEffect(() => {
    const fetchRequestDetailfunc = async () => {
      try {
        const response = await fetchRequestKeyDetail(requestId);
        console.log("data---", response.data);
        setRequestData(response.data);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    };

    const fetchRequests = async () => {
      try {
        const response = await fetchLogs(requestUid, { page: 1, limit: 100 });
        const requestList = response.data.logs;

        const mapDataRequest: RequestHistoryLog[] = requestList.map((item: LogType) => {
          const dateTime = convertToBuddhistDateTime(item.created_at);
          return {
            dateTime: dateTime.date + "" + dateTime.time,
            operator: item.created_by_emp.emp_name,
            position: item.created_by_emp.dept_sap,
            detail: item.status.ref_request_status_desc,
            remark: item.log_remark,
          };
        });
        console.log("Fetched data:", mapDataRequest);

        setDataRequest(mapDataRequest);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    if (requestId) {
      fetchRequestDetailfunc();
      fetchRequests();
    }
  }, [requestId, requestUid]);

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
        content: <ReceiveCarVehicleInUseTab requestId={requestId} displayOn="vehicle-in-use" />,
        constent: "",
        badge: "",
      },
      {
        label: "ข้อมูลการเดินทาง",
        content: (
          <>
            <RecordTravelTab requestId={requestId} data={requestData} />
          </>
        ),
        constent: "",
        badge: "",
      },
      {
        label: "การเติมเชื้อเพลิง",
        content: (
          <>
            <RecordFuelTab requestId={requestId} role="user" requestData={requestData} />
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
            <TableComponent data={dataRequest} columns={requestHistoryLogColumns} />
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
      <div className="py-4 relative">{tabs[activeTab].content}</div>
    </div>
  );
}
