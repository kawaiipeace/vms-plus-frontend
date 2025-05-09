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

export const updateDriverStatus = async (driverUid: string, isActive: string) => {
  try {
    const response = await axiosInstance.put(`driver-management/update-driver-is-active`, {
      is_active: isActive,
      mas_driver_uid: driverUid,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const listUseByOtherRadio = async () => {
  try {
    const response = await axiosInstance.get("ref/driver-other-use");
    return response;
  } catch (error) {
    throw error;
  }
};

export const listDriverLicense = async () => {
  try {
    const response = await axiosInstance.get("ref/driver-license-type");
    return response;
  } catch (error) {
    throw error;
  }
};

export const DriverInfo = async (driverUid: string) => {
  try {
    const response = await axiosInstance.get(`driver-management/driver/${driverUid}`);
    return response;
  } catch (error) {
    throw error;
  }
};
