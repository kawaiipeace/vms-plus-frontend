import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";

interface Props {
  pickupPlace?: string;
  pickupDatetime?: string;
}
export default function AppointmentDriverUserCard({ pickupPlace, pickupDatetime }: Props) {
  const formatToBuddhistDate = (isoDate?: string) => {
    if (!isoDate) return "-";

    const datetime = convertToBuddhistDateTime(isoDate);

    return `${datetime.date} ${datetime.time}`;
  };

  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">pin_drop</i>
              <div className="form-plaintext-group">
                <div className="form-label">สถานที่</div>
                <div className="form-text">{pickupPlace || "-"}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="grid grid-cols-2 ">
              <div className="form-group form-plaintext col-s">
                <i className="material-symbols-outlined">calendar_month</i>
                <div className="form-plaintext-group">
                  <div className="form-label">วันที่</div>
                  <div className="form-text">{convertToBuddhistDateTime(pickupDatetime || "").date}</div>
                </div>
              </div>
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">schedule</i>
                <div className="form-plaintext-group">
                  <div className="form-label">เวลา</div>
                  <div className="form-text">{convertToBuddhistDateTime(pickupDatetime || "").time}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
