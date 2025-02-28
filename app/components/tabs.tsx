import React, { useState, useRef } from "react";
import Image from "next/image";
import ZeroRecord from "./zeroRecord";
import FilterModal from "./filterModal";
import Link from "next/link";
import TableComponent from "./table";
import { requestData, requestDataColumns } from "@/app/data/requestData";

interface Tab {
  label: React.ReactNode;
  content: React.ReactNode;
  badge?: string;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  
 const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
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
        {tabs[activeTab].label == "รออนุมัติ" ? (
          <div className="flex justify-between items-center">
            <div className="hidden md:block">
            <div className="input-group input-group-search hidden">
              <div className="input-group-prepend">
                <span className="input-group-text search-ico-info">
                  <i className="material-symbols-outlined">search</i>
                </span>
              </div>
              <input
                type="text"
                id="myInputTextField"
                className="form-control dt-search-input"
                placeholder="เลขที่คำขอ, ผู้ใช้, ยานพาหนะ, สถานที่"
              />
              {/* <div className="input-group-append">
              <span className="input-group-text search-ico-trailing">
                <i className="material-symbols-outlined">close_small</i>
              </span>
            </div> */}
            </div>
            </div>

            <div className="flex gap-4">
              <button
                className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] hidden md:block"
                onClick={() => filterModalRef.current?.openModal()}
              >
                <div className="flex items-center gap-1">
                <i className="material-symbols-outlined">filter_list</i>
                ตัวกรอง
                <span className="badge badge-brand badge-outline rounded-[50%]">
                  2
                </span>
                </div>
              </button>
              <Link href="process-one" className="btn btn-primary h-[40px] min-h-[40px]"  >
                <i className="material-symbols-outlined">add</i>
                สร้างคำขอใช้
              </Link>
             
            </div>
          </div>
        ) : (
          ""
        )}
        {tabs[activeTab].content}

        <TableComponent data={requestData} columns={requestDataColumns} />

        <div className="hidden">
        <ZeroRecord
          imgSrc="/assets/img/empty/create_request_empty state_vehicle.svg"
          title="ไม่พบคำขอใช้ยานพาหนะ"
          desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
          button="ล้างตัวกรอง"
        />
        </div>

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
      </div>
      <FilterModal ref={filterModalRef} />
    </div>
  );
};

export default Tabs;
