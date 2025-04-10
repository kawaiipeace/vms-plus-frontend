import React, { useRef, useState } from "react";
import TableComponent from "@/components/table";
import { RequestData, requestDataColumns, requestData_1 } from "@/data/requestData";
import ZeroRecord from "@/components/zeroRecord";
import FilterModal from "@/components/modal/filterModal";
import RequestStatusBox from "../requestStatusBox";

export default function ApproveFlow() {
  const [data, setRequestData] = useState<RequestData[]>(requestData_1);
  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <RequestStatusBox iconName="schedule" status="info" title="รออนุมัติ" number={3} />
        <RequestStatusBox iconName="reply" status="warning" title="ตีกลับคำขอ" number={1} />
        <RequestStatusBox iconName="check" status="success" title="อนุมัติ" number={1} />
        <RequestStatusBox iconName="delete" status="default" title="ยกเลิกคำขอ" number={1} />
      </div>

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
          <TableComponent data={data} columns={requestDataColumns} />
          {/* <FilterModal ref={filterModalRef} /> */}
        </>
      ) : (
        <ZeroRecord imgSrc="/assets/img/empty/add_carpool.svg" title="สร้างคำขอใช้ยานพาหนะ" desc={<>ระบุข้อมูลการเดินทาง ค้นหายานพาหนะ และผู้ขับขี่</>} button="สร้างคำขอใช้" icon="add" link="process-one" />
      )}
    </>
  );
}
