"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import CancelRequestModal from "@/components/modal/cancelRequestModal";
import RecordTravelAddModal from "@/components/modal/recordTravelAddModal";
import ToastCustom from "@/components/toastCustom";
import { RecordTravelTabProps } from "@/data/requestData";
import { TravelData } from "@/data/travelData";
import { fetchDriverTravelDetails } from "@/services/vehicleInUseDriver";
import { fetchUserTravelDetails } from "@/services/vehicleInUseUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import TableRecordTravelComponent from "../tableRecordTravel";
import ZeroRecord from "../zeroRecord";

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
          desc={
            <>
              เพิ่มข้อมูลการเดินทางวันที่ {formatDateTime.date} <br></br>เรียบร้อยแล้ว
            </>
          }
          status="success"
          styleText="!mx-auto"
          searchParams={role === "user" ? "activeTab=ข้อมูลการเดินทาง" : "progressType=บันทึกการเดินทาง"}
        />
      )}

      {updateReq === "success" && (
        <ToastCustom
          title="แก้ไขข้อมูลการเดินทางสำเร็จ"
          desc={`ข้อมูลเดินทางวันที่ ${formatDateTime.date} ได้รับการแก้ไขเรียบร้อย`}
          status="success"
          styleText="!mx-auto"
          searchParams={role === "user" ? "activeTab=ข้อมูลการเดินทาง" : "progressType=บันทึกการเดินทาง"}
        />
      )}

      {deleteReq === "success" && (
        <ToastCustom
          title="ลบข้อมูลการเดินทางสำเร็จ"
          desc={`ข้อมูลเดินทางวันที่ ${dateTime} ถูกลบเรียบร้อย`}
          status="success"
          styleText="!mx-auto"
          searchParams={role === "user" ? "activeTab=ข้อมูลการเดินทาง" : "progressType=บันทึกการเดินทาง"}
        />
      )}
    </>
  );
}
interface RecordTravelPageTabProps {
  requestId?: string;
  role?: string;
  data?: RequestDetailType;
}

const RecordTravelTab = ({ requestId, role = "user", data }: RecordTravelPageTabProps) => {
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
      if (requestId) {
        try {
          let response;
          if (role === "driver") {
            response = await fetchDriverTravelDetails(requestId || "", params);
          } else {
            response = await fetchUserTravelDetails(requestId || "", params);
          }
          const sortedData = response?.data.sort((a: RecordTravelTabProps, b: RecordTravelTabProps) => {
            const dateA = new Date(a.trip_start_datetime);
            const dateB = new Date(b.trip_start_datetime);
            return dateA.getTime() - dateB.getTime(); // Sort in descending order
          });
          setRequestData(sortedData);
        } catch (error) {
          console.error("Error fetching vehicle details:", error);
        }
      }
    },
    [params, requestId, role] // Add requestId to the dependency array,
  );

  useEffect(() => {
    if (requestId) {
      fetchUserTravelDetailsFunc();
    }
  }, [requestId, params, fetchUserTravelDetailsFunc, createReq, updateReq]);

  const isAddAndEdit = ["เดินทาง", "เสร็จสิ้น", "รอตรวจสอบ", "ตีกลับยานพาหนะ"].includes(
    data?.ref_request_status_name || ""
  );

  const requestListColumns: ColumnDef<TravelData>[] = [
    {
      accessorKey: "trip_start_datetime",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">วันที่ / เวลาจากต้นทาง</div>
        </div>
      ),
      enableSorting: true,
      cell: ({ row }: { row: { original: { trip_start_datetime: string } } }) => {
        const tripdate = row.original.trip_start_datetime;
        const convertedDate = convertToBuddhistDateTime(tripdate);
        return (
          <div className="text-left" data-name="วันที่ / เวลาถึงปลายทาง">
            <div className="flex flex-col">
              {convertedDate?.date} - {convertedDate?.time}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "trip_end_datetime",
      header: () => <div className="text-left">วันที่ / เวลาถึงปลายทาง</div>,
      enableSorting: false,
      cell: ({ row }: any) => {
        const tripEnd = row.original.trip_end_datetime;
        const convertedDate = convertToBuddhistDateTime(tripEnd);
        return (
          <div className="text-left" data-name="วันที่ / เวลาถึงปลายทาง">
            <div className="flex flex-col">
              {convertedDate?.date} - {convertedDate?.time}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "trip_start_miles",
      header: () => <div className="text-center">เลขไมล์ต้นทาง</div>,
      enableSorting: false,
      cell: ({ row }: any) => (
        <div className="text-left" data-name="เลขไมล์ต้นทาง">
          <div className="flex flex-col">
            {" "}
            <div className="text-left">{row.original.trip_start_miles}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "trip_end_miles",
      header: () => <div className="text-center">เลขไมล์ปลายทาง</div>,
      enableSorting: false,
      cell: ({ row }: any) => (
        <div className="text-left" data-name="เลขไมล์ปลายทาง">
          <div className="flex flex-col">
            {" "}
            <div className="text-left">{row.original.trip_end_miles}</div>
          </div>
        </div>
      ),
    },

    {
      accessorKey: "trip_departure_place",
      header: () => <div className="text-center">สถานที่ต้นทาง</div>,
      enableSorting: false,
      cell: ({ getValue }: any) => (
        <div className="text-left" data-name="สถานที่ต้นทาง">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "trip_destination_place",
      header: () => <div className="text-center">สถานที่ปลายทาง</div>,
      enableSorting: false,
      cell: ({ getValue }: any) => (
        <div className="text-left" data-name="สถานที่ปลายทาง">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "trip_detail",
      header: () => <div className="text-center">รายละเอียด</div>,
      enableSorting: false,
      cell: ({ getValue }: any) => (
        <div className="text-left" data-name="รายละเอียด">
          {getValue() as string}
        </div>
      ),
    },

    {
      accessorKey: "action",
      header: "",
      enableSorting: false,
      // cell: ({ row }) => {
      //   return (
      //     <div className="text-left dataTable-action">
      //       <button
      //         className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
      //         data-tip="แก้ไขข้อมูลการเดินทาง"
      //         onClick={(e) => {
      //           e.preventDefault();
      //           e.stopPropagation();
      //           if (editRecordTravel) {
      //             return editRecordTravel(row.original);
      //           }
      //           recordTravelEditModalRef.current?.openModal();
      //         }}
      //       >
      //         <i className="material-symbols-outlined">stylus</i>
      //       </button>

      //       <button
      //         className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
      //         data-tip="ลบข้อมูลการเดินทาง"
      //         onClick={(e) => {
      //           e.preventDefault();
      //           e.stopPropagation();
      //           if (deleteRecordTravel) {
      //             return deleteRecordTravel(row.original);
      //           }
      //           cancelRequestModalRef.current?.openModal();
      //         }}
      //       >
      //         <i className="material-symbols-outlined">delete</i>
      //       </button>

      //       <RecordTravelAddModal
      //         ref={recordTravelEditModalRef}
      //         role="admin"
      //         requestId={row.original.trn_request_uid}
      //         dataItem={{
      //           trn_trip_detail_uid: row.original.trn_trip_detail_uid,
      //           trn_request_uid: row.original.trn_request_uid,
      //           trip_start_datetime: row.original.trip_start_datetime,
      //           trip_end_datetime: row.original.trip_end_datetime,
      //           trip_departure_place: row.original.trip_departure_place,
      //           trip_destination_place: row.original.trip_destination_place,
      //           trip_start_miles: row.original.trip_start_miles,
      //           trip_end_miles: row.original.trip_end_miles,
      //           trip_detail: row.original.trip_detail,
      //         }}
      //         status={true}
      //       />
      //       <CancelRequestModal
      //         id={row.original.trn_request_uid}
      //         tripId={row.original.trn_trip_detail_uid}
      //         title="ยืนยันลบข้อมูลการเดินทาง"
      //         desc={
      //           " ข้อมูลการเดินทางวันที่ " +
      //           convertToBuddhistDateTime(row.original.trip_start_datetime).date +
      //           " - " +
      //           convertToBuddhistDateTime(row.original.trip_start_datetime).time +
      //           " จะถูกลบออกจากระบบ "
      //         }
      //         confirmText="ลบข้อมูล"
      //         cancleFor="adminRecordTravel"
      //         ref={cancelRequestModalRef}
      //       />
      //     </div>
      //   );
      // },
    },
  ].filter((e) => {
    if (e.accessorKey === "action") {
      return isAddAndEdit;
    }
    return true;
  });

  return (
    <>
      <div className="w-full px-1">
        {requestData && requestData.length == 0 ? (
          <ZeroRecord
            imgSrc="/assets/img/graphic/record_travel_img.svg"
            title="เพิ่มข้อมูลการเดินทาง"
            desc={<>ระบุข้อมูลวันที่และเวลาเดินทาง เลขไมล์ สถานที่จากต้นทางและถึงปลายทาง</>}
            button="เพิ่มข้อมูล"
            icon="add"
            link="process-one"
            displayBtn={true}
            useModal={() => {
              console.log("test");
              recordTravelAddModalRef.current?.openModal();
            }}
          />
        ) : (
          <>
            <div className="py-2">
              <h4 className="font-bold text-xl">
                <span className="border-l-4 border-[#A80689] rounded-xl mr-4" />
                ข้อมูลการเดินทาง
              </h4>
            </div>

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
                  onChange={(e) => setParams({ ...params, search: e.target.value })}
                />
              </div>

              {isAddAndEdit && (
                <button
                  className="btn btn-secondary ml-auto"
                  onClick={() => {
                    setEditData(undefined);
                    recordTravelAddModalRef.current?.openModal();
                  }}
                >
                  <i className="material-symbols-outlined">add</i>
                  เพิ่มข้อมูล
                </button>
              )}
            </div>
            <div className="w-full mx-auto mt-3">
              <TableRecordTravelComponent
                data={requestData || []}
                columns={requestListColumns}
                listName="request"
                editRecordTravel={
                  isAddAndEdit
                    ? (dataItem: RecordTravelTabProps) => {
                        setEditData(dataItem);
                        recordTravelEditModalRef.current?.openModal();
                      }
                    : undefined
                }
                deleteRecordTravel={
                  isAddAndEdit
                    ? (dataItem: RecordTravelTabProps) => {
                        setEditData(dataItem);
                        cancelRequestModalRef.current?.openModal();
                      }
                    : undefined
                }
              />
            </div>
          </>
        )}
        <Suspense fallback={<div></div>}>
          <RequestListContent role={role} />
        </Suspense>
        <RecordTravelAddModal ref={recordTravelAddModalRef} role={role} requestId={requestId} />
        <RecordTravelAddModal
          ref={recordTravelEditModalRef}
          role={role}
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
          role={role || "recordTravel"}
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
