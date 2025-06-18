"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import ProcessRequestCar from "@/components/processRequestCar";
import SideBar from "@/components/sideBar";
import RequestEditForm from "@/components/flow/requestEditForm";
import TermAndConditionModal from "@/components/modal/termAndConditionModal";
import Link from "next/link";
import { createRequest } from "@/services/bookingUser";
import { FormDataType } from "@/app/types/form-data-type";
import { convertToISO } from "@/utils/convertToISO";
import { useFormContext } from "@/contexts/requestFormContext";

export default function ProcessFour() {
  const router = useRouter();
  const { isPinned } = useSidebar();
  const { updateFormData } = useFormContext();
  const termAndConditionModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  // const [formData, setFormData] = useState<FormDataType>();

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const storedData = localStorage.getItem("formData");
  //     if (storedData) {
  //       setFormData(JSON.parse(storedData));
  //     }
  //   }
  // }, []);

const nextStep = async () => {
  const storedData = localStorage.getItem("formData");
  const latestFormData: FormDataType | undefined = storedData ? JSON.parse(storedData) : undefined;

  if (latestFormData) {
    const mappedData = {
      confirmed_request_emp_id: latestFormData.approvedRequestEmpId,
      doc_file: latestFormData.attachmentFile || "",
      car_user_internal_contact_number: latestFormData.telInternal || "",
      car_user_mobile_contact_number: latestFormData.telMobile || "",
      cost_no: latestFormData.referenceNumber || "",
      driver_emp_dept_sap: latestFormData.driverDeptSap || "",
      driver_emp_id: latestFormData.driverEmpID || "",
      driver_emp_name: latestFormData.driverEmpName || "",
      driver_internal_contact_number: latestFormData.driverInternalContact || "",
      driver_mobile_contact_number: latestFormData.driverMobileContact || "",
      end_datetime: convertToISO(
        String(latestFormData.endDate),
        String(latestFormData.timeEnd)
      ),
      is_admin_choose_vehicle: latestFormData.isAdminChooseVehicle || "0",
      is_pea_employee_driver: latestFormData.isPeaEmployeeDriver || "0",
      mas_vehicle_uid: latestFormData.masVehicleUid,
      number_of_passengers: latestFormData.numberOfPassenger || 0,
      work_description: latestFormData.purpose || "",
      pickup_datetime: latestFormData.pickupDatetime || null,
      pickup_place: latestFormData.pickupPlace || "",
      ref_cost_type_code: parseInt(latestFormData.refCostTypeCode || ""),
      doc_no: latestFormData.referenceNumber || "",
      remark: latestFormData.remark || "",
      requested_vehicle_type: latestFormData.masCarpoolUid === "" ? "" : latestFormData.requestedVehicleTypeName,
      reserved_time_type: "1",
      start_datetime: convertToISO(
        String(latestFormData.startDate),
        String(latestFormData.timeStart)
      ),
      trip_type: String(latestFormData.tripType) === "0" ? 0 : 1,
      vehicle_user_dept_sap: latestFormData.vehicleUserDeptSap || "",
      vehicle_user_emp_id: latestFormData.vehicleUserEmpId || "",
      vehicle_user_emp_name: latestFormData.vehicleUserEmpName || "",
      work_place: latestFormData.workPlace || "",
      is_system_choose_vehicle: latestFormData.isSystemChooseVehicle || "0",
      pm_order_no: latestFormData.pmOrderNo || "",
      wbs_no: latestFormData.wbsNumber || "",
      activity_no: latestFormData.activityNo || "",
      cost_center: latestFormData.costCenter || "",
      mas_carpool_driver_uid: latestFormData.masCarpoolDriverUid || null,
      mas_carpool_uid: latestFormData.masCarpoolUid || null,
    };

    try {
      const response = await createRequest(mappedData);
      if (response.data) {
        localStorage.removeItem("formData");
        localStorage.removeItem("processOne");
        localStorage.removeItem("processTwo");
        localStorage.removeItem("processThree");
        updateFormData({});
        sessionStorage.clear();
        router.push(
          "request-list?create-req=success&request-id=" +
            response.data.trn_request_uid
        );
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  } else {
    console.warn("No formData found!");
  }
};






  return (
    <div>
      <div className="main-container">
        <SideBar menuName="คำขอใช้ยานพาหนะ" />

        <div
          className={`main-content ${
            isPinned ? "md:pl-[280px]" : "md:pl-[80px]"
          }`}
        >
          <Header />
          <div className="main-content-body">
            <div className="page-header">
              <div className="breadcrumbs text-sm">
                <ul>
                  <li className="breadcrumb-item">
                    <a>
                      <i className="material-symbols-outlined">home</i>
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="request-list">คำขอใช้ยานพาหนะ</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    สร้างคำขอใช้ยานพาหนะ
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">สร้างคำขอใช้ยานพาหนะ</span>
                </div>
              </div>
            </div>

            <ProcessRequestCar step={4} />

            <div className="form-steps-group">
              <div className="form-steps" data-step="4">
                <div className="form-section">
                  <div className="page-section-header border-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">
                          ยืนยันการสร้างคำขอ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <RequestEditForm approverCard={true} />
              </div>

              <div className="form-accept">
                การกดปุ่ม “สร้างคำขอ” จะถือว่าท่านอ่านและตกลงยอมรับ
                <a
                  onClick={() => termAndConditionModalRef.current?.openModal()}
                  href="#"
                  className="text-info text-underline"
                >
                  เงื่อนไข หลักเกณฑ์ และระเบียบการใช้ยานพาหนะ
                </a>
              </div>

              <div className="form-action">
                <button className="btn btn-primary" onClick={() => nextStep()}>
                  สร้างคำขอ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TermAndConditionModal ref={termAndConditionModalRef} />
    </div>
  );
}
