import React, { useEffect, useState } from "react";
import Image from "next/image";
import ZeroRecord from "@/app/components/zeroRecord";
import RequestStatusBox from "@/app/components/requestStatusBox";
import ArpproveFlow from "@/app/components/approveFlow";
import { requests } from "@/app/services/bookingUser";
import { RequestData } from "@/app/data/requestData";

export default function RequestTabs() {
  const [ data, setData ] = useState<RequestData[]>([]);

  useEffect(() => {
    const getRequest = async () => {
      try {
        const response = await requests();
        if (response.status === 200) {
          setData(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getRequest();
  }, []); // Runs only once when the component mounts

  const tabs = [
    {
      label: "กำลังดำเนินการ",
      content: <ArpproveFlow data={data} />,
      badge: data?.length,
    },
    {
      label: "เสร็จสิ้น",
      content: <div></div>,
    },
    {
      label: "ยกเลิก",
      content: <div></div>,
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
                <span className="badge badge-brand badge-pill-outline">{tab.badge}</span>
              )}{" "}
            </div>
          </button>
        ))}
      </div>
      <div className="py-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <RequestStatusBox
            iconName="schedule"
            status="info"
            title="รออนุมัติ"
            number={3}
          />
          <RequestStatusBox
            iconName="reply"
            status="warning"
            title="ถูกตีกลับ"
            number={1}
          />
        </div>

        {tabs[activeTab].content}

        <div className="hidden">
          <ZeroRecord
            imgSrc="/assets/img/empty/create_request_empty state_vehicle.svg"
            title="ไม่พบคำขอใช้ยานพาหนะ"
            desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
            button="ล้างตัวกรอง"
          />
        </div>

        { data.length == 0 && 
        <div className="dt-table-emptyrecord hidden">
          <div className="emptystate">
            <Image
              src="/assets/img/empty/add_carpool.svg"
              width={100}
              height={100}
              alt=""
            />
            <div className="emptystate-title">ไม่มีกลุ่มยานพาหนะ</div>
            <div className="emptystate-text">
              เริ่มสร้างกลุ่มยานพาหนะกลุ่มแรก
            </div>
            <div className="emptystate-action">
              <button className="btn btn-primary">
                <i className="material-symbols-outlined">add</i>
                สร้างกลุ่มยานพาหนะ
              </button>
            </div>
          </div>
        </div>
        }

      </div>
    </div>
  );
}
