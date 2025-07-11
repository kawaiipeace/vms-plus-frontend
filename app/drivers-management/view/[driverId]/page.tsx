"use client";

import AlertCustom from "@/components/drivers-management/alertCustom";
import DriverBasicInfoCard from "@/components/drivers-management/card/driverBasicInfoCard";
import DriverDriveInfoCard from "@/components/drivers-management/card/driverDriveInfoCard";
import DriverEmployeeContractCard from "@/components/drivers-management/card/driverEmployeeContractCard";
import DocumentListInfo from "@/components/drivers-management/documentListInfo";
import DriverActiveModal from "@/components/drivers-management/modal/driverActiveModal";
import DriverDeleteModal from "@/components/drivers-management/modal/driverDeleteModal";
import DriverEditBasicInfoModal from "@/components/drivers-management/modal/driverEditBasicInfoModal";
import DriverEditDocModal from "@/components/drivers-management/modal/driverEditDocModal";
import DriverEditLicenseModal from "@/components/drivers-management/modal/driverEditLicenseModal";
import DriverLeaveFormModal from "@/components/drivers-management/modal/driverLeaveFormModal";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import ToastCustom from "@/components/toastCustom";
import ToggleSwitch from "@/components/toggleSwitch";
import { useSidebar } from "@/contexts/sidebarContext";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { DriverInfo, driverStatusRef, listDriverVendors, updateDriverStatus } from "@/services/driversManagement";

import { DriverMasType } from "@/app/types/driver-user-type";
import { DriverInfoType } from "@/app/types/drivers-management-type";
import DriverEditInfoModal from "@/components/drivers-management/modal/driverEditInfoModal";
import { getCarpoolDriverDetails } from "@/services/carpoolManagement";
import Link from "next/link";

interface DriverStatus {
  ref_driver_status_code: string;
  ref_driver_status_desc: string;
}

function ToastCustomComponent({ type, driverName }: { type: string; driverName?: string }) {
  const active = useSearchParams().get("active");
  return (
    <>
      {type === "basicInfo" && (
        <ToastCustom
          title="แก้ไขข้อมูลสำเร็จ"
          desc={
            <span>
              บันทึกการแก้ไขข้อมูลพนักงานขับรถ <span className="font-semibold">{driverName}</span> เรียบร้อยแล้ว
            </span>
          }
          status="success"
          searchParams={`active=${active}`}
        />
      )}
      {type === "delete" && (
        <ToastCustom
          title="ลบพนักงานขับรถสำเร็จ"
          desc="ข้อมูลพนักงานขับรถถูกลบเรียบร้อยแล้ว"
          status="success"
          searchParams={`active=${active}`}
        />
      )}
      {type === "leave" && (
        <ToastCustom
          title="บันทึกข้อมูลลาป่วย/ลากิจสำเร็จ"
          desc={
            <span>
              เรียบร้อยแล้วบันทึกข้อมูลลาป่วย/ลากิจของพนักงานขับรถ <span className="font-semibold">{driverName}</span>{" "}
              เรียบร้อยแล้ว
            </span>
          }
          status="success"
          searchParams={`active=${active}`}
        />
      )}
      {type === "activeUser" && (
        <ToastCustom
          title="เปิดใช้งานพนักงานขับรถสำเร็จ"
          desc={
            <span>
              เปิดใช้งานพนักงานขับรถ <span className="font-semibold">{driverName}</span> เรียบร้อยแล้ว
            </span>
          }
          status="success"
          searchParams={`active=${active}`}
        />
      )}
      {type === "inactiveUser" && (
        <ToastCustom
          title="ปิดใช้งานพนักงานขับรถสำเร็จ"
          desc={
            <span>
              ปิดใช้งานพนักงานขับรถ <span className="font-semibold">{driverName}</span> เรียบร้อยแล้ว
            </span>
          }
          status="success"
          searchParams={`active=${active}`}
        />
      )}
    </>
  );
}

function IsActiveWrapper({ setIsActive }: { setIsActive: (v: number) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    setIsActive(searchParams.get("active") === "1" ? 1 : 0);
  }, [searchParams, setIsActive]);
  return null;
}

const DriverViewProfilePage = () => {
  const router = useRouter();
  const { driverId } = useParams<{ driverId: string }>();
  const { isPinned } = useSidebar();
  const [driverInfo, setDriverInfo] = useState<DriverInfoType | null>({});
  const [deleteModalType, setDeleteModalType] = useState<string>("");
  // const [isActive, setIsActive] = useState<number>(useSearchParams().get("active") === "1" ? 1 : 0);
  const [isActive, setIsActive] = useState<number>(1);
  const [driverUpdated, setDriverUpdated] = useState<boolean>(false);
  const [updateType, setUpdateType] = useState<string>("");
  const [driverStatus, setDriverStatus] = useState<DriverStatus[]>([]);
  const [driverStatusDesc, setDriverStatusDesc] = useState<string>("");
  // const [driverVendorsList, setDriverVendorsList] = useState([]);
  const [vehicleUserData, setVehicleUserData] = useState<DriverMasType>();

  const driverActiveModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const driverEditBasicInfoModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const driverEditInfoModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const driverEditLicenseModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const driverEditDocModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const driverLeaveFormModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const driverDeleteModalRef = useRef<{
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

    const fetchDriverStatus = async () => {
      try {
        const response = await driverStatusRef();
        if (response.status === 200) {
          const driverStatusArr: DriverStatus[] = response.data;
          setDriverStatus(driverStatusArr);
        } else {
          console.error("Failed to fetch driver status");
        }
      } catch (error) {
        console.error("Error fetching driver status:", error);
      }
    };

    // const fetchDriverVendors = async () => {
    //   try {
    //     const response = await listDriverVendors();
    //     setDriverVendorsList(response.data);
    //   } catch (error) {
    //     console.error("Error fetching driver department data:", error);
    //   }
    // };

    const fetchVehicleUserData = async () => {
      try {
        const response = await getCarpoolDriverDetails(driverId);
        if (response.status === 200) {
          const res = response.data;
          setVehicleUserData(res[0]);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchDriverInfo();
    fetchDriverStatus();
    // fetchDriverVendors();
    fetchVehicleUserData();
    setDriverUpdated(false);
    router.replace(`/drivers-management/view/${driverId}?active=${isActive}`);
  }, [driverUpdated, driverId, isActive, router]);

  useEffect(() => {
    if (driverInfo) {
      const status: DriverStatus | undefined = (driverStatus as DriverStatus[]).find(
        (status: DriverStatus) =>
          String(status.ref_driver_status_code) === String(driverInfo?.driver_status?.ref_driver_status_code)
      );
      if (status) {
        setDriverStatusDesc(status.ref_driver_status_code);
      }
    }
  }, [driverStatus, driverInfo]);

  const handleUpdateStatusDriver = (driverUid: string, isActive: string) => {
    try {
      if (driverUid) {
        updateDriverStatus(driverUid, isActive)
          .then((response) => {
            if (response) {
              setDriverUpdated(true);
              setIsActive(Number(isActive));
              setUpdateType(isActive === "1" ? "activeUser" : "inactiveUser");
            }
          })
          .catch((error) => {
            console.error("Error updating driver status:", error);
          });
      }
    } catch (error) {
      console.error("Error updating driver status:", error);
    }
  };

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
                    <Link href="/">
                      <i className="material-symbols-outlined">home</i>
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <a href="/drivers-management">ข้อมูลพนักงานขับรถ</a>
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
                    {vehicleUserData?.driver_average_satisfaction_score === 0 ? (
                      "ยังไม่มีการให้คะแนน"
                    ) : (
                      <>
                        <span className="px-2">{vehicleUserData?.driver_average_satisfaction_score}</span>
                        <span>({vehicleUserData?.driver_satisfaction_score_count})</span>
                      </>
                    )}
                  </div>
                  {driverInfo?.driver_status?.ref_driver_status_desc === "ปฏิบัติงานปกติ" ? (
                    <div className="badge badge-pill-outline badge-success whitespace-nowrap">
                      {driverInfo?.driver_status?.ref_driver_status_desc}
                    </div>
                  ) : driverInfo?.driver_status?.ref_driver_status_desc === "ลา (ป่วย/กิจ)" ? (
                    <div className="badge badge-pill-outline badge-warning whitespace-nowrap">
                      {driverInfo?.driver_status?.ref_driver_status_desc}
                    </div>
                  ) : driverInfo?.driver_status?.ref_driver_status_desc === "หมดสัญญาจ้าง" ? (
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
                  ) : driverInfo?.driver_status?.ref_driver_status_desc === "ให้ออก(BlackList)" ? (
                    <div className="badge badge-pill-outline badge-neutral whitespace-nowrap">
                      {driverInfo?.driver_status?.ref_driver_status_desc}
                    </div>
                  ) : (
                    <div className="badge badge-pill-outline badge-accent whitespace-nowrap">
                      {driverInfo?.driver_status?.ref_driver_status_desc}
                    </div>
                  )}
                </div>
                <div className="page-action flex flex-wrap gap-2 items-center">
                  <button
                    className="btn bg-transparent hover:bg-transparent border-transparent hover:border-transparent shadow-none text-color"
                    onClick={() => {
                      driverDeleteModalRef.current?.openModal();
                      setDeleteModalType("delete");
                    }}
                  >
                    ลบพนักงาน
                  </button>
                  {driverInfo?.driver_status?.ref_driver_status_desc === "หมดสัญญาจ้าง" ||
                  driverInfo?.driver_status?.ref_driver_status_desc === "ลาออก" ||
                  driverInfo?.driver_status?.ref_driver_status_desc === "ให้ออก(BlackList)" ? (
                    <></>
                  ) : (
                    <>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          driverDeleteModalRef.current?.openModal();
                          setDeleteModalType("resign");
                        }}
                      >
                        ลาออก
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          driverDeleteModalRef.current?.openModal();
                          setDeleteModalType("giveout");
                        }}
                      >
                        ให้ออก
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => driverLeaveFormModalRef.current?.openModal()}
                      >
                        <i className="material-symbols-outlined">sick</i> ลาป่วย/ลากิจ
                      </button>
                      <div className="flex items-center">
                        <ToggleSwitch
                          isActive={isActive}
                          driverActiveModalRef={driverActiveModalRef}
                          driverId={driverId}
                          // useInView={true}
                          onUpdateStatusDriver={handleUpdateStatusDriver}
                        />
                        <span className="pl-2">เปิดใช้งาน</span>
                      </div>
                    </>
                  )}
                  {driverInfo?.driver_status?.ref_driver_status_desc === "หมดสัญญาจ้าง" && (
                    <button className="btn btn-secondary">ต่อสัญญา</button>
                  )}
                </div>
              </div>
            </div>

            {driverInfo?.driver_status?.ref_driver_status_desc === "ลา (ป่วย/กิจ)" && (
              <div className="mb-5">
                <AlertCustom
                  title="ลา 28/02/2568 - 01/03/2568 เต็มวัน"
                  desc="ลากลับบ้านต่างจังหวัด"
                  status="warning"
                  icon="warning"
                />
              </div>
            )}
            {driverInfo?.driver_status?.ref_driver_status_desc === "ให้ออก(BlackList)" && (
              <div className="mb-5">
                <AlertCustom title="พนักงานคนนี้ถูกให้ออก" desc="เลขมท : มท123(กอพ.1)" icon="cancel" />
              </div>
            )}

            <div className="grid md:grid-cols-3 gird-cols-1 gap-4">
              <div className="w-full md:col-span-2">
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-header-title">ข้อมูลทั่วไป</div>
                    <button
                      className="text-[#A80689] font-semibold"
                      onClick={() => driverEditBasicInfoModalRef.current?.openModal()}
                    >
                      แก้ไข
                    </button>
                  </div>
                  {driverInfo && <DriverBasicInfoCard driverInfo={driverInfo} />}
                </div>
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-header-title">ข้อมูลสัญญาจ้างและสังกัด</div>
                    <button
                      className="text-[#A80689] font-semibold"
                      onClick={() => driverEditInfoModalRef.current?.openModal()}
                    >
                      แก้ไข
                    </button>
                  </div>
                  {driverInfo && <DriverEmployeeContractCard driverInfo={driverInfo} />}
                </div>
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-header-title">ข้อมูลการขับขี่</div>
                    <button
                      className="text-[#A80689] font-semibold"
                      onClick={() => driverEditLicenseModalRef.current?.openModal()}
                    >
                      แก้ไข
                    </button>
                  </div>
                  {driverInfo && <DriverDriveInfoCard driverInfo={driverInfo} />}
                </div>
              </div>
              <div className="w-full md:col-span-1">
                <div className="form-section">
                  <div className="form-section-header">
                    <div className="form-section-header-title">เอกสารเพิ่มเติม</div>
                    <button
                      className="text-[#A80689] font-semibold"
                      onClick={() => driverEditDocModalRef.current?.openModal()}
                    >
                      แก้ไข
                    </button>
                  </div>
                </div>
                <DocumentListInfo driverInfo={driverInfo} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DriverActiveModal
        ref={driverActiveModalRef}
        title="ยืนยันปิดใช้งานพนักงานขับรถ"
        desc="คำขอที่สร้างไว้ก่อนหน้านี้ยังสามารถดำเนินการต่อได้จนสิ้นสุดการใช้งาน คุณต้องการปิดให้บริการจองพนักงานขับรถ ชั่วคราวใช่หรือไม่?"
        confirmText={isActive === 1 ? "ปิดใช้งานพนักงาน" : "เปิดใช้งาน"}
        driverUid={driverId}
        onUpdateDriver={handleUpdateStatusDriver}
        useInView={true}
      />
      {driverInfo && (
        <DriverEditBasicInfoModal
          ref={driverEditBasicInfoModalRef}
          driverInfo={driverInfo}
          onUpdateDriver={setDriverUpdated}
          setUpdateType={setUpdateType}
        />
      )}
      {driverInfo && (
        <DriverEditInfoModal
          ref={driverEditInfoModalRef}
          driverInfo={driverInfo}
          onUpdateDriver={setDriverUpdated}
          setUpdateType={setUpdateType}
        />
      )}
      {driverInfo && (
        <DriverEditLicenseModal
          ref={driverEditLicenseModalRef}
          driverInfo={driverInfo}
          onUpdateDriver={setDriverUpdated}
          setUpdateType={setUpdateType}
        />
      )}
      <DriverEditDocModal
        ref={driverEditDocModalRef}
        driverInfo={driverInfo}
        onUpdateDriver={setDriverUpdated}
        setUpdateType={setUpdateType}
      />
      {driverInfo && (
        <DriverLeaveFormModal
          ref={driverLeaveFormModalRef}
          driverInfo={driverInfo}
          onUpdateDriver={setDriverUpdated}
          setUpdateType={setUpdateType}
        />
      )}
      {driverInfo && (
        <DriverDeleteModal
          ref={driverDeleteModalRef}
          driverInfo={driverInfo ?? {}}
          deleteDriverType={deleteModalType}
        />
      )}

      <Suspense fallback={<div></div>}>
        <IsActiveWrapper setIsActive={setIsActive} />
        <ToastCustomComponent type={updateType} driverName={driverInfo?.driver_name} />
      </Suspense>
    </>
  );
};

export default DriverViewProfilePage;
