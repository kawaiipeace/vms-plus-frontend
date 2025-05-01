"use client";
import CancelRequestModal from "@/components/modal/cancelRequestModal";
import RecordTravelAddModal from "@/components/modal/recordTravelAddModal";
import ToastCustom from "@/components/toastCustom";
import { recordTravelDataColumns, RecordTravelTabProps } from "@/data/requestData";
import { fetchUserTravelDetails } from "@/services/vehicleInUseUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import TableRecordTravelComponent from "../tableRecordTravel";

function RequestListContent() {
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
          desc={`เพิ่มข้อมูลการเดินทางวันที่ ${formatDateTime.date} เรียบร้อยแล้ว`}
          status="success"
          styleText="!mx-auto"
          searchParams={"activeTab=ข้อมูลการเดินทาง"}
        />
      )}

      {updateReq === "success" && (
        <ToastCustom
          title="แก้ไขข้อมูลการเดินทางสำเร็จ"
          desc={`ข้อมูลเดินทางวันที่ ${formatDateTime.date} ได้รับการแก้ไขเรียบร้อย`}
          status="success"
          styleText="!mx-auto"
          searchParams={"activeTab=ข้อมูลการเดินทาง"}
        />
      )}

      {deleteReq === "success" && (
        <ToastCustom
          title="ลบข้อมูลการเดินทางสำเร็จ"
          desc={`ข้อมูลเดินทางวันที่ ${dateTime} ถูกลบเรียบร้อย`}
          status="success"
          styleText="!mx-auto"
          searchParams={"activeTab=ข้อมูลการเดินทาง"}
        />
      )}
    </>
  );
}
interface RecordTravelPageTabProps {
  requestId?: string;
}

const RecordTravelTab = ({ requestId }: RecordTravelPageTabProps) => {
  const searchParams = useSearchParams();
  const createReq = searchParams.get("create-travel-req");
  const updateReq = searchParams.get("update-travel-req");

  const [requestData, setRequestData] = useState<RecordTravelTabProps[]>([]);
  const [params, setParams] = useState({ search: "" });
  const [editData, setEditData] = useState<RecordTravelTabProps | undefined>();

  const recordTravelAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const recordTravelEditModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const cancelRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const fetchUserTravelDetailsFunc = useCallback(
    async () => {
      try {
        const response = await fetchUserTravelDetails(requestId || "", params);
        const sortedData = response.data.sort((a: RecordTravelTabProps, b: RecordTravelTabProps) => {
          const dateA = new Date(a.trip_start_datetime);
          const dateB = new Date(b.trip_start_datetime);
          return dateA.getTime() - dateB.getTime(); // Sort in descending order
        });
        setRequestData(sortedData);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    },
    [params, requestId] // Add requestId to the dependency array,
  );

  useEffect(() => {
    fetchUserTravelDetailsFunc();
  }, [requestId, params, fetchUserTravelDetailsFunc, createReq, updateReq]);

  return (
    <>
      <div className="w-full px-1">
        {requestData && requestData.length == 0 ? (
          <div className="grid grid-cols-1 gap-4 text-center">
            <div className="flex items-center justify-center w-[300px] h-[300px] mx-auto my-5 col-span-12">
              <Image src="/assets/img/graphic/record_travel_img.svg" width={900} height={900} alt="" />
            </div>
            <div className="col-span-12">
              <p className="font-bold text-2xl">เพิ่มข้อมูลการเดินทาง</p>
              <p>ระบุข้อมูลวันที่และเวลาเดินทาง เลขไมล์ สถานที่ี่จากต้นทางและถึงปลายทาง</p>
            </div>
            <div className="col-span-12">
              <button
                className="btn btn-primary w-full text-xl"
                onClick={() => {
                  setEditData(undefined);
                  recordTravelAddModalRef.current?.openModal();
                }}
              >
                <i className="material-symbols-outlined !text-3xl">add</i> เพิ่มข้อมูล
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="py-2">
              <h4 className="font-bold text-xl">
                <span className="border-l-4 border-[#A80689] rounded-xl mr-4" />
                ข้อมูลการเดินทาง
              </h4>
            </div>
            <div className="mt-4">
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
                  onChange={(e) => setParams({ ...params, search: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-3">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditData(undefined);
                  recordTravelAddModalRef.current?.openModal();
                }}
              >
                <i className="material-symbols-outlined">add</i> เพิ่มข้อมูล
              </button>
            </div>
            <div className="w-full mx-auto mt-3">
              <TableRecordTravelComponent
                data={requestData || []}
                columns={recordTravelDataColumns}
                listName="request"
                editRecordTravel={(dataItem: RecordTravelTabProps) => {
                  setEditData(dataItem);
                  recordTravelEditModalRef.current?.openModal();
                }}
                deleteRecordTravel={(dataItem: RecordTravelTabProps) => {
                  setEditData(dataItem);
                  cancelRequestModalRef.current?.openModal();
                }}
              />
            </div>
          </>
        )}
        <Suspense fallback={<div></div>}>
          <RequestListContent />
        </Suspense>
        <RecordTravelAddModal ref={recordTravelAddModalRef} role={"user"} requestId={requestId} />
        <RecordTravelAddModal
          ref={recordTravelEditModalRef}
          role={"user"}
          requestId={requestId}
          dataItem={editData}
          status
        />
        <CancelRequestModal
          title="ยืนยันลบข้อมูลการเดินทาง"
          desc={`ข้อมูลการเดินทางวันที่ ${
            convertToBuddhistDateTime(editData?.trip_start_datetime || "").date +
            " " +
            convertToBuddhistDateTime(editData?.trip_start_datetime || "").time
          } จะถูกลบออกจากระบบ`}
          confirmText="ลบข้อมูล"
          ref={cancelRequestModalRef}
          cancleFor="recordTravel"
          role="recordTravel"
          id={editData?.trn_request_uid || ""}
          tripId={editData?.trn_trip_detail_uid || ""}
          datetime={
            convertToBuddhistDateTime(editData?.trip_start_datetime || "").date +
            " " +
            convertToBuddhistDateTime(editData?.trip_start_datetime || "").time
          }
        />
      </div>
    </>
  );
};

export default RecordTravelTab;
