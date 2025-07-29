import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import dayjs from "dayjs";

interface DriverWaitKeyCardProps {
  received_key_place: string;
  received_key_datetime: string;
  received_key_start_datetime: string;
  received_key_end_datetime: string;
}

export default function DriverWaitKeyCard(props: DriverWaitKeyCardProps) {
  const getTimeRange = () => {
    if (
      !props.received_key_start_datetime ||
      !props.received_key_end_datetime
    ) {
      return "-";
    }

    const startTime = convertToBuddhistDateTime(props.received_key_start_datetime).time;
    const endTime = convertToBuddhistDateTime(props.received_key_end_datetime).time;

    return `${startTime} - ${endTime}`;
  };

  const timeRange = getTimeRange();

  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">pin_drop</i>
              <div className="form-plaintext-group">
                <div className="form-label">สถานที่รับกุญแจ</div>
                <div className="form-text">{props.received_key_place}</div>
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่</div>
                <div className="form-text">
                  {props.received_key_start_datetime
                    ? convertToBuddhistDateTime(props.received_key_start_datetime).date
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">ช่วงเวลา</div>
                <div className="form-text">{timeRange}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
