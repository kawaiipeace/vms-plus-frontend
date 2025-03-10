"use client";
import { createContext, useContext, useState } from "react";

interface FormData {
    internalPhone?: string;
    phone?: string;
    workPlace?: string;
    purpose?: string;
    attachedDocument?: string;
    costNo?: string;
    endDatetime?: string;
    isAdminChooseDriver?: string;
    isAdminChooseVehicle?: string;
    isDriverNeed?: string;
    isHaveSubRequest?: string;
    isPeaEmployeeDriver?: string;
    masCarpoolDriverUid?: string;
    masVehicleUid?: string;
    numberOfPassengers?: number;
    pickupDatetime?: string;
    pickupPlace?: string;
    refCostTypeCode?: number;
    refRequestTypeCode?: number;
    referenceNumber?: string;
    remark?: string;
    requestedVehicleTypeId?: number;
    reservedTimeType?: string;
    startDatetime?: string;
    tripType?: number;
    vehicleUserDeptSap?: string;
    vehicleUserEmpId?: string;
    vehicleUserEmpName?: string;
}

interface RequestFormContextType {
  formData: FormData;
  updateFormData: (newData: Partial<FormData>) => void;
}

const FormContext = createContext<RequestFormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [formData, setFormData] = useState<FormData>({});

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
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
