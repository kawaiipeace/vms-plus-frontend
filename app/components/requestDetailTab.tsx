import React, { useState } from "react";
import RequestDetailForm from "./flow/requestDetailForm";
import { requestHistoryLog, requestHistoryLogColumns } from "../data/requestHistory";
import TableComponent from "./table";

interface Props{
 status: string;
}

export default function RequestDetailTabs({status} : Props) {
  const tabs = [
    {
      label: "รายละเอียดคำขอ",
      content:  <RequestDetailForm status={status} />,
      badge: ""
    },
    {
      label: "ประวัติการดำเนินการ",
      content:  <TableComponent data={requestHistoryLog} columns={requestHistoryLogColumns} />,
      badge: ""
    },
  ];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex border-b tablist">
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
      <div className="py-4">

        {tabs[activeTab].content}
      
      </div>
    </div>
  );
}
