import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useEffect, useState } from "react";

interface Props {
  receiveKeyPlace?: string;
  receiveKeyStart?: string;
  receiveKeyEnd?: string;
}
export default function PickupKeyDetailCard({
  receiveKeyPlace,
  receiveKeyStart,
  receiveKeyEnd,
}: Props) {


  const [date, setDate] = useState("");
  const [timeRange, setTimeRange] = useState("");

  useEffect(() => {
    const convertDate = async () => {
      if (receiveKeyStart && receiveKeyEnd) {
        const start = await convertToBuddhistDateTime(receiveKeyStart);
        const end = await convertToBuddhistDateTime(receiveKeyEnd);

        setDate(start.date);
        setTimeRange(`${start.time} น. - ${end.time} น.`);
      }
    };

    convertDate();
  }, [receiveKeyStart, receiveKeyEnd]);
  
  return (
    <div className="form-card">
          <h2 className="form-card-title mb-3 font-semibold">การนัดหมายรับกุญแจ</h2>
      <div className="form-card-body">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-12">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">pin_drop</i>
              <div className="form-plaintext-group">
                <div className="form-label">สถานที่นัดหมาย</div>
                <div className="form-text">{receiveKeyPlace}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">วันที่</div>
                <div className="form-text">{date}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">calendar_month</i>
              <div className="form-plaintext-group">
                <div className="form-label">ช่วงเวลา</div>
                <div className="form-text">{timeRange}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
