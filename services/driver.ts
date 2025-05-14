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

