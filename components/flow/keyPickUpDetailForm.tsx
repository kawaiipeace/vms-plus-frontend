import React, { useEffect, useState } from "react";
import AlertCustom from "@/components/alertCustom";
import DriverSmallInfoCard from "@/components/card/driverSmallInfoCard";
import JourneyDetailCard from "@/components/card/journeyDetailCard";
import ReferenceCard from "@/components/card/referenceCard";
import DisburstmentCard from "@/components/card/disburstmentCard";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { fetchRequestKeyDetail } from "@/services/masterService";
import DriverPeaInfoCard from "../card/driverPeaInfoCard";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import VehicleUserInfoCard from "../card/vehicleUserInfoCard";
import VehicleDetailCard from "../card/vehicleDetailCard";

interface KeyPickUpDetailFormProps {
  requestId: string;
  editable?: boolean;
}
export default function KeyPickUpDetailForm({
  editable,
  requestId,
}: KeyPickUpDetailFormProps) {
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

  return (
    <>
      {requestData?.ref_request_status_name == "ถูกตีกลับ" && (
        <AlertCustom
          title="คำขอใช้ถูกตีกลับ"
          desc={`เหตุผล: ${requestData?.rejected_request_reason}`}
        />
      )}

      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 col-span-1 md:col-start-1">
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
                requestData?.start_datetime || ""
              }
              endDate={
                requestData?.end_datetime || ""
              }
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
            <div className="form-section-header">
              <div className="form-section-header-title">ยานพาหนะ</div>
            </div>

            <VehicleDetailCard requestData={requestData} />

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
    </>
  );
}
