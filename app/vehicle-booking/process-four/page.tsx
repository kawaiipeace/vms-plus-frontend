"use client";
import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import ProcessRequestCar from "@/components/processRequestCar";
import SideBar from "@/components/sideBar";
import RequestDetailForm from "@/components/flow/requestDetailForm";
import TermAndConditionModal from "@/components/modal/termAndConditionModal";
import Link from "next/link";
import { createRequest } from "@/services/bookingUser";

export default function ProcessFour() {
  const router = useRouter();
  const { isPinned } = useSidebar();
  const termAndConditionModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [formData, setFormData] = useState<any>({});

  // Load formData from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("formData");
      if (storedData) {
        setFormData(JSON.parse(storedData));
      }
    }
  }, []);

  const nextStep = async () => {
    if (formData) {
      const mappedData = {
        approved_request_dept_sap: formData.approvedRequestDeptSap,
        approved_request_dept_sap_full: formData.approvedRequestDeptSapFull,
        approved_request_dept_sap_short: formData.approvedRequestDeptSapShort,
        approved_request_emp_id: formData.approvedRequestEmpId,
        approved_request_emp_name: formData.approvedRequestEmpName,
        attached_document: formData.attachmentFile || "",
        car_user_internal_contact_number: formData.telInternal || "",
        car_user_mobidriver_mobile_contact_numberle_contact_number:
          formData.driverMobileContact || "",
        car_user_mobile_contact_number: formData.telMobile || "",
        cost_no: formData.referenceNumber || "",
        driver_emp_dept_sap: formData.driverDeptSap || "",
        driver_emp_id: formData.driverEmpID || "",
        driver_emp_name: formData.driverEmpName || "",
        driver_internal_contact_number: formData.driverInternalContact || "",
        end_datetime: "2025-01-01T10:00:00Z",
        is_admin_choose_vehicle: formData.isAdminChooseVehicle || "0",
        is_pea_employee_driver: "1", // Assume always PEA employee, adjust as needed
        mas_carpool_driver_uid: formData.masCarpoolDriverUid || "", // If you have this info, map it
        mas_vehicle_uid: formData.vehicleSelect || "",
        number_of_passengers: formData.numberOfPassenger || 0,
        objective: formData.purpose || "",
        pickup_datetime: formData.pickupDatetime || "",
        pickup_place: formData.pickupPlace || "", // Fill if needed
        ref_cost_type_code: parseInt(formData.refCostTypeCode) || 101,
        reference_number: formData.referenceNumber || "",
        remark: formData.remark || "",
        requested_vehicle_type_id: 1, // You can map vehicleTypeSelect if it matches
        reserved_time_type: "1", // Adjust based on logic
        start_datetime: "2025-01-01T08:00:00Z",
        trip_type: parseInt(formData.tripType) || 1,
        vehicle_user_dept_sap: formData.deptSap || "",
        vehicle_user_emp_id: formData.vehicleUserEmpId || "",
        vehicle_user_emp_name: formData.vehicleUserEmpName || "",
        work_place: formData.workPlace || "",

        // attached_document: formData.attachmentFile || "",
        // car_user_internal_contact_number: formData.telInternal || "",
        // car_user_mobidriver_mobile_contact_numberle_contact_number:
        //   formData.driverMobileContact || "",
        // car_user_mobile_contact_number: formData.telMobile || "",
        // cost_no: formData.referenceNumber || "",
        // driver_emp_dept_sap: formData.driverDeptSap || "",
        // driver_emp_id: formData.driverEmpID || "",
        // driver_emp_name: formData.driverEmpName || "",
        // driver_internal_contact_number: formData.driverInternalContact || "",
        // end_datetime: "2025-01-01T10:00:00Z",
        // is_admin_choose_vehicle: formData.isAdminChooseVehicle || "0",
        // is_pea_employee_driver: "1", // Assume always PEA employee, adjust as needed
        // mas_carpool_driver_uid: formData.masCarpoolDriverUid || "", // If you have this info, map it
        // mas_vehicle_uid: formData.vehicleSelect || "",
        // number_of_passengers: formData.numberOfPassenger || 0,
        // objective: formData.purpose || "",
        // pickup_datetime: formData.pickupDatetime || "",
        // pickup_place: formData.pickupPlace || "", // Fill if needed
        // ref_cost_type_code: parseInt(formData.refCostTypeCode) || 101,
        // reference_number: formData.referenceNumber || "",
        // remark: formData.remark || "",
        // requested_vehicle_type_id: 1, // You can map vehicleTypeSelect if it matches
        // reserved_time_type: "1", // Adjust based on logic
        // start_datetime: "2025-01-01T08:00:00Z",
        // trip_type: parseInt(formData.tripType) || 1,
        // vehicle_user_dept_sap: formData.deptSap || "",
        // vehicle_user_emp_id: formData.vehicleUserEmpId || "",
        // vehicle_user_emp_name: formData.vehicleUserEmpName || "",
        // work_place: formData.workPlace || "",
      };

      console.log("Mapped Data:", mappedData);

      try {
        const response = await createRequest(mappedData);
        console.log("API Response:", response.data);
        if (response.data) {
          router.push("request-list?created=success");
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
                <RequestDetailForm status="add" approverCard={true} />{" "}
                {/* Pass formData as prop */}
              </div>

              <div className="form-accept">
                การกดปุ่ม “สร้างคำขอ” จะถือว่าท่านอ่านและตกลงยอมรับ{" "}
                <a
                  onClick={() => termAndConditionModalRef.current?.openModal()}
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
