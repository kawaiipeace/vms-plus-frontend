import { VehicleUserTravelCardType } from "@/app/types/vehicle-user-type";
import ToastCustom from "@/components/toastCustom";
import { fetchRequestKeyDetail } from "@/services/masterService";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { exportElementAsImage } from "@/utils/exportImage";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

interface Props {
  requestData?: VehicleUserTravelCardType;
  onSubmit?: () => void;
  id?: string;
}

const LicenseCardModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ requestData, id }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const exportImgRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false); // State to manage button behavior
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [requestGetData, setRequestData] =
    useState<VehicleUserTravelCardType>();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const fetchRequestDetailfunc = useCallback(async () => {
    try {
      // Ensure parsedData is an object before accessing vehicleSelect
      const response = await fetchRequestKeyDetail(id || "");
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchRequestDetailfunc();
    }
  }, [id]);

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  const data = useMemo(
    () => (requestData ? requestData : requestGetData),
    [requestData, requestGetData]
  );

  const startDate = convertToBuddhistDateTime(data?.start_datetime || "");
  const endDate = convertToBuddhistDateTime(data?.end_datetime || "");

  const handleExportImage = () => {
    exportElementAsImage(
      exportImgRef.current,
      "license-card.png",
      () => {
        setIsExporting(true);
      },
      () => {
        setIsExporting(false);
        setSaveSuccess(true);
      }
    );
  };

  return (
    <dialog ref={modalRef} className="modal">
      <div
        className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title"> ใบอนุญาตนำรถออกจาก กฟภ.</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto text-center">
          <div className="form-section">
            <div
              className="grid gap-5 grid-cols-12 w-[328px] max-w-[328px] export-img bg-[url('/assets/img/departure_card.png')] bg-center bg-no-repeat p-4 rounded-xl mx-auto"
              ref={exportImgRef}
            >
              <div className="col-span-12">
                <div className="flex">
                  <div className="w-[60px]">
                    <Image
                      src="/assets/img/brand.svg"
                      className="w-full"
                      width={100}
                      height={100}
                      alt=""
                    />
                  </div>
                  <div className="ml-auto text-white text-xs">
                    <p>
                      {startDate.date} - {endDate.date}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-start col-span-12">
                <div className="text-left">
                  <p className="font-bold text-3xl">
                    {data?.vehicle_license_plate || "-"}
                  </p>
                  <p>{data?.vehicle_license_plate_province_short || "-"}</p>
                </div>
              </div>
              <div className="col-span-12">
                <div className="form-section">
                  <div className="form-card bg-[#EAECF0]">
                    <div className="form-card-body">
                      <div className="grid grid-cols-12 gap-y-3">
                        <div className="col-span-12">
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">
                              calendar_month
                            </i>
                            <div className="form-plaintext-group">
                              <div className="form-label">
                                สถานที่ปฏิบัติงาน
                              </div>
                              <div className="form-text text-left">
                                {data?.work_place || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12">
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">
                              person_edit
                            </i>
                            <div className="form-plaintext-group">
                              <div className="form-label">ผู้อนุมัติ</div>
                              <div className="form-text text-left">
                                {data?.approved_request_emp_name || "-"}
                                <br />
                                {data?.approved_request_dept_sap_short || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-start items-center col-span-12 mt-5">
                <div className="w-[80px] rounded-full overflow-hidden">
                  <Image
                    src={
                      data?.vehicle_user_image_url ||
                      "/assets/img/sample-avatar.png"
                    }
                    className="w-full"
                    width={100}
                    height={100}
                    alt=""
                  />
                </div>
                <div className="text-left ml-3">
                  <p className="font-bold text-xl">
                    {data?.vehicle_user_emp_name || "-"}
                  </p>
                  <p>{data?.vehicle_user_dept_sap || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {saveSuccess && (
            <ToastCustom
              title="บันทึกใบอนุญาตสำเร็จ"
              desc=""
              status="success"
              styleText="!mx-auto"
            />
          )}
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0 w-full">
          <div className="flex justify-between w-full gap-3">
            <button
              className="btn btn-secondary flex-1"
              onClick={() => modalRef.current?.close()}
            >
              กลับหน้าหลัก
            </button>
            <button
              className={`btn btn-primary flex-1 ${
                isExporting ? "btn-disabled" : ""
              }`}
              onClick={handleExportImage}
              disabled={isExporting}
            >
              {isExporting ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
});

LicenseCardModal.displayName = "LicenseCardModal";

export default LicenseCardModal;
