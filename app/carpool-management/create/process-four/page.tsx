"use client";

import { PaginationType } from "@/app/types/request-action-type";
import Header from "@/components/header";
import ProcessCreateCarpool from "@/components/processCreateCarpool";
import SideBar from "@/components/sideBar";
import PaginationControls from "@/components/table/pagination-control";
import { useSidebar } from "@/contexts/sidebarContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import AddCarpoolVehicleModal from "@/components/modal/addCarpoolVehicleModal";
import CarpoolVehicleTable from "@/components/table/carpool-vehicle-table";

export default function CarpoolProcessFour() {
  const { isPinned } = useSidebar();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const addCarpoolVehicleModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const handlePageChange = (newPage: number) => {
    // setParams((prevParams) => ({
    //   ...prevParams,
    //   page: newPage,
    // }));
  };

  const handlePageSizeChange = (newLimit: string | number) => {
    // const limit =
    //   typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit; // Convert to number if it's a string
    // setParams((prevParams) => ({
    //   ...prevParams,
    //   limit,
    //   page: 1, // Reset to the first page when page size changes
    // }));
    // console.log(newLimit);
  };

  return (
    <div>
      <div className="main-container">
        <SideBar menuName="กลุ่มยานพาหนะ" />

        <div
          className={`main-content ${
            isPinned ? "md:pl-[280px]" : "md:pl-[80px]"
          }`}
        >
          <Header />
          <div className="main-content-body">
            <div className="page-header">
              <div className="breadcrumbs text-sm">
                <ul>
                  <li className="breadcrumb-item">
                    <a>
                      <i className="material-symbols-outlined">home</i>
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="carpool-management">กลุ่มยานพาหนะ</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    สร้างกลุ่มยานพาหนะ
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">สร้างกลุ่มยานพาหนะ</span>
                  {/* <!-- <span className="badge badge-outline badge-gray">95 กลุ่ม</span> --> */}
                </div>
              </div>
            </div>

            <ProcessCreateCarpool step={4} />

            {data.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <div className="page-section-header border-0 !pb-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">ยานพาหนะ</span>
                        <span className="badge badge-outline badge-gray !rounded">
                          3 คัน
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button className="btn btn-secondary w-full">
                      <i className="material-symbols-outlined">add</i>
                      เพิ่ม
                    </button>
                  </div>
                </div>

                <CarpoolVehicleTable defaultData={[]} pagination={pagination} />

                <PaginationControls
                  pagination={{
                    limit: pagination.limit,
                    page: pagination.page,
                    totalPages: 1,
                    total: 0,
                  }}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </>
            )}

            {data.length === 0 && (
              <div className="zerorecord">
                <div className="emptystate">
                  <Image
                    src="/assets/img/carpool/add-vehicle.png"
                    width={100}
                    height={100}
                    alt=""
                    className="w-[200px] h-[200px]"
                  ></Image>
                  <div className="emptystate-title">เพิ่มผู้อนุมัติ</div>
                  <div className="emptystate-text">
                    <div>ผู้อนุมัติมีหน้าที่อนุมัติการจองยานพาหนะ</div>
                    <div>และพนักงานขับรถในขั้นตอนสุดท้่าย</div>
                  </div>
                  <div className="emptystate-action">
                    <Link
                      href="/carpool-management/create/process-five"
                      className="btn btn-secondary"
                    >
                      ข้าม
                    </Link>

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        addCarpoolVehicleModalRef.current?.openModal()
                      }
                    >
                      <i className="material-symbols-outlined">add</i>
                      เพิ่ม
                    </button>
                  </div>
                </div>
              </div>
            )}
            <AddCarpoolVehicleModal
              ref={addCarpoolVehicleModalRef}
              id={""}
              title={""}
              desc={""}
              confirmText={""}
            />
            {/* <RequestForm /> */}

            {data.length > 0 && (
              <div className="form-action">
                <button
                  onClick={() =>
                    router.push("/carpool-management/create/process-three")
                  }
                  className="btn btn-primary"
                >
                  ต่อไป
                  <i className="material-symbols-outlined icon-settings-300-24">
                    arrow_right_alt
                  </i>
                </button>
              </div>
            )}
            {/* <RequestForm /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
