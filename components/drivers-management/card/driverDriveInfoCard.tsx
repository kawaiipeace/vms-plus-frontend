import React from "react";
import { DriverInfoType } from "@/app/types/drivers-management-type";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const DriverDriveInfoCard = ({ driverInfo }: { driverInfo: DriverInfoType }) => {
  return (
    <>
      <div className="form-card">
        <div className="form-card-body form-card-inline">
          <div className="form-group form-plaintext form-users w-full items-center">
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 w-full">
              <div className="flex col-span-1">
                <i className="material-symbols-outlined">id_card</i>
                <div className="pl-2">
                  <h5 className="font-semibold mb-1">ประเภทใบขับขี่</h5>
                  <p>{driverInfo?.driver_license?.driver_license_type?.ref_driver_license_type_name}</p>
                </div>
              </div>
              <div className="flex col-span-1">
                <i className="material-symbols-outlined">featured_play_list</i>
                <div className="pl-2">
                  <h5 className="font-semibold mb-1">เลขที่ใบขับขี่</h5>
                  <p>{driverInfo?.driver_license?.driver_license_no}</p>
                </div>
              </div>
              <div className="flex col-span-1">
                <i className="material-symbols-outlined">calendar_month</i>
                <div className="pl-2">
                  <h5 className="font-semibold mb-1">วันที่ออกใบขับขี่</h5>
                  <p>{dayjs(driverInfo?.driver_license?.driver_license_start_date).format("DD/MM/BBBB")}</p>
                </div>
              </div>
              <div className="flex col-span-1">
                <i className="material-symbols-outlined">calendar_month</i>
                <div className="pl-2">
                  <h5 className="font-semibold mb-1">วันที่หมดอายุใบขับขี่</h5>
                  <p>{dayjs(driverInfo?.driver_license?.driver_license_end_date).format("DD/MM/BBBB")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DriverDriveInfoCard;
