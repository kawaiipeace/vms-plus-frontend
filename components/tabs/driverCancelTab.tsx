import React from "react";
import MobileDriverCard from "@/components/card/mobileDriverCard";
import Image from "next/image";
import { ReceivedKeyDriver } from "@/app/types/vehicle-in-use-driver-type";
import dayjs from "dayjs";
import Link from "next/link";

interface DriverCancelTabProps {
  data: ReceivedKeyDriver[];
}

const DriverCancelTab = ({ data }: DriverCancelTabProps) => {
  const getDateMMYYYY = (date: string) => {
    const [month, year] = date.split("-");
    const monthNumber = parseInt(month) - 1;
    const yearNumber = parseInt(year);

    return dayjs().month(monthNumber).year(yearNumber);
  };

  const getDateRange = (start: string, end: string) => {
    const startDate = dayjs(start).format("DD/MM/YYYY");
    const endDate = dayjs(end).format("DD/MM/YYYY");

    return `${startDate} - ${endDate}`;
  };

  const getCancelByMonth = () => {
    const cancelData = data.reduce((p, n) => {
      const month_year = dayjs(n.end_datetime).format("MM-YYYY");
      if (p[month_year]) return { ...p, [month_year]: [...p[month_year], n] };
      return { ...p, [month_year]: [n] };
    }, {} as { [key: string]: ReceivedKeyDriver[] });

    return cancelData;
  };

  const getMonthSorted = () => {
    const months = Object.keys(cancelData).sort((a, b) => {
      const aDate = getDateMMYYYY(a);
      const bDate = getDateMMYYYY(b);

      return aDate.unix() - bDate.unix();
    });

    return months;
  };

  const cancelData = getCancelByMonth();
  const monthSorted = getMonthSorted();

  return (
    <>
      {data.length !== 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {monthSorted.map((key) => {
              return (
                <div key={key}>
                  <h6 className="text-md font-bold my-4">
                    {getDateMMYYYY(key).format("MMMM BBBB")}
                  </h6>
                  <p className="font-light mb-4">
                    {cancelData[key].length} งาน
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {cancelData[key].map((item) => {
                      const {
                        start_datetime: s_date,
                        end_datetime: e_date,
                        vehicle_license_plate: license_plate,
                        vehicle_license_plate_province_full: province,
                      } = item;

                      const license_plate_full = `${license_plate} ${province}`;
                      const date = getDateRange(s_date, e_date);
                      const link = `/vehicle-in-use/driver/${item.trn_request_uid}`;

                      return (
                        <Link key={item.request_no} href={link}>
                          <MobileDriverCard
                            title={"ยกเลิกภารกิจ"}
                            carRegis={license_plate_full}
                            location={item.work_place}
                            date={date}
                            cardType="cancel"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 text-center">
            <div className="flex items-center justify-center w-[300px] h-[300px] mx-auto my-5 col-span-12">
              <Image
                src="/assets/img/graphic/data_empty.svg"
                width={900}
                height={900}
                alt=""
              />
            </div>
            <div className="col-span-12">
              <p className="font-bold text-2xl">ไม่มีคำขอใช้ยานพาหนะ</p>
              <p>รายการคำขอใช้พาหนะที่เสร็จสิ้นจะแสดงที่นี่</p>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DriverCancelTab;
