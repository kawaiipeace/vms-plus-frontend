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
import { getCarpoolVehicleSearch } from "@/services/carpoolManagement";

export default function CarpoolProcessFour() {
  const { isPinned } = useSidebar();
  const router = useRouter();
  const id = useSearchParams().get("id");
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
  }, [refetch]);

  useEffect(() => {
    if (!id) {
      if (formData.mas_carpool_uid) fetchCarpoolVehicleSearchFunc();
    }
  }, [formData]);

  const fetchCarpoolVehicleSearchFunc = async (newPagination?: any) => {
    try {
      const response = await getCarpoolVehicleSearch(formData.mas_carpool_uid, {
        ...newPagination,
        ...pagination,
      });
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

            <ProcessCreateCarpool step={4} />

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
                    <button
                      onClick={() => skipStepModalRef.current?.openModal()}
                      className="btn btn-secondary"
                    >
                      ข้าม
                    </button>

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
              title={"คุณแน่ใจที่จะยกเลิกการสร้างกลุ่ม?"}
              desc={"หากยกเลิก การกรอกข้อมูลทั้งหมดจะไม่ถูกบันทึกไว้"}
              confirmText={"ยกเลิกการสร้างกลุ่ม"}
            />

            {data.length > 0 && (
              <div className="form-action">
                <button
                  onClick={() =>
                    router.push("/carpool-management/form/process-three")
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
