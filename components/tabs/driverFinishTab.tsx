import { PaginationType } from "@/app/types/request-action-type";
import { RequestListType } from "@/app/types/request-list-type";
import MobileDriverCard from "@/components/card/mobileDriverCard";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import RequestListTable from "../table/request-list-table";

interface DriverFinishTabProps {
  data: RequestListType[];
}

const DriverFinishTab = ({ data }: DriverFinishTabProps) => {
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

  const getDateRange = (start: string, end: string) => {
    const startDate = dayjs(start).format("DD/MM/YYYY");
    const endDate = dayjs(end).format("DD/MM/YYYY");

    if (startDate === endDate) return startDate;

    return `${startDate} - ${endDate}`;
  };

  const getFinishByMonth = () => {
    const finishData = data.reduce((p, n) => {
      const month_year = dayjs(n.end_datetime).format("MM-YYYY");
      if (p[month_year]) return { ...p, [month_year]: [...p[month_year], n] };
      return { ...p, [month_year]: [n] };
    }, {} as { [key: string]: RequestListType[] });

    return finishData;
  };

  const getMonthSorted = () => {
    const months = Object.keys(finishData).sort((a, b) => {
      const aDate = getDateMMYYYY(a);
      const bDate = getDateMMYYYY(b);

      return aDate.unix() - bDate.unix();
    });

    return months;
  };

  const finishData = getFinishByMonth();
  const monthSorted = getMonthSorted();

  return (
    <>
      {data.length !== 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {monthSorted.map((key) => {
              const month = parseInt(key.split("-")[0]) - 1;
              const year = parseInt(key.split("-")[1]);

              return (
                <div key={key}>
                  <h6 className="text-md font-bold my-4">
                    {getDateMMYYYY(key).format("MMMM BBBB")}
                  </h6>
                  <p className="font-light mb-4">
                    {finishData[key].length} งาน
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {finishData[key].map((item) => {
                      const {
                        start_datetime: s_date,
                        end_datetime: e_date,
                        vehicle_license_plate: license_plate,
                        vehicle_license_plate_province_short: province,
                      } = item;

                      const license_plate_full = `${license_plate} ${province}`;
                      const date = getDateRange(s_date || "", e_date || "");
                      const link = `/vehicle-in-use/driver/${item.trn_request_uid}`;

                      return (
                        <Link
                          key={item.request_no}
                          href={link + "?progressType=ภารกิจสำเร็จ"}
                        >
                          <MobileDriverCard
                            title={"ภารกิจสำเร็จ"}
                            carRegis={license_plate_full}
                            location={item?.work_place || ""}
                            date={date}
                            cardType="complete"
                            rating={undefined}
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
            <RequestListTable
              defaultData={data}
              pagination={pagination}
              role="driver"
            />
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

export default DriverFinishTab;
