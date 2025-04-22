import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import JourneyDetailModal from "@/components/modal/journeyDetailModal";
import VehiclePickModel from "@/components/modal/vehiclePickModal";
import DriverAppointmentModal from "@/components/modal/driverAppointmentModal";
import VehicleUserModal from "@/components/modal/vehicleUserModal";
import ReferenceModal from "@/components/modal/referenceModal";
import DisbursementModal from "@/components/modal/disbursementModal";
import ApproverModal from "@/components/modal/approverModal";
import AlertCustom from "@/components/alertCustom";
import UserInfoCard from "@/components/card/userInfoCard";
import PickupKeyCard from "@/components/card/pickupKeyCard";
import DriverSmallInfoCard from "@/components/card/driverSmallInfoCard";
import JourneyDetailCard from "@/components/card/journeyDetailCard";
import ReferenceCard from "@/components/card/referenceCard";
import DisburstmentCard from "@/components/card/disburstmentCard";
import CarDetailCard2 from "@/components/card/carDetailCard2";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { fetchRequestKeyDetail } from "@/services/masterService";
import DriverPeaInfoCard from "../card/driverPeaInfoCard";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import VehicleUserInfoCard from "../card/vehicleUserInfoCard";

interface KeyPickUpDetailFormProps {
  requestId: string;
  editable?: boolean;
}
export default function KeyPickUpDetailForm({
  editable,
  requestId,
}: KeyPickUpDetailFormProps) {
  const carSelect = "true";
  const [driverType, setDriverType] = useState("PEA");
  const driverAppointmentModalRef = useRef<{
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
  const handleDriverTypeChange = (newType: string) => {
    setDriverType(newType);
  };

  const [requestData, setRequestData] = useState<RequestDetailType>();

  const fetchRequestDetailfunc = async () => {
    try {
      // Ensure parsedData is an object before accessing vehicleSelect
      const response = await fetchRequestKeyDetail(requestId);
      console.log("data---", response.data);
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  useEffect(() => {
    fetchRequestDetailfunc();
  }, [requestId]);

  const handleModalUpdate = () => {
    fetchRequestDetailfunc();
  };

  return (
    <>
        {requestData?.ref_request_status_name == "ถูกตีกลับ" && (
        <AlertCustom
          title="คำขอใช้ถูกตีกลับ"
          desc={`เหตุผล: ${requestData?.sended_back_request_reason}`}
        />
      )}

      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 col-span-1 md:col-start-1">
        <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ใช้ยานพาหนะ</div>
              {editable && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => vehicleUserModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>
            <VehicleUserInfoCard id={requestData?.vehicle_user_emp_id || ""} requestData={requestData} />
          </div>


          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                รายละเอียดการเดินทาง
              </div>
              {editable && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => journeyDetailModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <JourneyDetailCard
              startDate={
                convertToBuddhistDateTime(requestData?.start_datetime || "")
                  .date
              }
              endDate={
                convertToBuddhistDateTime(requestData?.end_datetime || "").date
              }
              timeStart={
                convertToBuddhistDateTime(requestData?.start_datetime || "")
                  .time
              }
              timeEnd={
                convertToBuddhistDateTime(requestData?.end_datetime || "").time
              }
              workPlace={requestData?.work_place}
              purpose={requestData?.objective}
              remark={requestData?.remark}
              tripType={requestData?.trip_type}
              numberOfPassenger={requestData?.number_of_passengers}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">หนังสืออ้างอิง</div>
              {editable && (
                <button
                  className="btn btn-tertiary-brand bg-transparent border-none shadow-none"
                  onClick={() => referenceModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <ReferenceCard
              refNum={requestData?.reference_number}
              file={requestData?.attached_document}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">การเบิกค่าใช้จ่าย</div>
              {editable && (
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
            {requestData?.ref_cost_type_code && (
              <DisburstmentCard
                refCostTypeCode={requestData?.ref_cost_type_code}
              />
            )}
          </div>
        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ยานพาหนะ</div>
            </div>

            <CarDetailCard2 />

            {driverType == "PEAS" && (
              <>
                {carSelect == "true" ? (
                  <>
                    <div className="form-section-header">
                      <div className="form-section-header-title">ยานพาหนะ</div>
                    </div>

                    <CarDetailCard2 />

                    <DriverSmallInfoCard />
                  </>
                ) : (
                  <>
                    {" "}
                    <div className="card card-section-inline mt-5">
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
                              <div className="supporting-text">
                                สายงานดิจิทัล
                              </div>
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

                <div className="mt-5">
                  <PickupKeyCard />
                </div>
              </>
            )}

            {requestData?.is_pea_employee_driver === "1" ? (
              <div className="mt-5">
                <div className="form-section-header">
                  <div className="form-section-header-title">ผู้ขับขี่</div>
                </div>

                <DriverPeaInfoCard
                  driver_emp_id={requestData?.driver_emp_id}
                  driver_emp_name={requestData?.driver_emp_name}
                  driver_emp_dept_sap={requestData?.driver_emp_dept_sap}
                  driver_internal_contact_number={
                    requestData?.driver_internal_contact_number
                  }
                  driver_mobile_contact_number={
                    requestData?.driver_mobile_contact_number
                  }
                  driver_image_url={requestData?.driver_image_url}
                />
              </div>
            ) : (
              requestData?.driver && (
                <div className="mt-5">
                  <div className="form-section-header">
                    <div className="form-section-header-title">ผู้ขับขี่</div>
                  </div>

                  <DriverSmallInfoCard
                    driverDetail={requestData?.driver}
                    showPhone={true}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <DriverAppointmentModal ref={driverAppointmentModalRef} id="2" />
      <VehiclePickModel process="edit" ref={vehiclePickModalRef} />
      <JourneyDetailModal ref={journeyDetailModalRef} />
      <VehicleUserModal process="edit" ref={vehicleUserModalRef} />
      <ReferenceModal ref={referenceModalRef} />
      <DisbursementModal ref={disbursementModalRef} />
      <ApproverModal ref={approverModalRef} />
      {/* <ApproveRequestModal ref={approveRequestModalRef} title={"ยืนยันการส่งคำขออีกครั้ง"} desc={"ระบบจะทำการส่งคำขอนี้ ไปให้ต้นสังกัดอนุมัติอีกครั้ง"} confirmText="ส่งคำขอ" /> */}
    </>
  );
}
