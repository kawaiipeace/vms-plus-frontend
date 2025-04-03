import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import JourneyDetailModal from "@/components/modal/journeyDetailModal";
import VehiclePickModel from "@/components/modal/vehiclePickModal";
import EditDriverAppointmentModal from "@/components/modal/editDriverAppointmentModal";
import VehicleUserModal from "@/components/modal/vehicleUserModal";
import ReferenceModal from "@/components/modal/referenceModal";
import DisbursementModal from "@/components/modal/disbursementModal";
import ApproverModal from "@/components/modal/approverModal";
import AlertCustom from "@/components/alertCustom";
import ApproveRequestModal from "@/components/modal/approveRequestModal";
import CarDetailCard from "@/components/card/carDetailCard";
// import PickupKeyCard from "@/components/card/pickupKeyCard";
import DriverSmallInfoCard from "@/components/card/driverSmallInfoCard";
import JourneyDetailCard from "@/components/card/journeyDetailCard";
import AppointmentDriverCard from "@/components/card/appointmentDriverCard";
import ReferenceCard from "@/components/card/referenceCard";
import DisburstmentCard from "@/components/card/disburstmentCard";
import ApproveProgress from "@/components/approveProgress";
import { fetchVehicleDetail } from "@/services/bookingUser";
import DriverPeaInfoCard from "../card/driverPeaInfoCard";
import { FormDataType } from "@/app/types/form-data-type";
import ApproverInfoCard from "../card/approverInfoCard";
interface VehicleDetail {
  mas_vehicle_uid?: string;
  vehicle_brand_name?: string;
  vehicle_model_name?: string;
  vehicle_license_plate?: string;
  vehicle_img?: string;
  CarType?: string;
  vehicle_owner_dept_sap?: string;
  is_has_fleet_card?: string;
  vehicle_gear?: string;
  ref_vehicle_subtype_code?: number;
  vehicle_user_emp_id?: string;
  ref_fuel_type_id?: number;
  seat?: number;
  age?: number;
  vehicle_imgs: string[];
  ref_fuel_type?: {
    ref_fuel_type_id?: number;
    ref_fuel_type_name_th?: string;
    ref_fuel_type_name_en?: string;
  };
  vehicle_department?: {
    vehicle_mileage: string;
    vehicle_fleet_card_no: string;
    vehicle_pea_id: string;
    parking_place: string;
    vehicle_user?: {
      emp_id: string;
      full_name: string;
      dept_sap: string;
      tel_internal?: string;
      tel_mobile: string;
      dept_sap_short: string;
      image_url: string;
    };
  };
}

interface RequestDetailFormProps {
  status: string;
  approverCard?: boolean;
  driverCard?: boolean;
  keyPickUpCard?: boolean;
}

export default function RequestDetailForm({
  status,
  approverCard,
  driverCard,
}: // keyPickUpCard,
RequestDetailFormProps) {
  const carSelect = "true";
  const editDriverAppointmentModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const vehicleUserModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const journeyDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const vehiclePickModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const referenceModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const disbursementModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const approverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const approveRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [updatedFormData, setUpdatedFormData] = useState<FormDataType>();

  const [vehicleDetail, setVehicleDetail] = useState<VehicleDetail | null>(
    null
  );

  const handleModalUpdate = (updatedData: Partial<FormDataType>) => {
    setUpdatedFormData((prevData) => {
      if (!prevData) return undefined; // Fix: Return undefined instead of null

      return {
        ...prevData,
        ...updatedData,
      };
    });
  };

  useEffect(() => {
    const storedDataString = localStorage.getItem("formData");

    if (storedDataString) {
      const parsedData = JSON.parse(storedDataString); // Parse the string
      setUpdatedFormData(parsedData);
      console.log("data", parsedData);

      const fetchVehicleDetailData = async () => {
        try {
          if (parsedData?.vehicleSelect) {
            // Ensure parsedData is an object before accessing vehicleSelect
            const response = await fetchVehicleDetail(parsedData.vehicleSelect);
            console.log("rescar", response.data);

            if (response.status === 200) {
              setVehicleDetail(response.data ?? {});
            }
          }
        } catch (error) {
          console.error("Error fetching vehicle details:", error);
        }
      };

      fetchVehicleDetailData();
    }
  }, []);

  if (!updatedFormData) return null;
  return (
    <>
      {status == "edit" && (
        <AlertCustom
          title="คำขอใช้ถูกตีกลับ"
          desc="เหตุผล: แก้วัตถุประสงค์และสถานที่ปฏิบัติงานตามเอกสารอ้างอิง"
        />
      )}
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ใช้ยานพาหนะ</div>
              {status != "detail" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => vehicleUserModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <div className="form-card">
              <div className="form-card-body form-card-inline">
                <div className="form-group form-plaintext form-users">
                  <Image
                    src={
                      updatedFormData.userImageUrl || "/assets/img/avatar.svg"
                    }
                    className="avatar avatar-md"
                    width={100}
                    height={100}
                    alt=""
                  />
                  <div className="form-plaintext-group align-self-center">
                    <div className="form-label">
                      {updatedFormData?.vehicleUserEmpName}
                    </div>
                    <div className="supporting-text-group">
                      <div className="supporting-text">
                        {updatedFormData.vehicleUserDeptSap}
                      </div>
                      <div className="supporting-text">
                        {updatedFormData.deptSapShort}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-card-right align-self-center">
                  <div className="flex flex-wrap gap-4">
                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">smartphone</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowrap">
                            {updatedFormData.telMobile}
                          </div>
                        </div>
                      </div>
                    </div>

                    {updatedFormData.telInternal && (
                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">call</i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowra">
                              {" "}
                              {updatedFormData.telInternal}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                รายละเอียดการเดินทาง
              </div>
              {status != "detail" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => journeyDetailModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <JourneyDetailCard
              startDate={updatedFormData.startDate}
              endDate={updatedFormData.endDate}
              timeStart={updatedFormData.timeStart}
              timeEnd={updatedFormData.timeEnd}
              workPlace={updatedFormData.workPlace}
              purpose={updatedFormData.purpose}
              remark={updatedFormData.remark}
              tripType={updatedFormData.tripType}
              numberOfPassenger={updatedFormData.numberOfPassenger}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                การนัดหมายพนักงานขับรถ
              </div>
              {status != "detail" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() =>
                    editDriverAppointmentModalRef.current?.openModal()
                  }
                >
                  แก้ไข
                </button>
              )}
            </div>

            <AppointmentDriverCard
              pickupPlace={updatedFormData.pickupPlace}
              pickupDatetime={updatedFormData.pickupDatetime}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">หนังสืออ้างอิง</div>
              {status != "detail" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent border-none shadow-none"
                  onClick={() => referenceModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <ReferenceCard
              refNum={updatedFormData.referenceNumber}
              file={updatedFormData.attachmentFile}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">การเบิกค่าใช้จ่าย</div>
              {status != "detail" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent border-none shadow-none"
                  data-toggle="modal"
                  data-target="#editDisbursementModal"
                  onClick={() => disbursementModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <DisburstmentCard
              refCostTypeCode={updatedFormData.refCostTypeCode}
            />
          </div>
        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">
            {status == "detail" && <ApproveProgress />}

            <>
              {carSelect == "true" ? (
                <>
                  <div className="form-section-header">
                    <div className="form-section-header-title">ยานพาหนะ</div>
                  </div>

                  {updatedFormData.vehicleSelect && vehicleDetail && (
                    <CarDetailCard vehicle={vehicleDetail} />
                  )}

                  {updatedFormData.isAdminChooseVehicle === "1" && (
                    <div className="card card-section-inline mt-5 mb-5">
                      <div className="card-body card-body-inline">
                        <div className="img img-square img-avatar flex-grow-1 align-self-start">
                          <Image
                            src="/assets/img/graphic/admin_select_small.png"
                            className="rounded-md"
                            width={100}
                            height={100}
                            alt=""
                          />
                        </div>
                        <div className="card-content">
                          <div className="card-content-top card-content-top-inline">
                            <div className="card-content-top-left">
                              <div className="card-title">
                                ผู้ดูแลเลือกยานพาหนะให้
                              </div>
                              <div className="supporting-text-group">
                                <div className="supporting-text">
                                  สายงานดิจิทัล
                                </div>
                              </div>
                            </div>

                            <button
                              className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                              onClick={() =>
                                vehiclePickModalRef.current?.openModal()
                              }
                            >
                              เลือกประเภทยานพาหนะ
                            </button>
                          </div>

                          <div className="card-item-group d-flex">
                            <div className="card-item col-span-2">
                              <i className="material-symbols-outlined">
                                directions_car
                              </i>
                              <span className="card-item-text">
                                รถแวนตรวจการ (รถเก๋ง, SUV)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="card card-section-inline mt-5">
                    <div className="card-body card-body-inline">
                      <div className="img img-square img-avatar flex-grow-1 align-self-start">
                        <Image
                          src="/assets/img/graphic/admin_select_driver_small.png"
                          className="rounded-md"
                          width={100}
                          height={100}
                          alt=""
                        />
                      </div>
                      <div className="card-content">
                        <div className="card-content-top">
                          <div className="card-title">
                            ผู้ดูแลเลือกพนักงานขับรถให้
                          </div>
                          <div className="supporting-text-group">
                            <div className="supporting-text">สายงานดิจิทัล</div>
                          </div>
                        </div>

                        <div className="card-item-group d-flex">
                          <div className="card-item">
                            <i className="material-symbols-outlined">group</i>
                            <span className="card-item-text">ว่าง 2 คน</span>
                          </div>
                        </div>
                        <div className="card-actions">
                          <button className="btn btn-primary w-full">
                            เลือกพนักงานขับรถ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
            {updatedFormData.masCarpoolDriverUid && (
              <div className="mt-5">
                <DriverSmallInfoCard
                  id={updatedFormData.masCarpoolDriverUid}
                  userKeyPickup={false}
                />
              </div>
            )}

            {/* <div className="mt-5">
                <DriverPeaInfoCard />
            </div> */}

            {driverCard && status != "detail" && status != "edit" && (
              <div className="form-section mt-5">
                <div className="form-section-header">
                  <div className="form-section-header-title">ผู้ขับขี่</div>
                </div>

                <div className="card mt-3">
                  <div className="card-body card-body-inline">
                    <div className="img img-square img-avatar flex-grow-1 align-self-start">
                      <Image
                        src="/assets/img/sample-avatar.png"
                        className="rounded-md"
                        width={100}
                        height={100}
                        alt=""
                      />
                    </div>
                    <div className="card-content">
                      <div className="card-content-top">
                        <div className="card-title">ธนพล วิจารณ์ปรีชา</div>
                        <div className="supporting-text-group">
                          <div className="supporting-text">505291</div>
                          <div className="supporting-text">
                            นรค.6 กอพ.1 ฝพจ.
                          </div>
                        </div>
                      </div>

                      <div className="card-item-group">
                        <div className="card-item">
                          <i className="material-symbols-outlined">
                            smartphone
                          </i>
                          <span className="card-item-text">091-234-5678</span>
                        </div>
                        <div className="card-item">
                          <i className="material-symbols-outlined">call</i>
                          <span className="card-item-text">6032</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {approverCard && status != "detail" && status != "edit" && (
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  ผู้อนุมัติต้นสังกัด
                </div>
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => approverModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              </div>
              {approverCard && (
                <ApproverInfoCard
                emp_id={updatedFormData?.approvedRequestEmpId || ""}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {status == "edit" && (
        <div className="form-action">
          <button
            className="btn btn-primary"
            onClick={() => approveRequestModalRef.current?.openModal()}
          >
            ส่งคำขออีกครั้ง
          </button>
        </div>
      )}
      <EditDriverAppointmentModal
        ref={editDriverAppointmentModalRef}
        onUpdate={handleModalUpdate}
      />
      <VehiclePickModel process="edit" ref={vehiclePickModalRef} />
      <JourneyDetailModal
        ref={journeyDetailModalRef}
        onUpdate={handleModalUpdate}
      />
      <VehicleUserModal
        process="edit"
        ref={vehicleUserModalRef}
        onUpdate={handleModalUpdate}
      />
      <ReferenceModal
        ref={referenceModalRef}
        // refNum={updatedFormData.referenceNumber}
        // files={updatedFormData.attachmentFile}
        onUpdate={handleModalUpdate}
      />
      <DisbursementModal
        ref={disbursementModalRef}
        onUpdate={handleModalUpdate}
      />
      <ApproverModal ref={approverModalRef} />
      <ApproveRequestModal
        ref={approveRequestModalRef}
        title={"ยืนยันการส่งคำขออีกครั้ง"}
        desc={"ระบบจะทำการส่งคำขอนี้ ไปให้ต้นสังกัดอนุมัติอีกครั้ง"}
        confirmText="ส่งคำขอ"
      />
    </>
  );
}
