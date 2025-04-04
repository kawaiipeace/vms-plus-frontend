import { VehicleUserType } from "@/app/types/vehicle-user-type";
import { fetchVehicleUsers } from "@/services/masterService";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Props {
  id: string;
}

export default function VehicleUserInfoCard({ id }: Props) {
  const [vehicleUser, setVehicleUser] = useState<VehicleUserType>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchVehicleUsers(id);
        setVehicleUser(res.data[0]);
      } catch (error) {
        console.error("Error fetching driver data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="form-card">
      <div className="form-card-body form-card-inline">
        <div className="form-group form-plaintext form-users">
          <Image
            src={vehicleUser?.image_url || "/assets/img/avatar.svg"}
            className="avatar avatar-md"
            width={100}
            height={100}
            alt=""
          />
          <div className="form-plaintext-group align-self-center">
            <div className="form-label">{vehicleUser?.full_name}</div>
            <div className="supporting-text-group">
              <div className="supporting-text">
                {vehicleUser?.emp_id}
              </div>
              <div className="supporting-text">{vehicleUser?.dept_sap_short}</div>
            </div>
          </div>
        </div>
        <div className="form-card-right align-self-center">
          <div className="flex flex-wrap gap-4">
            <div className="col-span-12 md:col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">smartphone</i>
                <div className="form-plaintext-group">
                  <div className="form-text text-nowrap">
                    {vehicleUser?.tel_mobile}
                  </div>
                </div>
              </div>
            </div>

            {vehicleUser?.tel_internal && (
              <div className="col-span-12 md:col-span-6">
                <div className="form-group form-plaintext">
                  <i className="material-symbols-outlined">call</i>
                  <div className="form-plaintext-group">
                    <div className="form-text text-nowra">
                      {vehicleUser?.tel_internal}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
