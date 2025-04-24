import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { fetchVehicleUsers } from "@/services/masterService";
import { VehicleUserType } from "@/app/types/vehicle-user-type";
import CallToDriverModal from "@/components/modal/callToDriverModal";

interface DriverPassengerInfoCardProps {
  id?: string;
  requestData?: RequestDetailType;
  displayLocation?: boolean;
}

export default function DriverPassengerPeaInfoCard({
  id,
  requestData,
  displayLocation,
}: DriverPassengerInfoCardProps) {
  const callToDriverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const [vehicleUser, setVehicleUser] = useState<VehicleUserType>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchVehicleUsers(id);
        console.log("vehicledata", res);
        let user = res.data[0];

        // Override only contact numbers from requestData if available
        if (requestData) {
          user = {
            ...user,
            tel_mobile: requestData.car_user_mobile_contact_number,
            tel_internal: requestData.car_user_internal_contact_number,
          };
        }

        setVehicleUser(user);
      } catch (error) {
        console.error("Error fetching driver data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, requestData]);

  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="flex items-center gap-3">
          <div className="w-[80px] aspect-square overflow-hidden rounded-full">
            <Image
              className="object-cover object-center"
              src={vehicleUser?.image_url || "/assets/img/avatar.svg"}
              alt="driver-passenger-info"
              width={200}
              height={200}
            />
          </div>
          <div>
            <p className="font-bold">{vehicleUser?.full_name}</p>
            <p className="font-light">
              {vehicleUser?.emp_id} | {vehicleUser?.dept_sap_short}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex">
            <i className="material-symbols-outlined mr-2 text-[#A80689]">
              deskphone
            </i>
            <p> {vehicleUser?.tel_internal}</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="flex items-center col-span-3">
              <i className="material-symbols-outlined mr-2 text-[#A80689]">
                smartphone
              </i>
              <p> {vehicleUser?.tel_mobile}</p>
            </div>
            <div className="col-span-1">
              <button
                className="btn btn-primary"
                onClick={() => callToDriverModalRef.current?.openModal()}
              >
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
        imgSrc={vehicleUser?.image_url || "/assets/img/avatar.svg"}
        name={vehicleUser?.full_name || ""}
        phone={vehicleUser?.tel_mobile || ""}
        ref={callToDriverModalRef}
      />
    </div>
  );
}
