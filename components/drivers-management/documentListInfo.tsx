import React from "react";
import DocItem from "@/components/drivers-management/docItem";
import { DriverInfoType } from "@/app/types/drivers-management-type";

interface DocumentListInfoProps {
  driverInfo?: DriverInfoType | null;
}

const DocumentListInfo = ({ driverInfo }: DocumentListInfoProps) => {
  return (
    <div className="flex flex-col">
      <div>
        <h5 className="text-[#475467] font-semibold mb-3">รูปใบขับขี่, บัตรประชาชน, ทะเบียนบ้าน ฯลฯ</h5>
        <div className="flex flex-col gap-y-3">
          {/* { driverInfo} */}
          <DocItem />
          <DocItem />
        </div>
      </div>
      <div className="mt-5">
        <h5 className="text-[#475467] font-semibold mb-3">รูปใบรับรองการอบรม</h5>
        <div className="flex flex-col gap-y-3">
          <DocItem />
        </div>
      </div>
    </div>
  );
};

export default DocumentListInfo;
