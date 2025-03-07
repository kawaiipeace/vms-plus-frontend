import React, { useRef } from "react";
import TableComponent from "@/app/components/table";
import { requestData } from "@/app/data/requestData";
import ZeroRecord from "@/app/components/zeroRecord";
import RequestStatusBox from "../requestStatusBox";
import { keyHandOverData, keyHandOverDataColumns } from "@/app/data/keyHandOverData";
import FilterKeyHandOverModal from "../modal/filterKeyHandOverModal";

export default function KeyHandOver() {
//   const [requestData, setRequestData] = useState([]);
  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  return (
    <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <RequestStatusBox
                iconName="key"
                status="info"
                title="รอให้กุญแจ"
                number={1}
              />
                 <RequestStatusBox
                iconName="priority_high"
                status="error"
                title="เกินวันที่นัดหมาย"
                number={1}
              />
            </div>
            
      {requestData.length > 0 ? (
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
                  <span className="badge badge-brand badge-outline rounded-[50%]">
                    2
                  </span>
                </div>
              </button>
            </div>
          </div>
          <TableComponent data={keyHandOverData} columns={keyHandOverDataColumns} listName="keyhandover"/>
          <FilterKeyHandOverModal ref={filterModalRef} />
        </>
      ) : (
        <ZeroRecord
          imgSrc="/assets/img/empty/add_carpool.svg"
          title="สร้างคำขอใช้ยานพาหนะ"
          desc={<>ระบุข้อมูลการเดินทาง ค้นหายานพาหนะ และผู้ขับขี่</>}
          button="สร้างคำขอใช้"
          icon="add"
          link="process-one"
        />
      )}
    </>
  );

}
