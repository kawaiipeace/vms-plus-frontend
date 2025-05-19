import { VehicleUserType } from "@/app/types/vehicle-user-type";
import UserKeyPickUpModal from "@/components/modal/userKeyPickUpModal";
import { fetchVehicleUsers } from "@/services/masterService";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PeaDriverInfoModal from "../modal/peaDriverInfoModal";

interface DriverInfoProps {
  userKeyPickup?: boolean;
  seeDetail?: boolean;
  driverEmpID?: string;
  role?: string;
  // fallback props
  driver_emp_id?: string;
  driver_emp_name?: string;
  driver_emp_dept_sap?: string;
  driver_internal_contact_number?: string;
  driver_mobile_contact_number?: string;
  driver_image_url?: string;
}

export default function DriverPeaInfoCard({
  role,
  driverEmpID,
  userKeyPickup,
  seeDetail,
  driver_emp_id,
  driver_emp_name,
  driver_emp_dept_sap,
  driver_internal_contact_number,
  driver_mobile_contact_number,
  driver_image_url,
}: DriverInfoProps) {
  const driverInfoModalRef = useRef<{ openModal: () => void; closeModal: () => void } | null>(null);
  const userKeyPickUpModalRef = useRef<{ openModal: () => void; closeModal: () => void } | null>(null);

  const [fetchedDriver, setFetchedDriver] = useState<VehicleUserType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!driverEmpID) return;
      try {
        const res = await fetchVehicleUsers(driverEmpID);
        console.log("driver---", res.data);
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
    image_url: driver_image_url,
  };

  return (
    <div className="card overflow-hidden">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square !w-[30%] max-h-[108px] md:aspect-auto !aspect-square rounded-md overflow-hidden self-start">
            <Image
              src={driver?.image_url || "/assets/img/avatar.svg"}
              className="object-cover w-full h-full"
              width={100}
              height={100}
              alt="Driver Avatar"
            />
          </div>
          <div className="card-content w-[70%]">
            <div className="card-content-top">
              <div className="card-title">{driver?.full_name}</div>
              <div className="supporting-text-group">
                <div className="supporting-text">{driver?.emp_id || "-"}</div>
                <div className="supporting-text">{driver?.dept_sap_short || "-"}</div>
              </div>
            </div>

            <div className="card-item-group w-full !grid-cols-1 md:!grid-cols-2">
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
              className="btn btn-secondary w-full"
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

      <PeaDriverInfoModal ref={driverInfoModalRef} role={role} id={driver_emp_id} />
      {userKeyPickup && <UserKeyPickUpModal ref={userKeyPickUpModalRef} />}
    </div>
  );
}
