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
      "received-vehicle-admin/search-requests",
      { params }
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

