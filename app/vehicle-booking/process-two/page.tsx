"use client";
import { useState } from "react";
import { useSidebar } from "@/app/contexts/sidebarContext";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import ProcessRequestCar from "@/app/components/processRequestCar";
import SideBar from "@/app/components/sideBar";
import AutoCarCard from "@/app/components/card/autoCarCard";
import SelectCarCard from "@/app/components/selectCarCard";
import Pagination from "@/app/components/pagination";
import CustomSelect from "@/app/components/customSelect";
import ZeroRecord from "@/app/components/zeroRecord";
// import Toast from "@/app/components/toast";

export default function ProcessTwo() {
  const router = useRouter();
  const [vehicleCards, setVehicleCards] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const { isPinned } = useSidebar();


  const orgOptions = ["ทุกสังกัด", "หน่วยงานต้นสังกัด", "ฝพจ.", "กอพ.2"];
  const vehicleOptions = [
    "ทุกประเภทยานพาหนะ",
    "รถแวนตรวจการ (รถเก๋ง, SUV)",
    "รถตู้นั่ง",
  ];

  const handleVehicleSelect = (value: string) => {
    setSelectedVehicle(value);
  };

  const NextProcess = () => {
    router.push("process-three");
  }

  return (
    <div>
      <div className="main-container">
         <SideBar menuName="คำขอใช้ยานพาหนะ" />

        <div className={`main-content ${isPinned ? "md:pl-[280px]" : "md:pl-[80px]"}`}>
          <Header />
          <div className="main-content-body">
            <div className="page-header">
              <div className="breadcrumbs text-sm">
                <ul>
                  <li className="breadcrumb-item">
                    <a>
                      <i className="material-symbols-outlined">home</i>
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <a>คำขอใช้ยานพาหนะ</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    สร้างคำขอใช้ยานพาหนะ
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">สร้างคำขอใช้ยานพาหนะ</span>
                  {/* <!-- <span className="badge badge-outline badge-gray">95 กลุ่ม</span> --> */}
                </div>
              </div>
            </div>

            <ProcessRequestCar step={2} />

            <div className="form-steps-group">

              <div className="form-steps" data-step="2">
                <div className="form-section">
                  <div className="page-section-header border-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">
                          ข้อมูลผู้ใช้ยานพาหนะ
                        </span>
                        <span className="badge badge-outline badge-gray page-title-status">
                          20 คัน
                        </span>
                      </div>
                      <div className="page-desc">
                        ระบบจะแสดงรายการยานพาหนะที่พร้อมให้บริการตามช่วงเวลาและเงื่อนไขที่กำหนด
                      </div>
                    </div>
                  </div>

                  <div className="search-section flex justify-between">
                    <div className="input-group input-group-search w-6/12">
                      <div className="input-group-prepend">
                        <span className="input-group-text search-ico-info">
                          <i className="material-symbols-outlined">search</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control dt-search-input"
                        placeholder="ค้นหาเลขทะเบียน, ยี่ห้อ"
                      />
                      <div className="input-group-append hidden">
                        <span className="input-group-text search-ico-trailing">
                          <i className="material-symbols-outlined">
                            close_small
                          </i>
                        </span>
                      </div>
                    </div>

                    <div className="search-filter w-12/12 md:w-6/12 sm:gap-4 flex md:justify-end">
                      <CustomSelect w="md:w-[13.4rem]" options={orgOptions} />
                      <CustomSelect w="md:w-[14rem]" options={vehicleOptions} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
                    <AutoCarCard
                      imgSrc="/assets/img/admin-selected.png"
                      title="ผู้ดูแลยานพาหนะเลือกให้"
                      desc="สายงานดิจิทัล"
                      onSelect={handleVehicleSelect}
                    />
                    <AutoCarCard
                      imgSrc="/assets/img/system-selected.png"
                      title="ระบบเลือกยานพาหนะให้อัตโนมัติ"
                      desc="สายงานดิจิทัล"
                      onSelect={handleVehicleSelect}
                    />
                    <SelectCarCard
                      imgSrc="/assets/img/sample-car.jpeg"
                      title="Toyota Yaris"
                      subTitle="ก78ยบ กรุงเทพ"
                      onSelect={handleVehicleSelect}
                    />
                    <SelectCarCard
                      imgSrc="/assets/img/sample-car.jpeg"
                      title="Toyota Yaris"
                      subTitle="ก78ยบ กรุงเทพ"
                    onSelect={handleVehicleSelect}
                    />
                    <SelectCarCard
                      imgSrc="/assets/img/sample-car.jpeg"
                      title="Toyota Yaris"
                      subTitle="ก78ยบ กรุงเทพ"
                    onSelect={handleVehicleSelect}
                    />
                  </div>

                  <div className="pagination mt-[1.5rem] flex justify-end">
                    <Pagination />
                  </div>
                </div>
              </div>
            </div>

          { vehicleCards.length > 0 && <ZeroRecord
              imgSrc="/assets/img/empty/create_request_empty state_vehicle.svg"
              title="ไม่พบยานพาหนะ"
              desc={
                <>
                  ระบบไม่พบยานพาหนะที่คุณสามารถเลือกได้
                  <br />
                  ลองค้นหาใหม่อีกครั้ง
                </>
              }
              button="ล้างคำค้นหา"
            /> }
            

            <div className="form-action">
              <button onClick={() => NextProcess()} className="btn btn-primary" disabled={selectedVehicle === ""}>
                ต่อไป
                <i className="material-symbols-outlined icon-settings-300-24">
                  arrow_right_alt
                </i>
              </button>
            </div>
          </div>
        </div>
      </div>
           
    </div>
  );
}
