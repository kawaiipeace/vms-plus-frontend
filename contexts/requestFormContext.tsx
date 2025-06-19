"use client";
import { FormDataType } from "@/app/types/form-data-type";
import { createContext, useContext, useState, ReactNode } from "react";

interface RequestFormContextType {
  formData: FormDataType;
  updateFormData: (newData: Partial<FormDataType>) => void;
  resetFormData: () => void;
}

const defaultFormData: FormDataType = {
  approvedRequestDeptSap: "",
  approvedRequestDeptSapFull: "",
  approvedRequestDeptSapShort: "",
  approvedRequestEmpId: "",
  approvedRequestEmpName: "",
  telInternal: "",
  telMobile: "",
  workPlace: "",
  purpose: "",
  attachmentFile: "",
  doc_no: "",
  doc_file: "",
  carpoolName: "",
  costNo: "",
  costOrigin: "",
  costCenter: "",
  wbsNumber: "",
  vehicleType: "",
  masCarpoolUid: "",
  networkNo: "",
  activityNo: "",
  pmOrderNo: "",
  endDatetime: "",
  isAdminChooseDriver: false,
  isSystemChooseVehicle: "",
  isAdminChooseVehicle: "",
  isDriverNeed: "",
  isHaveSubRequest: "",
  isPeaEmployeeDriver: "",
  vehicleUserEmpPosition: "",
  masCarpoolDriverUid: "",
  masVehicleUid: "",
  numberOfPassenger: 0,
  pickupDatetime: "",
  pickupPlace: "",
  refCostTypeCode: "",
  refRequestTypeCode: 0,
  referenceNumber: "",
  remark: "",
  requestedVehicleTypeId: 0,
  requestedVehicleTypeName: "",
  reservedTimeType: "",
  startDate: "",
  endDate: "",
  timeStart: "",
  timeEnd: "",
  tripType: 0,
  vehicleUserDeptSap: "",
  vehicleUserEmpId: "",
  vehicleUserEmpName: "",
  deptSapShort: "",
  userImageUrl: "",
  vehicleSelect: "",
  driverInternalContact: "",
  driverMobileContact: "",
  driverEmpID: "",
  driverEmpName: "",
  driverEmpPosition: "",
  driverDeptSap: "",
};

const FormContext = createContext<RequestFormContextType | undefined>(
  undefined
);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormDataType>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("formData");
      return storedData ? JSON.parse(storedData) : {};
    }
    return {};
  });

  const resetFormData = () => setFormData(defaultFormData);

  const updateFormData = (newData: Partial<FormDataType>) => {
    setFormData((prev) => {
      const updatedData = { ...prev, ...newData };
      if (typeof window !== "undefined") {
        localStorage.setItem("formData", JSON.stringify(updatedData));
      }
      return updatedData;
    });
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};
