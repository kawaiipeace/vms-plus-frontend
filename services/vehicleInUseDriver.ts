import {
  RequestReceivedKeyDriver,
  ReceivedKeyDriverParams,
} from "@/app/types/vehicle-in-use-driver-type";
import axiosInstance from "@/utils/axiosInstance";

export const fetchMenus = async () => {
  try {
    const response = await axiosInstance.get("booking-driver/menu-requests");
    return response;
  } catch (error) {
    throw error;
  }
};

export const receivedKeyDriver = async (params: ReceivedKeyDriverParams) => {
  try {
    const response = await axiosInstance.get(
      "received-key-driver/search-requests",
      { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const receivedKeyDriverRequest = async (trn_request_uid: string) => {
  try {
    const response = await axiosInstance.get(
      "received-key-driver/request/" + trn_request_uid
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const requestReceivedKeyDriver = async (
  data: RequestReceivedKeyDriver
) => {
  try {
    const response = await axiosInstance.put(
      "received-key-driver/update-recieived-key-confirmed",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDriverTravelDetails = async (
  id: string,
  params: { search?: string }
) => {
  try {
    const response = await axiosInstance.get(
      `vehicle-in-use-driver/travel-details/` + id,
      { params }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverCreateTravelDetail = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      "vehicle-in-use-driver/create-travel-detail",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverUpdateTravelDetail = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-in-use-driver/update-travel-detail/" + id,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserAddFuelDetails = async (
  id: string,
  params: { search?: string }
) => {
  try {
    const response = await axiosInstance.get(
      `vehicle-in-use-driver/add-fuel-details/` + id,
      { params }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
