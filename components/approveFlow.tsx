import React, { useRef } from "react";
import ZeroRecord from "./zeroRecord";
import FilterModal from "@/components/modal/filterModal";
import { useRouter } from "next/navigation";
import RequestListTable from "@/components/table/request-list-table";
import { RequestListType } from "@/app/types/request-list-type";

interface ApproveFlowProps {
  data: RequestListType[];
}


export default function ArpproveFlow({ data }: ApproveFlowProps) {
  // const [requestData, setRequestData] = useState<RequestData[]>([]);
  const router = useRouter();
  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const addNewRequest = () => {
    localStorage.removeItem('formData');
    router.push('/vehicle-booking/process-one');
  }


  return (
    <>
      {data?.length > 0 ? (
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
              <button
                onClick={addNewRequest}
                className="btn btn-primary h-[40px] min-h-[40px]"
              >
                <i className="material-symbols-outlined">add</i>
                สร้างคำขอใช้
              </button>
            </div>
          </div>
          {/* <TableComponent
            data={data}
            columns={columns}
          /> */}
          <RequestListTable defaultData={data} />
          <FilterModal ref={filterModalRef} />
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
