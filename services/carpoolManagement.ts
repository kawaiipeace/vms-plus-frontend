import {
  CarpoolAdminCreate,
  CarpoolApproverCreate,
  CarpoolDriverParams,
  CarpoolForm,
  CarpoolParams,
  CarpoolVehicleParams,
} from "@/app/types/carpool-management-type";
import axiosInstance from "@/utils/axiosInstance";

export const carpoolManagementSearch = async (params: CarpoolParams) => {
  try {
    const response = await axiosInstance.get("carpool-management/search", {
      params,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const chooseCarChoice = async () => {
  try {
    const response = await axiosInstance.get("ref/carpool-choose-car");

    return response;
  } catch (error) {
    throw error;
  }
};

export const chooseDriverChoice = async () => {
  try {
    const response = await axiosInstance.get("ref/carpool-choose-driver");

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolAdmin = async () => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/admin-mas-search"
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolApprover = async () => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/approver-mas-search"
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolVehicle = async (params: CarpoolVehicleParams) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/vehicle-mas-search",
      { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolDriver = async (params: CarpoolDriverParams) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/driver-mas-search",
      { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolDepartment = async () => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/mas-department"
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolDepartmentByType = async (type: string) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/mas-department/" + type
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolManagementId = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/carpool/" + id
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const postCarpoolCreate = async (data: CarpoolForm) => {
  try {
    const response = await axiosInstance.post(
      "carpool-management/create",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const postCarpoolAdminCreate = async (data: CarpoolAdminCreate) => {
  try {
    const response = await axiosInstance.post(
      "carpool-management/admin-create",
      [data]
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolAdminSearch = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/admin-search/" + id
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const postCarpoolApproverCreate = async (
  data: CarpoolApproverCreate
) => {
  try {
    const response = await axiosInstance.post(
      "carpool-management/approver-create",
      [data]
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolApproverSearch = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/approver-search/" + id
    );

    return response;
  } catch (error) {
    throw error;
  }
};
