
import axiosInstance from '@/app/utils/axiosInstance';

export const requests = async (params: {
  search?: string;
  ref_request_status_code?: string;
  startdate?: string;
  enddate?: string;
  order_by?: string;
  order_dir?: number;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await axiosInstance.get('booking-user/search-requests', { params });

    return response;

  } catch (error) {
    throw error;
  }
};

export const requestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get('booking-user/request/' + id);

    return response;

  } catch (error) {
    throw error;
  }
};


export const createRequest = async (data: any) => {
  try {
    const response = await axiosInstance.post('booking-user/create-request',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

export const fetchVehicles = async (params: {
  search?: string;
  vehicle_owner_dept?: string;
  car_type?: string;
  category_code?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await axiosInstance.get('vehicle/search', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehicleDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get('vehicle/' + id);
    return response;
  } catch (error) {
    throw error;
  }
};