import { RequestAnnualDriver } from "@/app/types/driver-lic-list-type";
import AlertCustom from "@/components/alertCustom";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import VehicleUserInfoCard from "@/components/annual-driver-license/vehicleUserInfoCard";
import { fetchFinalRequestDetail, fetchRequestDetail } from "@/services/driver";
import DrivingRequestProgress from "./drivingRequestProgress";
import EditApproverModal from "./editApproverModal";
import DriverPeaInfoCard from "../card/driverPeaInfoCard";
import ToastCustom from "../toastCustom";
import EditFinalApproverModal from "./editFinalApproverModal";

interface RequestDetailFormProps {
  requestId: string;
  licType: string;
}

export default function RequestDetailForm({
  requestId,
  licType
}: RequestDetailFormProps) {
  const editFinalApproverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [requestData, setRequestData] = useState<RequestAnnualDriver>();
  const [toastStatus, setToastStatus] = useState<"success" | "error" | "">("");

  const fetchRequestDetailfunc = async () => {
    try {
      let response;
      if (licType === "ตรวจสอบ") {
        response = await fetchRequestDetail(requestId);
      } else {
        response = await fetchFinalRequestDetail(requestId);
      }

      console.log("res", response.data);
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  const handleModalUpdate = () => {
    console.log("tstsuccess");
    setToastStatus("success");
    fetchRequestDetailfunc();
  };
  useEffect(() => {
    if (requestId) {
      fetchRequestDetailfunc();
    }
  }, [requestId]);

  const handleDownload = () => {
    // Implement download functionality
    console.log("Downloading driver license image");
  };

  return (
    <>
      {(requestData?.ref_request_annual_driver_status_code === "11" ||
        requestData?.ref_request_annual_driver_status_code === "21") && (
        <AlertCustom
          title="คำขอใช้ถูกตีกลับ"
          desc={`เหตุผล: ${requestData?.rejected_request_reason}`}
        />
      )}

      {toastStatus === "success" && (
        <ToastCustom
          title="แก้ไขผู้อนุมัติให้ทำหน้าที่ขับรถยนต์สำเร็จ"
          desc={
            <>
              คำขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี{" "}
              {requestData?.request_annual_driver_no}
              <br />
              แก้ไขเรียบร้อยแล้ว
            </>
          }
          status="success"
        />
      )}

      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ขออนุมัติ</div>
            </div>
            <VehicleUserInfoCard
              created_request_datetime={
                requestData?.created_request_datetime || ""
              }
              created_request_emp_id={requestData?.created_request_emp_id || ""}
              created_request_emp_name={
                requestData?.created_request_emp_name || ""
              }
              created_request_emp_position={
                requestData?.created_request_emp_position || ""
              }
              created_request_dept_sap={
                requestData?.created_request_dept_sap || ""
              }
              created_request_dept_sap_name_short={
                requestData?.created_request_dept_sap_name_short || ""
              }
              created_request_dept_sap_name_full={
                requestData?.created_request_dept_sap_name_full || ""
              }
              created_request_phone_number={
                requestData?.created_request_phone_number || ""
              }
              created_request_mobile_number={
                requestData?.created_request_mobile_number || ""
              }
              created_request_image_url={
                requestData?.created_request_image_url || ""
              }
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">รายละเอียดคำขอ</div>
            </div>
            <div className="form-card">
              <div className="form-card-body">
                <div className="grid grid-cols-12">
                  <div className="col-span-12 md:col-span-6">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">
                        directions_car
                      </i>
                      <div className="form-plaintext-group">
                        <div className="form-label">
                          {
                            requestData?.driver_license_type
                              .ref_driver_license_type_name
                          }
                        </div>
                        <div className="form-text">
                          {
                            requestData?.driver_license_type
                              .ref_driver_license_type_desc
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
                        <div className="form-label">ประจำปี</div>
                        <div className="form-text">
                          {requestData?.annual_yyyy}
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
                          {requestData?.driver_license_no}
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
                              requestData?.driver_license_expire_date || ""
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
                      <div className="w-[50%] relative">
                        <Image
                          src={
                            requestData?.driver_license_img ||
                            "/assets/img/ex_driver_license.png"
                          }
                          className="w-full"
                          width={100}
                          height={100}
                          alt="Driver License"
                        />
                        <button
                          onClick={handleDownload}
                          className="btn btn-circle btn-secondary absolute top-5 right-5 btn-md"
                        >
                          <i className="material-symbols-outlined">download</i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(requestData?.ref_driver_license_type_code === "2+" ||
            requestData?.ref_driver_license_type_code === "3+") && (
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
                            {requestData?.driver_certificate_name}
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
                            {requestData?.driver_certificate_no}
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
                            {
                              requestData?.driver_certificate_type
                                ?.ref_driver_certificate_type_name
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
                            {
                              convertToBuddhistDateTime(
                                requestData?.driver_certificate_issue_date
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
                            {
                              convertToBuddhistDateTime(
                                requestData?.driver_certificate_expire_date
                              ).date
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 mt-3">
                      <div className="form-plaintext-group">
                        <div className="form-label font-semibold">
                          รูปใบรับรองการอบรม
                        </div>
                        <div className="w-full relative">
                          <Image
                            src={
                              requestData?.driver_certificate_img ||
                              "/assets/img/ex_certificate.png"
                            }
                            className="w-full"
                            width={100}
                            height={100}
                            alt="Driver Certificate"
                          />
                          <button
                            onClick={handleDownload}
                            className="btn btn-circle btn-secondary absolute top-5 right-5 btn-md"
                          >
                            <i className="material-symbols-outlined">
                              download
                            </i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">
            {(requestData?.ref_request_annual_driver_status_code === "10" ||
              requestData?.ref_request_annual_driver_status_code === "11") && (
              <DrivingRequestProgress
                progressSteps={requestData?.progress_request_status}
                title="ผู้ตรวจสอบ"
                confirmedRequest={{
                  confirmed_request_datetime:
                    requestData?.confirmed_request_datetime ||
                    "0001-01-01T00:00:00Z",
                  confirmed_request_dept_sap:
                    requestData?.confirmed_request_dept_sap || "9121",
                  confirmed_request_dept_sap_full:
                    requestData?.confirmed_request_dept_sap_full ||
                    "สถานีไฟฟ้าแม่สอด 4 (ลานไก)",
                  confirmed_request_dept_sap_short:
                    requestData?.confirmed_request_dept_sap_short ||
                    "สฟฟ.มสด.4(ล)",
                  confirmed_request_emp_id:
                    requestData?.confirmed_request_emp_id || "990001",
                  confirmed_request_emp_name:
                    requestData?.confirmed_request_emp_name || "ปัณณธร อ",
                  confirmed_request_emp_position:
                    requestData?.confirmed_request_emp_position || "",
                  confirmed_request_image_url:
                    requestData?.confirmed_request_image_url ||
                    "https://pictureapi.pea.co.th/MyphotoAPI/api/v1/Main/GetPicImg?EmpCode=990001&Type=2&SType=2",
                  confirmed_request_mobile_number:
                    requestData?.confirmed_request_mobile_number || "",
                  confirmed_request_phone_number:
                    requestData?.confirmed_request_phone_number || "",
                }}
              />
            )}

            {(requestData?.ref_request_annual_driver_status_code === "20" ||
              requestData?.ref_request_annual_driver_status_code === "30") && (
              <DrivingRequestProgress
                progressSteps={requestData?.progress_request_status}
                title="ผู้อนุมัติ"
                confirmedRequest={{
                  confirmed_request_datetime:
                    requestData?.approved_request_datetime ||
                    "0001-01-01T00:00:00Z",
                  confirmed_request_dept_sap:
                    requestData?.approved_request_dept_sap || "9121",
                  confirmed_request_dept_sap_full:
                    requestData?.approved_request_dept_sap_full ||
                    "สถานีไฟฟ้าแม่สอด 4 (ลานไก)",
                  confirmed_request_dept_sap_short:
                    requestData?.approved_request_dept_sap_short ||
                    "สฟฟ.มสด.4(ล)",
                  confirmed_request_emp_id:
                    requestData?.approved_request_emp_id || "990001",
                  confirmed_request_emp_name:
                    requestData?.approved_request_emp_name || "ปัณณธร อ",
                  confirmed_request_emp_position:
                    requestData?.approved_request_emp_position || "",
                  confirmed_request_image_url:
                    requestData?.approved_request_image_url ||
                    "https://pictureapi.pea.co.th/MyphotoAPI/api/v1/Main/GetPicImg?EmpCode=990001&Type=2&SType=2",
                  confirmed_request_mobile_number:
                    requestData?.approved_request_mobile_number || "",
                  confirmed_request_phone_number:
                    requestData?.approved_request_phone_number || "",
                }}
              />
            )}
          </div>

          {requestData?.ref_request_annual_driver_status_code === "10" && (
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  ผู้อนุมัติให้ทำหน้าที่ขับรถยนต์
                </div>

                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => editFinalApproverModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              </div>
              <DriverPeaInfoCard
                driver_emp_id={requestData?.approved_request_emp_id}
                driver_emp_name={requestData?.approved_request_emp_name}
                driver_emp_dept_sap={
                  requestData?.approved_request_dept_sap_short
                }
                driver_internal_contact_number={
                  requestData?.approved_request_phone_number
                }
                driver_mobile_contact_number={
                  requestData?.approved_request_mobile_number
                }
                driver_image_url={requestData?.approved_request_image_url}
              />
            </div>
          )}
        </div>
      </div>

      <EditFinalApproverModal
        ref={editFinalApproverModalRef}
        requestData={requestData}
        title={"แก้ไขผู้อนุมัติให้ทำหน้าที่ขับรถยนต์"}
        onSubmitForm={handleModalUpdate}
      />
    </>
  );
}
