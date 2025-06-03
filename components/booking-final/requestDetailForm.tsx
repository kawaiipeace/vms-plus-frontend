import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AppointmentDriverCard,
  ApproveProgress,
  CarDetailCard,
  DisburstmentCard,
  DriverPeaInfoCard,
  DriverSmallInfoCard,
  JourneyDetailCard,
  ReferenceCard,
  VehicleUserInfoCard,
} from "@/components";
import AlertCustom from "@/components/alertCustom";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { fetchRequestDetail } from "@/services/bookingFinal";
import PickupKeyDetailCard from "@/components/card/pickupKeyDetailCard";
import DriverWorkCard from "../card/driverWorkCard";

interface RequestDetailFormProps {
  requestId: string;
}

export default function RequestDetailForm({
  requestId,
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

  const sendbackRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [requestData, setRequestData] = useState<RequestDetailType>();

  const fetchRequestDetailfunc = async () => {
    try {
      const response = await fetchRequestDetail(requestId);
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

      {requestData?.ref_request_status_name == "อนุมัติแล้ว" && (
        <AlertCustom
          title="คำขอใช้ยานพาหนะนี้ถูกอนุมัติแล้ว"
          status="success"
          desc={""}
        />
      )}

      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ใช้ยานพาหนะ</div>
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
            </div>

            <JourneyDetailCard
              startDate={requestData?.start_datetime || ""}
              endDate={requestData?.end_datetime || ""}
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

            <ReferenceCard
              refNum={requestData?.doc_no}
              file={requestData?.doc_file}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">การเบิกค่าใช้จ่าย</div>
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

                {requestData?.is_system_choose_vehicle === "1" && (
                  <div className="card card-section-inline mt-5 mb-5">
                    <div className="card-body card-body-inline">
                      <div className="img img-square img-avatar flex-grow-1 align-self-start">
                        <Image
                          src="/assets/img/system-selected.png"
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
                              ระบบเลือกยานพาหนะให้อัตโนมัติ
                            </div>
                            <div className="supporting-text-group">
                              <div className="supporting-text">
                                สายงานดิจิทัล
                              </div>
                            </div>
                          </div>
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
                    <CarDetailCard
                      reqId={requestData?.trn_request_uid}
                      vehicle={requestData?.vehicle}
                      seeDetail={true}
                    />
                  )}

                {requestData?.is_pea_employee_driver === "1" ? (
                  <div className="mt-5 w-full overflow-hidden">
                    <DriverPeaInfoCard
                      role="final"
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
                      seeDetail={true}
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

                      <DriverWorkCard
                        reqId={requestData?.trn_request_uid}
                        id={requestData?.mas_carpool_driver_uid}
                        driverDetail={requestData?.driver}
                        seeDetail={true}
                      />
                    </div>
                  )
                )}
                <div className="mt-5">
                  <div className="form-section-header">
                    <div className="form-section-header-title">
                      การนัดหมายรับกุญแจ
                    </div>
                  </div>
                  <PickupKeyDetailCard
                    receiveKeyPlace={requestData?.received_key_place}
                    receiveKeyStart={requestData?.received_key_start_datetime}
                    receiveKeyEnd={requestData?.received_key_end_datetime}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
