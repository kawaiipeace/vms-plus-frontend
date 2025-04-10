import React, { useRef, useState } from "react";
import { RequestData } from "@/data/requestData";
import ZeroRecord from "@/components/zeroRecord";
import { keyHandOverData, keyHandOverDataColumns } from "@/data/keyHandOverData";
import FilterKeyHandOverModal from "@/components/modal/filterKeyHandOverModal";
import TableComponent from "@/components/tableFinish";
export default function FinishTab() {
  const [data, setRequestData] = useState<RequestData[]>([]);
  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  return (
    <>
      {data.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <div className="hidden md:block">
              <div className="input-group input-group-search hidden">
                <div className="input-group-prepend">
                  <span className="input-group-text search-ico-info">
                    <i className="material-symbols-outlined">search</i>
                  </span>
                </div>
                <input type="text" id="myInputTextField" className="form-control dt-search-input" placeholder="เลขที่คำขอ, ผู้ใช้, ยานพาหนะ, สถานที่" />
              </div>
            </div>

            <div className="flex gap-4">
              <button className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] hidden md:block" onClick={() => filterModalRef.current?.openModal()}>
                <div className="flex items-center gap-1">
                  <i className="material-symbols-outlined">filter_list</i>
                  ตัวกรอง
                  <span className="badge badge-brand badge-outline rounded-[50%]">2</span>
                </div>
              </button>
            </div>
          </div>
          <TableComponent data={keyHandOverData} columns={keyHandOverDataColumns} />
          <FilterKeyHandOverModal ref={filterModalRef} />
        </>
      ) : (
        <ZeroRecord imgSrc="/assets/img/graphic/empty.svg" title="ไม่มีคำขอใช้ยานพาหนะ" desc={<>รายการคำขอที่เสร็จสิ้นการใช้ยานพาหนะแล้วจะแสดงที่นี่</>} button="สร้างคำขอใช้" icon="add" link="process-one" displayBtn={false} />
      )}
    </>
  );
}
