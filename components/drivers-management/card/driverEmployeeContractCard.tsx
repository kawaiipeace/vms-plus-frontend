import { DriverInfoType } from "@/app/types/drivers-management-type";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const DriverEmployeeContractCard = ({
  driverInfo,
  driverVendorsList,
}: {
  driverInfo: DriverInfoType;
  driverVendorsList?: any[];
}) => {
  const vendor = driverVendorsList?.find((vendor) => vendor.mas_vendor_code === driverInfo?.mas_vendor_code);

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
                  <p>{vendor?.mas_vendor_name}</p>
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
