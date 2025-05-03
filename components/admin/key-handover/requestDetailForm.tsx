import { RequestDetailType } from "@/app/types/request-detail-type";
import {
  AppointmentDriverCard,
  CarDetailCard,
  DisburstmentCard,
  DriverPeaInfoCard,
  DriverSmallInfoCard,
  JourneyDetailCard,
  ReferenceCard,
  VehicleUserInfoCard,
} from "@/components";
import AlertCustom from "@/components/alertCustom";
import ChooseVehicleCard from "@/components/card/chooseVehicleCard";
import { fetchRequestDetail } from "@/services/keyAdmin";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useEffect, useState } from "react";

interface RequestDetailFormProps {
  requestId: string;
}

export default function RequestDetailForm({ requestId }: RequestDetailFormProps) {
  const [requestData, setRequestData] = useState<RequestDetailType>();
  const [pickupDatePassed, setPickupDatePassed] = useState(false);

  const fetchRequestDetailfunc = async () => {
    try {
      // Ensure parsedData is an object before accessing vehicleSelect
      const response = await fetchRequestDetail(requestId);
      console.log("datakey---", response.data);
      setRequestData(response.data);
      const today = new Date();
      const pickup = new Date(response?.data?.received_key_start_datetime);
      // zero out time for accurate day comparison
      today.setHours(0, 0, 0, 0);
      pickup.setHours(0, 0, 0, 0);
      setPickupDatePassed(today > pickup ? true : false);
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
      {pickupDatePassed && requestData?.ref_request_status_code === "50e" && (
        <AlertCustom
          icon="cancel"
          title="เกินวันที่นัดหมายรับกุญแจแล้ว"
          desc="กรุณาติดต่อผู้ดูแลยานพาหนะหากต้องการนัดหมายเดินทางใหม่"
        />
      )}
   {requestData?.is_return_overdue === true && (
              <AlertCustom
                icon="cancel"
                title="คืนยานพาหนะล่าช้า"
                desc=""
              />
            )}


      {requestData?.ref_request_status_name == "ถูกตีกลับ" && (
        <AlertCustom title="คำขอใช้ถูกตีกลับ" desc={`เหตุผล: ${requestData?.sended_back_request_reason}`} />
      )}
      {requestData?.ref_request_status_name == "ยกเลิกคำขอ" && (
        <AlertCustom title="คำขอใช้ถูกยกเลิกแล้ว" desc={`เหตุผล: ${requestData?.canceled_request_reason}`} />
      )}
      {requestData?.ref_request_status_code === "60e" && (
        <AlertCustom
          title="รับยานพาหนะล่าช้า"
          desc={`คุณต้องรับยานพาหนะก่อนจึงจะสามารถรับบัตรเดินทาง เพื่อนำไปแสดงกับเจ้าหน้าที่รักษาความปลอดภัยก่อนนำรถออกจาก กฟภ.`}
        />
      )}
      {requestData?.ref_request_status_name == "ยกเลิกคำขอ" && (
        <AlertCustom title="คำขอใช้ถูกยกเลิกแล้ว" desc={`เหตุผล: ${requestData?.canceled_request_reason}`} />
      )}
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ใช้ยานพาหนะ</div>
            </div>
            <VehicleUserInfoCard id={requestData?.vehicle_user_emp_id || ""} requestData={requestData} />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">รายละเอียดการเดินทาง</div>
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
              <div className="form-section-header-title">การนัดหมายพนักงานขับรถ</div>
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
            {requestData?.ref_cost_type_code && <DisburstmentCard refCostTypeCode={requestData?.ref_cost_type_code} />}
          </div>
        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">
            <div className="col-span-1 row-start-1 md:row-start-2">
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">ยานพาหนะ</div>
                </div>

                {requestData?.is_admin_choose_vehicle === "1" && (
                  <ChooseVehicleCard
                    reqId={requestData?.trn_request_uid}
                    vehicleType={requestData?.request_vehicle_type}
                    typeName={requestData?.request_vehicle_type?.ref_vehicle_type_name}
                  />
                )}

                {requestData?.vehicle &&
                  (!requestData?.is_admin_choose_vehicle || requestData?.is_admin_choose_vehicle === "0") && (
                    <CarDetailCard
                      reqId={requestData?.trn_request_uid}
                      vehicle={requestData?.vehicle}
                      seeDetail={true}
                    />
                  )}

                {requestData?.is_pea_employee_driver === "1" ? (
                  <div className="mt-5 w-full overflow-hidden">
                    <DriverPeaInfoCard
                      role="admin"
                      driver_emp_id={requestData?.driver_emp_id}
                      driver_emp_name={requestData?.driver_emp_name}
                      driver_emp_dept_sap={requestData?.driver_emp_dept_sap}
                      driver_internal_contact_number={requestData?.driver_internal_contact_number}
                      driver_mobile_contact_number={requestData?.driver_mobile_contact_number}
                      driver_image_url={requestData?.driver_image_url}
                      seeDetail={true}
                    />
                  </div>
                ) : (
                  requestData?.driver && (
                    <div className="mt-5">
                      <DriverSmallInfoCard
                        reqId={requestData?.trn_request_uid}
                        driverDetail={requestData?.driver}
                        showPhone={true}
                        seeDetail={true}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
