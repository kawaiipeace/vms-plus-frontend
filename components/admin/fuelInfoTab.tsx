import React, { useState, useRef } from "react";
import TableRecordFuelComponent from "@/components/tableRecordFuel";
import { fuelData, fuelDataColumnsAdmin, FuelData } from "@/data/fuelData";
import ZeroRecord from "@/components/zeroRecord";
import RecordTravelAddModal from "@/components/modal/recordFuelAddModal";
import CancelRequestModal from "@/components/modal/cancelRequestModal";

interface FuelDataProps {
  requestType?: string;
}

export default function FuelInfoTab({ requestType }: FuelDataProps) {
  const [data, setData] = useState<FuelData[]>(fuelData);
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
              ข้อมูลการเติมเชื้อเพลิง
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
              {requestType === "เสร็จสิ้น" && (
                <button className="btn btn-secondary ml-auto">
                  <i className="material-symbols-outlined">add</i>
                  เพิ่มข้อมูล
                </button>
              )}
            </div>
          </div>
          <TableRecordFuelComponent
            data={fuelData}
            columns={fuelDataColumnsAdmin}
            listName="request"
            editRecordFuel={() => {
              recordTravelAddModalRef.current?.openModal();
              handleStatusEdit(true);
            }}
            deleteRecordFuel={() => cancelRequestModalRef.current?.openModal()}
          />
        </>
      ) : (
        <ZeroRecord imgSrc="/assets/img/graphic/fuel_img.svg" title="เพิ่มข้อมูลเติมการเชื้อเพลิง" desc={<>กรุณาระบุเลขไมล์และข้อมูลใบเสร็จทุกครั้งที่เติมน้ำมัน เพื่อใช้ในการเบิกค่าใช้จ่าย</>} button="เพิ่มข้อมูล" icon="add" link="process-one" displayBtn={true} useModal={() => recordTravelAddModalRef.current?.openModal()} />
      )}
      <RecordTravelAddModal status={statusEdit} ref={recordTravelAddModalRef} />
      <CancelRequestModal id="" title="ยืนยันลบข้อมูลการเติมเชื้อเพลิง" desc="ข้อมูลการเติมเชื้อเพลิงเลขที่ใบเสร็จ 57980006561  จะถูกลบออกจากระบบ" confirmText="ลบข้อมูล" cancleFor="recordTravel" ref={cancelRequestModalRef} />
    </>
  );
}
