"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import CancelRequestModal from "@/components/modal/cancelRequestModal";
import RecordFuelAddModal from "@/components/modal/recordFuelAddModal";
import ToastCustom from "@/components/toastCustom";
import { RecordFuelTabProps } from "@/data/requestData";
import { fetchOilStationBrandType } from "@/services/masterService";
import { fetchDriverAddFuelDetails } from "@/services/vehicleInUseDriver";
import { fetchUserAddFuelDetails } from "@/services/vehicleInUseUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { getOilBrandImage } from "@/utils/getOilBrandImage";
import { CellContext, ColumnDef } from "@tanstack/react-table";
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
  const [oilStationBrandData, setOilStationBrandData] = useState<
    {
      ref_oil_station_brand_id: 1;
      ref_oil_station_brand_name_th: string;
      ref_oil_station_brand_name_en: string;
      ref_oil_station_brand_name_full: string;
      ref_oil_station_brand_img: string;
    }[]
  >([]);
  const [params, setParams] = useState({ search: "" });
  const [editData, setEditData] = useState<RecordFuelTabProps | undefined>();
  const [loading, setLoading] = useState(true);

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

  const fetchUserTravelDetailsFunc = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      const responseOil = await fetchOilStationBrandType();
      if (role === "driver") {
        response = await fetchDriverAddFuelDetails(requestId || "", params);
      } else {
        response = await fetchUserAddFuelDetails(requestId || "", params);
      }

      setOilStationBrandData(responseOil.data);
      setRequestData(response?.data);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    } catch (error) {
      const timer = setTimeout(() => {
        console.error("Error fetching vehicle details:", error);
        setLoading(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [params, requestId, role]);

  useEffect(() => {
    fetchUserTravelDetailsFunc();
  }, [requestId, params, fetchUserTravelDetailsFunc, createReq, updateReq, deleteReq]);

  const mapDataRequest = useMemo(
    () =>
      requestFuelData.map((item) => {
        const oilStationBrand = oilStationBrandData.find(
          (brand) => brand.ref_oil_station_brand_id === item.ref_oil_station_brand_id
        );
        return {
          ...item,
          ref_oil_station_brand_name: oilStationBrand?.ref_oil_station_brand_name_th || "",
          ref_fuel_type_name: item.ref_fuel_type.ref_fuel_type_name_th,
          ref_payment_type_name: item.ref_payment_type.ref_payment_type_name,
          ref_cost_type_name: item.ref_cost_type.ref_cost_type_name,
        };
      }),
    [requestFuelData, oilStationBrandData]
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
      cell: ({ getValue }: CellContext<RecordFuelTabProps, unknown>) => {
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
      cell: ({ row }: CellContext<RecordFuelTabProps, unknown>) => {
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
      cell: ({ row }: CellContext<RecordFuelTabProps, unknown>) => {
        const oilStationBrandName = row.original.ref_oil_station_brand_name;
        const imageSrc = getOilBrandImage(oilStationBrandName);
        return (
          <div className="text-left" data-name="สถานีบริการน้ำมัน">
            <div className="flex items-center gap-1 text-md">
              <img src={imageSrc} alt={"oil-image-" + imageSrc} width={24} height={24} />
              <span className="">{oilStationBrandName}</span>
            </div>
            {/* <div className="flex flex-col">
              <div className="text-left">{row.original.ref_oil_station_brand_name}</div>
            </div> */}
          </div>
        );
      },
    },
    {
      accessorKey: "ref_fuel_type_name",
      header: () => <div className="text-center">ประเภทเชื้อเพลิง</div>,
      enableSorting: false,
      cell: ({ row }: CellContext<RecordFuelTabProps, unknown>) => (
        <div className="text-left" data-name="ประเภทเชื้อเพลิง">
          <div className="flex flex-col">
            <div className="text-left">{row.original.ref_fuel_type_name}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "mile",
      header: () => <div className="text-center">เลขไมล์</div>,
      enableSorting: false,
      cell: ({ getValue }: CellContext<RecordFuelTabProps, unknown>) => (
        <div className="text-left" data-name="เลขไมล์">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "sum_liter",
      header: () => <div className="text-center">จำนวนลิตร</div>,
      enableSorting: false,
      cell: ({ getValue }: CellContext<RecordFuelTabProps, unknown>) => (
        <div className="text-left" data-name="จำนวนลิตร">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "price_per_liter",
      header: () => <div className="text-center">ราคาต่อลิตร</div>,
      enableSorting: false,
      cell: ({ getValue }: CellContext<RecordFuelTabProps, unknown>) => (
        <div className="text-left" data-name="ราคาต่อลิตร">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "vat",
      header: () => <div className="text-center">ภาษี</div>,
      enableSorting: false,
      cell: ({ getValue }: CellContext<RecordFuelTabProps, unknown>) => (
        <div className="text-left" data-name="ภาษี">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "sum_price",
      header: () => <div className="text-center">ยอดรวมชำระ</div>,
      enableSorting: false,
      cell: ({ getValue }: CellContext<RecordFuelTabProps, unknown>) => (
        <div className="text-left" data-name="ยอดรวมชำระ">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "ref_payment_type_name",
      header: () => <div className="text-center">วิธีชำระเงิน</div>,
      enableSorting: false,
      cell: ({ getValue }: CellContext<RecordFuelTabProps, unknown>) => (
        <div className="text-left" data-name="วิธีชำระเงิน">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "",
      enableSorting: false,
    },
  ].filter((column) => {
    if (column.accessorKey === "action") {
      return isAddAndEdit;
    }
    return true;
  });

  if (loading && requestFuelData.length === 0)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-40vh)]">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#A80689]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );

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
                  placeholder="ค้นหาเลขที่ใบเสร็จ"
                  onChange={(e) => setParams({ ...params, search: e.target.value })}
                />
              </div>

              {role === "admin" && (
                <button
                  className="btn btn-primary ml-auto"
                  onClick={() => {
                    setEditData(undefined);
                    recordFuelAddModalRef.current?.openModal();
                  }}
                >
                  <i className="material-symbols-outlined">add</i>
                  เพิ่มข้อมูล
                </button>
              )}

              {isAddAndEdit && (
                <button
                  className="btn btn-primary ml-auto"
                  onClick={() => {
                    recordFuelAddModalRef.current?.openModal();
                    setEditData(undefined);
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
        <RecordFuelAddModal ref={recordFuelAddModalRef} requestId={requestId} isPayment={true} role={role} />
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
