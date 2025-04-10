import React, { useState, useRef } from "react";
import DriverWaitKeyCard from "@/components/card/driverWaitKeyCard";
import DriverPickUpPassengerCard from "@/components/card/driverPickUpPassengerCard";
import UserInfoCard from "@/components/card/userInfoCard";
import Link from "next/link";
import AlertCustom from "@/components/alertCustom";
import CarDetailCard2 from "@/components/card/carDetailCard2";
import DriverPassengerInfoCard from "@/components/card/driverPassengerInfoCard";
import ReceiveCarVehicleModal from "@/components/modal/receiveCarVehicleModal";
import RequestStatusBox from "@/components/requestStatusBox";
import RecordTravelTab from "@/components/tabs/recordTravelTab";
import RecordFuelTab from "@/components/tabs/recordFuelTab";
import ReturnCarAddModal from "@/components/modal/returnCarAddModal";
import { ReturnCarInfoCard } from "@/components/card/returnCarInfoCard";
import { DriverReceiveCarInfoCard } from "@/components/card/driverReceiveCarInfoCard";
import ImagesCarCard from "@/components/card/ImagesCarCard";

interface DriverDetailContentProps {
  progressType: string;
}

const DriverDetailContent = ({ progressType }: DriverDetailContentProps) => {
  const status = "ยกเลิก";
  const returnCarAddComplete = true;
  const [activeTab, setActiveTab] = useState(0);
  const receiveCarVehicleModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const returnCarAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const tabs = [
    {
      label: "ข้อมูลการเดินทาง",
      content: (
        <>
          <RecordTravelTab />
        </>
      ),
      badge: "",
    },
    {
      label: "การเติมเชื้อเพลิง",
      content: (
        <>
          <RecordFuelTab />
        </>
      ),
      badge: "",
    },
  ];
  return (
    <div>
      {status === "ยกเลิก" && <AlertCustom title="งานถูกยกเลิกแล้ว" desc="ยกเลิกเมื่อ 25/12/2566" />}

      {progressType !== "การรับยานพาหนะ" && progressType !== "การคืนยานพาหนะ" && (
        <div className="flex items-center bg-[#F9FAFB] -mx-4 px-4">
          <p>VA67RA000001</p>
          <Link className="ml-auto" href={progressType === "คืนยานพาหนะไม่สำเร็จ" ? "/vehicle-in-use/driver/edit/1" : "/vehicle-in-use/driver/request-list/1"}>
            <button className="btn bg-transparent border-0 shadow-none text-[#A80689] p-0">
              รายละเอียด <i className="material-symbols-outlined">keyboard_arrow_right</i>
            </button>
          </Link>
        </div>
      )}

      {progressType === "รอรับกุญแจ" && (
        <div className="grid gird-cols-1 gap-4">
          <div className="w-full">
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  <p>การรับกุญแจ</p>
                  <p className="text-sm text-gray-500 font-normal">กรุณาไปรับกุญแจตามสถานที่ ในวันและเวลาที่กำหนด</p>
                </div>
              </div>
              <DriverWaitKeyCard />
            </div>
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  <p>การรับผู้โดยสาร</p>
                  <p className="text-sm text-gray-500 font-normal">กรุณาไปรับผู้โดยสารตามวัน เวลา และสถานที่ดังนี้</p>
                </div>
              </div>
              <DriverPickUpPassengerCard />
            </div>
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  <p>ข้อมูลผู้ดูแลยานพาหนะ</p>
                </div>
              </div>
              <UserInfoCard displayOn="driver" displayBtnMore={true} />
            </div>
          </div>
        </div>
      )}

      {progressType === "รอรับยานพาหนะ" && (
        <>
          <div className="grid gird-cols-1 gap-4">
            <div className="w-full">
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>ข้อมูลยานพาหนะ</p>
                  </div>
                </div>
                <CarDetailCard2 />
              </div>
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>สถานที่จอดรถ</p>
                  </div>
                </div>
                <div className="form-card">
                  <div className="form-card-body">
                    <div className="grid grid-cols-12">
                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">local_parking</i>
                          <div className="form-plaintext-group">
                            <div className="form-text">ล็อคที่ 5A ชั้น 2B อาคาร LED</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>การรับผู้โดยสาร</p>
                    <p className="text-sm text-gray-500 font-normal">กรุณาไปรับผู้โดยสารตามวัน เวลา และสถานที่ดังนี้</p>
                  </div>
                </div>
                <DriverPickUpPassengerCard />
              </div>
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>ผู้โดยสาร</p>
                  </div>
                </div>
                <DriverPassengerInfoCard displayOn="waitCar" />
              </div>
              <div className="col-span-12">
                <button type="button" className="btn btn-primary w-full" onClick={() => receiveCarVehicleModalRef.current?.openModal()}>
                  รับยานพาหนะ
                </button>
              </div>
            </div>
          </div>
          <ReceiveCarVehicleModal status="" ref={receiveCarVehicleModalRef} />
        </>
      )}

      {(progressType === "บันทึกการเดินทาง" || progressType === "บันทึกการเติมเชื้อเพลิง" || progressType === "รอการตรวจสอบ" || progressType === "คืนยานพาหนะไม่สำเร็จ" || progressType === "ภารกิจสำเร็จ") && (
        <>
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Link href={progressType === "ภารกิจสำเร็จ" ? "/vehicle-in-use/driver/1?progressType=การรับยานพาหนะ" : "/vehicle-in-use/driver/edit/1"}>
                <RequestStatusBox iconName="directions_car" status="info" title="รับยานพาหนะ" />
              </Link>
              {returnCarAddComplete ? (
                <Link href={progressType === "ภารกิจสำเร็จ" ? "/vehicle-in-use/driver/1?progressType=การคืนยานพาหนะ" : "/vehicle-in-use/driver/edit/1"}>
                  <RequestStatusBox iconName="reply" status="warning" title="คืนยานพาหนะ" />
                </Link>
              ) : (
                <div onClick={() => returnCarAddModalRef.current?.openModal()} className="cursor-pointer">
                  <RequestStatusBox iconName="reply" status="warning" title="คืนยานพาหนะ" />
                </div>
              )}
            </div>
            {progressType === "คืนยานพาหนะไม่สำเร็จ" && <AlertCustom title="ถูกตีกลับโดยผู้ดูแลยานพาหนะ" desc="เหตุผล: กรุณาเติมเชื้อเพลิงและดูแลความสะอาด ก่อนคืนยานพาหนะ" />}
          </div>
          <div className="w-full overflow-x-auto">
            <div className="flex border-b tablist">
              {tabs.map((tab, index) => (
                <button key={index} className={`tab transition-colors duration-300 ease-in-out ${activeTab === index ? "active" : "text-gray-600"}`} onClick={() => setActiveTab(index)}>
                  <div className="flex gap-2 items-center">
                    {tab.label}
                    {tab.badge && <span className="badge badge-brand badge-pill-outline">4</span>}{" "}
                  </div>
                </button>
              ))}
            </div>
          </div>
          {tabs[activeTab].content}
        </>
      )}

      {progressType === "การรับยานพาหนะ" && (
        <>
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ข้อมูลการรับยานพาหนะ</p>
              </div>
            </div>

            <DriverReceiveCarInfoCard />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>รูปยานพาหนะก่อนเดินทาง</p>
              </div>
            </div>

            <ImagesCarCard />
          </div>
        </>
      )}

      {progressType === "การคืนยานพาหนะ" && (
        <>
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ข้อมูลการคืนยานพาหนะ</p>
              </div>
            </div>

            <ReturnCarInfoCard />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>รูปยานพาหนะก่อนเดินทาง</p>
              </div>
            </div>

            <ImagesCarCard />
          </div>
        </>
      )}
      <ReturnCarAddModal useBy="driver" ref={returnCarAddModalRef} />
    </div>
  );
};

export default DriverDetailContent;
