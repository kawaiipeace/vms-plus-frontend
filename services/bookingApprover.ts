
import { ApproveRequestType, CanceledRequestType, SendbackRequestType } from '@/app/types/request-action-type';
import axiosInstance from '@/utils/axiosInstance';

export const firstApproverRequests = async (params: {
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
    const response = await axiosInstance.get('booking-approver/search-requests', { params });

    return response;

  } catch (error) {
    throw error;
  }
};

export const firstApproverRequestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get('booking-approver/request/' + id);

    return response;

  } catch (error) {
    throw error;
  }
};

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

export const firstApprovercancelRequest = async (data: CanceledRequestType) => {
  try {
    const response = await axiosInstance.put('booking-approver/update-canceled',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

export const firstApproverSendbackRequest = async (data: SendbackRequestType) => {
  try {
    const response = await axiosInstance.put('booking-approver/update-sended-back',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

export const firstApproverApproveRequest = async (data: ApproveRequestType) => {
  try {
    const response = await axiosInstance.put('booking-approver/update-approved',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

export const fetchMenus = async () => {
  try {
    const response = await axiosInstance.get('booking-approver/menu-requests');
    return response;
  } catch (error) {
    throw error;
  }
};
