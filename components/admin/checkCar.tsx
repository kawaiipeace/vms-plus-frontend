import FilterKeyHandOverModal from "@/components/modal/filterKeyHandOverModal";
import RequestStatusBox from "@/components/requestStatusBox";
import TableComponent from "@/components/tableCheckCar";
import ZeroRecord from "@/components/zeroRecord";
import { keyHandOverData, keyHandOverDataColumns } from "@/data/keyHandOverData";
import { RequestData } from "@/data/requestData";
import { useRef, useState } from "react";

export default function CheckCar() {
  const [data, setRequestData] = useState<RequestData[]>([]);
  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-4">
        <RequestStatusBox iconName="schedule" status="info" title="รอตรวจสอบ" number={1} />
        <RequestStatusBox iconName="reply" status="warning" title="ตีกลับยานพาหนะ" number={1} />
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
                <input
                  type="text"
                  id="myInputTextField"
                  className="form-control dt-search-input"
                  placeholder="เลขที่คำขอ, ผู้ใช้, ยานพาหนะ, สถานที่"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] hidden md:block"
                onClick={() => filterModalRef.current?.openModal()}
              >
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
        <ZeroRecord
          imgSrc="/assets/img/graphic/empty.svg"
          title="ไม่มีคำขอใช้ยานพาหนะ"
          desc={<>เมื่อผู้ใช้คืนยานพาหนะรายการคำขอที่รอตรวจสอบจะแสดงที่นี่</>}
          button="สร้างคำขอใช้"
          icon="add"
          link="process-one"
          displayBtn={false}
        />
      )}
    </>
  );
}
