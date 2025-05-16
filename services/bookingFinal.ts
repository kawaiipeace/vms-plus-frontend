
import { CanceledRequestType, SendbackRequestType, VerifyRequestType } from '@/app/types/request-action-type';
import axiosInstance from '@/utils/axiosInstance';

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
    const response = await axiosInstance.get('booking-final/search-requests', { params });

    return response;

  } catch (error) {
    throw error;
  }
};

export const fetchRequestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get('booking-final/request/' + id);
    console.log('res',response);
    return response;

  } catch (error) {
    throw error;
  }
};


export const finalCancelRequest = async (data: CanceledRequestType) => {
  try {
    const response = await axiosInstance.put('booking-final/update-canceled',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

export const finalUpdateVehicleUser = async (data: any) => {
  try {
    const response = await axiosInstance.put('booking-final/update-vehicle-user', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const finalSendbackRequest = async (data: SendbackRequestType) => {
  try {
    const response = await axiosInstance.put('booking-final/update-rejected',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

export const finalApproveRequest = async (data: any) => {
  try {
    const response = await axiosInstance.put('booking-final/update-approved',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

export const fetchMenus = async () => {
  try {
    const response = await axiosInstance.get('booking-final/menu-requests');
    return response;
  } catch (error) {
    throw error;
  }
};
