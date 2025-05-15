import axiosInstance from '@/utils/axiosInstance';

export const driverLicenseUserCard = async () => {
  try {
    const response = await axiosInstance.get('driver-license-user/card');

    return response;

  } catch (error) {
    throw error;
  }
};

export const createAnnualLic = async (data: any) => {
  try {
    const response = await axiosInstance.post("driver-license-user/create-license-annual", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDriverLicRequests = async (params: {
  search?: string;
  ref_driver_license_type_code?: string;
  ref_request_annual_driver_status_code?: string;
  start_created_request_datetime?: string;
  end_created_request_datetime?: string;
  order_by?: string;
  order_dir?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await axiosInstance.get(
      "driver-license-confirmer/search-requests",
      { params }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchRequestDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get('driver-license-confirmer/license-annual/' + id);

    return response;

  } catch (error) {
    throw error;
  }
};

