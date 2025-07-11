"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import {
  AppointmentDriverCard,
  ApproveProgress,
  ApproverModal,
  CarDetailCard,
  ChooseDriverCard,
  DisbursementModal,
  DisburstmentCard,
  DriverPeaInfoCard,
  DriverSmallInfoCard,
  EditDriverAppointmentModal,
  JourneyDetailCard,
  JourneyDetailModal,
  ReferenceCard,
  ReferenceModal,
  SendbackRequestModal,
  VehiclePickModel,
  VehicleUserInfoCard,
  VehicleUserModal,
} from "@/components";
import AlertCustom from "@/components/alertCustom";
import { requestDetail } from "@/services/bookingUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface RequestDetailFormProps {
  requestId: string;
  editable?: boolean;
}

export default function RequestDetailForm({
  requestId,
  editable,
}: RequestDetailFormProps) {
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

  const sendbackRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [requestData, setRequestData] = useState<RequestDetailType>();

  const fetchRequestDetailfunc = async () => {
    try {
      // Ensure parsedData is an object before accessing vehicleSelect
      const response = await requestDetail(requestId);
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
          desc={`เหตุผล: ${requestData?.rejected_request_reason}`}
        />
      )}
      {requestData?.ref_request_status_name == "ยกเลิกคำขอ" && (
        <AlertCustom
          title="คำขอใช้ถูกยกเลิกแล้ว"
          desc={`เหตุผล: ${requestData?.canceled_request_reason}`}
        />
      )}
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ใช้ยานพาหนะ</div>
              {editable && requestData?.ref_request_status_code !== "50" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => vehicleUserModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>
            <VehicleUserInfoCard
              id={requestData?.vehicle_user_emp_id || ""}
              requestData={requestData}
              displayPhone={true}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                รายละเอียดการเดินทาง
              </div>
              {editable && requestData?.ref_request_status_code !== "50" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => journeyDetailModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <JourneyDetailCard
              startDate={requestData?.start_datetime}
              endDate={requestData?.end_datetime}
              timeStart={
                convertToBuddhistDateTime(requestData?.start_datetime || "")
                  .time
              }
              timeEnd={
                convertToBuddhistDateTime(requestData?.end_datetime || "").time
              }
              workPlace={requestData?.work_place}
              purpose={requestData?.work_description}
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
              {editable && requestData?.ref_request_status_code !== "50" && (
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
              pickupPlace={requestData?.pickup_place}
              pickupDatetime={requestData?.pickup_datetime}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">หนังสืออ้างอิง</div>
              {editable && requestData?.ref_request_status_code !== "50" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent border-none shadow-none"
                  onClick={() => referenceModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <ReferenceCard
              refNum={requestData?.doc_no}
              file={requestData?.doc_file}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">การเบิกค่าใช้จ่าย</div>
              {editable && requestData?.ref_request_status_code !== "50" && (
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
                costCenter={requestData?.cost_center}
                activityNo={requestData?.activity_no}
                wbsNo={requestData?.wbs_number}
                networkNo={requestData?.network_no}
                pmOrderNo={requestData?.pm_order_no}
              />
            )}
          </div>
        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">
            <ApproveProgress
              progressSteps={requestData?.progress_request_status}
              progressRequestStatusEmp={
                requestData?.progress_request_status_emp
              }
            />

            <div className="col-span-1 row-start-1 md:row-start-2">
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">ยานพาหนะ</div>
                </div>

                {requestData?.is_admin_choose_vehicle === "1" && (
                  <div className="card card-section-inline mt-5 mb-5">
                    <div className="card-body card-body-inline">
                      <div className="img img-square img-avatar flex-grow-1 align-self-start">
                        <Image
                          src="/assets/img/graphic/admin_select_small.png"
                          className="rounded-md"
                          width={100}
                          height={100}
                          alt="adminselect"
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
                                {requestData?.carpool_name || ""}
                              </div>
                            </div>
                          </div>
                          {editable &&
                            requestData?.ref_request_status_code !== "50" && (
                              <button
                                className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                                onClick={() =>
                                  vehiclePickModalRef.current?.openModal()
                                }
                              >
                                เลือกประเภทยานพาหนะ
                              </button>
                            )}
                        </div>

                        <div className="card-item-group d-flex">
                          <div className="card-item col-span-2">
                            <i className="material-symbols-outlined">
                              directions_car
                            </i>
                            <span className="card-item-text">
                              {requestData?.requested_vehicle_type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {requestData?.is_system_choose_vehicle === "1" && (
                  <div className="card card-section-inline mt-5 mb-5">
                    <div className="card-body card-body-inline">
                      <div className="img img-square img-avatar flex-grow-1 align-self-start">
                        <Image
                          src="/assets/img/system-selected.png"
                          className="rounded-md"
                          width={100}
                          height={100}
                          alt="system select"
                        />
                      </div>
                      <div className="card-content">
                        <div className="card-content-top card-content-top-inline">
                          <div className="card-content-top-left">
                            <div className="card-title">
                              ระบบเลือกยานพาหนะให้อัตโนมัติ
                            </div>
                            <div className="supporting-text-group">
                              <div className="supporting-text">
                                สายงานดิจิทัล
                              </div>
                            </div>
                          </div>
                          {editable &&
                            requestData?.ref_request_status_code !== "50" && (
                              <button
                                className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                                onClick={() =>
                                  vehiclePickModalRef.current?.openModal()
                                }
                              >
                                เลือกประเภทยานพาหนะ
                              </button>
                            )}
                        </div>

                        <div className="card-item-group d-flex">
                          <div className="card-item col-span-2">
                            <i className="material-symbols-outlined">
                              directions_car
                            </i>
                            <span className="card-item-text">
                              {/* {requestData.requestedVehicleTypeName} */}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {requestData?.vehicle &&
                  (!requestData?.is_admin_choose_vehicle ||
                    requestData?.is_admin_choose_vehicle === "0") && (
                    <CarDetailCard vehicle={requestData?.vehicle} />
                  )}

                {requestData?.can_choose_driver === true && (
                  <ChooseDriverCard
                    number={requestData?.number_of_available_drivers}
                    requestData={requestData}
                  />
                )}
                {requestData?.can_choose_driver === false &&
                  (requestData?.is_pea_employee_driver === "1" ? (
                    <div className="mt-5">
                      <div className="form-section-header">
                        <div className="form-section-header-title">
                          ผู้ขับขี่
                        </div>
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
                          <div className="form-section-header-title">
                            ผู้ขับขี่
                          </div>
                        </div>

                        <DriverSmallInfoCard
                          driverDetail={requestData?.driver}
                          showPhone={true}
                        />
                      </div>
                    )
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditDriverAppointmentModal
        ref={editDriverAppointmentModalRef}
        requestData={requestData}
        onUpdate={handleModalUpdate}
      />
      <VehiclePickModel
        process="edit"
        ref={vehiclePickModalRef}
        masCarpoolUid={requestData?.mas_carpool_uid}
        selectType={
          requestData?.is_admin_choose_vehicle === "1"
            ? "Admin เลือกยานพาหนะให้"
            : "ระบบเลือกยานพาหนะให้"
        }
        desc={requestData?.carpool_name}
        requestData={requestData}
        onUpdate={handleModalUpdate}
      />
      <JourneyDetailModal
        ref={journeyDetailModalRef}
        requestData={requestData}
        onUpdate={handleModalUpdate}
      />
      <VehicleUserModal
        requestData={requestData}
        process="edit"
        ref={vehicleUserModalRef}
        onUpdate={handleModalUpdate}
      />
      <ReferenceModal
        ref={referenceModalRef}
        requestData={requestData}
        onUpdate={handleModalUpdate}
      />
      <DisbursementModal
        ref={disbursementModalRef}
        requestData={requestData}
        onUpdate={handleModalUpdate}
      />
      <ApproverModal ref={approverModalRef} />
      <SendbackRequestModal
        id={String(requestData?.trn_request_uid)}
        ref={sendbackRequestModalRef}
        title={"ยืนยันการส่งคำขออีกครั้ง"}
        desc={"ระบบจะทำการส่งคำขอนี้ ไปให้ต้นสังกัดอนุมัติอีกครั้ง"}
        confirmText="ส่งคำขอ"
      />
      {requestData?.ref_request_status_name == "ถูกตีกลับ" && (
        <div className="form-action">
          <button
            className="btn btn-primary"
            onClick={() => sendbackRequestModalRef.current?.openModal()}
          >
            ส่งคำขออีกครั้ง
          </button>
        </div>
      )}
    </>
  );
}
