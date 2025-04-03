export default function PickupKeyCard() {
  return (
    <div className="card w-full">
      <div className="card-body">
        <h2 className="card-title">การนัดหมายรับกุญแจ</h2>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <div className="form-group">
              <label className="form-label">สถานที่รับกุญแจ</label>

              <input
                type="text"
                className="form-control"
                disabled={true}
                placeholder=""
                defaultValue="ศรัญยู บริรัตน์ฤทธิ์ (505291)"
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="form-group">
              <label className="form-label">วันที่รับกุญแจ</label>

              <input
                type="text"
                className="form-control"
                disabled={true}
                placeholder=""
                defaultValue="28/02/2567"
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="form-group">
              <label className="form-label">ช่วงเวลา</label>

              <input
                type="text"
                className="form-control"
                disabled={true}
                placeholder=""
                defaultValue="13:00 - 18:00"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
