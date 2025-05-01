import axiosInstance from "@/utils/axiosInstance";

export const userReceivedVehicle = async (data: any) => {
  try {
    const response = await axiosInstance.put("received-vehicle-user/received-vehicle", data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserTravelCard = async (id: string) => {
  try {
    const response = await axiosInstance.get(`received-vehicle-user/travel-card/` + id);
    return response;
  } catch (error) {
    throw error;
  }
};
