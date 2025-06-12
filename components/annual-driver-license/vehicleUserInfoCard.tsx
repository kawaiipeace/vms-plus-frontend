import Image from "next/image";

interface Props {
  created_request_datetime: string; // ISO format
  created_request_emp_id: string;
  created_request_emp_name: string;
  created_request_emp_position: string;
  created_request_dept_sap: string;
  created_request_dept_sap_name_short: string;
  created_request_dept_sap_name_full: string;
  created_request_phone_number: string;
  created_request_mobile_number: string;
  created_request_image_url: string;
}

export default function VehicleUserInfoCard({
  created_request_emp_id,
  created_request_emp_name,
  created_request_dept_sap_name_short,
  created_request_phone_number,
  created_request_mobile_number,
  created_request_image_url,
  created_request_emp_position
}: Props) {
  return (
    <div className="form-card">
      <div className="form-card-body form-card-inline">
        <div className="form-group form-plaintext form-users">
          <Image
            src={created_request_image_url || "/assets/img/avatar.svg"}
            className="avatar avatar-md"
            width={100}
            height={100}
            alt=""
          />
          <div className="form-plaintext-group align-self-center">
            <div className="form-label">{created_request_emp_name}</div>
            <div className="supporting-text-group">
              <div className="supporting-text">{created_request_emp_id}</div>
              <div className="supporting-text">
                {created_request_emp_position + " " +created_request_dept_sap_name_short}
              </div>
            </div>
          </div>
        </div>
    
        <div className="form-card-right align-self-center !w-[30%]">
          <div className="flex flex-wrap gap-4">
            <div className="col-span-12 md:col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">smartphone</i>
                <div className="form-plaintext-group">
                  <div className="form-text text-nowrap">
                    {created_request_mobile_number}
                  </div>
                </div>
              </div>
            </div>

        
              <div className="col-span-12 md:col-span-6">
                <div className="form-group form-plaintext">
                  <i className="material-symbols-outlined">call</i>
                  <div className="form-plaintext-group">
                    <div className="form-text text-nowrap">
                      {created_request_phone_number}
                    </div>
                  </div>
                </div>
              </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}