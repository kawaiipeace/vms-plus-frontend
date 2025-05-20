"use client";

import { PaginationType } from "@/app/types/request-action-type";
import Header from "@/components/header";
import ProcessCreateCarpool from "@/components/processCreateCarpool";
import SideBar from "@/components/sideBar";
import { useSidebar } from "@/contexts/sidebarContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PaginationControls from "@/components/table/pagination-control";
import AddCarpoolDriverModal from "@/components/modal/addCarpoolDriverModal";
import CarpoolDriverTable from "@/components/table/carpool-driver-table";
import ConfirmCreateCarpoolModal from "@/components/modal/confirmCreateCarpoolModal";
import ConfirmCancelCreateCarpoolModal from "@/components/modal/confirmCancelCreateCarpoolModal";
import { useFormContext } from "@/contexts/carpoolFormContext";
import {
  getCarpoolDriverSearch,
  putCarpoolSetActive,
} from "@/services/carpoolManagement";
import CarpoolManagementTabs from "@/components/tabs/carpoolManagemntTabs";

export default function CarpoolProcessFive() {
  const { isPinned } = useSidebar();
  const id = useSearchParams().get("id");
  const name = useSearchParams().get("name");
  const active = useSearchParams().get("active");
  const [refetch, setRefetch] = useState(false);
  const router = useRouter();

  const { formData } = useFormContext();

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
  const cancelCreateModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useEffect(() => {
    if (refetch) {
      fetchCarpoolDriverSearchFunc();
    }
  }, [refetch]);

  useEffect(() => {
    if (!id) {
      if (formData.mas_carpool_uid) fetchCarpoolDriverSearchFunc();
    }
  }, [formData]);

  useEffect(() => {
    if (id) {
      fetchCarpoolDriverSearchFunc();
    }
  }, []);

  const fetchCarpoolDriverSearchFunc = async (newPagination?: any) => {
    try {
      const response = await getCarpoolDriverSearch(
        id || formData.mas_carpool_uid,
        {
          ...newPagination,
          ...pagination,
        }
      );
      const result = response.data;
      setData(result.drivers);
      setRefetch(false);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchCarpoolDriverSearchFunc({
      ...pagination,
      page: newPage,
    });
    setPagination((prevParams) => ({
      ...prevParams,
      page: newPage,
    }));
  };

  const handlePageSizeChange = (newLimit: string | number) => {
    const limit =
      typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit; // Convert to number if it's a string
    fetchCarpoolDriverSearchFunc({
      ...pagination,
      limit,
      page: 1,
    });
    setPagination((prevParams) => ({
      ...prevParams,
      limit,
      page: 1, // Reset to the first page when page size changes
    }));
  };

  const handleActive = async () => {
    try {
      const response = await putCarpoolSetActive(
        id as string,
        active === "1" ? "0" : "1"
      );
      if (response.request.status === 200) {
        router.push(
          "/carpool-management/form/process-five?id=" +
            id +
            "&name=" +
            name +
            "&active=" +
            (active === "1" ? "0" : "1")
        );
      }
    } catch (error) {
      console.log(error);
    }
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
                  <div className="flex gap-6 items-center">
                    <span className="page-title-label">
                      {id ? name : "สร้างกลุ่มยานพาหนะ"}
                    </span>
                    {id &&
                      (active === "1" ? (
                        <div className="w-fit flex items-center gap-[6px] px-2 py-[3px] border border-primary-grayBorder rounded">
                          <div className="w-[6px] h-[6px] rounded-full bg-success" />
                          <span>เปิด</span>
                        </div>
                      ) : (
                        <div className="w-fit flex items-center gap-[6px] px-2 py-[3px] border border-primary-grayBorder rounded">
                          <div className="w-[6px] h-[6px] rounded-full bg-icon-error" />
                          <span>ปิด</span>
                        </div>
                      ))}
                  </div>
                  <div className="flex items-center gap-6">
                    <span
                      className={
                        active === "1"
                          ? "text-[#98A2B3]"
                          : "text-icon-error cursor-pointer"
                      }
                      onClick={() =>
                        active === "1"
                          ? {}
                          : cancelCreateModalRef.current?.openModal()
                      }
                    >
                      {id ? "ลบกลุ่ม" : "ยกเลิก"}
                    </span>
                    {/* <!-- <span className="badge badge-outline badge-gray">95 กลุ่ม</span> --> */}
                    {id && (
                      <div className="custom-group">
                        <div className="custom-control custom-checkbox custom-control-inline !gap-2">
                          <input
                            type="checkbox"
                            checked={active === "1"}
                            onClick={handleActive}
                            className="toggle border-[#D0D5DD] [--tglbg:#D0D5DD] text-white checked:border-[#A80689] checked:[--tglbg:#A80689] checked:text-white"
                          />
                          <label className="custom-control-label !w-fit">
                            <div className="custom-control-label-group">
                              {active === "1" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {id ? (
              <CarpoolManagementTabs active={4} />
            ) : (
              <ProcessCreateCarpool step={5} />
            )}

            {data.length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <div className="page-section-header border-0 !pb-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">ยานพาหนะ</span>
                        <span className="badge badge-outline badge-gray !rounded">
                          {pagination.total} คัน
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      className="btn btn-secondary w-full"
                      onClick={() =>
                        addCarpoolDriverModalRef.current?.openModal()
                      }
                    >
                      <i className="material-symbols-outlined">add</i>
                      เพิ่ม
                    </button>
                  </div>
                </div>

                <CarpoolDriverTable
                  defaultData={data}
                  pagination={pagination}
                  setRefetch={setRefetch}
                />

                <PaginationControls
                  pagination={{
                    limit: pagination.limit,
                    page: pagination.page,
                    totalPages: pagination.totalPages,
                    total: pagination.total,
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
                    {!id && (
                      <button
                        className="btn btn-secondary"
                        onClick={() =>
                          addCarpoolConfirmModalRef.current?.openModal()
                        }
                      >
                        สร้างกลุ่มเลย
                      </button>
                    )}

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
              setRefetch={setRefetch}
            />

            <ConfirmCreateCarpoolModal
              ref={addCarpoolConfirmModalRef}
              id={"ยืนยันสร้างกลุ่มยานพาหนะ"}
              title={"ยืนยันสร้างกลุ่มยานพาหนะ"}
              desc={
                "คุณหรือผู้ดูแลยานพาหนะประจำกลุ่มสามารถตั้งค่ากลุ่มและจัดการข้อมูลได้ภายหลังคุณต้องการสร้างกลุ่ม " +
                name +
                " ใช่หรือไม่"
              }
              confirmText={"สร้างกลุ่ม"}
            />

            <ConfirmCancelCreateCarpoolModal
              id={""}
              ref={cancelCreateModalRef}
              title={
                id
                  ? "ยืนยันลบกลุ่มยานพาหนะ"
                  : "คุณแน่ใจที่จะยกเลิกการสร้างกลุ่ม?"
              }
              desc={
                id
                  ? "ระบบจะนำยานพาหนะและพนักงานขับรถออกจากการให้บริการของกลุ่มโดยอัตโนมัติคุณต้องการลบ " +
                    name +
                    " ใช่หรือไม่?"
                  : "หากยกเลิก การกรอกข้อมูลทั้งหมดจะไม่ถูกบันทึกไว้"
              }
              confirmText={id ? "ลบกลุ่ม" : "ยกเลิกการสร้างกลุ่ม"}
              remove={!!id}
            />

            {data.length > 0 && !id && (
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
          </div>
        </div>
      </div>
    </div>
  );
}
