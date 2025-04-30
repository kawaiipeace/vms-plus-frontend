import { RequestDetailType } from "@/app/types/request-detail-type";

interface Props {
  requestData?: RequestDetailType;
}

export default function KeyPickupDetailCard({ requestData }: Props) {
  return (
    <>
      <div className="form-card">
        <div className="form-card-body">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">calendar_month</i>
                <div className="form-plaintext-group">
                  <div className="form-label">วันที่</div>
                  <div className="form-text">02/12/2566</div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">schedule</i>
                <div className="form-plaintext-group">
                  <div className="form-label">เวลา</div>
                  <div className="form-text">fdasfd</div>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">approval_delegation</i>
                <div className="form-plaintext-group">
                  <div className="form-label">สิ่งที่ส่งมอบ</div>
                  <div className="form-text">    <i className="material-symbols-outlined">key</i> กุญแจหลัก</div>
                  <div className="form-text">    <i className="material-symbols-outlined">credit_card</i> บัตรเติมน้ำมัน</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
