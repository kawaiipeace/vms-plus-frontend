import React, { useRef } from "react";
import Image from "next/image";
import ToastCustom from "@/app/components/toastCustom";
import TableRecordTravelComponent from "../tableRecordTravel";
import { recordFuelData, recordFuelDataColumns } from "@/app/data/requestData";
import RecordFuelAddModal from "@/app/components/modal/recordFuelAddModal";
import CancelRequestModal from "@/app/components/modal/cancelRequestModal";

const RecordFuelTab = () => {
  const recordFuelAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const cancelRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  return (
    <>
      <div className="w-full">
        {recordFuelData.length == 0 ? (
          <div className="grid grid-cols-1 gap-4 text-center">
            <div className="flex items-center justify-center w-[300px] h-[300px] mx-auto my-5 col-span-12">
              <Image src="/assets/img/graphic/fuel_img.svg" width={900} height={900} alt="" />
            </div>
            <div className="col-span-12">
              <p className="font-bold text-2xl">เพิ่มข้อมูลการเดินทาง</p>
              <p>ระบุข้อมูลวันที่และเวลาเดินทาง เลขไมล์ สถานที่ี่จากต้นทางและถึงปลายทาง</p>
            </div>
            <div className="col-span-12">
              <button className="btn btn-primary w-full text-xl" onClick={() => recordFuelAddModalRef.current?.openModal()}>
                <i className="material-symbols-outlined !text-3xl">add</i> เพิ่มข้อมูล
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-3">
              <button className="btn btn-primary" onClick={() => recordFuelAddModalRef.current?.openModal()}>
                <i className="material-symbols-outlined">add</i> เพิ่มข้อมูล
              </button>
            </div>
            <div className="w-full mx-auto mt-3">
              <TableRecordTravelComponent data={recordFuelData} columns={recordFuelDataColumns} listName="fuel" editRecordTravel={() => recordFuelAddModalRef.current?.openModal()} deleteRecordTravel={() => cancelRequestModalRef.current?.openModal()} />
            </div>
          </>
        )}
        <RecordFuelAddModal ref={recordFuelAddModalRef} />
        <CancelRequestModal title="ยืนยันลบข้อมูลการเติมเชื้อเพลิง" desc="ข้อมูลการเติมเชื้อเพลิงเลขที่ใบเสร็จ 57980006561 จะโดนลบออกจาก ระบบ" confirmText="ลบข้อมูล" ref={cancelRequestModalRef} cancleFor="recordTravel" />
        <ToastCustom title="เพิ่มข้อมูลการเดินทางสำเร็จ" desc="เพิ่มข้อมูลการเดินทางวันที่ 05/01/2567 เรียบร้อยแล้ว" status="success" styleText="!mx-auto" />
      </div>
    </>
  );
};

export default RecordFuelTab;
