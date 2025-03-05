export default function AppointmentDriverCard() {
    return (
        <div className="form-card">
        <div className="form-card-body">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">pin_drop</i>
                <div className="form-plaintext-group">
                  <div className="form-label">สถานที่นัดหมาย</div>
                  <div className="form-text">Lobby อาคาร LED</div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">
                  calendar_month
                </i>
                <div className="form-plaintext-group">
                  <div className="form-label">วันที่และเวลา</div>
                  <div className="form-text">01/01/2567 08:30</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}