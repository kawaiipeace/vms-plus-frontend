interface JourneyDetailCardProps {
  displayOn?: string;
}
export default function JourneyDetailCard({ displayOn }: JourneyDetailCardProps) {
  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่ / เวลาเดินทาง</div>
                <div className="form-text">01/01/2567 - 07/01/2567 08:30 - 18:00</div>
              </div>
            </div>
          </div>

          {displayOn === "keypickup" ? (
            <>
              <div className="col-span-6 md:col-span-3">
                <div className="form-group form-plaintext">
                  <i className="material-symbols-outlined">departure_board</i>
                  <div className="form-plaintext-group">
                    <div className="form-label">ช่วงเวลา</div>
                    <div className="form-text">เต็มวัน</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="col-span-12 md:col-span-3">
                <div className="form-group form-plaintext">
                  <i className="material-symbols-outlined">groups</i>
                  <div className="form-plaintext-group">
                    <div className="form-label">จำนวนผู้โดยสาร</div>
                    <div className="form-text">4 (รวมผู้ขับขี่)</div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="col-span-6 md:col-span-3">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">travel_luggage_and_bags</i>
              <div className="form-plaintext-group">
                <div className="form-label">ประเภท</div>
                <div className="form-text">ไป-กลับ</div>
              </div>
            </div>
          </div>

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
              <i className="material-symbols-outlined">target</i>
              <div className="form-plaintext-group">
                <div className="form-label">วัตถุประสงค์</div>
                <div className="form-text">เพื่อเก็บรวบรวมข้อมูลการใช้งานระบบ VMS Plus ขอบเขตงานบริการเช่าชุดเครื่องยนต์กำเนิดไฟฟ้าของ กฟภ. และงานบริหารจัดการยานพาหนะขนาดใหญ่</div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">sms</i>
              <div className="form-plaintext-group">
                <div className="form-label">หมายเหตุ</div>
                <div className="form-text">รายละเอียดแผนและรายชื่อพนักงานตามเอกสารแนบ</div>
              </div>
            </div>
          </div>

          {displayOn === "keypickup" && (
            <div className="col-span-12">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">groups</i>
                <div className="form-plaintext-group">
                  <div className="form-label">จำนวนผู้โดยสาร</div>
                  <div className="form-text">4 (รวมผู้ขับขี่)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
