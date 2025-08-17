import { RequestDetailType } from "@/app/types/request-detail-type";
import AlertCustom from "@/components/alertCustom";
import DisburstmentCard from "@/components/card/disburstmentCard";
import DriverSmallInfoCard from "@/components/card/driverSmallInfoCard";
import JourneyDetailCard from "@/components/card/journeyDetailCard";
import ReferenceCard from "@/components/card/referenceCard";
import { fetchRequestKeyDetail } from "@/services/masterService";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useEffect, useState } from "react";
import DriverPeaInfoCard from "../card/driverPeaInfoCard";
import VehicleDetailCard from "../card/vehicleDetailCard";
import VehicleUserInfoCard from "../card/vehicleUserInfoCard";

interface KeyPickUpDetailFormProps {
  requestId: string;
  editable?: boolean;
}
export default function KeyPickUpDetailForm({ editable, requestId }: KeyPickUpDetailFormProps) {
  const [requestData, setRequestData] = useState<RequestDetailType>();
  const [loading, setLoading] = useState(true);

  const fetchRequestDetailfunc = async () => {
    try {
      setLoading(true);
      // Ensure parsedData is an object before accessing vehicleSelect
      const response = await fetchRequestKeyDetail(requestId);

      setRequestData(response.data);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  };

  useEffect(() => {
    fetchRequestDetailfunc();
  }, [requestId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-40vh)]">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#A80689]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );

  return (
    <>
      {requestData?.ref_request_status_name == "ถูกตีกลับ" && (
        <AlertCustom title="คำขอใช้ถูกตีกลับ" desc={`เหตุผล: ${requestData?.rejected_request_reason}`} />
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
              <div className="form-section-header-title">รายละเอียดการเดินทาง</div>
            </div>

            <JourneyDetailCard
              startDate={requestData?.start_datetime || ""}
              endDate={requestData?.end_datetime || ""}
              timeStart={convertToBuddhistDateTime(requestData?.start_datetime || "").time}
              timeEnd={convertToBuddhistDateTime(requestData?.end_datetime || "").time}
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

            <ReferenceCard refNum={requestData?.doc_no}   link={requestData?.doc_file} file={requestData?.doc_file_name} />
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
                wbsNo={requestData?.wbs_no}
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
                  driver_internal_contact_number={requestData?.driver_internal_contact_number}
                  driver_mobile_contact_number={requestData?.driver_mobile_contact_number}
                  driver_image_url={requestData?.driver_image_url}
                />
              </div>
            ) : (
              requestData?.driver && (
                <div className="mt-5">
                  <div className="form-section-header">
                    <div className="form-section-header-title">ผู้ขับขี่</div>
                  </div>

                  <DriverSmallInfoCard driverDetail={requestData?.driver} showPhone={true} />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
