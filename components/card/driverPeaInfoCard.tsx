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

  // fallback props
  driver_emp_id?: string;
  driver_emp_name?: string;
  driver_emp_dept_sap?: string;
  driver_internal_contact_number?: string;
  driver_mobile_contact_number?: string;
  driver_image_url?: string;
}

export default function DriverPeaInfoCard({
  driverEmpID,
  userKeyPickup,
  seeDetail,
  driver_emp_id,
  driver_emp_name,
  driver_emp_dept_sap,
  driver_internal_contact_number,
  driver_mobile_contact_number,
  driver_image_url
}: DriverInfoProps) {
  const driverInfoModalRef = useRef<{ openModal: () => void; closeModal: () => void } | null>(null);
  const userKeyPickUpModalRef = useRef<{ openModal: () => void; closeModal: () => void } | null>(null);

  const [fetchedDriver, setFetchedDriver] = useState<VehicleUserType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!driverEmpID) return;
      try {
        const res = await fetchVehicleUsers(driverEmpID);
        setFetchedDriver(res.data[0]);
      } catch (error) {
        console.error("Error fetching driver data:", error);
      }
    };

    fetchData();
  }, [driverEmpID]);

  // Decide which data to use: API result or props
  const driver = fetchedDriver ?? {
    emp_id: driver_emp_id,
    full_name: driver_emp_name,
    dept_sap_short: driver_emp_dept_sap,
    tel_internal: driver_internal_contact_number,
    tel_mobile: driver_mobile_contact_number,
    image_url: driver_image_url
  };

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
                  <span className="card-item-text">{driver?.tel_internal}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {seeDetail && (
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
        )}
      </div>

      <DriverInfoModal ref={driverInfoModalRef} />
      {userKeyPickup && <UserKeyPickUpModal ref={userKeyPickUpModalRef} />}
    </div>
  );
}
