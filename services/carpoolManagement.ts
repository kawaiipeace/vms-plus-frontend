import { CarpoolsParams } from "@/app/types/carpool-management-type";
import axiosInstance from "@/utils/axiosInstance";

export const carpoolManagementSearch = async (params: CarpoolsParams) => {
  try {
    const response = await axiosInstance.get("carpool-management/search", {
      params,
    });

    return response;
  } catch (error) {
    throw error;
  }
};
