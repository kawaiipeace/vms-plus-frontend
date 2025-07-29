import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import dayjs from "dayjs";
import "dayjs/locale/th";
import "dayjs/locale/en-gb";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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
                    ? dayjs
                        .utc(props.pickup_datetime)
                        .format("DD/MM/BBBB")
                        .replace(
                          "BBBB",
                          (
                            dayjs.utc(props.pickup_datetime).year() + 543
                          ).toString()
                        )
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
                    ? convertToBuddhistDateTime(props.pickup_datetime).time
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
