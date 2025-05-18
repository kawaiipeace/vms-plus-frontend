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
        <h5 className="text-[#475467] font-semibold mb-3">รูปใบรับรองการอบรม, บัตรประชาชน, ทะเบียนบ้าน ฯลฯ</h5>
        <div className="flex flex-col gap-y-3">
          {driverInfo?.driver_documents?.map((item) => (
            <DocItem
              key={item.driver_document_no}
              documentName={item.driver_document_name}
              documentUrl={item.driver_document_file}
            /> // Assuming DocItem takes an id prop
          ))}
        </div>
      </div>
      <div className="mt-5">
        <h5 className="text-[#475467] font-semibold mb-3">รูปใบขับขี่</h5>
        <div className="flex flex-col gap-y-3">
          {driverInfo?.driver_license?.mas_driver_license_uid && (
            <DocItem documentName="ใบขับขี่" documentUrl={driverInfo?.driver_license?.driver_license_image} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentListInfo;
