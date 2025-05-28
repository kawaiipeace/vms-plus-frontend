import { DriverInfoType } from "@/app/types/drivers-management-type";
import DocItem from "@/components/drivers-management/docItem";

interface DocumentListInfoProps {
  driverInfo?: DriverInfoType | null;
}

const DocumentListInfo = ({ driverInfo }: DocumentListInfoProps) => {
  return (
    <div className="flex flex-col">
      {(driverInfo?.driver_documents?.length || 0) > 0 && (
        <div>
          <h5 className="text-[#475467] font-semibold mb-3">รูปใบรับรอง, บัตรประชาชน, ทะเบียนบ้าน ฯลฯ</h5>
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
      )}
      {driverInfo?.driver_license?.mas_driver_license_uid && driverInfo?.driver_license?.driver_license_image && (
        <div className="mt-5">
          <h5 className="text-[#475467] font-semibold mb-3">รูปใบขับขี่</h5>
          <div className="flex flex-col gap-y-3">
            <DocItem documentName="ใบขับขี่" documentUrl={driverInfo?.driver_license?.driver_license_image} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListInfo;
