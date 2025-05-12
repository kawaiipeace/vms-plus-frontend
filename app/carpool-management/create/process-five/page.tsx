"use client";

import { PaginationType } from "@/app/types/request-action-type";
import Header from "@/components/header";
import ProcessCreateCarpool from "@/components/processCreateCarpool";
import SideBar from "@/components/sideBar";
import { useSidebar } from "@/contexts/sidebarContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";
import PaginationControls from "@/components/table/pagination-control";
import AddCarpoolDriverModal from "@/components/modal/addCarpoolDriverModal";
import CarpoolDriverTable from "@/components/table/carpool-driver-table";
import ConfirmCreateCarpoolModal from "@/components/modal/confirmCreateCarpoolModal";

export default function CarpoolProcessFive() {
  const { isPinned } = useSidebar();
  const router = useRouter();

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const addCarpoolDriverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const addCarpoolConfirmModalRef = useRef<{
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

            <ProcessCreateCarpool step={5} />

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

                <CarpoolDriverTable defaultData={[]} pagination={pagination} />

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
                    src="/assets/img/carpool/add-driver.png"
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
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        addCarpoolConfirmModalRef.current?.openModal()
                      }
                    >
                      สร้างกลุ่มเลย
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        addCarpoolDriverModalRef.current?.openModal()
                      }
                    >
                      <i className="material-symbols-outlined">add</i>
                      เพิ่ม
                    </button>
                  </div>
                </div>
              </div>
            )}
            <AddCarpoolDriverModal
              ref={addCarpoolDriverModalRef}
              id={""}
              title={""}
              desc={""}
              confirmText={""}
            />
            <ConfirmCreateCarpoolModal
              ref={addCarpoolConfirmModalRef}
              id={"ยืนยันสร้างกลุ่มยานพาหนะ"}
              title={"ยืนยันสร้างกลุ่มยานพาหนะ"}
              desc={
                "คุณหรือผู้ดูแลยานพาหนะประจำกลุ่มสามารถตั้งค่ากลุ่มและจัดการข้อมูลได้ภายหลังคุณต้องการสร้างกลุ่ม กลุ่ม กอพ.1 ใช่หรือไม่"
              }
              confirmText={"สร้างกลุ่ม"}
            />
            {/* <RequestForm /> */}

            {data.length > 0 && (
              <div className="form-action">
                <button
                  onClick={() => addCarpoolConfirmModalRef.current?.openModal()}
                  className="btn btn-primary"
                >
                  สร้างกลุ่ม
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
