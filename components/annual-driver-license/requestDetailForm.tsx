import { RequestAnnualDriver } from "@/app/types/driver-lic-list-type";
import AlertCustom from "@/components/alertCustom";
import ApproveProgress from "@/components/approveProgress";
import ReferenceCard from "@/components/card/referenceCard";
import ApproverModal from "@/components/modal/approverModal";
import DisbursementModal from "@/components/modal/disbursementModal";
import JourneyDetailModal from "@/components/modal/journeyDetailModal";
import ReferenceModal from "@/components/modal/referenceModal";
import VehiclePickModel from "@/components/modal/vehiclePickModal";
import VehicleUserModal from "@/components/modal/vehicleUserModal";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import VehicleUserInfoCard from "@/components/annual-driver-license/vehicleUserInfoCard";
import { fetchDriverLicRequests } from "@/services/driver";

interface RequestDetailFormProps {
  requestId: string;
}

export default function RequestDetailForm({
  requestId,
}: RequestDetailFormProps) {
  const vehicleUserModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const journeyDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const vehiclePickModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const referenceModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const disbursementModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const approverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [requestData, setRequestData] = useState<RequestAnnualDriver>();

  const fetchRequestDetailfunc = async () => {
    try {
      const response = await fetchDriverLicRequests(requestId || "");
      console.log("res", response.data);
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  useEffect(() => {
    if(requestId){
      fetchRequestDetailfunc();
    }

  }, [requestId]);

  const handleDownload = () => {
    // Implement download functionality
    console.log("Downloading driver license image");
  };

  return (
    <>
      {requestData?.rejected_request?.rejected_request_reason && (
        <AlertCustom 
          title="คำขอใช้ถูกตีกลับ" 
          desc={`เหตุผล: ${requestData?.rejected_request?.rejected_request_reason}`} 
        />
      )}
      
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ขออนุมัติ</div>
            </div>
            <VehicleUserInfoCard
              created_request_datetime={requestData?.created_request_datetime || ""}
              created_request_emp_id={requestData?.created_request_emp_id  || ""}
              created_request_emp_name={requestData?.created_request_emp_name  || ""}
              created_request_emp_position={requestData?.created_request_emp_position  || ""}
              created_request_dept_sap={requestData?.created_request_dept_sap  || ""}
              created_request_dept_sap_name_short={requestData?.created_request_dept_sap_name_short  || ""}
              created_request_dept_sap_name_full={requestData?.created_request_dept_sap_name_full  || ""}
              created_request_phone_number={requestData?.created_request_phone_number  || ""}
              created_request_mobile_number={requestData?.created_request_mobile_number  || ""}
              created_request_image_url={requestData?.created_request_image_url  || ""}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">รายละเอียดคำขอ</div>
            </div>
            <ReferenceCard
              refNum={requestData?.request_annual_driver_no}
              file={requestData?.driver_license_img} // Assuming this is the attached document
            />
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
                          {convertToBuddhistDateTime(
                            requestData?.driver_license_expire_date || ""
                          ).date}
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
                        <i className="material-symbols-outlined">developer_guide</i>
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
                        <i className="material-symbols-outlined">front_loader</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">ประเภทยานพาหนะ</div>
                          <div className="form-desc">
                            {requestData?.driver_certificate_type?.ref_driver_certificate_type_name}
                          </div>
                        </div>
                      </div>
                    </div>
          
                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">calendar_month</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">วันที่อบรม</div>
                          <div className="form-desc">
                            {convertToBuddhistDateTime(
                              requestData?.driver_certificate_issue_date
                            ).date}
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
                            <i className="material-symbols-outlined">download</i>
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
            <ApproveProgress
              progressSteps={requestData?.progress_request_status}
              approverId={`${requestData?.approved_request?.emp_id}`}
            />
          </div>
        </div>
      </div>

      <VehiclePickModel process="edit" ref={vehiclePickModalRef} />
      <JourneyDetailModal ref={journeyDetailModalRef} />
      <VehicleUserModal process="edit" ref={vehicleUserModalRef} />
      <ReferenceModal ref={referenceModalRef} />
      <DisbursementModal ref={disbursementModalRef} />
      <ApproverModal ref={approverModalRef} />
    </>
  );
}