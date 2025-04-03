import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";

interface Props {
  pickupPlace?: string;
  pickupDatetime?: string;
}
export default function AppointmentDriverCard({
  pickupPlace,
  pickupDatetime,
}: Props) {

  const formatToBuddhistDate = (isoDate?: string) => {
    if (!isoDate) return "-";
  
    const datetime = convertToBuddhistDateTime(isoDate);
  
    return `${datetime.date} ${datetime.time}`;
  };
  
  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">pin_drop</i>
              <div className="form-plaintext-group">
                <div className="form-label">สถานที่นัดหมาย</div>
                <div className="form-text">{pickupPlace}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่และเวลา</div>
                <div className="form-text">{formatToBuddhistDate(pickupDatetime)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
