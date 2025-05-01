import axiosInstance from "@/utils/axiosInstance";

export const fetchUserTravelDetails = async (id: string, params: { search?: string }) => {
  try {
    const response = await axiosInstance.get(`vehicle-in-use-user/travel-details/` + id, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserRequest = async (requestId: string) => {
  try {
    const response = await axiosInstance.get(`vehicle-in-use-user/request/${requestId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const UserCreateTravelDetail = async (data: any) => {
  try {
    const response = await axiosInstance.post("vehicle-in-use-user/create-travel-detail", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const UserUpdateTravelDetail = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put("vehicle-in-use-user/update-travel-detail/" + id, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const UserDeleteTravelDetail = async (id: string) => {
  try {
    const response = await axiosInstance.delete("vehicle-in-use-user/delete-travel-detail/" + id);
    return response;
  } catch (error) {
    throw error;
  }
};
