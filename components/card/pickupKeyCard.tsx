"use client"; // if you're using Next.js app router

import { useEffect, useState } from "react";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";

interface Props {
  receiveKeyPlace?: string;
  receiveKeyStart?: string;
  receiveKeyEnd?: string;
}

export default function PickupKeyCard({
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
                disabled
                defaultValue={receiveKeyPlace}
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="form-group">
              <label className="form-label">วันที่รับกุญแจ</label>
              <input
                type="text"
                className="form-control"
                disabled
                value={date}
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="form-group">
              <label className="form-label">ช่วงเวลา</label>
              <input
                type="text"
                className="form-control"
                disabled
                value={timeRange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
