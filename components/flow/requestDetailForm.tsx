import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import JourneyDetailModal from "@/components/modal/journeyDetailModal";
import VehiclePickModel from "@/components/modal/vehiclePickModal";
import VehicleUserModal from "@/components/modal/vehicleUserModal";
import ReferenceModal from "@/components/modal/referenceModal";
import DisbursementModal from "@/components/modal/disbursementModal";
import ApproverModal from "@/components/modal/approverModal";
import AlertCustom from "@/components/alertCustom";
import ApproveRequestModal from "@/components/modal/approveRequestModal";
import CarDetailCard from "@/components/card/carDetailCard";
import DriverSmallInfoCard from "@/components/card/driverSmallInfoCard";
import JourneyDetailCard from "@/components/card/journeyDetailCard";
import AppointmentDriverCard from "@/components/card/appointmentDriverCard";
import ReferenceCard from "@/components/card/referenceCard";
import DisburstmentCard from "@/components/card/disburstmentCard";
import ApproveProgress from "@/components/approveProgress";
import { requestDetail } from "@/services/bookingUser";
import DriverPeaInfoCard from "../card/driverPeaInfoCard";
import ApproverInfoCard from "../card/approverInfoCard";
import { fetchVehicleUsers } from "@/services/masterService";
import { RequestDetailType } from "@/app/types/request-detail-type";
import VehicleUserInfoCard from "../card/vehicleUserInfoCard";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";

interface RequestDetailFormProps {
  requestId: string;
  approverCard?: boolean;
  driverCard?: boolean;
  keyPickUpCard?: boolean;
  requestAgain?: boolean;
}

export default function RequestDetailForm({
  requestId,
  approverCard,
  driverCard,
  keyPickUpCard,
  requestAgain
}: // keyPickUpCard,
RequestDetailFormProps) {
  const carSelect = "true";

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

 
  const [requestData, setRequestData] = useState<RequestDetailType>();

  useEffect(() => {
      const fetchRequestDetailfunc = async () => {
        try {
          // Ensure parsedData is an object before accessing vehicleSelect
          const response = await requestDetail(requestId);
          setRequestData(response.data);
        } catch (error) {
          console.error("Error fetching vehicle details:", error);
        }
      };

      fetchRequestDetailfunc();
  }, [requestId]);


  return (
    <>

        {/* <AlertCustom
          title="คำขอใช้ถูกตีกลับ"
          desc="เหตุผล: แก้วัตถุประสงค์และสถานที่ปฏิบัติงานตามเอกสารอ้างอิง"
        /> */}

      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ใช้ยานพาหนะ</div>
            </div>
            <VehicleUserInfoCard id={requestData?.vehicle_user_emp_id || ""} />
            
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                รายละเอียดการเดินทาง
              </div>
            </div>

            <JourneyDetailCard
              startDate={convertToBuddhistDateTime(requestData?.start_datetime || "").date}
              endDate={convertToBuddhistDateTime(requestData?.end_datetime || "").date}
              timeStart={convertToBuddhistDateTime(requestData?.start_datetime || "").time}
              timeEnd={convertToBuddhistDateTime(requestData?.end_datetime || "").time}
              workPlace={requestData?.work_place}
              purpose={requestData?.objective}
              remark={requestData?.remark}
              tripType={requestData?.trip_type}
              numberOfPassenger={requestData?.number_of_passengers}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                การนัดหมายพนักงานขับรถ
              </div>
            </div>

            <AppointmentDriverCard
              pickupPlace={requestData?.pickup_place}
              pickupDatetime={requestData?.pickup_datetime}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">หนังสืออ้างอิง</div>
            </div>

            <ReferenceCard refNum={requestData?.reference_number} file={requestData?.attached_document} />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">การเบิกค่าใช้จ่าย</div>
            </div>
{requestData?.ref_cost_type_code && 
            <DisburstmentCard
              refCostTypeCode={requestData?.ref_cost_type_code}
            />
          }
          </div>
        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">

         <ApproveProgress processActive={1} />

            <>
              {carSelect == "true" ? (
                <>
                  <div className="form-section-header">
                    <div className="form-section-header-title">ยานพาหนะ</div>
                  </div>

                  {/* {requestData?.vehicleSelect && vehicleDetail && (
                    <CarDetailCard vehicle={vehicleDetail} />
                  )} */}

                  {requestData?.is_admin_choose_driver === "1" && (
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
            {requestData?.is_pea_employee_driver === "1" ? (
              <div className="mt-5">
                {/* <DriverPeaInfoCard driverEmpID={requestData?.vehicle_user_emp_id} /> */}
              </div>
            ) : (
              <div className="mt-5">
                {/* <DriverSmallInfoCard
                  id={requestData?.mas_carpool_driver_uid}
                  userKeyPickup={false}
                /> */}
              </div>
            )}

            {driverCard && (
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
          {approverCard && (
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  ผู้อนุมัติต้นสังกัด
                </div>
              </div>
              {approverCard && (
                <ApproverInfoCard
                  emp_id={requestData?.approved_request_emp_id || ""}
                />
              )}
            </div>
          )}
        </div>
      </div>

        {requestAgain && 
        <div className="form-action">
          <button
            className="btn btn-primary"
            onClick={() => approveRequestModalRef.current?.openModal()}
          >
            ส่งคำขออีกครั้ง
          </button>
        </div>
        }


      <VehiclePickModel process="edit" ref={vehiclePickModalRef} />
      <JourneyDetailModal
        ref={journeyDetailModalRef}
      />
      <VehicleUserModal
        process="edit"
        ref={vehicleUserModalRef}
      />
      <ReferenceModal ref={referenceModalRef} />
      <DisbursementModal
        ref={disbursementModalRef}
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
