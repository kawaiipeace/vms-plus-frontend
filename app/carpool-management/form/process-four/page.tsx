"use client";

import { PaginationType } from "@/app/types/request-action-type";
import Header from "@/components/header";
import ProcessCreateCarpool from "@/components/processCreateCarpool";
import SideBar from "@/components/sideBar";
import PaginationControls from "@/components/table/pagination-control";
import { useSidebar } from "@/contexts/sidebarContext";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import AddCarpoolVehicleModal from "@/components/modal/addCarpoolVehicleModal";
import CarpoolVehicleTable from "@/components/table/carpool-vehicle-table";
import ConfirmSkipStepCarpoolModal from "@/components/modal/confirmSkipStepCarpoolModal";
import ConfirmCancelCreateCarpoolModal from "@/components/modal/confirmCancelCreateCarpoolModal";
import { useFormContext } from "@/contexts/carpoolFormContext";
import {
  getCarpoolVehicleSearch,
  putCarpoolSetActive,
} from "@/services/carpoolManagement";
import CarpoolManagementTabs from "@/components/tabs/carpoolManagemntTabs";

export default function CarpoolProcessFour() {
  const { isPinned } = useSidebar();
  const router = useRouter();
  const id = useSearchParams().get("id");
  const name = useSearchParams().get("name");
  const active = useSearchParams().get("active");
  const [refetch, setRefetch] = useState(false);

  const { formData } = useFormContext();

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
  const skipStepModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const cancelCreateModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useEffect(() => {
    if (refetch) {
      fetchCarpoolVehicleSearchFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  useEffect(() => {
    if (!id) {
      if (formData.mas_carpool_uid) fetchCarpoolVehicleSearchFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    if (id) {
      fetchCarpoolVehicleSearchFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCarpoolVehicleSearchFunc = async (newPagination?: any) => {
    try {
      const response = await getCarpoolVehicleSearch(
        id || formData.mas_carpool_uid,
        {
          ...newPagination,
          ...pagination,
        }
      );
      const result = response.data;
      setData(result.vehicles);
      setRefetch(false);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchCarpoolVehicleSearchFunc({
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
    fetchCarpoolVehicleSearchFunc({
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
          "/carpool-management/form/process-four?id=" +
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
              <CarpoolManagementTabs active={3} />
            ) : (
              <ProcessCreateCarpool step={4} />
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
                        addCarpoolVehicleModalRef.current?.openModal()
                      }
                    >
                      <i className="material-symbols-outlined">add</i>
                      เพิ่ม
                    </button>
                  </div>
                </div>

                <CarpoolVehicleTable
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
                    src="/assets/img/carpool/add-vehicle.png"
                    width={100}
                    height={100}
                    alt=""
                    className="w-[200px] h-[200px]"
                  ></Image>
                  <div className="emptystate-title">เพิ่มยานพาหนะ</div>
                  <div className="emptystate-text">
                    <div>ยานพาหนะที่จะให้บริการในกลุ่มนี้</div>
                  </div>
                  <div className="emptystate-action">
                    {!id && (
                      <button
                        onClick={() => skipStepModalRef.current?.openModal()}
                        className="btn btn-secondary"
                      >
                        ข้าม
                      </button>
                    )}

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
              setRefetch={setRefetch}
            />

            <ConfirmSkipStepCarpoolModal
              ref={skipStepModalRef}
              id={""}
              title={"ข้ามขั้นตอนนี้"}
              desc={
                <>
                  <div>คุณหรือผู้ดูแลยานพาหนะประจำกลุ่ม</div>
                  <div>สามารถเพิ่มข้อมูลนี้ได้ภายหลัง</div>
                </>
              }
              confirmText={"ข้าม"}
              route="/carpool-management/form/process-five"
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
                  onClick={() =>
                    router.push("/carpool-management/form/process-five")
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
