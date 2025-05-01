import axiosInstance from "@/utils/axiosInstance";

export const fetchRequests = async (params: {
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

export const adminReceivedVehicle = async (data: any) => {
  try {
    const response = await axiosInstance.put("received-vehicle-admin/received-vehicle", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehiclePickupRequestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get('received-key-admin/request/' + id);

    return response;

  } catch (error) {
    throw error;
  }
};

export const fetchTravelDetailTrips = async (id: string,search?: string) => {
  try {
    const response = await axiosInstance.get(`vehicle-in-use-admin/travel-details/${id}?search=`+search);

    return response;

  } catch (error) {
    throw error;
  }
};

export const adminDeleteTravelDetail = async (id: string) => {
  try {
    const response = await axiosInstance.delete("vehicle-in-use/delete-travel-detail/" + id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehicleInsRequests = async (params: {
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
      "vehicle-inspection-admin/search-requests",
      { params }
    );
    return response;
  } catch (error) {
    throw error;
  }
};



