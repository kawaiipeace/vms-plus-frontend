import React from 'react';

interface JourneyDetailCardProps {
  displayOn?: string;
  startDate?: string;
  endDate?: string;
  timeStart?: string;
  timeEnd?: string;
  workPlace?: string;
  purpose?: string;
  remark?: string;
  tripType?: string;
  numberOfPassanger?: number;
}

export default function JourneyDetailCard({
  displayOn,
  startDate,
  endDate,
  timeStart,
  timeEnd,
  workPlace,
  purpose,
  remark,
  tripType,
  numberOfPassanger,
}: JourneyDetailCardProps) {
  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่ / เวลาเดินทาง</div>
                <div className="form-text">
                  {startDate} - {endDate} {timeStart} - {timeEnd}
                </div>
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
                    <div className="form-text">{numberOfPassanger} (รวมผู้ขับขี่)</div>
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
                <div className="form-text">{tripType == "1" ? "ไป-กลับ" : "ค้างแรม"}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">emoji_transportation</i>
              <div className="form-plaintext-group">
                <div className="form-label">สถานที่ปฏิบัติงาน</div>
                <div className="form-text">{workPlace}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">target</i>
              <div className="form-plaintext-group">
                <div className="form-label">วัตถุประสงค์</div>
                <div className="form-text">{purpose}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">sms</i>
              <div className="form-plaintext-group">
                <div className="form-label">หมายเหตุ</div>
                <div className="form-text">{remark}</div>
              </div>
            </div>
          </div>

          {displayOn === "keypickup" && (
            <div className="col-span-12">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">groups</i>
                <div className="form-plaintext-group">
                  <div className="form-label">จำนวนผู้โดยสาร</div>
                  <div className="form-text">{numberOfPassanger} (รวมผู้ขับขี่)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}