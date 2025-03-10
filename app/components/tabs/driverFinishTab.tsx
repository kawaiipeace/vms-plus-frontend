import React from "react";
import MobileDriverCard from "@/app/components/card/mobileDriverCard";
import Image from "next/image";

interface DriverFinishTabProps {
  data: [];
}

const DriverFinishTab = ({ data }: DriverFinishTabProps) => {
  return (
    <>
      {data.length !== 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h6 className="text-md font-bold my-4">มกราคม 2567</h6>
              <p className="font-light mb-4">2 งาน</p>
              <div className="grid grid-cols-1 gap-4">
                <MobileDriverCard cardType="complete" carRegis="5กก 1234 กรุงเทพมหานคร" location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด..." date="01/01/2567 - 07/01/2567" title="ภารกิจสำเร็จ" rating="4.5" />
                <MobileDriverCard cardType="complete" carRegis="5กก 1234 กรุงเทพมหานคร" location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด..." date="01/01/2567 - 07/01/2567" title="ภารกิจสำเร็จ" />
              </div>
            </div>
            <div>
              <h6 className="text-md font-bold my-4">กุมภาพันธ์ 2567</h6>
              <p className="font-light mb-4">2 งาน</p>
              <div className="grid grid-cols-1 gap-4">
                <MobileDriverCard cardType="complete" carRegis="5กก 1234 กรุงเทพมหานคร" location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด..." date="01/01/2567 - 07/01/2567" title="ภารกิจสำเร็จ" rating="4.5" />
                <MobileDriverCard cardType="complete" carRegis="5กก 1234 กรุงเทพมหานคร" location="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด..." date="01/01/2567 - 07/01/2567" title="ภารกิจสำเร็จ" rating="4.5" />
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

export default DriverFinishTab;
