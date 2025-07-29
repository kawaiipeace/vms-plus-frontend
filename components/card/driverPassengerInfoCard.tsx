import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { fetchDrivers } from "@/services/masterService";
import { DriverType } from "@/app/types/driver-user-type";
import CallToDriverModal from "@/components/modal/callToDriverModal";
import dayjs from "dayjs";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";

interface DriverPassengerInfoCardProps {
  id?: string;
  requestData?: RequestDetailType;
  displayLocation?: boolean;
}

export default function DriverPassengerInfoCard({
  id,
  requestData,
  displayLocation,
}: DriverPassengerInfoCardProps) {
  const callToDriverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const [params, setParams] = useState({
    name: "",
    page: 1,
    limit: 10,
  });
  const [driver, setDriver] = useState<DriverType>();
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await fetchDrivers(params);
        if (response.status === 200) {
          setDriver(response.data.drivers[0]);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    if (id) {
      fetchDriverData();
    }
  }, [id, requestData]);

  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="flex items-center gap-3">
          <div className="w-[80px] aspect-square overflow-hidden rounded-full">
            <Image
              className="object-cover object-center"
              src={driver?.driver_image || "/assets/img/avatar.svg"}
              alt="driver-passenger-info"
              width={200}
              height={200}
            />
          </div>
          <div>
            <p className="font-bold">{driver?.driver_name || "-"}</p>
            <p className="font-light">{driver?.driver_dept_sap || "-"}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="grid grid-cols-4 gap-3">
            <div className="flex items-center col-span-3">
              <i className="material-symbols-outlined mr-2 text-[#A80689]">
                smartphone
              </i>
              <p> {driver?.driver_contact_number || "-"}</p>
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
                  <div className="form-text">
                    {requestData?.pickup_place || "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">calendar_month</i>
                <div className="form-plaintext-group">
                  <div className="form-label">วันที่</div>
                  <div className="form-text">
                    {requestData?.pickup_datetime
                      ? dayjs(requestData.pickup_datetime).format("DD/MM/YYYY")
                      : "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">schedule</i>
                <div className="form-plaintext-group">
                  <div className="form-label">เวลา</div>
                  <div className="form-text">
                    {requestData?.pickup_datetime
                      ? convertToBuddhistDateTime(requestData.pickup_datetime).time
                      : "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">groups</i>
                <div className="form-plaintext-group">
                  <div className="form-label">จำนวนผู้โดยสาร</div>
                  <div className="form-text">
                    {requestData?.number_of_passengers || 0} (รวมผู้ขับขี่)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <CallToDriverModal
        imgSrc={driver?.driver_image || "/assets/img/avatar.svg"}
        name={driver?.driver_name || "-"}
        phone={driver?.driver_contact_number || "-"}
        ref={callToDriverModalRef}
      />
    </div>
  );
}
