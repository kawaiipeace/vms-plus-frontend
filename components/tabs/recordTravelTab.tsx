import React, { useRef } from "react";
import Image from "next/image";
import RecordTravelAddModal from "@/components/modal/recordTravelAddModal";
import ToastCustom from "@/components/toastCustom";
import TableRecordTravelComponent from "../tableRecordTravel";
import { recordData, recordDataColumns } from "@/data/requestData";
import CancelRequestModal from "@/components/modal/cancelRequestModal";

const RecordTravelTab = () => {
  const recordTravelAddModalRef = useRef<{
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
        {recordData.length == 0 ? (
          <div className="grid grid-cols-1 gap-4 text-center">
            <div className="flex items-center justify-center w-[300px] h-[300px] mx-auto my-5 col-span-12">
              <Image src="/assets/img/graphic/record_travel_img.svg" width={900} height={900} alt="" />
            </div>
            <div className="col-span-12">
              <p className="font-bold text-2xl">เพิ่มข้อมูลการเดินทาง</p>
              <p>ระบุข้อมูลวันที่และเวลาเดินทาง เลขไมล์ สถานที่ี่จากต้นทางและถึงปลายทาง</p>
            </div>
            <div className="col-span-12">
              <button className="btn btn-primary w-full text-xl" onClick={() => recordTravelAddModalRef.current?.openModal()}>
                <i className="material-symbols-outlined !text-3xl">add</i> เพิ่มข้อมูล
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-4">
              <div className="input-group input-group-search hidden">
                <div className="input-group-prepend">
                  <span className="input-group-text search-ico-info">
                    <i className="material-symbols-outlined">search</i>
                  </span>
                </div>
                <input type="text" id="myInputTextField" className="form-control dt-search-input" placeholder="ค้นหา" />
              </div>
            </div>
            <div className="mt-3">
              <button className="btn btn-primary" onClick={() => recordTravelAddModalRef.current?.openModal()}>
                <i className="material-symbols-outlined">add</i> เพิ่มข้อมูล
              </button>
            </div>
            <div className="w-full mx-auto mt-3">
              <TableRecordTravelComponent data={recordData} columns={recordDataColumns} listName="request" editRecordTravel={() => recordTravelAddModalRef.current?.openModal()} deleteRecordTravel={() => cancelRequestModalRef.current?.openModal()} />
            </div>
          </>
        )}
        <RecordTravelAddModal ref={recordTravelAddModalRef} />
        <CancelRequestModal title="ยืนยันลบข้อมูลการเดินทาง" desc="ข้อมูลการเดินทางวันที่ 05/01/2567 08:00 จะถูกลบออกจากระบบ" confirmText="ลบข้อมูล" ref={cancelRequestModalRef} cancleFor="recordTravel" id={""} />
        <ToastCustom title="เพิ่มข้อมูลการเดินทางสำเร็จ" desc="เพิ่มข้อมูลการเดินทางวันที่ 05/01/2567 เรียบร้อยแล้ว" status="success" styleText="!mx-auto" />
      </div>
    </>
  );
};

export default RecordTravelTab;
