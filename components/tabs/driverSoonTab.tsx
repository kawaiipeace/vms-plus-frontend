import React, { useState } from "react";
import MobileDriverCard from "@/components/card/mobileDriverCard";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import { RequestListType } from "@/app/types/request-list-type";
import { PaginationType } from "@/app/types/request-action-type";
import RequestListTable from "../table/request-list-table";

interface DriverSoonTabProps {
  data: RequestListType[];
}

const DriverSoonTab = ({ data }: DriverSoonTabProps) => {
  const [pagination, setPagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const getDateMMYYYY = (date: string) => {
    const [month, year] = date.split("-");
    const monthNumber = parseInt(month) - 1;
    const yearNumber = parseInt(year);

    return dayjs().month(monthNumber).year(yearNumber);
  };

  const getDateRange = (start: string, end?: string, format?: string) => {
    const startDate = dayjs(start).format(format || "DD/MM/YYYY");
    const endDate = dayjs(end).format(format || "DD/MM/YYYY");

    if (!end) return startDate;
    return `${startDate} - ${endDate}`;
  };

  const getSoonByMonth = () => {
    const soonData = data.reduce((p, n) => {
      const month_year = dayjs(n.end_datetime).format("MM-YYYY");
      if (p[month_year]) return { ...p, [month_year]: [...p[month_year], n] };
      return { ...p, [month_year]: [n] };
    }, {} as { [key: string]: RequestListType[] });

    return soonData;
  };

  const getMonthSorted = () => {
    const months = Object.keys(soonData).sort((a, b) => {
      const aDate = getDateMMYYYY(a);
      const bDate = getDateMMYYYY(b);

      return aDate.unix() - bDate.unix();
    });

    return months;
  };

  const soonData = getSoonByMonth();
  const monthSorted = getMonthSorted();

  return (
    <>
      {data.length !== 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {monthSorted.map((key) => {
              return (
                <div key={key}>
                  <h6 className="text-md font-bold my-4">
                    {getDateMMYYYY(key).format("MMMM BBBB")}
                  </h6>
                  <p className="font-light mb-4">{soonData[key].length} งาน</p>
                  <div className="grid grid-cols-1 gap-4">
                    {soonData[key].map((item) => {
                      const {
                        start_datetime: s_date,
                        end_datetime: e_date,
                        received_key_start_datetime: receive_key_date,
                        vehicle_license_plate: license_plate,
                        vehicle_license_plate_province_full: province,
                      } = item;

                      const license_plate_full = `${license_plate} ${province}`;

                      const date = getDateRange(s_date, e_date);
                      const timeRange = getDateRange(s_date, e_date, "HH:mm");
                      const receivedKeyDate = getDateRange(receive_key_date);

                      const link = `/vehicle-in-use/driver/${item.trn_request_uid}?progressType=รอรับกุญแจ`;

                      return (
                        <Link key={item.request_no} href={link}>
                          <MobileDriverCard
                            title={"รอรับกุญแจ"}
                            carRegis={license_plate_full}
                            location={item.work_place}
                            locationNote={item.received_key_place}
                            date={date}
                            timeRange={timeRange}
                            receivedKeyDate={receivedKeyDate}
                            cardType="waitKey"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="hidden md:block">
            <RequestListTable defaultData={data} pagination={pagination} />
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

export default DriverSoonTab;
