import React, { useState } from "react";
import RequestDetailForm from "@/app/components/admin/requestDetailForm";
import { requestHistoryLog, requestHistoryLogColumns } from "@/app/data/requestHistory";
import TableComponent from "@/app/components/table";
import AlertCustom from "@/app/components/alertCustom";
import ReceiveCarVehicleInUseTab from "@/app/components/tabs/receiveCarVehicleInUseTab";
import TravelInfoTab from "@/app/components/admin/travelInfoTab";
import FuelInfoTab from "@/app/components/admin/fuelInfoTab";
import ReturnCarTab from "@/app/components/admin/returnCarTab";

interface Props {
  status: string;
  requestType: string | undefined;
}

export default function RequestDetailTabs({ status, requestType }: Props) {
  const tabs = [
    {
      label: "รายละเอียดคำขอ",
      content: <RequestDetailForm status={status} />,
      badge: "",
    },
    {
      label: "การรับยานพาหนะ",
      content: <ReceiveCarVehicleInUseTab edit="edit" displayOn="admin" />,
      badge: "",
    },
    {
      label: "ข้อมูลการเดินทาง",
      content: <TravelInfoTab requestType={requestType} />,
      badge: "",
    },
    {
      label: "การเติมเชื้อเพลิง",
      content: <FuelInfoTab requestType={requestType} />,
      badge: "",
    },
    {
      label: "การคืนยานพาหนะ",
      content: <ReturnCarTab displayOn="adminTab" />,
      badge: "",
    },
    {
      label: "ประวัติการดำเนินการ",
      content: <TableComponent data={requestHistoryLog} columns={requestHistoryLogColumns} />,
      badge: "",
    },
  ];
  const [activeTab, setActiveTab] = useState(5);

  return (
    <div className="w-full">
      {status == "edit" && <AlertCustom icon="cancel" title="รับยานพาหนะล่าช้า" desc="คุณต้องรับยานพาหนะก่อนจึงจะสามารถรับบัตรเดินทาง เพื่อนำไปแสดงกับเจ้าหน้าที่รักษาความปลอดภัยก่อนนำรถออกจาก กฟภ." />}
      <div className="flex border-b tablist z-[10]">
        {tabs.map((tab, index) => (
          <button key={index} className={`tab transition-colors duration-300 ease-in-out ${activeTab === index ? "active" : "text-gray-600"}`} onClick={() => setActiveTab(index)}>
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
