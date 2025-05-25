import { RequestDetailType } from "@/app/types/request-detail-type";
import AlertCustom from "@/components/alertCustom";
import ApproveProgress from "@/components/approveProgress";
import AppointmentDriverCard from "@/components/card/appointmentDriverCard";
import CarDetailCard from "@/components/card/carDetailCard";
import ChooseDriverCard from "@/components/card/chooseDriverCard";
import DisburstmentCard from "@/components/card/disburstmentCard";
import DriverPeaInfoCard from "@/components/card/driverPeaInfoCard";
import DriverSmallInfoCard from "@/components/card/driverSmallInfoCard";
import JourneyDetailCard from "@/components/card/journeyDetailCard";
import PickupKeyCard from "@/components/card/pickupKeyCard";
import ReferenceCard from "@/components/card/referenceCard";
import VehicleUserInfoCard from "@/components/card/vehicleUserInfoCard";
import ApproverModal from "@/components/modal/approverModal";
import DisbursementModal from "@/components/modal/disbursementModal";
import JourneyDetailModal from "@/components/modal/journeyDetailModal";
import ReferenceModal from "@/components/modal/referenceModal";
import VehiclePickModel from "@/components/modal/vehiclePickModal";
import VehicleUserModal from "@/components/modal/vehicleUserModal";
import { firstApproverRequestDetail } from "@/services/bookingApprover";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface RequestDetailFormProps {
  requestId: string;
}

export default function RequestDetailForm({
  requestId,
}: RequestDetailFormProps) {
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

  const fetchRequestDetailfunc = async () => {
    try {
      const response = await firstApproverRequestDetail(requestId);
      console.log("res", response.data);
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  useEffect(() => {
    fetchRequestDetailfunc();
  }, [requestId]);

  return (
    <>
      {requestData?.ref_request_status_name == "ถูกตีกลับ" && (
        <AlertCustom
          title="คำขอใช้ถูกตีกลับ"
          desc={`เหตุผล: ${requestData?.rejected_request_reason}`}
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
            </div>

            <ReferenceCard
              refNum={requestData?.reference_number}
              file={requestData?.attached_document}
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
                activityNo={requestData?.activity_no || "ff"}
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
              approverId={`${requestData?.approved_request_emp_id}`}
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
                        </div>

                        <div className="card-item-group d-flex">
                          <div className="card-item col-span-2">
                            <i className="material-symbols-outlined">
                              directions_car
                            </i>
                            <span className="card-item-text">
                              {
                                requestData?.request_vehicle_type
                                  ?.ref_vehicle_type_name
                              }
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
                              {
                                requestData?.request_vehicle_type
                                  ?.ref_vehicle_type_name
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {requestData?.vehicle &&
                  !requestData?.is_admin_choose_vehicle &&
                  requestData?.is_admin_choose_vehicle === "0" && (
                    <CarDetailCard
                      vehicle={requestData?.vehicle}
                      seeDetail={true}
                    />
                  )}

                {requestData?.is_admin_choose_driver &&
                  requestData?.is_admin_choose_driver === "1" && (
                    <ChooseDriverCard
                      number={requestData?.number_of_available_drivers}
                    />
                  )}

                {requestData?.is_pea_employee_driver === "1" ? (
                  <div className="mt-5">
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
                      seeDetail={true}
                    />
                  </div>
                ) : (
                  requestData?.driver && (
                    <div className="mt-5">
                      <DriverSmallInfoCard
                        driverDetail={requestData?.driver}
                        id={requestData?.driver.driver_id}
                        seeDetail={true}
                      />
                    </div>
                  )
                )}

                {(requestData?.ref_request_status_code == "90" ||
                  requestData?.ref_request_status_code == "31" ||
                  requestData?.ref_request_status_code == "21" ||
                  requestData?.ref_request_status_code == "30") && (
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
                )}

                <div className="mt-5">
                  <PickupKeyCard
                    receiveKeyPlace={requestData?.pickup_place}
                    receiveKeyStart={requestData?.pickup_datetime}
                    receiveKeyEnd={requestData?.pickup_datetime}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VehiclePickModel process="edit" ref={vehiclePickModalRef} />
      <JourneyDetailModal ref={journeyDetailModalRef} />
      <VehicleUserModal process="edit" ref={vehicleUserModalRef} />
      <ReferenceModal ref={referenceModalRef} />
      <DisbursementModal ref={disbursementModalRef} />
      <ApproverModal ref={approverModalRef} />
    </>
  );
}
