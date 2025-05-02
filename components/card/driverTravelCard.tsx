interface DriverTravelCardProps {
  location?: string;
  date?: string;
  timeRange?: string;
  tripType?: number;
}

export default function DriverTravelCard({
  location,
  date,
  timeRange,
  tripType,
}: DriverTravelCardProps) {
  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">emoji_transportation</i>
              <div className="form-plaintext-group">
                <div className="form-label">สถานที่ปฏิบัติงาน</div>
                <div className="form-text">{location || "-"}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่เดินทาง</div>
                <div className="form-text">{date || "-"}</div>
                <div className="form-text">{timeRange || "-"}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">
                travel_luggage_and_bags
              </i>
              <div className="form-plaintext-group">
                <div className="form-label">ประเภท</div>
                <div className="form-text">
                  {tripType ? (tripType === 1 ? "ไป-กลับ" : "ค้างแรม") : "-"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
