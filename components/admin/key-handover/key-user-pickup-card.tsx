import { RequestDetailType } from "@/app/types/request-detail-type";

interface Props {
  requestData?: RequestDetailType;
}

export default function KeyUserPickupCard({ requestData }: Props) {
  return (
    <>
      <div className="form-card">
        <div className="form-card-body form-card-inline flex-wrap">
          <div className="w-full flex flex-wrap gap-4">
            <div className="form-group form-plaintext form-users">
              <div className="form-plaintext-group align-self-center">
                <div className="form-label">
                  {requestData?.received_key_emp_name || "-"}
                </div>
                <div className="supporting-text-group">
                  <div className="supporting-text">
                    {requestData?.received_key_emp_id || "-"}
                  </div>
                  <div className="supporting-text">
                    {requestData?.received_key_position + " " + requestData?.received_key_dept_sap_short}
                  </div>
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
                        {requestData?.received_key_mobile_contact_number || "-"}
                      </div>
                    </div>
                  </div>
                </div>
                { requestData?.received_key_internal_contact_number && 
                <div className="col-span-12 md:col-span-6">
                  <div className="form-group form-plaintext">
                    <i className="material-symbols-outlined">call</i>
                    <div className="form-plaintext-group">
                      <div className="form-text text-nowrap">
                        {requestData?.received_key_internal_contact_number || "-"}
                      </div>
                    </div>
                  </div>
                </div>
                }
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 w-full pt-3">
            <div className="col-span-12">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">sms</i>
                <div className="form-plaintext-group">
                  <div className="form-label">หมายเหตุ</div>
                  <div className="form-text text-nowrap">
                    {requestData?.received_key_remark || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
