import { RequestDetailType } from "@/app/types/request-detail-type";
import Image from "next/image";
import { useRef } from "react";
import CallToDriverModal from "../modal/callToDriverModal";

interface Props {
  id: string;
  requestData?: RequestDetailType;
  isDriver?: boolean;
}

export default function DriverUserAppointmentCard({ requestData, isDriver = true }: Props) {
  const {
    driver,
    driver_emp_dept_sap,
    driver_emp_id,
    driver_emp_name,
    driver_image_url,
    driver_internal_contact_number,
    driver_mobile_contact_number,
  } = requestData || {};

  const callToDriverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const name = isDriver ? driver?.driver_name : driver_emp_name;
  const contactNumber = isDriver ? driver?.driver_contact_number : driver_mobile_contact_number;
  const id = isDriver ? driver?.driver_id : driver_emp_id;
  const deptSap = isDriver ? driver?.driver_dept_sap : driver_emp_dept_sap;
  const imageSrc = isDriver ? driver?.driver_image : driver_image_url;

  return (
    <div className="form-card">
      <div className="form-card-body form-card-inline">
        <div className="form-group form-plaintext form-users">
          <Image
            src={imageSrc || "/assets/img/avatar.svg"}
            className="avatar avatar-md"
            width={100}
            height={100}
            alt=""
          />
          <div className="form-plaintext-group align-self-center">
            <div className="form-label">{name} ({requestData?.driver?.driver_nickname})</div>
            <div className="supporting-text-group">
              {/* <div className="supporting-text">{id}</div> */}
              <div className="supporting-text">{requestData?.driver?.vendor_name}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-4">
          {!isDriver && (
            <div className="form-group form-plaintext flex items-center col-span-4">
              <i className="material-symbols-outlined">deskphone</i>
              <div className="form-plaintext-group">
                <div className="form-text text-nowrap">{driver_internal_contact_number}</div>
              </div>
            </div>
          )}
          <div className="form-group form-plaintext flex items-center col-span-3">
            <i className="material-symbols-outlined">smartphone</i>
            <div className="form-plaintext-group">
              <div className="form-text text-nowrap">{contactNumber}</div>
            </div>
          </div>
          <div className="col-span-1">
            <button className="btn btn-primary" onClick={() => callToDriverModalRef.current?.openModal()}>
              <i className="material-symbols-outlined">call</i>
            </button>
          </div>
        </div>
      </div>
      <CallToDriverModal
        imgSrc={imageSrc || "/assets/img/avatar.svg"}
        name={name || ""}
        phone={contactNumber || ""}
        title={isDriver ? "ติดต่อพนักงานขับรถ" : undefined}
        subTitle={isDriver ? "คุณต้องการโทรหาพนักงานขับรถหรือไม่ ?" : undefined}
        ref={callToDriverModalRef}
      />
    </div>
  );
}
