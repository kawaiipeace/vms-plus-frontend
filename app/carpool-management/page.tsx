"use client";

import SideBar from "@/components/sideBar";
import PaginationControls from "@/components/table/pagination-control";
import { useSidebar } from "@/contexts/sidebarContext";
import { useEffect, useRef, useState } from "react";
import { Carpool, CarpoolParams } from "../types/carpool-management-type";
import { carpoolManagementSearch } from "@/services/carpoolManagement";
import { PaginationType } from "../types/request-action-type";
import CarpoolManagementTable from "@/components/table/carpool-management-table";
import ZeroRecord from "@/components/zeroRecord";
import FilterCarpoolModal from "@/components/modal/filterCarpool";
import { useRouter } from "next/navigation";
import Header from "@/components/header";

export default function CarpoolManagement() {
  const [params, setParams] = useState<CarpoolParams>({});
  const [data, setData] = useState<Carpool[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const router = useRouter();
  const { isPinned } = useSidebar();

  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useEffect(() => {
    const fetchCarpoolManagementSearchFunc = async () => {
      try {
        const response = await carpoolManagementSearch(params);
        const result = response.data;
        setData(result.carpools ?? []);
        setPagination({ ...result?.pagination });
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    fetchCarpoolManagementSearchFunc();
  }, [params]);

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

  const handleClearAllFilters = () => {};

  const isSearch = !!params.search;

  return (
    <>
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
                  <li className="breadcrumb-item active" aria-current="page">
                    <a>กลุ่มยานพาหนะ</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">กลุ่มยานพาหนะ</span>
                  <span className="badge badge-outline badge-gray !rounded">
                    95 กลุ่ม
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full">
              {(!!data.length || isSearch) && (
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-5">
                    <div className="block">
                      <div className="input-group input-group-search hidden">
                        <div className="input-group-prepend">
                          <span className="input-group-text search-ico-info">
                            <i className="material-symbols-outlined">search</i>
                          </span>
                        </div>
                        <input
                          type="text"
                          id="myInputTextField"
                          className="form-control dt-search-input !w-60"
                          placeholder="ชื่อกลุ่มยานพาหนะ, ผู้รับผิดชอบหลัก"
                          value={params.search}
                          onChange={(e) =>
                            setParams((prevParams) => ({
                              ...prevParams,
                              search: e.target.value,
                              page: 1, // Reset to page 1 on search
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] block"
                        onClick={() => filterModalRef.current?.openModal()}
                      >
                        <div className="flex items-center gap-1">
                          <i className="material-symbols-outlined">
                            filter_list
                          </i>
                          ตัวกรอง
                        </div>
                      </button>
                      <button
                        className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] block"
                        // onClick={() => filterModalRef.current?.openModal()}
                      >
                        <div className="flex items-center gap-1">
                          <i className="material-symbols-outlined">download</i>
                          Export
                        </div>
                      </button>
                      <button
                        onClick={() =>
                          router.push("/carpool-management/form/process-one")
                        }
                        className="btn btn-primary h-[40px] min-h-[40px] hidden md:block"
                      >
                        <i className="material-symbols-outlined">add</i>
                        สร้างกลุ่ม
                      </button>
                    </div>
                  </div>

                  {!data.length ? (
                    <ZeroRecord
                      imgSrc="/assets/img/empty/search_not_found.png"
                      title="ไม่พบข้อมูล"
                      desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
                      button="ล้างตัวกรอง"
                      displayBtn={true}
                      btnType="secondary"
                      classNameImg="w-[200px] h-[200px]"
                      useModal={handleClearAllFilters}
                    />
                  ) : (
                    <div>
                      <CarpoolManagementTable
                        defaultData={data}
                        pagination={pagination}
                      />

                      <PaginationControls
                        pagination={{
                          limit: pagination.limit,
                          page: pagination.page,
                          totalPages: 1,
                          total: 10,
                        }}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                      />
                    </div>
                  )}
                </div>
              )}

              {!data.length && !isSearch && (
                <ZeroRecord
                  imgSrc="/assets/img/carpool/empty.png"
                  title="ไม่มีกลุ่มยานพาหนะ"
                  desc={<>เริ่มสร้างกลุ่มยานพาหนะกลุ่มแรก</>}
                  button="สร้างกลุ่ม"
                  icon="add"
                  displayBtn={true}
                  btnType="primary"
                  classNameImg="w-[200px] h-[200px]"
                  useModal={() => () =>
                    router.push("/carpool-management/form/process-one")}
                />
              )}
              <FilterCarpoolModal ref={filterModalRef} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
