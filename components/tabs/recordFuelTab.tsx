"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import CancelRequestModal from "@/components/modal/cancelRequestModal";
import RecordFuelAddModal from "@/components/modal/recordFuelAddModal";
import ToastCustom from "@/components/toastCustom";
import { recordFuelDataColumns, RecordFuelTabProps } from "@/data/requestData";
import { fetchUserAddFuelDetails } from "@/services/vehicleInUseUser";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ExampleFuelStringImageModal from "../modal/exampleFuelImageModal";
import TableRecordTravelComponent from "../tableRecordTravel";

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

const RecordFuelTab = ({
  requestId,
  role,
  requestData,
}: RecordFuelTabPageProps) => {
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
        const response = await fetchUserAddFuelDetails(requestId || "", params);
        console.log("data---", response.data);

        setRequestData(response.data);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    },
    [params, requestId] // Add requestId to the dependency array,
  );

  useEffect(() => {
    fetchUserTravelDetailsFunc();
  }, [
    requestId,
    params,
    fetchUserTravelDetailsFunc,
    createReq,
    updateReq,
    deleteReq,
  ]);

  const mapDataRequest = useMemo(
    () =>
      requestFuelData.map((item) => {
        return {
          ...item,
          ref_oil_station_brand_name:
            item.ref_oil_station_brand.ref_oil_station_brand_name_th,
          ref_fuel_type_name: item.ref_fuel_type.ref_fuel_type_name_th,
          ref_payment_type_name: item.ref_payment_type.ref_payment_type_name,
          ref_cost_type_name: item.ref_cost_type.ref_cost_type_name,
        };
      }),
    [requestFuelData]
  );

  return (
    <>
      <div className="w-full">
        {requestFuelData && requestFuelData.length == 0 ? (
          <div className="grid grid-cols-1 gap-4 text-center">
            <div className="flex items-center justify-center w-[300px] h-[300px] mx-auto my-5 col-span-12">
              <Image
                src="/assets/img/graphic/fuel_img.svg"
                width={900}
                height={900}
                alt=""
              />
            </div>
            <div className="col-span-12">
              <p className="font-bold text-2xl">เพิ่มข้อมูลการเดินทาง</p>
              <p>
                ระบุข้อมูลวันที่และเวลาเดินทาง เลขไมล์
                สถานที่ี่จากต้นทางและถึงปลายทาง
              </p>
            </div>
            <div className="col-span-12">
              <button
                className="btn btn-primary w-full text-xl"
                onClick={() => {
                  setEditData(undefined);
                  recordFuelAddModalRef.current?.openModal();
                }}
              >
                <i className="material-symbols-outlined !text-3xl">add</i>{" "}
                เพิ่มข้อมูล
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="py-2">
              <h4 className="font-bold text-xl">
                <span className="border-l-4 border-[#A80689] rounded-xl mr-4" />
                ข้อมูลการเติมเชื้อเพลิง
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
                  placeholder="ค้นหาเลขที่ใบเสร็จ"
                  onChange={(e) =>
                    setParams({ ...params, search: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-3">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditData(undefined);
                  recordFuelAddModalRef.current?.openModal();
                }}
              >
                <i className="material-symbols-outlined">add</i> เพิ่มข้อมูล
              </button>
            </div>
            <div className="w-full mx-auto mt-3">
              <TableRecordTravelComponent
                data={mapDataRequest}
                columns={recordFuelDataColumns}
                listName="fuel"
                editRecordTravel={(data: RecordFuelTabProps) => {
                  setEditData(data);
                  recordFuelEditModalRef.current?.openModal();
                }}
                deleteRecordTravel={(data: RecordFuelTabProps) => {
                  setEditData(data);
                  cancelRequestModalRef.current?.openModal();
                }}
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
          role="user"
        />
        <RecordFuelAddModal
          ref={recordFuelEditModalRef}
          requestId={requestId}
          isPayment={!!requestData?.fleet_card_no}
          dataItem={editData}
          role="user"
          status
        />
        <CancelRequestModal
          title="ยืนยันลบข้อมูลการเติมเชื้อเพลิง"
          desc={`ข้อมูลการเติมเชื้อเพลิงเลขที่ใบเสร็จ ${editData?.tax_invoice_no} จะโดนลบออกจาก ระบบ`}
          confirmText="ลบข้อมูล"
          ref={cancelRequestModalRef}
          cancleFor="recordFuel"
          role="recordFuel"
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
