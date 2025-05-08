import axiosInstance from '@/utils/axiosInstance';

export const driverLicenseUserCard = async () => {
  try {
    const response = await axiosInstance.get('driver-license-user/card');

    return response;

  } catch (error) {
    throw error;
  }
};

