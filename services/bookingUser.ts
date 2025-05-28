import { CanceledRequestType, SendbackRequestType } from "@/app/types/request-action-type";
import axiosInstance from "@/utils/axiosInstance";

export const requests = async (params: {
  search?: string;
  ref_request_status_code?: string;
  startdate?: string;
  enddate?: string;
  order_by?: string;
  order_dir?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await axiosInstance.get("booking-user/search-requests", { params });

    return response;
  } catch (error) {
    throw error;
  }
};

export const requestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get("booking-user/request/" + id);

    return response;
  } catch (error) {
    throw error;
  }
};

export const createRequest = async (data: any) => {
  try {
    const response = await axiosInstance.post("booking-user/create-request", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const cancelRequest = async (data: CanceledRequestType) => {
  try {
    const response = await axiosInstance.put("booking-user/update-canceled", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateSendback = async (data: SendbackRequestType) => {
  try {
    const response = await axiosInstance.put("booking-user/update-resend", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchMenus = async () => {
  try {
    const response = await axiosInstance.get("booking-user/menu-requests");
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateVehicleUser = async (data: any) => {
  try {
    const response = await axiosInstance.put("booking-user/update-vehicle-user", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateTrip = async (data: any) => {
  try {
    const response = await axiosInstance.put("booking-user/update-trip", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePickup = async (data: any) => {
  try {
    const response = await axiosInstance.put("booking-user/update-pickup", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateRef = async (data: any) => {
  try {
    const response = await axiosInstance.put("booking-user/update-document", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCost = async (data: any) => {
  try {
    const response = await axiosInstance.put("booking-user/update-cost", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateVehicleType = async (data: any) => {
  try {
    const response = await axiosInstance.put("booking-user/update-vehicle-type", data);
    return response;
  } catch (error) {
    throw error;
  }
};
