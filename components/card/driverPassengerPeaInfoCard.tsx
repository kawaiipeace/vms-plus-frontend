import { RequestDetailType } from "@/app/types/request-detail-type";
import CallToDriverModal from "@/components/modal/callToDriverModal";
import Image from "next/image";
import { useRef } from "react";

interface DriverPassengerInfoCardProps {
  id?: string;
  requestData?: RequestDetailType;
  displayLocation?: boolean;
}

export default function DriverPassengerPeaInfoCard({ id, requestData, displayLocation }: DriverPassengerInfoCardProps) {
  const callToDriverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const { vehicle_user } = requestData?.vehicle?.vehicle_department || {};

  const name = vehicle_user?.full_name;
  const contactNumber = vehicle_user?.tel_mobile;
  const internal = vehicle_user?.tel_internal;
  const idDriver = vehicle_user?.emp_id;
  const deptSap = vehicle_user?.dept_sap;
  const imageSrc = vehicle_user?.image_url;

  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="flex items-center gap-3">
          <div className="w-[80px] aspect-square overflow-hidden rounded-full">
            <Image
              className="object-cover object-center"
              src={imageSrc || "/assets/img/avatar.svg"}
              alt="driver-passenger-info"
              width={200}
              height={200}
            />
          </div>
          <div>
            <p className="font-bold">{name}</p>
            <p className="font-light">{idDriver + "|" + deptSap}</p>
          </div>
        </div>
        <div className="mt-3">
          {internal && (
            <div className="flex">
              <i className="material-symbols-outlined mr-2 text-[#A80689]">deskphone</i>
              <p> {internal}</p>
            </div>
          )}
          <div className="grid grid-cols-4 gap-3">
            <div className="flex items-center col-span-3">
              <i className="material-symbols-outlined mr-2 text-[#A80689]">smartphone</i>
              <p> {contactNumber}</p>
            </div>
            <div className="col-span-1">
              <button className="btn btn-primary" onClick={() => callToDriverModalRef.current?.openModal()}>
                <i className="material-symbols-outlined">call</i>
              </button>
            </div>
          </div>
        </div>
        {displayLocation && (
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">pin_drop</i>
                <div className="form-plaintext-group">
                  <div className="form-label">สถานที่นัดหมาย</div>
                  <div className="form-text">Lobby อาคาร LED</div>
                </div>
              </div>
            </div>

            <div className="col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">calendar_month</i>
                <div className="form-plaintext-group">
                  <div className="form-label">วันที่</div>
                  <div className="form-text">28/12/2566</div>
                </div>
              </div>
            </div>

            <div className="col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">schedule</i>
                <div className="form-plaintext-group">
                  <div className="form-label">เวลา</div>
                  <div className="form-text">08:30</div>
                </div>
              </div>
            </div>

            <div className="col-span-12">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">groups</i>
                <div className="form-plaintext-group">
                  <div className="form-label">จำนวนผู้โดยสาร</div>
                  <div className="form-text">4 (รวมผู้ขับขี่)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <CallToDriverModal
        imgSrc={imageSrc || "/assets/img/avatar.svg"}
        name={name || ""}
        phone={contactNumber || ""}
        ref={callToDriverModalRef}
      />
    </div>
  );
}
