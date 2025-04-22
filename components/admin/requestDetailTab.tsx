import React, { useState } from "react";
import {
  requestHistoryLog,
  requestHistoryLogColumns,
} from "@/data/requestHistory";
import TableComponent from "@/components/table";
import RequestDetailForm from "@/components/admin/requestDetailForm";

interface Props {
  requestId: string;
}

export default function RequestDetailTabs({ requestId }: Props) {
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
        <TableComponent
          data={requestHistoryLog}
          columns={requestHistoryLogColumns}
        />
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
              )}{" "}
            </div>
          </button>
        ))}
      </div>
      <div className="py-4 relative">{tabs[activeTab].content}</div>
    </div>
  );
}
