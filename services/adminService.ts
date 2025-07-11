import { SendbackRequestType } from "@/app/types/request-action-type";
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
    const response = await axiosInstance.get(
      "received-key-admin/request/" + id
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const adminReceivedVehicle = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "received-vehicle-admin/received-vehicle",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehiclePickupRequestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      "received-key-admin/request/" + id
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchTravelDetailTrips = async (id: string, search?: string) => {
  try {
    const response = await axiosInstance.get(
      `vehicle-in-use-admin/travel-details/${id}?search=` + search
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const adminDeleteTravelDetail = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      "vehicle-in-use-admin/delete-travel-detail/" + id
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminDeleteFuelDetail = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      "vehicle-in-use-admin/delete-add-fuel/" + id
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminAddFuelDetails = async (
  id: string,
  params: { search?: string }
) => {
  try {
    const response = await axiosInstance.get(
      `vehicle-in-use-admin/add-fuel-details/` + id,
      { params }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminUpdateAddFuelDetail = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-in-use-admin/update-add-fuel/" + id,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchAdminAddFuelDetails = async (
  id: string,
  params: { search?: string }
) => {
  try {
    const response = await axiosInstance.get(
      `vehicle-in-use-admin/add-fuel-details/` + id,
      { params }
    );
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

export const adminCreateTravelDetail = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      "vehicle-in-use-admin/create-travel-detail",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminCreateFuelDetail = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      "vehicle-in-use-admin/create-add-fuel",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminUpdateTravelDetail = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-in-use-admin/update-travel-detail/" + id,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminUpdateImageDetail = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-in-use-admin/update-received-vehicle-images",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminUpdateReturnImageDetail = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-inspection-admin/update-returned-vehicle-images",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminUpdateVehicleInsImage = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-inspection-admin/update-inspect-vehicle-images",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const AdminReturnedVehicle = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-in-use-admin/returned-vehicle",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const AdminUpdateReturnedVehicle = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-inspection-admin/update-returned-vehicle",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminSendBackVehicle = async (data: SendbackRequestType) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-inspection-admin/update-rejected",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminAcceptVehicle = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-inspection-admin/update-accepted",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchReviewDriverDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      "vehicle-inspection-admin/satisfaction-survey/" + id
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserReviewDriverDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      "vehicle-inspection-user/satisfaction-survey/" + id
    );

    return response;
  } catch (error) {
    throw error;
  }
};
