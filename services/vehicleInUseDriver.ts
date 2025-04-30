import { ReceivedKeyDriverParams } from "@/app/types/vehicle-in-use-driver-type";
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
