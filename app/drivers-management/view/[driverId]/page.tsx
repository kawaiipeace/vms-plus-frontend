"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import ToggleSwitch from "@/components/toggleSwitch";
import DriverActiveModal from "@/components/drivers-management/modal/driverActiveModal";
import DriverBasicInfoCard from "@/components/drivers-management/card/driverBasicInfoCard";
import DriverEmployeeContractCard from "@/components/drivers-management/card/driverEmployeeContractCard";
import DriverDriveInfoCard from "@/components/drivers-management/card/driverDriveInfoCard";
import DocumentListInfo from "@/components/drivers-management/documentListInfo";
import AlertCustom from "@/components/drivers-management/alertCustom";
import { useParams } from "next/navigation";

import { DriverInfo } from "@/services/driversManagement";

import { DriverInfoType } from "@/app/types/drivers-management-type";

const DriverViewProfilePage = () => {
  const { driverId } = useParams<{ driverId: string }>();
  const { isPinned } = useSidebar();
  const [driverInfo, setDriverInfo] = useState<DriverInfoType | null>({});

  const driverActiveModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useEffect(() => {
    const fetchDriverInfo = async () => {
      try {
        const driverUid = driverId; // Replace with actual driver UID
        const response = await DriverInfo(driverUid);
        if (response.status === 200) {
          setDriverInfo(response.data.driver);
        } else {
          console.error("Failed to fetch driver info");
        }
      } catch (error) {
        console.error("Error fetching driver info:", error);
      }
    };

    fetchDriverInfo();
  }, [driverId]);

  return (
    <>
      <div className="main-container">
        <SideBar menuName="ข้อมูลพนักงานขับรถ" />
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
                  <li className="breadcrumb-item active" aria-current="page">
                    <a>ข้อมูลพนักงานขับรถ</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <a>{driverInfo?.driver_name}</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">{driverInfo?.driver_name}</span>
                  <div className="flex items-center">
                    <i className="material-symbols-outlined text-[#A80689] !text-3xl">star</i>
                    <span className="px-2">4.6</span>
                    <span>(200)</span>
                  </div>
                  {driverInfo?.driver_status?.ref_driver_status_desc === "ปฏิบัติงานปกติ" ? (
                    <div className="badge badge-pill-outline badge-success whitespace-nowrap">
                      {driverInfo?.driver_status?.ref_driver_status_desc}
                    </div>
                  ) : driverInfo?.driver_status?.ref_driver_status_desc === "ลาป่วย/ลากิจ" ? (
                    <div className="badge badge-pill-outline badge-warning whitespace-nowrap">
                      {driverInfo?.driver_status?.ref_driver_status_desc}
                    </div>
                  ) : driverInfo?.driver_status?.ref_driver_status_desc === "สิ้นสุดสัญญา" ? (
                    <div className="badge badge-pill-outline badge-gray whitespace-nowrap">
                      {driverInfo?.driver_status?.ref_driver_status_desc}
                    </div>
                  ) : driverInfo?.driver_status?.ref_driver_status_desc === "ลาออก" ? (
                    <div className="badge badge-pill-outline badge-error whitespace-nowrap">
                      {driverInfo?.driver_status?.ref_driver_status_desc}
                    </div>
                  ) : driverInfo?.driver_status?.ref_driver_status_desc === "สำรอง" ? (
                    <div className="badge badge-pill-outline badge-info whitespace-nowrap">
                      {driverInfo?.driver_status?.ref_driver_status_desc}
                    </div>
                  ) : driverInfo?.driver_status?.ref_driver_status_desc === "ให้ออก" ? (
                    <div className="badge badge-pill-outline badge-gray whitespace-nowrap">
                      {driverInfo?.driver_status?.ref_driver_status_desc}
                    </div>
                  ) : (
                    <div className="badge badge-pill-outline badge-success whitespace-nowrap">
                      {driverInfo?.driver_status?.ref_driver_status_desc}
                    </div>
                  )}
                </div>
                <div className="page-action flex gap-2 items-center">
                  <button className="btn bg-transparent hover:bg-transparent border-transparent hover:border-transparent shadow-none">
                    ลบพนักงาน
                  </button>
                  {driverInfo?.driver_status?.ref_driver_status_desc === "สิ้นสุดสัญญา" ||
                  driverInfo?.driver_status?.ref_driver_status_desc === "ลาออก" ||
                  driverInfo?.driver_status?.ref_driver_status_desc === "ให้ออก" ? (
                    <></>
                  ) : (
                    <>
                      <button className="btn btn-secondary">ลาออก</button>
                      <button className="btn btn-secondary">ให้ออก</button>
                      <button className="btn btn-secondary">
                        <i className="material-symbols-outlined">sick</i> ลาป่วย/ลากิจ
                      </button>
                      <div className="flex items-center">
                        <ToggleSwitch isActive={1} driverActiveModalRef={driverActiveModalRef} driverId="" />
                        <span className="pl-2">เปิดใช้งาน</span>
                      </div>
                    </>
                  )}
                  {driverInfo?.driver_status?.ref_driver_status_desc === "สิ้นสุดสัญญา" && (
                    <button className="btn btn-secondary">ต่อสัญญา</button>
                  )}
                </div>
              </div>
            </div>

            {driverInfo?.driver_status?.ref_driver_status_desc === "ลาป่วย/ลากิจ" && (
              <div className="mb-5">
                <AlertCustom
                  title="ลา 28/02/2568 - 01/03/2568 เต็มวัน"
                  desc="ลากลับบ้านต่างจังหวัด"
                  status="warning"
                  icon="warning"
                />
              </div>
            )}
            {driverInfo?.driver_status?.ref_driver_status_desc === "ให้ออก" && (
              <div className="mb-5">
                <AlertCustom title="พนักงานคนนี้ถูกให้ออก" desc="เลขมท : มท123(กอพ.1)" icon="cancel" />
              </div>
            )}

            <div className="grid md:grid-cols-3 gird-cols-1 gap-4">
              <div className="w-full md:col-span-2">
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-header-title">ข้อมูลทั่วไป</div>
                    <button className="text-[#A80689] font-semibold">แก้ไข</button>
                  </div>
                  {driverInfo && <DriverBasicInfoCard driverInfo={driverInfo} />}
                </div>
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-header-title">ข้อมูลสัญญาจ้างและสังกัด</div>
                    <button className="text-[#A80689] font-semibold">แก้ไข</button>
                  </div>
                  {driverInfo && <DriverEmployeeContractCard driverInfo={driverInfo} />}
                </div>
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-header-title">ข้อมูลการขับขี่</div>
                    <button className="text-[#A80689] font-semibold">แก้ไข</button>
                  </div>
                  {driverInfo && <DriverDriveInfoCard driverInfo={driverInfo} />}
                </div>
              </div>
              <div className="w-full md:col-span-1">
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-header-title">เอกสารเพิ่มเติม</div>
                    <button className="text-[#A80689] font-semibold">แก้ไข</button>
                  </div>
                </div>
                <DocumentListInfo />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DriverActiveModal
        ref={driverActiveModalRef}
        title="ยืนยันปิดใช้งานพนักงานขับรถ"
        desc="คำขอที่สร้างไว้ก่อนหน้านี้ยังสามารถดำเนินการต่อได้จนสิ้นสุดการใช้งาน คุณต้องการปิดให้บริการจองพนักงานขับรถ ชั่วคราวใช่หรือไม่?"
        confirmText="ปิดใช้งานพนักงานชั่วคราว"
      />
    </>
  );
};

export default DriverViewProfilePage;
