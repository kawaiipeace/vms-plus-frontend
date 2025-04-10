import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import DriverInfoModal from "@/components/modal/driverInfoModal";
import UserKeyPickUpModal from "@/components/modal/userKeyPickUpModal";
import { fetchVehicleUsers } from "@/services/masterService";
import { VehicleUserType } from "@/app/types/vehicle-user-type";

interface DriverInfoProps {
  userKeyPickup?: boolean;
  seeDetail?: boolean;
  driverEmpID?: string;
}

export default function DriverPeaInfoCard({
  driverEmpID,
  userKeyPickup,
  seeDetail
}: DriverInfoProps) {
  const driverInfoModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const userKeyPickUpModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

    const [driver, setDriver] = useState<VehicleUserType>();

   useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetchVehicleUsers(driverEmpID || "");
          setDriver(res.data[0]);
        } catch (error) {
          console.error("Error fetching driver data:", error);
        }
      };
  
      fetchData();
    }, [driverEmpID]);

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image
              src={driver?.image_url || "/assets/img/avatar.svg"}
              className="rounded-md"
              width={100}
              height={100}
              alt="Driver Avatar"
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">{driver?.full_name}</div>
              <div className="supporting-text-group">
                <div className="supporting-text">{driver?.emp_id || "-"}</div>
                <div className="supporting-text">{driver?.dept_sap_short || "-"}</div>
              </div>
            </div>

            <div className="card-item-group">
              {driver?.tel_mobile && (
                <div className="card-item">
                  <i className="material-symbols-outlined">smartphone</i>
                  <span className="card-item-text">
                    <span className="supporting-text">{driver?.tel_mobile}</span>
                  </span>
                </div>
              )}
              {driver?.tel_internal && (
                <div className="card-item">
                  <i className="material-symbols-outlined">call</i>
                  <span className="card-item-text">{driver?.tel_internal }</span>
                </div>
              )}
            </div>
          </div>
        </div>
          { seeDetail && 
        <div className="card-actions w-full">
          <button
            className="btn btn-default w-full"
            onClick={
              userKeyPickup
                ? () => userKeyPickUpModalRef.current?.openModal()
                : () => driverInfoModalRef.current?.openModal()
            }
          >
            ดูรายละเอียด
          </button>
        </div>
        }
      </div>

      <DriverInfoModal ref={driverInfoModalRef} />
      {userKeyPickup && <UserKeyPickUpModal ref={userKeyPickUpModalRef} />}
    </div>
  );
}
