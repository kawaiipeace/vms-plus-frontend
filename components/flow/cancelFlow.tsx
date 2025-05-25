import { RequestListType } from "@/app/types/request-list-type";
import RequestListTable from "@/components/table/request-list-table";
import ZeroRecord from "@/components/zeroRecord";
import { requests } from "@/services/bookingUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useEffect, useRef, useState } from "react";
import FilterModal from "../modal/filterModal";
import PaginationControls from "../table/pagination-control";
import ListFlow from "./listFlow";

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
    const date =
      convertToBuddhistDateTime(selectedStartDate).date + " - " + convertToBuddhistDateTime(selectedEndDate).date;

    if (selectedStartDate && selectedEndDate) {
      setFilterDate(date);
    }

    setParams((prevParams) => ({
      ...prevParams,
      startdate: selectedStartDate,
      enddate: selectedEndDate,
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
    const limit = typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit; // Convert to number if it's a string
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
    <div className="flex flex-col gap-4">
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
            className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] block"
            onClick={() => filterModalRef.current?.openModal()}
          >
            <div className="flex items-center gap-1">
              <i className="material-symbols-outlined">filter_list</i>
              ตัวกรอง
            </div>
          </button>
        </div>
      </div>

      <div className="mt-3">
        {filterDate && (
          <span className="badge badge-brand badge-outline rounded-sm mr-2">
            {filterDate}
            <i className="material-symbols-outlined cursor-pointer" onClick={() => removeFilter("date")}>
              close_small
            </i>
          </span>
        )}
      </div>

      {dataRequest?.length > 0 && (
        <>
          <div className="hidden md:block">
            <div className="mt-2">
              <RequestListTable defaultData={dataRequest} pagination={pagination} />
            </div>
          </div>

          <div className="block md:hidden">
            <ListFlow requestData={dataRequest} />
          </div>

          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      {dataRequest !== null && pagination.total > 0 && (
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

      {pagination.total <= 0 && (
        <ZeroRecord
          imgSrc="/assets/img/graphic/empty.svg"
          title="ไม่มีคำขอใช้ที่ถูกยกเลิก"
          desc={<>รายการคำขอใช้ยานพาหนะที่ถูกยกเลิกจะแสดงที่นี่</>}
          button="สร้างคำขอใช้"
          displayBtn={false}
        />
      )}
      <FilterModal ref={filterModalRef} onSubmitFilter={handleFilterSubmit} />
    </div>
  );
}
