import axiosInstance from "@/utils/axiosInstance";
import { DriversManagementParams } from "@/app/types/drivers-management-type";

export const driversMamagement = async (params: DriversManagementParams) => {
  try {
    const response = await axiosInstance.get("driver-management/search", { params });
    return response;
  } catch (error) {
    throw error;
  }
};
