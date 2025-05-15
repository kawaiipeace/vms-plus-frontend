import { useState, ReactNode } from "react";
import VehicleFlow from "../flow/vehicleFlow";
import VehicleTimeLine from "../flow/vehicleTimeLineFlow";

interface Tab {
    label: string;
    content: ReactNode;
}

export default function VehicleManagementTabs() {
    const [activeTab, setActiveTab] = useState(0);

    const tabs: Tab[] = [
        { label: "ปฏิทินการจอง", content: 'ปฏิทินการจอง' },
        { label: "ยานพาหนะ", content: <VehicleFlow /> },
    ];

    const renderTabButton = (tab: Tab, index: number) => (
        <button
            key={index}
            className={`tab transition-colors duration-300 ease-in-out ${
                activeTab === index ? "active" : "text-gray-600"
            }`}
            onClick={() => setActiveTab(index)}
        >
            <div className="flex gap-2 items-center">{tab.label}</div>
        </button>
    );

    return (
        <div className="w-full">
            <div className="flex border-b tablist z-[10] w-[100vw] max-w-[100vw] overflow-auto">
                {tabs.map(renderTabButton)}
            </div>

            <div className="py-4">{tabs[activeTab]?.content}</div>
        </div>
    );
}