import { RequestDetailType } from "@/app/types/request-detail-type";
import Image from "next/image";

interface Props {
  id: string;
  requestData?: RequestDetailType;
  displayPhone?: boolean;
}

export default function VehicleUserInfoCard({ id, requestData, displayPhone }: Props) {

  return (
    <div className="form-card">
      <div className="form-card-body form-card-inline">
        <div className="form-group form-plaintext form-users">
          <Image
            src={requestData?.vehicle_user_image_url || "/assets/img/avatar.svg"}
            className="avatar avatar-md"
            width={100}
            height={100}
            alt=""
          />
          <div className="form-plaintext-group align-self-center">
            <div className="form-label">{requestData?.vehicle_user_emp_name || "-"}</div>
            <div className="supporting-text-group">
              <div className="supporting-text">{requestData?.vehicle_user_emp_id || "-"}</div>
              <div className="supporting-text">{requestData?.vehicle_user_position + " " +requestData?.vehicle_user_dept_name_short || "-"}</div>
            </div>
          </div>
        </div>
        {displayPhone && (
          <div className="form-card-right align-self-center">
            <div className="flex flex-wrap gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="form-group form-plaintext">
                  <i className="material-symbols-outlined">smartphone</i>
                  <div className="form-plaintext-group">
                    <div className="form-text text-nowrap">{requestData?.car_user_mobile_contact_number || "-"}</div>
                  </div>
                </div>
              </div>

             
                <div className="col-span-12 md:col-span-6">
                  <div className="form-group form-plaintext">
                    <i className="material-symbols-outlined">call</i>
                    <div className="form-plaintext-group">
                      <div className="form-text text-nowrap">{requestData?.car_user_internal_contact_number || "-"}</div>
                    </div>
                  </div>
                </div>
  
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
