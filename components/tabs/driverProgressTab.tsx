import React, { useState } from "react";
import MobileDriverCard from "@/components/card/mobileDriverCard";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import RequestListTable from "../table/request-list-table";
import { RequestListType } from "@/app/types/request-list-type";
import { PaginationType } from "@/app/types/request-action-type";

interface DriverProgressTabProps {
  data: RequestListType[];
}

const DriverProgressTab = ({ data }: DriverProgressTabProps) => {
  const [pagination, setPagination] = useState<PaginationType>({
    limit: 100,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const getDateRange = (start: string, end?: string, format?: string) => {
    const startDate = dayjs(start).format(format || "DD/MM/YYYY");
    const endDate = dayjs(end).format(format || "DD/MM/YYYY");

    if (!end) return startDate;
    return `${startDate} - ${endDate}`;
  };

  const getTravelData = () => {
    const travelData = data.filter((e) =>
      ["51", "60"].includes(e.ref_request_status_code || "")
    );

    const sort = travelData.sort(
      (a, b) => dayjs(a.start_datetime).unix() - dayjs(b.start_datetime).unix()
    );

    return sort;
  };

  const getReturnedData = () => {
    const returnedData = data.filter((e) =>
      ["70", "71"].includes(e.ref_request_status_code || "")
    );

    const sort = returnedData.sort(
      (a, b) => dayjs(a.start_datetime).unix() - dayjs(b.start_datetime).unix()
    );

    return sort;
  };

  const travelData = getTravelData();
  const returnedData = getReturnedData();

  return (
    <>
      {data.length !== 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {travelData.length !== 0 && (
              <div>
                <h6 className="text-md font-bold my-4">เดินทาง</h6>
                <div className="grid grid-cols-1 gap-4">
                  {travelData.map((item) => {
                    const {
                      work_place,
                      start_datetime: s_date,
                      end_datetime: e_date,
                      vehicle_license_plate: license_plate,
                      vehicle_license_plate_province_full: province,
                    } = item;

                    const license_plate_full = `${license_plate} ${province}`;
                    const date = getDateRange(s_date || "", e_date || "");

                    const link = `/vehicle-in-use/driver/${item.trn_request_uid}`;

                    return (
                      <React.Fragment key={item.request_no}>
                        {item.ref_request_status_code === "51" && (
                          <Link href={link + "?progressType=บันทึกการเดินทาง"}>
                            <MobileDriverCard
                              cardType="recordTravel"
                              carRegis={license_plate_full}
                              location={work_place || ""}
                              date={date}
                              title="บันทึกการเดินทาง"
                              noteText="กรุณาบันทึกเลขไมล์และการเติมเชื้อเพลิง"
                            />
                          </Link>
                        )}
                        {item.ref_request_status_code === "60" && (
                          <Link href={link + "?progressType=รอรับยานพาหนะ"}>
                            <MobileDriverCard
                              cardType="waitCar"
                              carRegis={license_plate_full}
                              location={work_place || ""}
                              date={date}
                              title="รอรับยานพาหนะ"
                              locationNote={item.parking_place}
                            />
                          </Link>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {/* <Link href="/vehicle-in-use/driver/97852739-cdb5-46c4-a280-78894fb432fd">
                  <MobileDriverCard
                    cardType="recordTravel"
                    carRegis="5กก 1234 กรุงเทพมหานคร"
                    location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด..."
                    date="01/01/2567 - 07/01/2567"
                    title="บันทึกการเดินทาง"
                    noteText="กรุณาบันทึกเลขไมล์และการเติมเชื้อเพลิง"
                  />
                </Link>
                <MobileDriverCard
                  cardType="waitCar"
                  carRegis="5กก 1234 กรุงเทพมหานคร"
                  location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด..."
                  date="01/01/2567 - 07/01/2567"
                  title="รอรับยานพาหนะ"
                /> */}
                </div>
              </div>
            )}
            {returnedData.length !== 0 && (
              <div>
                <h6 className="text-md font-bold my-4">คืนยานพาหนะ</h6>
                <div className="grid grid-cols-1 gap-4">
                  {returnedData.map((item) => {
                    const {
                      work_place,
                      start_datetime: s_date,
                      end_datetime: e_date,
                      vehicle_license_plate: license_plate,
                      vehicle_license_plate_province_full: province,
                    } = item;

                    const license_plate_full = `${license_plate} ${province}`;
                    const date = getDateRange(s_date || "", e_date || "");

                    const link = `/vehicle-in-use/driver/${item.trn_request_uid}`;

                    return (
                      <React.Fragment key={item.request_no}>
                        {item.ref_request_status_code === "70" && (
                          <Link href={link + "?progressType=รอการตรวจสอบ"}>
                            <MobileDriverCard
                              cardType="waitVerify"
                              carRegis={license_plate_full}
                              location={work_place || ""}
                              date={date}
                              title="รอตรวจสอบ"
                              noteText="รอผู้ดูแลยานพาหนะตรวจสอบและปิดงาน"
                            />
                          </Link>
                        )}
                        {item.ref_request_status_code === "71" && (
                          <Link
                            href={link + "?progressType=คืนยานพาหนะไม่สำเร็จ"}
                          >
                            <MobileDriverCard
                              cardType="returnFail"
                              carRegis={license_plate_full}
                              location={work_place || ""}
                              date={date}
                              title="คืนยานพาหนะไม่สำเร็จ"
                              noteText={item.returned_vehicle_remark}
                            />
                          </Link>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {/* <MobileDriverCard
                  cardType="waitVerify"
                  carRegis="5กก 1234 กรุงเทพมหานคร"
                  location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด..."
                  date="01/01/2567 - 07/01/2567"
                  title="รอตรวจสอบ"
                  noteText="รอผู้ดูแลยานพาหนะตรวจสอบและปิดงาน"
                />
                <MobileDriverCard
                  cardType="returnFail"
                  carRegis="5กก 1234 กรุงเทพมหานคร"
                  location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด..."
                  date="01/01/2567 - 07/01/2567"
                  title="คืนยานพาหนะไม่สำเร็จ"
                  noteText="กรุณาเติมเชื้อเพลิงและดูแลความสะอาด ก่อนคืนยานพาหนะ"
                /> */}
                </div>
              </div>
            )}
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

export default DriverProgressTab;
