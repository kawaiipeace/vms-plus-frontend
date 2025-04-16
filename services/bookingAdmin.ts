
import { ApproveRequestType, CanceledRequestType, SendbackRequestType } from '@/app/types/request-action-type';
import axiosInstance from '@/utils/axiosInstance';

export const FetchRequests = async (params: {
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
    const response = await axiosInstance.get('booking-admin/search-requests', { params });

    return response;

  } catch (error) {
    throw error;
  }
};

export const FetchRequestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get('booking-admin/request/' + id);

    return response;

  } catch (error) {
    throw error;
  }
};


export const CancelRequest = async (data: CanceledRequestType) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-canceled',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

export const SendbackRequest = async (data: SendbackRequestType) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-sended-back',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

export const ApproveRequest = async (data: ApproveRequestType) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-approved',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

export const fetchMenus = async () => {
  try {
    const response = await axiosInstance.get('booking-admin/menu-requests');
    return response;
  } catch (error) {
    throw error;
  }
};
