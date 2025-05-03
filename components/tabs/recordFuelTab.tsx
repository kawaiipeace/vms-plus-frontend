"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import CancelRequestModal from "@/components/modal/cancelRequestModal";
import RecordFuelAddModal from "@/components/modal/recordFuelAddModal";
import ToastCustom from "@/components/toastCustom";
import { RecordFuelTabProps } from "@/data/requestData";
import { fetchDriverAddFuelDetails } from "@/services/vehicleInUseDriver";
import { fetchUserAddFuelDetails } from "@/services/vehicleInUseUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ExampleFuelStringImageModal from "../modal/exampleFuelImageModal";
import TableRecordTravelComponent from "../tableRecordTravel";
import ZeroRecord from "../zeroRecord";

function RequestListContent() {
  const searchParams = useSearchParams();
  const createReq = searchParams.get("create-fuel-req");
  const updateReq = searchParams.get("update-fuel-req");
  const deleteReq = searchParams.get("delete-fuel-req");
  const taxInvoiceNo = searchParams.get("tax_invoice_no");

  return (
    <>
      {createReq === "success" && (
        <ToastCustom
          title="เพิ่มข้อมูลการเติมเชื้อเพลิงสำเร็จ"
          desc={`ข้อมูลการเติมเชื้อเพลิงเลขที่ใบเสร็จ ${taxInvoiceNo} ได้รับการเพิ่มเรียบร้อย`}
          status="success"
          styleText="!mx-auto"
          searchParams={"activeTab=การเติมเชื้อเพลิง"}
        />
      )}

      {updateReq === "success" && (
        <ToastCustom
          title="แก้ไขข้อมูลการเติมเชื้อเพลิงสำเร็จ"
          desc={`ข้อมูลการเติมเชื้อเพลิงเลขที่ใบเสร็จ ${taxInvoiceNo} ได้รับการแก้ไขเรียบร้อย`}
          status="success"
          styleText="!mx-auto"
          searchParams={"activeTab=การเติมเชื้อเพลิง"}
        />
      )}

      {deleteReq === "success" && (
        <ToastCustom
          title="ลบข้อมูลการเติมเชื้อเพลิงสำเร็จ"
          desc={`ข้อมูลการเติมเชื้อเพลิงเลขที่ใบเสร็จ ${taxInvoiceNo} ถูกลบเรียบร้อย`}
          status="success"
          styleText="!mx-auto"
          searchParams={"activeTab=การเติมเชื้อเพลิง"}
        />
      )}
    </>
  );
}

interface RecordFuelTabPageProps {
  requestId?: string;
  role?: string;
  requestData?: RequestDetailType;
}

const RecordFuelTab = ({ requestId, role, requestData }: RecordFuelTabPageProps) => {
  const searchParams = useSearchParams();
  const createReq = searchParams.get("create-fuel-req");
  const updateReq = searchParams.get("update-fuel-req");
  const deleteReq = searchParams.get("delete-fuel-req");

  const [requestFuelData, setRequestData] = useState<RecordFuelTabProps[]>([]);
  const [params, setParams] = useState({ search: "" });
  const [editData, setEditData] = useState<RecordFuelTabProps | undefined>();

  const recordFuelAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const recordFuelEditModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const cancelRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const previewModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const fetchUserTravelDetailsFunc = useCallback(
    async () => {
      try {
        let response;
        if (role === "driver") {
          response = await fetchDriverAddFuelDetails(requestId || "", params);
        } else {
          response = await fetchUserAddFuelDetails(requestId || "", params);
        }
        console.log("data---", response?.data);

        setRequestData(response?.data);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    },
    [params, requestId] // Add requestId to the dependency array,
  );

  useEffect(() => {
    fetchUserTravelDetailsFunc();
  }, [requestId, params, fetchUserTravelDetailsFunc, createReq, updateReq, deleteReq]);

  const mapDataRequest = useMemo(
    () =>
      requestFuelData.map((item) => {
        return {
          ...item,
          ref_oil_station_brand_name: item.ref_oil_station_brand.ref_oil_station_brand_name_th,
          ref_fuel_type_name: item.ref_fuel_type.ref_fuel_type_name_th,
          ref_payment_type_name: item.ref_payment_type.ref_payment_type_name,
          ref_cost_type_name: item.ref_cost_type.ref_cost_type_name,
        };
      }),
    [requestFuelData]
  );

  const isAddAndEdit = ["เดินทาง", "เสร็จสิ้น", "รอตรวจสอบ", "ตีกลับยานพาหนะ"].includes(
    requestData?.ref_request_status_name || ""
  );

  const requestListColumns: ColumnDef<RecordFuelTabProps>[] = [
    {
      accessorKey: "tax_invoice_date",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">วันที่ใบเสร็จ</div>
        </div>
      ),
      enableSorting: false,
      cell: ({ getValue }) => {
        const tripdate = getValue() as string;
        const convertedDate = convertToBuddhistDateTime(tripdate);
        return (
          <div className="text-left" data-name="วันที่ใบเสร็จ">
            <div className="flex flex-col">{convertedDate?.date}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "tax_invoice_no",
      header: () => <div className="text-left">เลขที่ใบเสร็จ</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const tax_invoice_no = row.original.tax_invoice_no;
        return (
          <div className="text-left" data-name="เลขที่ใบเสร็จ">
            <div className="flex flex-col">{tax_invoice_no}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "ref_oil_station_brand_name",
      header: () => <div className="text-center">สถานีบริการน้ำมัน</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="สถานีบริการน้ำมัน">
          <div className="flex flex-col">
            {" "}
            <div className="text-left">{row.original.ref_oil_station_brand_name}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "ref_fuel_type_name",
      header: () => <div className="text-center">ประเภทเชื้อเพลิง</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="ประเภทเชื้อเพลิง">
          <div className="flex flex-col">
            {" "}
            <div className="text-left">{row.original.ref_fuel_type_name}</div>
          </div>
        </div>
      ),
    },

    {
      accessorKey: "mile",
      header: () => <div className="text-center">เลขไมล์</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="เลขไมล์">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "sum_liter",
      header: () => <div className="text-center">จำนวนลิตร</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="จำนวนลิตร">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "price_per_liter",
      header: () => <div className="text-center">ราคาต่อลิตร</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="ราคาต่อลิตร">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "vat",
      header: () => <div className="text-center">ภาษี</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="ภาษี">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "sum_price",
      header: () => <div className="text-center">ยอดรวมชำระ</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="ยอดรวมชำระ">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "ref_payment_type_name",
      header: () => <div className="text-center">วิธีชำระเงิน</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="วิธีชำระเงิน">
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
  ].filter((column) => {
    if (column.accessorKey === "action") {
      return isAddAndEdit;
    }
    return true;
  });

  return (
    <>
      <div className="w-full">
        {requestFuelData && requestFuelData.length == 0 ? (
          <ZeroRecord
            imgSrc="/assets/img/graphic/fuel_img.svg"
            title="เพิ่มข้อมูลการเติมเชื้อเพลิง"
            desc={
              <>
                กรุณาระบุเลขไมล์และข้อมูลใบเสร็จทุกครั้ง <br></br>
                ที่เติมน้ำมัน เพื่อใช้ในการเบิกค่าใช้จ่าย
              </>
            }
            button="เพิ่มข้อมูล"
            icon="add"
            displayBtn={true}
            useModal={() => {
              setEditData(undefined);
              recordFuelAddModalRef.current?.openModal();
            }}
          />
        ) : (
          <>
            <div className="py-2">
              <h4 className="font-bold text-xl">
                <span className="border-l-4 border-[#A80689] rounded-xl mr-4" />
                ข้อมูลการเติมเชื้อเพลิง
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
                    recordFuelAddModalRef.current?.openModal();
                  }}
                >
                  <i className="material-symbols-outlined">add</i>
                  เพิ่มข้อมูล
                </button>
              )}
            </div>
            <div className="w-full mx-auto mt-3">
              <TableRecordTravelComponent
                data={mapDataRequest}
                columns={requestListColumns}
                listName="fuel"
                editRecordTravel={
                  isAddAndEdit
                    ? (data: RecordFuelTabProps) => {
                        setEditData(data);
                        recordFuelEditModalRef.current?.openModal();
                      }
                    : undefined
                }
                deleteRecordTravel={
                  isAddAndEdit
                    ? (data: RecordFuelTabProps) => {
                        setEditData(data);
                        cancelRequestModalRef.current?.openModal();
                      }
                    : undefined
                }
                previewRecordTravel={(data: RecordFuelTabProps) => {
                  setEditData(data);
                  previewModalRef.current?.openModal();
                }}
              />
            </div>
          </>
        )}
        <RecordFuelAddModal
          ref={recordFuelAddModalRef}
          requestId={requestId}
          isPayment={!!requestData?.fleet_card_no}
          role={role}
        />
        <RecordFuelAddModal
          ref={recordFuelEditModalRef}
          requestId={requestId}
          isPayment={!!requestData?.fleet_card_no}
          dataItem={editData}
          role={role}
          status
        />
        <CancelRequestModal
          title="ยืนยันลบข้อมูลการเติมเชื้อเพลิง"
          desc={`ข้อมูลการเติมเชื้อเพลิงเลขที่ใบเสร็จ ${editData?.tax_invoice_no} จะโดนลบออกจาก ระบบ`}
          confirmText="ลบข้อมูล"
          ref={cancelRequestModalRef}
          cancleFor="recordFuel"
          role={role || "recordFuel"}
          id={requestId || ""}
          fuelId={editData?.trn_add_fuel_uid || ""}
          tax_invoice_no={editData?.tax_invoice_no || ""}
        />
        <ExampleFuelStringImageModal
          backModal={() => previewModalRef.current?.closeModal()}
          ref={previewModalRef}
          imageEx={editData?.receipt_img ? [editData.receipt_img] : []}
        />
        <Suspense fallback={<div></div>}>
          <RequestListContent />
        </Suspense>
      </div>
    </>
  );
};

export default RecordFuelTab;
