import React, { useEffect, useRef, useState } from "react";
import ZeroRecord from "@/components/zeroRecord";
import { useRouter } from "next/navigation";
import RequestListTable from "@/components/table/request-list-table";
import { RequestListType, summaryType } from "@/app/types/request-list-type";
import { requests } from "@/services/bookingUser";
import Paginationselect from "@/components/table/paginationSelect";
import FilterModal from "@/components/modal/filterModal";
import dayjs from "dayjs";
import FilterCancelModal from "@/components/modal/filterCancelModal";

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export default function CancelFlow() {
  const [filterDate, setFilterDate] = useState<string>("");
  const [params, setParams] = useState({
    search: "",
    vehicle_owner_dept: "",
    ref_request_status_code: "90",
    startdate: "",
    enddate: "",
    car_type: "",
    category_code: "",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [dataRequest, setDataRequest] = useState<RequestListType[]>([]);

  const handlePageChange = (newPage: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: newPage,
    }));
  };

  const handleFilterSubmit = ({
    selectedStartDate,
    selectedEndDate,
  }: {
    selectedStartDate: string;
    selectedEndDate: string;
  }) => {
    const date = selectedStartDate + " - " + selectedEndDate;

    if (selectedStartDate && selectedEndDate) {
      setFilterDate(date);
    }

    setParams((prevParams) => ({
      ...prevParams,
      startdate:
        selectedStartDate &&
        dayjs(selectedStartDate).subtract(543, "year").format("YYYY-MM-DD"),
      enddate:
        selectedEndDate &&
        dayjs(selectedEndDate).subtract(543, "year").format("YYYY-MM-DD"),
    }));
  };

  const removeFilter = (filterType: string) => {
    if (filterType === "date") {
      setFilterDate("");
      setParams((prevParams) => ({
        ...prevParams,
        startdate: "",
        enddate: "",
      }));
    }
  };

  const handleClearAllFilters = () => {
    setParams({
      search: "",
      vehicle_owner_dept: "",
      ref_request_status_code: "90",
      startdate: "",
      enddate: "",
      car_type: "",
      category_code: "",
      page: 1,
      limit: 10,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (newLimit: string | number) => {
    const limit =
      typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit; // Convert to number if it's a string
    setParams((prevParams) => ({
      ...prevParams,
      limit,
      page: 1, // Reset to the first page when page size changes
    }));
  };


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requests(params);
        if (response.status === 200) {
          const requestList = response.data.requests;
          const { total, totalPages } = response.data.pagination;
          setDataRequest(requestList);
          setPagination({
            limit: params.limit,
            page: params.page,
            total,
            totalPages,
          });
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [params]);

  return (
    <>
      <div className="flex justify-between items-center mt-5">
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
              className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] hidden md:block"
              onClick={() => filterModalRef.current?.openModal()}
            >
              <div className="flex items-center gap-1">
                <i className="material-symbols-outlined">filter_list</i>
                ตัวกรอง
              </div>
            </button>
          </div>
      </div>

      {dataRequest?.length > 0 ? (
        <>
          <div className="mt-2">
            <RequestListTable
              defaultData={dataRequest}
              pagination={pagination}
            />
          </div>

          <div className="flex justify-between items-center mt-5 dt-bottom">
            <div className="flex items-center gap-2">
              <div className="dt-info" aria-live="polite" role="status">
                แสดง{" "}
                {Math.min(
                  pagination.page * pagination.limit - pagination.limit + 1,
                  pagination.total
                )}{" "}
                ถึง{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                จาก {pagination.total} รายการ
              </div>

              <Paginationselect
                w="w-[5em]"
                position="top"
                options={["10", "25", "50", "100"]}
                value={pagination.limit}
                onChange={(value) => handlePageSizeChange(value)}
              />
            </div>

            <div className="pagination flex justify-end">
              <div className="join">
                <button
                  className="join-item btn btn-sm btn-outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <i className="material-symbols-outlined">chevron_left</i>
                </button>

                {Array.from(
                  { length: pagination.totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    className={`join-item btn btn-sm btn-outline ${
                      pagination.page === page
                        ? "active !bg-primary-grayBorder"
                        : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="join-item btn btn-sm btn-outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  <i className="material-symbols-outlined">chevron_right</i>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <ZeroRecord
          imgSrc="/assets/img/empty/search_not_found.png"
          title="ไม่พบข้อมูล"
          desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
          button="ล้างตัวกรอง"
          displayBtn={true}
          btnType="secondary"
          useModal={handleClearAllFilters}
        />
      )}
      <FilterCancelModal ref={filterModalRef} onSubmitFilter={handleFilterSubmit} />
    </>
  );
}