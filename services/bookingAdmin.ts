
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
    const response = await axiosInstance.get('booking-admin/search-requests', { params });

    return response;

  } catch (error) {
    throw error;
  }
};

export const fetchRequestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get('booking-admin/request/' + id);

    return response;

  } catch (error) {
    throw error;
  }
};


export const adminCancelRequest = async (data: CanceledRequestType) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-canceled',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

export const adminUpdateVehicleUser = async (data: any) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-vehicle-user', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminSendbackRequest = async (data: SendbackRequestType) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-sended-back',  data );
    return response;

  } catch (error) {
    throw error;
  }
}

export const adminApproveRequest = async (data: VerifyRequestType) => {
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

export const adminUpdateTrip = async (data: any) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-trip', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminUpdatePickup = async (data: any) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-pickup', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminUpdateRef = async (data: any) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-document', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminUpdateDriver = async (data: any) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-driver', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminUpdateCost = async (data: any) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-cost', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminUpdateVehicleType = async (data: any) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-vehicle-type', data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const adminUpdateVehicle = async (data: any) => {
  try {
    const response = await axiosInstance.put('booking-admin/update-vehicle', data);
    return response;
  } catch (error) {
    throw error;
  }
};
