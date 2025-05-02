import { RequestDetailType } from "@/app/types/request-detail-type";
import dayjs from "dayjs";

export const ReturnCarInfoCard = ({ data }: { data?: RequestDetailType }) => {
  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-2">
          <div>
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่</div>
                <div className="form-text">
                  {data?.returned_vehicle_datetime
                    ? dayjs(data.returned_vehicle_datetime).format("DD/MM/YYYY")
                    : "-"}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">schedule</i>
              <div className="form-plaintext-group">
                <div className="form-label">เวลา</div>
                <div className="form-text">
                  {data?.accepted_vehicle_datetime
                    ? dayjs(data.accepted_vehicle_datetime).format("HH:mm")
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div>
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">local_parking</i>
              <div className="form-plaintext-group">
                <div className="form-label">สถานที่จอดรถ</div>
                <div className="form-text">{data?.parking_place || "-"}</div>
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
                <div className="form-text">{data?.mile_end || "-"}</div>
              </div>
            </div>
          </div>
          <div>
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">local_gas_station</i>
              <div className="form-plaintext-group">
                <div className="form-label">ปริมาณเชื้อเพลิง</div>
                <div className="form-text">{data?.fuel_end || "-"}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div>
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">mop</i>
              <div className="form-plaintext-group">
                <div className="form-label">ภายในห้องโดยสาร</div>
                <div className="form-text">สะอาด</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1">
          <div>
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">local_car_wash</i>
              <div className="form-plaintext-group">
                <div className="form-label">ภายนอกยานพาหนะ</div>
                <div className="form-text">สะอาด</div>
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
                <div className="form-text">{data?.remark || "-"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
