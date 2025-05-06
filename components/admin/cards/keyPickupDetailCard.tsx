import { RequestDetailType } from "@/app/types/request-detail-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";

interface Props {
  requestData?: RequestDetailType;
}

export default function KeyPickupDetailCard({ requestData }: Props) {
  // Get formatted date and time using your utility function
  const pickupDateTime = requestData?.received_key_datetime 
    ? convertToBuddhistDateTime(requestData.received_key_datetime)
    : { date: "-", time: "-" };

  // Determine which key types are included
  const hasMainKey = requestData?.receiver_key_type_detail?.ref_vehicle_key_type_name;
  const hasFuelCard = requestData?.fleet_card_no;

  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12 gap-4">
          {/* Date */}
          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่</div>
                <div className="form-text">{pickupDateTime.date}</div>
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">schedule</i>
              <div className="form-plaintext-group">
                <div className="form-label">เวลา</div>
                <div className="form-text">{pickupDateTime.time}</div>
              </div>
            </div>
          </div>

          {/* Items delivered */}
          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">approval_delegation</i>
              <div className="form-plaintext-group">
                <div className="form-label">สิ่งที่ส่งมอบ</div>
                {hasMainKey && (
                  <div className="form-text">
                    <i className="material-symbols-outlined">key</i> กุญแจหลัก
                  </div>
                )}
                {hasFuelCard && (
                  <div className="form-text">
                    <i className="material-symbols-outlined">credit_card</i> บัตรเติมน้ำมัน <span>{requestData?.fleet_card_no}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Receiver */}
          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">person</i>
              <div className="form-plaintext-group">
                <div className="form-label">ผู้รับมอบ</div>
                <div className="form-text">
                  {requestData?.received_key_emp_name || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Pickup location */}
          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">location_on</i>
              <div className="form-plaintext-group">
                <div className="form-label">สถานที่รับมอบ</div>
                <div className="form-text">
                  {requestData?.received_key_place || "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}