import { DriverLicenseCardType } from "@/app/types/vehicle-user-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef } from "react";
import DriverLicProgress from "../driverLicProgress";

interface Props {
  requestData?: DriverLicenseCardType;
  onBack?: () => void;
}

const DriverLicenseDetailModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ requestData, onBack }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  console.log("driverUser", requestData);

  const download = (filename: string, url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (!requestData?.driver_license.driver_license_image) {
        console.error("No image URL available");
        return;
      }

      // For demonstration, we'll use the image URL from the requestData
      // In a real app, you might need to fetch from your API endpoint
      const imageUrl = requestData.driver_license.driver_license_image;

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Generate a filename based on the license number
      const licenseNo =
        requestData.driver_license.driver_license_no || "driver_license";
      download(`${licenseNo}.jpg`, url);

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
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
          <div className="modal-title flex items-center gap-4">
            {" "}
            <i
              className="material-symbols-outlined cursor-pointer"
              onClick={() => {
                modalRef.current?.close();
                if (onBack) {
                  onBack();
                }
              }}
            >
              keyboard_arrow_left
            </i>{" "}
            <div className="">
              <p>เลขที่่คำขอ {requestData?.request_annual_driver_no} </p>
              <span className="text-color-secondary text-base font-normal">
                ขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี {requestData?.annual_yyyy}
              </span>
            </div>
          </div>

          <button
            className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
            onClick={() => modalRef.current?.close}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>
        <div className="modal-body overflow-y-auto text-left">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">รายละเอียดคำขอ</div>
            </div>

            <div className="form-card">
              <div className="form-card-body">
                <div className="grid grid-cols-12">
                  <div className="col-span-12">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">
                        directions_car
                      </i>
                      <div className="form-plaintext-group">
                        <div className="form-label">
                          {
                            requestData?.driver_license?.driver_license_type
                              ?.ref_driver_license_type_name
                          }
                        </div>
                        <div className="form-text">
                          {
                            requestData?.driver_license?.driver_license_type
                              ?.ref_driver_license_type_desc
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                ใบอนุญาตขับรถยนต์ส่วนบุคคล
              </div>
            </div>

            <div className="form-card">
              <div className="form-card-body">
                <div className="grid grid-cols-12">
                  <div className="col-span-12 md:col-span-6">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">id_card</i>
                      <div className="form-plaintext-group">
                        <div className="form-label">เลขที่ใบอนุญาต</div>
                        <div className="form-text">
                          {requestData?.driver_license?.driver_license_no}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">
                        calendar_month
                      </i>
                      <div className="form-plaintext-group">
                        <div className="form-label">วันที่สิ้นอายุ</div>
                        <div className="form-text">
                          {
                            convertToBuddhistDateTime(
                              requestData?.driver_license
                                ?.driver_license_end_date || ""
                            ).date
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 mt-3">
                    <div className="form-plaintext-group">
                      <div className="form-label font-semibold">
                        รูปใบขับขี่
                      </div>
                      <div className="w-full relative">
                        <Image
                          src={
                            requestData?.driver_license.driver_license_image ||
                            "/assets/img/ex_driver_license.png"
                          }
                          className="w-full"
                          width={100}
                          height={100}
                          alt=""
                        />
                        <button
                          onClick={handleDownload}
                          className="btn btn-circle btn-secondary absolute top-5 right-5 btn-md"
                        >
                          {" "}
                          <i className="material-symbols-outlined">
                            download
                          </i>{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {(requestData?.driver_license?.ref_driver_license_type_code ===
            "2+" ||
            requestData?.driver_license?.ref_driver_license_type_code ===
              "3+") && (
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">ใบรับรองการอบรม</div>
              </div>

              <div className="form-card">
                <div className="form-card-body">
                  <div className="grid grid-cols-12 gap-5">
                    <div className="col-span-12">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">
                          developer_guide
                        </i>
                        <div className="form-plaintext-group">
                          <div className="form-label">ชื่อหลักสูตร</div>
                          <div className="form-desc">
                            {" "}
                            {
                              requestData?.driver_certificate
                                .driver_certificate_name
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">news</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">เลขที่ใบรับรอง</div>
                          <div className="form-desc">
                            {" "}
                            {
                              requestData?.driver_certificate
                                .driver_certificate_no
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">
                          front_loader
                        </i>
                        <div className="form-plaintext-group">
                          <div className="form-label">ประเภทยานพาหนะ</div>
                          <div className="form-desc">
                            {" "}
                            {
                              requestData?.driver_certificate
                                .driver_certificate_type
                                .ref_driver_certificate_type_name
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">
                          calendar_month
                        </i>
                        <div className="form-plaintext-group">
                          <div className="form-label">วันที่อบรม</div>
                          <div className="form-desc">
                            {" "}
                            {
                              convertToBuddhistDateTime(
                                requestData?.driver_certificate
                                  .driver_certificate_issue_date
                              ).date
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">
                          calendar_month
                        </i>
                        <div className="form-plaintext-group">
                          <div className="form-label">วันที่สิ้นอายุ</div>
                          <div className="form-desc">
                            {" "}
                            {
                              convertToBuddhistDateTime(
                                requestData?.driver_certificate
                                  .driver_certificate_issue_date
                              ).date
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="form-section mt-0">
            <div className="form-section-header">
              <div className="form-section-header-title">
                ประวัติการดำเนินการ
              </div>
            </div>

            <div className="process-driver">
              <DriverLicProgress
                progressSteps={requestData?.progress_request_history}
              />
            </div>
          </div>
        </div>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => modalRef.current?.close()}
          >
            ปิด
          </button>
        </div>
      </div>
    </dialog>
  );
});

DriverLicenseDetailModal.displayName = "DriverLicenseDetailModal";

export default DriverLicenseDetailModal;
