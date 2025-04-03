import React, { ReactNode, useRef } from "react";
import TableComponent from "./table";
import { RequestData } from "@/data/requestData";
import ZeroRecord from "./zeroRecord";
import Link from "next/link";
import FilterModal from "@/components/modal/filterModal";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import router from "next/router";

interface ApproveFlowProps {
  data: RequestData[];
}

const columns: ColumnDef<RequestData>[] = [
  {
    header: "เลขที่คำขอ",
    accessorFn: (row) => `${row.request_no}`,
  },
  {
    header: "ผู้ใช้ยานพาหนะ",
    accessorFn: (row) => `${row.vehicle_user_emp_name} (${row.vehicle_user_dept_sap && ""})`,
    enableSorting: false
  },
  {
    header: "ยานพาหนะ",
    accessorFn: (row) => `${row.vehicle_license_plate}`,
    enableSorting: false
  },
  {
    header: "สถานที่ปฏิบัติงาน",
    accessorFn: (row) => `${row.work_place}`,
    enableSorting: false
  },
  {
    header: "วันที่เดินทาง",
    accessorFn: (row) => `${row.start_datetime} ${row.end_datetime}`,
   
  },
  {
    header: "สถานะคำขอ",
    accessorFn: (row) => `${row.ref_request_status_name}`,
    enableSorting: false,
  },
  // {
  //   header: "",
  //   accessorFn: (row) => `${row.ref_request_status_name}`,
  //   enableSorting: false,
  // },
];

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
          <TableComponent
            data={data}
            columns={columns}
          />
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
