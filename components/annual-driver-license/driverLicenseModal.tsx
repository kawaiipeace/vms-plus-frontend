import { Profile } from "@/app/types/profile-type";
import { DriverLicenseCardType } from "@/app/types/vehicle-user-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import DriverLicenseDetailModal from "./driverLicenseDetailModal";
import Link from "next/link";
import AlertCustom from "../alertCustom";

interface Props {
  requestData?: DriverLicenseCardType;
  profile?: Profile | null;
  onSubmit?: () => void;
  showRequestStatus?: () => void;
  showNextRequestStatus?: () => void;
  onStepOne?: () => void;
  onStepOneEdit?: () => void;
}

const DriverLicenseModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(
  (
    { requestData, profile, showRequestStatus,showNextRequestStatus, onStepOne, onStepOneEdit },
    ref
  ) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    const driverLicenseDetailModalRef = useRef<{
      openModal: () => void;
      closeModal: () => void;
    } | null>(null);

    const driverLicenseDetailNextModalRef = useRef<{
      openModal: () => void;
      closeModal: () => void;
    } | null>(null);

    
    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    const onBack = () => {
      modalRef.current?.showModal();
    };

    useEffect(() => {
    }, [requestData]);
    return (
      <dialog ref={modalRef} className="modal">
        <div
          className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10 !border-b-0">
            <div className="modal-title flex flex-col !items-start text-left">
              {" "}
              ใบอนุญาตทำหน้าที่ขับรถยนต์{" "}
              <span className="text-base text-color-secondary font-normal">
                ประจำปี { requestData?.annual_yyyy}
              </span>{" "}
            </div>

            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>
          <div className="modal-body overflow-y-auto text-center">
            <div className="form-section">
              <div className="grid gap-5 grid-cols-12 w-[328px] max-w-[328px] bg-[url('/assets/img/annual_driving_card.svg')] bg-center bg-no-repeat p-0 rounded-xl mx-auto pb-[13%]">
                <div className="flex justify-center col-span-12 bg-brand-900 rounded-t-xl">
                  <div className="text-center p-2">
                    <p className="font-bold text-base text-white">
                      ใบอนุญาตทำหน้าที่ขับรถยนต์ประจำปี
                    </p>
                  </div>
                </div>
                <div className="flex justify-start items-center col-span-12 mt-0 px-3">
                  <div className="w-[80px] rounded-full overflow-hidden border-brand-900 border-4">
                    <Image
                      src={
                        profile?.image_url || "/assets/img/sample-avatar.png"
                      }
                      className="w-full"
                      width={100}
                      height={100}
                      alt=""
                    />
                  </div>
                  <div className="text-left ml-3 flex flex-col gap-2 content-title">
                    <p className="font-bold text-xl">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p>{profile?.posi_text + " " + profile?.dept_sap_short}</p>
                    {profile?.license_status === "อนุมัติแล้ว" ? (
                      <div className="badge badge-success">
                        {profile.license_status}
                      </div>
                    ) : profile?.license_status === "หมดอายุ" ? (
                      <div className="badge badge-error">
                        {profile.license_status}
                      </div>
                    ) : profile?.license_status === "มีผลปีถัดไป" ? (
                      <div className="badge badge-warning">
                        {profile.license_status}
                      </div>
                    ) : profile?.license_status === "ไม่มี" ? (
                      <div className="badge bg-brand-900 text-white">
                        {profile.license_status}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="col-span-12 p-5">
                  <div className="form-section">
                    <div className="form-card bg-[#EAECF0] rounded-md backdrop-blur-md shadow-[0px_0px_7px_0px_#63636340_inset]">
                      <div className="form-card-body">
                        {profile?.license_status_code !== "40" ? (
                          <div className="grid grid-cols-12 gap-y-3">
                            <div className="col-span-12">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  id_card
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">
                                    เลขที่ใบขับขี่
                                  </div>
                                  <div className="form-text text-left">
                                    {requestData?.driver_license
                                      ?.driver_license_no ?? ""}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-12">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  directions_car
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">
                                    {
                                      requestData?.driver_license
                                        ?.driver_license_type
                                        ?.ref_driver_license_type_name
                                    }
                                  </div>
                                  <div className="form-text text-left">
                                    {
                                      requestData?.driver_license
                                        ?.driver_license_type
                                        ?.ref_driver_license_type_desc
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-12">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  calendar_month
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">วันที่มีผล</div>
                                  <div className="form-text text-left">
                                    {
                                      convertToBuddhistDateTime(
                                        requestData?.driver_license
                                          ?.driver_license_start_date || ""
                                      ).date
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-12">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  calendar_clock
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">
                                    มีผลถึงวันที่
                                  </div>
                                  <div className="form-text text-left">
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
                          </div>
                        ) : (
                          <div className="px-2 py-[3rem] text-color-secondary">
                            ผู้บริหารระดับ 12 ขึ้นไป
                            สามารถทำหน้าที่ขับรถยนต์ประจำปีได้โดยไม่ต้องขออนุมัติ
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
    
          <div className="modal-footer sticky bottom-0 gap-3 mt-0 w-full p-5 pt-0">
            {/* <div className="mb-4">
            <AlertCustom title="พนักงานคนนี้ถูกให้ออก" desc="เลขมท : มท123(กอพ.1)" icon="cancel" />
            </div> */} 

            {profile?.license_status_code === "30" && (
              <div className="flex justify-between w-full gap-3 items-center">
                <div className="cursor-pointer">
                  {requestData?.next_license_status === "อนุมัติแล้ว" ? (
                    <Link
                      href="#"
                      className="flex gap-2 items-center"
                      onClick={() => {
                        modalRef.current?.close();
                        driverLicenseDetailNextModalRef.current?.openModal();
                      }}
                    >
                      {" "}
                      <span className="text-brand-900 text-sm">
                        ขออนุมัติประจำปี {requestData?.next_annual_yyyy}
                      </span>
                      <div
                        className="badge badge-success"
                        onClick={() => {
                          modalRef.current?.close();
                          driverLicenseDetailNextModalRef.current?.openModal();
                        }}
                      >
                        {requestData.next_license_status}
                      </div>
                    </Link>
                  ) : requestData?.next_license_status === "หมดอายุ" ? (
                    <Link
                      href="#"
                      className="flex gap-2 items-center"
                      onClick={() => {
                        modalRef.current?.close();
                        driverLicenseDetailNextModalRef.current?.openModal();
                      }}
                    >
                      {" "}
                      <span className="text-brand-900 text-sm">
                        ขออนุมัติประจำปี {requestData?.next_annual_yyyy}
                      </span>
                      <div
                        className="badge badge-success"
                        onClick={() => {
                          modalRef.current?.close();
                          driverLicenseDetailNextModalRef.current?.openModal();
                        }}
                      >
                        {requestData.next_license_status}
                      </div>
                    </Link>
                  ) : requestData?.next_license_status === "มีผลปีถัดไป" ? (
                    <Link
                      href="#"
                      className="flex gap-2 items-center"
                      onClick={() => {
                        modalRef.current?.close();
                        if (onStepOne) onStepOne();
                      }}
                    >
                      {" "}
                      <span className="text-brand-900 text-sm">
                        ขออนุมัติประจำปี {requestData?.next_annual_yyyy}
                      </span>
                      <div className="badge badge-success">
                        {requestData.next_license_status}
                      </div>
                    </Link>
                  ) : requestData?.next_license_status === "ตีกลับ" ? (
                    <Link
                      href="#"
                      className="flex gap-2 items-center"
                      onClick={() => {
                        modalRef.current?.close();
                        if (onStepOneEdit) onStepOneEdit();
                      }}
                    >
                      {" "}
                      <span className="text-brand-900 text-sm">
                        ขออนุมัติประจำปี {requestData?.next_annual_yyyy}
                      </span>
                      <div className="badge badge-warning">
                        {requestData.next_license_status}
                      </div>
                    </Link>
                  ) : requestData?.next_license_status === "รออนุมัติ" ? (
                    <Link
                      href="#"
                      className="flex gap-2 items-center"
                      onClick={() => {
                        modalRef.current?.close();
                        if (showNextRequestStatus) showNextRequestStatus();
                      }}
                    >
                      {" "}
                      <span className="text-brand-900 text-sm">
                        ขออนุมัติประจำปี {requestData?.next_annual_yyyy}
                      </span>
                      <div className="badge badge-info">
                        {requestData.next_license_status}
                      </div>
                    </Link>
                  ) : requestData?.next_license_status === "ยกเลิก" ? (
                    <Link
                      href="#"
                      className="flex gap-2 items-center"
                      onClick={() => {
                        modalRef.current?.close();
                        if (showNextRequestStatus) showNextRequestStatus();
                      }}
                    >
                      {" "}
                      <span className="text-brand-900 text-sm">
                        ขออนุมัติประจำปี {requestData?.next_annual_yyyy}
                      </span>
                      <div className="badge badge-info">
                        {requestData.next_license_status}
                      </div>
                    </Link>
                  ) : (
                    requestData?.next_license_status === "ไม่มี" && (
                      <Link
                        href="#"
                        onClick={() => {
                          modalRef.current?.close();
                          if (onStepOne) onStepOne();
                        }}
                      >
                        {" "}
                        <span className="text-brand-900 text-sm">
                          ขออนุมัติประจำปี {requestData?.next_annual_yyyy}
                        </span>
                      </Link>
                    )
                  )}
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    modalRef.current?.close(); // Added parentheses to call the function
                    driverLicenseDetailModalRef.current?.openModal();
                  }}
                >
                  ดูรายละเอียด
                </button>
              </div>
            )}

            {profile?.license_status === "หมดอายุ" && (
              <div className="flex justify-end w-full gap-3 items-center">
                <div className="flex gap-2">
                  <button className="btn btn-secondary">ดูรายละเอียด</button>
                  <button className="btn btn-primary">อนุมัติคำขอ</button>
                </div>
              </div>
            )}
          </div>
        </div>
        <DriverLicenseDetailModal
          ref={driverLicenseDetailModalRef}
          onBack={onBack}
          trn_id={requestData?.trn_request_annual_driver_uid}
        />

<DriverLicenseDetailModal
          ref={driverLicenseDetailNextModalRef}
          onBack={onBack}
          trn_id={requestData?.next_trn_request_annual_driver_uid}
        />
      </dialog>
    );
  }
);

DriverLicenseModal.displayName = "DriverLicenseModal";

export default DriverLicenseModal;
