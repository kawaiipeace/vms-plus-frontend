import React from "react";
import Image from "next/image";
import { DriverInfoType } from "@/app/types/drivers-management-type";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const DriverBasicInfoCard = ({ driverInfo }: { driverInfo: DriverInfoType }) => {
  return (
    <>
      <div className="form-card">
        <div className="form-card-body form-card-inline">
          <div className="form-group form-plaintext form-users w-full items-center">
            <div className="grid grid-cols-12 gap-4 w-full">
              <div className="flex items-center col-span-12 md:col-span-7">
                <Image src={driverInfo?.driver_image || "/assets/img/avatar.svg"} width={100} height={100} alt="" />
                <div className="flex flex-col justify-center pl-4">
                  <h5 className="font-semibold mb-1">
                    {driverInfo?.driver_name}({driverInfo?.driver_nickname})
                  </h5>
                  <div className="flex items-center gap-2">
                    <span>{dayjs(driverInfo?.driver_birthdate).format("D/MM/BBBB")}</span>
                    <span className="border-gray-300 border-l-[1px] block h-[16px]"></span>
                    <span>{driverInfo?.driver_identification_no}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center col-span-12 md:col-span-5">
                <div className="form-card-right align-self-center">
                  <div className="flex flex-wrap gap-4">
                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">hotel</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowrap">
                            {driverInfo?.work_type === 1 ? "ค้างคืนได้" : "ไม่ค้างคืนได้"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">smartphone</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowrap">{driverInfo?.driver_contact_number}</div>
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
    </>
  );
};

export default DriverBasicInfoCard;
