import {
  CarpoolsParams,
  CarpoolVehicleParams,
} from "@/app/types/carpool-management-type";
import axiosInstance from "@/utils/axiosInstance";

export const carpoolManagementSearch = async (params: CarpoolsParams) => {
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
