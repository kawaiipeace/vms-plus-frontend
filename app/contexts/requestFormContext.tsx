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
  // Initialize formData with data from localStorage if available
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("formData");
      return storedData ? JSON.parse(storedData) : {};
    }
    return {};
  });

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => {
      const updatedData = { ...prev, ...newData };
      // Save the updated formData to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("formData", JSON.stringify(updatedData));
      }
      return updatedData;
    });
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
