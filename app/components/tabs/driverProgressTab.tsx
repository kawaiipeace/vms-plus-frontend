import React from "react";
import MobileDriverCard from "@/app/components/card/mobileDriverCard";
import Image from "next/image";
import Link from "next/link";

interface DriverProgressTabProps {
  data: number[];
}

const DriverProgressTab = ({ data }: DriverProgressTabProps) => {
  return (
    <>
      {data.length !== 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h6 className="text-md font-bold my-4">เดินทาง</h6>
              <div className="grid grid-cols-1 gap-4">
                <Link href="/vehicle-in-use/driver/1">
                  <MobileDriverCard cardType="recordTravel" carRegis="5กก 1234 กรุงเทพมหานคร" location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด..." date="01/01/2567 - 07/01/2567" title="บันทึกการเดินทาง" noteText="กรุณาบันทึกเลขไมล์และการเติมเชื้อเพลิง" />
                </Link>
                <MobileDriverCard cardType="waitCar" carRegis="5กก 1234 กรุงเทพมหานคร" location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด..." date="01/01/2567 - 07/01/2567" title="รอรับยานพาหนะ" />
              </div>
            </div>
            <div>
              <h6 className="text-md font-bold my-4">คืนยานพาหนะ</h6>
              <div className="grid grid-cols-1 gap-4">
                <MobileDriverCard cardType="waitVerify" carRegis="5กก 1234 กรุงเทพมหานคร" location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด..." date="01/01/2567 - 07/01/2567" title="รอตรวจสอบ" noteText="รอผู้ดูแลยานพาหนะตรวจสอบและปิดงาน" />
                <MobileDriverCard cardType="returnFail" carRegis="5กก 1234 กรุงเทพมหานคร" location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด..." date="01/01/2567 - 07/01/2567" title="คืนยานพาหนะไม่สำเร็จ" noteText="กรุณาเติมเชื้อเพลิงและดูแลความสะอาด ก่อนคืนยานพาหนะ" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 text-center">
            <div className="flex items-center justify-center w-[300px] h-[300px] mx-auto my-5 col-span-12">
              <Image src="/assets/img/graphic/data_empty.svg" width={900} height={900} alt="" />
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
