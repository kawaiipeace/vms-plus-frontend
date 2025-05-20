"use client";

import { CarpoolForm } from "@/app/types/carpool-management-type";
import { createContext, useContext, useState, ReactNode } from "react";

interface RequestFormContextType {
  formData: CarpoolForm;
  updateFormData: (newData: Partial<CarpoolForm>) => void;
}

const FormContext = createContext<RequestFormContextType | undefined>(
  undefined
);

export const CarpoolProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<CarpoolForm>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("formCarpoolData");
      return storedData ? JSON.parse(storedData) : {};
    }
    return {};
  });

  const updateFormData = (newData: Partial<CarpoolForm>) => {
    if (Object.keys(newData).length === 0) {
      setFormData(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("formCarpoolData", JSON.stringify(newData));
        }
        return newData as CarpoolForm;
      });
    } else {
      setFormData((prev) => {
        const updatedData = { ...prev, ...newData };
        if (typeof window !== "undefined") {
          localStorage.setItem("formCarpoolData", JSON.stringify(updatedData));
        }
        return updatedData;
      });
    }
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
