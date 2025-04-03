export default function DriverWaitKeyCard() {
  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">pin_drop</i>
              <div className="form-plaintext-group">
                <div className="form-label">สถานที่รับกุญแจ</div>
                <div className="form-text">อาคาร LED ชั้น 3</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่</div>
                <div className="form-text">28/12/2566</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
