import React, { useState } from "react";

export default function CarpoolManagementTabs({ active }: { active: number }) {
  const [activeTab, setActiveTab] = useState(active);

  const tabs = [
    { label: "ปฏิทินการจอง" },
    { label: "ผู้ดูแลยานพาหนะ" },
    { label: "ผู้อนุมัติ" },
    { label: "ยานพาหนะ" },
    { label: "พนักงานขับรถ" },
    { label: "ตั้งค่ากลุ่ม" },
  ];

  return (
    <div className="w-full mb-6">
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
