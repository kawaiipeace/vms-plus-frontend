"use client";

import { DriverInfoType } from "@/app/types/drivers-management-type";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { useEffect, useState } from "react";
import { DriverInfo, driversMamagement } from "@/services/driversManagement";
import { se } from "date-fns/locale";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const DriverEmployeeContractCard = ({ driverInfo }: { driverInfo: DriverInfoType }) => {
  const [replacementDriverName, setReplacementDriverName] = useState<string>("");
  const [params, setParams] = useState({
    search: "",
    driver_dept_sap_work: "",
    work_type: "",
    ref_driver_status_code: "",
    is_active: "",
    driver_license_end_date: "",
    approved_job_driver_end_date: "",
    order_by: "",
    order_dir: "",
    page: 1,
    limit: 10,
  });
  const [replacementDriverActive, setReplacementDriverActive] = useState<number>(0);
  useEffect(() => {
    const fetchDriverInfo = async () => {
      try {
        const driverUid = driverInfo?.replacement_driver_uid; // Replace with actual driver UID

        if (driverUid) {
          const response = await DriverInfo(driverUid);
          // console.log("Driver Info Response:", response);
          if (response.status === 200) {
            setReplacementDriverName(response.data.driver.driver_name);
            setParams((pre) => ({
              ...pre,
              search: response.data.driver.driver_name,
              page: 1,
              limit: 10,
            }));
            // setReplacementDriverActive(response.data.driver.is_active);
          } else {
            console.error("Failed to fetch driver info");
          }
        }
      } catch (error) {
        console.error("Error fetching driver info:", error);
      }
    };

    if (driverInfo?.replacement_driver_uid) {
      fetchDriverInfo();
    }
  }, [driverInfo]);

  useEffect(() => {
    const driverSearch = async () => {
      try {
        const response = await driversMamagement(params);
        console.log("Driver Search Response2:", response?.data?.drivers[0]?.is_active);
        if (response.status === 200) {
          if (response?.data?.drivers[0]?.is_active) {
            setReplacementDriverActive(response?.data?.drivers[0]?.is_active);
          }
        } else {
          console.error("Failed to fetch driver info");
        }
      } catch (error) {
        console.error("Error fetching driver info:", error);
      }
    };

    driverSearch();
  }, [params, replacementDriverName]);

  return (
    <>
      <div className="form-card">
        <div className="form-card-body form-card-inline">
          <div className="form-group form-plaintext form-users w-full items-center">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 w-full">
              <div className="flex col-span-1">
                <i className="material-symbols-outlined">receipt_long</i>
                <div className="pl-2">
                  <h5 className="font-semibold mb-1">เลขที่สัญญาจ้าง</h5>
                  <p>{driverInfo?.contract_no}</p>
                </div>
              </div>
              <div className="flex col-span-1">
                <i className="material-symbols-outlined">partner_exchange</i>
                <div className="pl-2">
                  <h5 className="font-semibold mb-1">หน่วยงานผู้ว่าจ้าง</h5>
                  <p>{driverInfo?.driver_dept_sap_short_name_hire}</p>
                </div>
              </div>
              <div className="flex col-span-1">
                <i className="material-symbols-outlined">apartment</i>
                <div className="pl-2">
                  <h5 className="font-semibold mb-1">บริษัทผู้รับจ้าง</h5>
                  <p>{driverInfo?.vendor_name}</p>
                </div>
              </div>
              <div className="flex col-span-1">
                <i className="material-symbols-outlined">groups</i>
                <div className="pl-2">
                  <h5 className="font-semibold mb-1">หน่วยงานที่สังกัด</h5>
                  <p>{driverInfo?.driver_dept_sap_short_name_work}</p>
                </div>
              </div>
              <div className="flex col-span-1">
                <i className="material-symbols-outlined">calendar_month</i>
                <div className="pl-2">
                  <h5 className="font-semibold mb-1">วันที่เริ่มต้นสัญญาจ้าง</h5>
                  <p>{dayjs(driverInfo?.approved_job_driver_start_date).format("D/MM/BBBB")}</p>
                </div>
              </div>
              <div className="flex col-span-1">
                <i className="material-symbols-outlined">calendar_month</i>
                <div className="pl-2">
                  <h5 className="font-semibold mb-1">วันที่สิ้นสุดสัญญาจ้าง</h5>
                  <p>{dayjs(driverInfo?.approved_job_driver_end_date).format("D/MM/BBBB")}</p>
                </div>
              </div>
              <div className="flex col-span-1">
                <i className="material-symbols-outlined">business_center</i>
                <div className="pl-2">
                  <h5 className="font-semibold mb-1">ประเภทการปฏิบัติงาน</h5>
                  <p>{driverInfo?.is_replacement === "0" ? "ปฏิบัติงานปกติ" : "สำรอง"}</p>
                </div>
              </div>
              {driverInfo?.replacement_driver_uid !== "" && (
                <>
                  <div className="flex col-span-1">
                    <i className="material-symbols-outlined">person</i>
                    <div className="pl-2">
                      <h5 className="font-semibold mb-1">พนักงานที่ปฏิบัติงานแทน</h5>
                      <p className="text-blue-700 underline">
                        <a
                          href={`/drivers-management/view/${driverInfo?.replacement_driver_uid}?active=${replacementDriverActive}`}
                        >
                          {replacementDriverName}
                        </a>
                      </p>
                    </div>
                  </div>
                </>
              )}
              <div className="flex col-span-1">
                <i className="material-symbols-outlined">group_search</i>
                <div className="pl-2">
                  <h5 className="font-semibold mb-1">หน่วยงานอื่นสามารถขอใช้งานได้</h5>
                  <p>
                    {driverInfo?.ref_other_use_code === "0"
                      ? "ไม่ให้หน่วยงานอื่นใช้"
                      : driverInfo?.ref_other_use_code === "1"
                      ? "ให้หน่วยงานอื่นใช้เฉพาะ One Day Trip"
                      : "ให้หน่วยงานอื่นใช้ได้"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverEmployeeContractCard;
