import React, { useState, useRef, useEffect, Suspense } from "react";
import { TravelData } from "@/data/travelData";
import ZeroRecord from "@/components/zeroRecord";
import PaginationControls from "../table/pagination-control";
import { fetchTravelDetailTrips } from "@/services/adminService";
import TravelListTable from "../table/travel-list-table";
import { useSearchParams } from "next/navigation";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import ToastCustom from "../toastCustom";
import RecordTravelAddModal from "../modal/recordTravelAddModal";

interface TravelDataProps {
  requestType?: string;
  reqId?: string;
}

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

function RequestListContent({ role }: { role: string }) {
  const searchParams = useSearchParams();
  const createReq = searchParams.get("create-travel-req");
  const updateReq = searchParams.get("update-travel-req");
  const deleteReq = searchParams.get("delete-travel-req");
  const dateTime = searchParams.get("date-time");

  const formatDateTime = convertToBuddhistDateTime(dateTime || "");

  return (
    <>
      {createReq === "success" && (
        <ToastCustom
          title="เพิ่มข้อมูลการเดินทางสำเร็จ"
          desc={<>เพิ่มข้อมูลการเดินทางวันที่ {formatDateTime.date}  <br></br>เรียบร้อยแล้ว</>}
          status="success"
          styleText="!mx-auto"
          searchParams={
            role === "admin"
              ? "activeTab=ข้อมูลการเดินทาง"
              : "progressType=บันทึกการเดินทาง"
          }
        />
      )}

      {updateReq === "success" && (
        <ToastCustom
          title="แก้ไขข้อมูลการเดินทางสำเร็จ"
          desc={`ข้อมูลเดินทางวันที่ ${formatDateTime.date} ได้รับการแก้ไขเรียบร้อย`}
          status="success"
          styleText="!mx-auto"
          searchParams={
            role === "admin"
              ? "activeTab=ข้อมูลการเดินทาง"
              : "progressType=บันทึกการเดินทาง"
          }
        />
      )}

      {deleteReq === "success" && (
        <ToastCustom
          title="ลบข้อมูลการเดินทางสำเร็จ"
          desc={`ข้อมูลเดินทางวันที่ ${dateTime} ถูกลบเรียบร้อย`}
          status="success"
          styleText="!mx-auto"
          searchParams={
            role === "admin" 
              ? "activeTab=ข้อมูลการเดินทาง"
              : "progressType=บันทึกการเดินทาง"
          }
        />
      )}
    </>
  );
}

export default function TravelInfoTab({ requestType, reqId }: TravelDataProps) {
  const [data, setData] = useState<TravelData[]>([]);

  const recordTravelAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [params, setParams] = useState({
    search: "",
  });

  const [pagination, setPagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (reqId) {
      const fetchRequestsData = async () => {
        try {
          const response = await fetchTravelDetailTrips(reqId, params.search);
          if (response.status === 200) {
            const requestList = response.data;
            setData(requestList);
            setPagination({
              limit: 100,
              page: 1,
              total: 1,
              totalPages: 1,
            });
          }
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      };

      fetchRequestsData();
    }
  }, [params]);

  const handlePageChange = (newPage: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: newPage,
    }));
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
  }, [data]);

  return (
    <>
      {data.length > 0 ? (
        <>
          <div>
            <h4 className="font-bold text-xl">
              <span className="border-l-4 border-[#A80689] rounded-xl mr-4" />
              ข้อมูลการเดินทาง
            </h4>
            <div className="flex w-full my-4">
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
                  placeholder="ค้นหาสถานที่"
                />
              </div>
              {requestType === "เสร็จสิ้น" && (
                <button
                  className="btn btn-secondary ml-auto"
                  onClick={() => recordTravelAddModalRef.current?.openModal()}
                >
                  <i className="material-symbols-outlined">add</i>
                  เพิ่มข้อมูล
                </button>
              )}
            </div>
          </div>
          <div>
            <TravelListTable defaultData={data} pagination={pagination} />
            <PaginationControls
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />

            <Suspense fallback={<div></div>}>
              <RequestListContent role={"admin"} />
            </Suspense>
          </div>
        </>
      ) : (
        <ZeroRecord
          imgSrc="/assets/img/graphic/record_travel_img.svg"
          title="เพิ่มข้อมูลการเดินทาง"
          desc={
            <>
              ระบุข้อมูลวันที่และเวลาเดินทาง เลขไมล์
              สถานที่จากต้นทางและถึงปลายทาง
            </>
          }
          button="เพิ่มข้อมูล"
          icon="add"
          link="process-one"
          displayBtn={true}
          useModal={() => {
            recordTravelAddModalRef.current?.openModal()}
          }
        />
      )}
         <RecordTravelAddModal
          ref={recordTravelAddModalRef}
          status={false}
          role="admin"
          requestId={reqId}
        />
    </>
  );
}
