export default function DriverTravelCard() {
  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">emoji_transportation</i>
              <div className="form-plaintext-group">
                <div className="form-label">สถานที่ปฏิบัติงาน</div>
                <div className="form-text">การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด</div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่เดินทาง</div>
                <div className="form-text">01/01/2567 - 07/01/2567</div>
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">departure_board</i>
              <div className="form-plaintext-group">
                <div className="form-label">ช่วงเวลา</div>
                <div className="form-text">เต็มวัน</div>
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">travel_luggage_and_bags</i>
              <div className="form-plaintext-group">
                <div className="form-label">ประเภท</div>
                <div className="form-text">ไป - กลับ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
