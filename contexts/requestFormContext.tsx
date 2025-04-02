"use client";
import { FormDataType } from "@/app/types/form-data-type";
import { createContext, useContext, useState, ReactNode } from "react";

interface RequestFormContextType {
  formData: FormDataType;
  updateFormData: (newData: Partial<FormDataType>) => void;
}

const FormContext = createContext<RequestFormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormDataType>(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("formData");
      return storedData ? JSON.parse(storedData) : {};
    }
    return {};
  });

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