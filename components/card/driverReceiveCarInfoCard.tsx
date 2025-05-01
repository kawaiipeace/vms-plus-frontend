import { RequestDetailType } from "@/app/types/request-detail-type";

interface DriverReceiveCarInfoCardProps {
  date?: string;
  time?: string;
  mile_end?: string;
  fuel_end?: string;
  remark?: string;
}

export const DriverReceiveCarInfoCard = ({
  date,
  time,
  mile_end,
  fuel_end,
  remark,
}: DriverReceiveCarInfoCardProps) => {
  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-2">
          <div>
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่</div>
                <div className="form-text">{date}</div>
              </div>
            </div>
          </div>
          <div>
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">schedule</i>
              <div className="form-plaintext-group">
                <div className="form-label">เวลา</div>
                <div className="form-text">{time}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div>
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">search_activity</i>
              <div className="form-plaintext-group">
                <div className="form-label">เลขไมล์</div>
                <div className="form-text">{mile_end}</div>
              </div>
            </div>
          </div>
          <div>
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">local_gas_station</i>
              <div className="form-plaintext-group">
                <div className="form-label">ปริมาณเชื้อเพลิง</div>
                <div className="form-text">{fuel_end}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div>
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">news</i>
              <div className="form-plaintext-group">
                <div className="form-label">หมายเหตุ</div>
                <div className="form-text">{remark}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
