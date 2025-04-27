import axiosInstance from '@/utils/axiosInstance';

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
      const response = await axiosInstance.get('received-key-admin/search-requests', {params});
      console.log('res----',response);
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  