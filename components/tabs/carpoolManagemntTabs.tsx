import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";

export default function CarpoolManagementTabs({ active }: { active: number }) {
  const id = useSearchParams().get("id");
  const name = useSearchParams().get("name");
  const activeStatus = useSearchParams().get("active");
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(active);

  const tabs = [
    { label: "ปฏิทินการจอง" },
    { label: "ผู้ดูแลยานพาหนะ" },
    { label: "ผู้อนุมัติ" },
    { label: "ยานพาหนะ" },
    { label: "พนักงานขับรถ" },
    { label: "ตั้งค่ากลุ่ม" },
  ];

  const tabRouter = {
    0:
      "/carpool-management/form/calendar?id=" +
      id +
      "&name=" +
      name +
      "&active=" +
      activeStatus,
    1:
      "/carpool-management/form/process-two?id=" +
      id +
      "&name=" +
      name +
      "&active=" +
      activeStatus,
    2:
      "/carpool-management/form/process-three?id=" +
      id +
      "&name=" +
      name +
      "&active=" +
      activeStatus,
    3:
      "/carpool-management/form/process-four?id=" +
      id +
      "&name=" +
      name +
      "&active=" +
      activeStatus,
    4:
      "/carpool-management/form/process-five?id=" +
      id +
      "&name=" +
      name +
      "&active=" +
      activeStatus,
    5:
      "/carpool-management/form/process-one?id=" +
      id +
      "&name=" +
      name +
      "&active=" +
      activeStatus,
  };

  return (
    <div className="w-full mb-6">
      <div className="flex border-b tablist w-[100vw] max-w-[100vw] overflow-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`tab transition-colors duration-300 ease-in-out ${
              activeTab === index ? "active" : "text-gray-600"
            }`}
            onClick={() => {
              setActiveTab(index);
              router.push(tabRouter[index as keyof typeof tabRouter]);
            }}
          >
            <div className="flex gap-2 items-center">
              {tab.label}
              {/* {tab.badge !== undefined && (
                <span className="badge badge-brand badge-pill-outline">
                  {tab.badge}
                </span>
              )} */}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
