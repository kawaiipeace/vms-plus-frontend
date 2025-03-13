import React, { useState, useRef } from "react";
import TableRecordTravelComponent from "@/app/components/tableRecordTravel";
import { travelData, travelDataColumnsAdmin, TravelData } from "@/app/data/travelData";
import ZeroRecord from "@/app/components/zeroRecord";
import RecordTravelAddModal from "@/app/components/modal/recordTravelAddModal";
import CancelRequestModal from "@/app/components/modal/cancelRequestModal";

export default function TravelInfoTab() {
  const [data, setData] = useState<TravelData[]>(travelData);
  const [statusEdit, setStatusEdit] = useState(false);
  const recordTravelAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const cancelRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  function handleStatusEdit(edit?: boolean) {
    setStatusEdit(edit ? true : false);
  }
  return (
    <>
      {data.length > 0 ? (
        <>
          <div>
            <h4 className="font-bold text-xl">
              <span className="border-l-4 border-[#A80689] rounded-xl mr-4" />
              ข้อมูลการเดินทาง
            </h4>
            <div className="flex w-full my-4">
              <div className="input-group input-group-search hidden">
                <div className="input-group-prepend">
                  <span className="input-group-text search-ico-info">
                    <i className="material-symbols-outlined">search</i>
                  </span>
                </div>
                <input type="text" id="myInputTextField" className="form-control dt-search-input" placeholder="เลขที่คำขอ, ผู้ใช้, ยานพาหนะ, สถานที่" />
              </div>
            </div>
          </div>
          <TableRecordTravelComponent
            data={travelData}
            columns={travelDataColumnsAdmin}
            listName="request"
            editRecordTravel={() => {
              recordTravelAddModalRef.current?.openModal();
              handleStatusEdit(true);
            }}
            deleteRecordTravel={() => cancelRequestModalRef.current?.openModal()}
          />
        </>
      ) : (
        <ZeroRecord imgSrc="/assets/img/graphic/record_travel_img.svg" title="เพิ่มข้อมูลการเดินทาง" desc={<>ระบุข้อมูลวันที่และเวลาเดินทาง เลขไมล์ สถานที่ี่จากต้นทางและถึงปลายทาง</>} button="เพิ่มข้อมูล" icon="add" link="process-one" displayBtn={true} useModal={() => recordTravelAddModalRef.current?.openModal()} />
      )}
      <RecordTravelAddModal status={statusEdit} ref={recordTravelAddModalRef} />
      <CancelRequestModal title="ยืนยันลบข้อมูลการเดินทาง" desc="ข้อมูลการเดินทางวันที่ 05/01/2567 08:00 จะถูกลบออกจากระบบ" confirmText="ลบข้อมูล" cancleFor="recordTravel" ref={cancelRequestModalRef} />
    </>
  );
}
