export default function DriverPickUpPassengerCard() {
  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">pin_drop</i>
              <div className="form-plaintext-group">
                <div className="form-label">สถานที่นัดหมาย</div>
                <div className="form-text">Lobby อาคาร LED</div>
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่</div>
                <div className="form-text">28/12/2566</div>
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">schedule</i>
              <div className="form-plaintext-group">
                <div className="form-label">เวลา</div>
                <div className="form-text">08:30</div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">groups</i>
              <div className="form-plaintext-group">
                <div className="form-label">จำนวนผู้โดยสาร</div>
                <div className="form-text">4 (รวมผู้ขับขี่)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
