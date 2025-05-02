import dayjs from "dayjs";

interface DriverPickUpPassengerCardProps {
  pickup_place: string;
  pickup_datetime: string;
  number_of_passengers: number;
}

export default function DriverPickUpPassengerCard(
  props: DriverPickUpPassengerCardProps
) {
  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">pin_drop</i>
              <div className="form-plaintext-group">
                <div className="form-label">สถานที่นัดหมาย</div>
                <div className="form-text">{props.pickup_place}</div>
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่</div>
                <div className="form-text">
                  {props.pickup_datetime
                    ? dayjs(props.pickup_datetime).format("DD/MM/BBBB")
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">schedule</i>
              <div className="form-plaintext-group">
                <div className="form-label">เวลา</div>
                <div className="form-text">
                  {props.pickup_datetime
                    ? dayjs(props.pickup_datetime).format("HH:mm")
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">groups</i>
              <div className="form-plaintext-group">
                <div className="form-label">จำนวนผู้โดยสาร</div>
                <div className="form-text">
                  {props.number_of_passengers || "-"} (รวมผู้ขับขี่)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
