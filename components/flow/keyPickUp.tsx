import { RequestDetailType } from "@/app/types/request-detail-type";
import { VehicleKeyType } from "@/app/types/vehicle-user-type";
import AlertCustom from "@/components/alertCustom";
import CarDetailCard2 from "@/components/card/carDetailCard2";
import ApproverModal from "@/components/modal/approverModal";
import DriverAppointmentModal from "@/components/modal/driverAppointmentModal";
import KeyPickupDetailModal from "@/components/modal/keyPickUpDetailModal";
import { fetchRequestKeyDetail, fetchVehicleKeyType } from "@/services/masterService";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import DriverPassengerPeaInfoCard from "../card/driverPassengerPeaInfoCard";
import PickupKeyDetailCard from "../card/pickupKeyDetailCard";
import KeyPickUpEditModal from "../modal/keyPickUpEditModal";

interface RequestDetailFormProps {
  editable?: boolean;
  requestId?: string;
}
export default function KeyPickUp({ editable, requestId }: RequestDetailFormProps) {
  const driverAppointmentModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const keyPickupDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const approverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const keyPickUpEditModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  }>(null);

  const [requestData, setRequestData] = useState<RequestDetailType>();
  const [pickupDatePassed, setPickupDatePassed] = useState(false);
  const [vehicleKeyTypeData, setVehicleKeyTypeData] = useState<VehicleKeyType[]>();

  const fetchRequestDetailfunc = async () => {
    try {
      // Ensure parsedData is an object before accessing vehicleSelect
      const response = await fetchRequestKeyDetail(requestId || "");
      const responseKeyType = await fetchVehicleKeyType();
      const today = new Date();
      const pickup = new Date(response?.data?.received_key_start_datetime);
      // zero out time for accurate day comparison
      today.setHours(0, 0, 0, 0);
      pickup.setHours(0, 0, 0, 0);
      setPickupDatePassed(today > pickup ? true : false);
      setRequestData(response.data);
      setVehicleKeyTypeData(responseKeyType.data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  useEffect(() => {
    console.log("re-", requestId);
    fetchRequestDetailfunc();
  }, [requestId]);

  const handleModalUpdate = () => {
    fetchRequestDetailfunc();
  };

  const findVehicleKeyType: VehicleKeyType | undefined = useMemo(() => {
    return vehicleKeyTypeData?.find(
      (e: VehicleKeyType) => e.ref_vehicle_key_type_code === requestData?.ref_vehicle_key_type_code.toString()
    );
  }, [vehicleKeyTypeData, requestData]);
  console.log(findVehicleKeyType);

  console.log("requestData---", requestData);

  return (
    <>
      {pickupDatePassed && requestData && requestData?.ref_request_status_code === "50" && (
        <AlertCustom
          icon="cancel"
          title="เกินวันที่นัดหมายรับกุญแจแล้ว"
          desc="กรุณาติดต่อผู้ดูแลยานพาหนะหากต้องการนัดหมายเดินทางใหม่"
        />
      )}
      {requestData?.ref_request_status_code === "50" ? (
        <div className="grid md:grid-cols-2 gird-cols-1 gap-4 w-full">
          <div className="w-full row-start-2 md:col-start-1">
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  <p>การนัดหมายรับกุญแจ</p>
                  <p className="text-sm text-gray-500 font-normal">
                    กรุณาไปรับกุญแจตามวัน เวลา และสถานที่ที่กำหนด หรือติดต่อผู้ดูแลยานพาหนะหากต้องการแก้ไขนัดหมาย
                  </p>
                </div>

                {editable && (
                  <button
                    className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                    onClick={() => driverAppointmentModalRef.current?.openModal()}
                  >
                    แก้ไข
                  </button>
                )}
              </div>

              <PickupKeyDetailCard
                receiveKeyPlace={requestData?.received_key_place}
                receiveKeyStart={requestData?.received_key_start_datetime}
                receiveKeyEnd={requestData?.received_key_end_datetime}
              />
            </div>

            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">ผู้ดูแลยานพาหนะ **รอkey</div>
              </div>
              <DriverPassengerPeaInfoCard id={requestData?.vehicle_user_emp_id || ""} requestData={requestData} />
              {/* {requestData?.is_pea_employee_driver === "1" ? (
                <DriverPassengerPeaInfoCard id={requestData?.vehicle_user_emp_id || ""} requestData={requestData} />
              ) : (
                <DriverPassengerInfoCard id={requestData?.mas_carpool_driver_uid || ""} requestData={requestData} />
              )} */}
            </div>
          </div>

          <div className="col-span-1 row-start-1 md:row-start-2">
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">ยานพาหนะ</div>
              </div>

              <CarDetailCard2 reqId={requestData?.trn_request_uid} vehicle={requestData?.vehicle} />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols- gap-4">
          <div className="flex flex-col gap-4">
            <div className="form-section-header ">
              <div className="form-section-header-title">ผู้ไปรับกุญแจ</div>
            </div>
            <div className="form-card ">
              <div className="form-card-body form-card-inline flex-wrap ">
                <div className="w-full flex flex-wrap gap-4">
                  <div className="form-group form-plaintext form-users">
                    <Image
                      src={requestData?.received_key_image_url ?? "/assets/img/sample-avatar.png"}
                      className="avatar avatar-md"
                      width={100}
                      height={100}
                      alt=""
                    />
                    <div className="form-plaintext-group align-self-center">
                      <div className="form-label">{requestData?.received_key_emp_name || "-"}</div>
                      <div className="supporting-text-group">
                        <div className="supporting-text">{requestData?.received_key_dept_sap || "-"}</div>
                        <div className="supporting-text">{requestData?.received_key_dept_sap_short || "-"}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-card-right align-self-center ">
                  <div className="flex flex-col flex-wrap gap-4">
                    <div className="col-span-12 ">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">smartphone</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowrap">
                            {requestData?.received_key_mobile_contact_number || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 ">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">call</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowra">
                            {requestData?.received_key_internal_contact_number || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">sms</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">หมายเหตุ</div>
                          <div className="form-text text-nowra">{requestData?.received_key_remark || "-"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="form-section-header">
              <div className="form-section-header-title">รายละเอียดการรับกุญแจ</div>
            </div>
            <div className="form-card">
              <div className="form-card-body form-card-inline flex-wrap">
                <div className="w-full flex flex-wrap gap-4">
                  <div className="form-card-right align-self-center">
                    <div className="grid grid-cols-2  flex-wrap gap-4">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">calendar_month</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">วันที่</div>
                          <div className="form-text text-nowra">
                            {requestData?.received_key_datetime
                              ? convertToBuddhistDateTime(requestData?.received_key_datetime).date
                              : "-"}
                          </div>
                        </div>
                      </div>

                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">schedule</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">เวลา</div>
                          <div className="form-text text-nowra">
                            {requestData?.received_key_datetime
                              ? convertToBuddhistDateTime(requestData?.received_key_datetime).time
                              : "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 w-full pt-3">
                  <div className="col-span-12">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">approval_delegation</i>
                      <div className="form-plaintext-group">
                        <div className="form-label">หมายเหตุ</div>
                        <div className="form-text text-nowra flex flex-col gap-2">
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">key</i>
                            <div className="form-plaintext-group">
                              <div className="form-text text-nowra">
                                {findVehicleKeyType?.ref_vehicle_key_type_name || "-"}
                              </div>
                            </div>
                          </div>
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">credit_card</i>
                            <div className="form-plaintext-group">
                              <div className="form-text text-nowra">
                                {findVehicleKeyType?.ref_vehicle_key_type_name || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {requestData?.ref_request_status_code === "50" && (
        <button className="btn btn-primary w-full mt-5" onClick={() => keyPickupDetailModalRef.current?.openModal()}>
          รับกุญแจ
        </button>
      )}
      <DriverAppointmentModal ref={driverAppointmentModalRef} id={requestData?.driver.mas_driver_uid || ""} />
      <KeyPickupDetailModal
        reqId={requestData?.trn_request_uid || ""}
        imgSrc={requestData?.received_key_image_url || "/assets/img/avatar.svg"}
        ref={keyPickupDetailModalRef}
        id={requestData?.received_key_emp_id || ""}
        name={requestData?.received_key_emp_name || "-"}
        deptSap={requestData?.received_key_dept_sap || "-"}
        deptSapShort={requestData?.received_key_dept_sap_short || "-"}
        phone={requestData?.received_key_mobile_contact_number || "-"}
        vehicle={requestData?.vehicle}
        onEdit={() => {
          keyPickUpEditModalRef.current?.openModal();
        }}
      />
      <KeyPickUpEditModal
        ref={keyPickUpEditModalRef}
        onBack={() => {
          keyPickupDetailModalRef.current?.openModal();
        }}
        onSubmit={() => {
          handleModalUpdate();
          keyPickupDetailModalRef.current?.openModal();
        }}
        requestData={requestData}
      />

      <ApproverModal ref={approverModalRef} />
    </>
  );
}
