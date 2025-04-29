import { CanceledRequestType } from "@/app/types/request-action-type";
import axiosInstance from "@/utils/axiosInstance";

export const fetchKeyRequests = async (params: {
  search?: string;
  vehicle_owner_dept_sap?: string;
  ref_request_status_code?: string;
  startdate?: string;
  enddate?: string;
  order_by?: string;
  order_dir?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await axiosInstance.get(
      "received-key-admin/search-requests",
      { params }
    );
    console.log("res----", response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateRecivedKeyHandover = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "received-key-admin/update-recieived-key",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchRequestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get('received-key-admin/request/' + id);

    return response;

  } catch (error) {
    throw error;
  }
};

export const keyCancelRequest = async (data: CanceledRequestType) => {
  try {
    const response = await axiosInstance.put('received-key-admin/update-canceled',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

