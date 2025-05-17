"use client";

import { PaginationType } from "@/app/types/request-action-type";
import Header from "@/components/header";
import AddCarpoolAdminModal from "@/components/modal/addCarpoolAdminModal";
import ConfirmCancelCreateCarpoolModal from "@/components/modal/confirmCancelCreateCarpoolModal";
import ProcessCreateCarpool from "@/components/processCreateCarpool";
import SideBar from "@/components/sideBar";
import CarpoolAdminTable from "@/components/table/carpool-admin-table";
import PaginationControls from "@/components/table/pagination-control";
import ZeroRecord from "@/components/zeroRecord";
import { useFormContext } from "@/contexts/carpoolFormContext";
import { useSidebar } from "@/contexts/sidebarContext";
import { getCarpoolAdminSearch } from "@/services/carpoolManagement";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function CarpoolProcessTwo() {
  const { isPinned } = useSidebar();
  const adminCreated = useSearchParams().get("admin-created");
  const id = useSearchParams().get("id");

  const { formData } = useFormContext();

  const router = useRouter();

  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const addCarpoolAdminModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const cancelCreateModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useEffect(() => {
    if (adminCreated) {
      fetchCarpoolAdminSearchFunc();
    }
  }, [adminCreated]);

  const fetchCarpoolAdminSearchFunc = async () => {
    try {
      const response = await getCarpoolAdminSearch(formData.mas_carpool_uid);
      const result = response.data;
      setData(result);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  };

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
                    <Link href="/carpool-management">กลุ่มยานพาหนะ</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    สร้างกลุ่มยานพาหนะ
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title justify-between">
                  <span className="page-title-label">สร้างกลุ่มยานพาหนะ</span>
                  <span
                    className="text-icon-error cursor-pointer"
                    onClick={() => cancelCreateModalRef.current?.openModal()}
                  >
                    ยกเลิก
                  </span>
                  {/* <!-- <span className="badge badge-outline badge-gray">95 กลุ่ม</span> --> */}
                </div>
              </div>
            </div>
            <ProcessCreateCarpool step={2} />

            {data.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <div className="page-section-header border-0 !pb-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">
                          ผู้ดูแลยานพาหนะ
                        </span>
                        <span className="badge badge-outline badge-gray !rounded">
                          3 คน
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

                <CarpoolAdminTable defaultData={data} pagination={pagination} />

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
              <ZeroRecord
                imgSrc="/assets/img/carpool/add-admin.png"
                title="เพิ่มผู้ดูแลยานพาหนะ"
                desc={
                  <>
                    <div>ผู้ดูแลมีหน้าที่จัดการกลุ่ม ตรวจสอบคำขอ ให้กุญแจ</div>
                    <div>และตรวจสอบยานพาหนะหลังเสร็จสิ้นการใช้งาน</div>
                  </>
                }
                icon="add"
                button={"เพิ่ม"}
                displayBtn={true}
                btnType="primary"
                classNameImg="w-[200px] h-[200px]"
                useModal={() => addCarpoolAdminModalRef.current?.openModal()}
              />
            )}

            <AddCarpoolAdminModal
              ref={addCarpoolAdminModalRef}
              id={""}
              title={""}
              desc={""}
              confirmText={""}
            />

            <ConfirmCancelCreateCarpoolModal
              id={""}
              ref={cancelCreateModalRef}
              title={"คุณแน่ใจที่จะยกเลิกการสร้างกลุ่ม?"}
              desc={"หากยกเลิก การกรอกข้อมูลทั้งหมดจะไม่ถูกบันทึกไว้"}
              confirmText={"ยกเลิกการสร้างกลุ่ม"}
            />
            {/* <RequestForm /> */}

            {data.length > 0 && (
              <div className="form-action">
                <button
                  onClick={() =>
                    router.push("/carpool-management/form/process-four")
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
          </div>
        </div>
      </div>
    </div>
  );
}
