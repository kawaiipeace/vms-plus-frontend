import {
  RequestReceivedKeyDriver,
  ReceivedKeyDriverParams,
} from "@/app/types/vehicle-in-use-driver-type";
import axiosInstance from "@/utils/axiosInstance";

export const fetchMenus = async () => {
  try {
    const response = await axiosInstance.get("booking-driver/menu-requests");
    return response;
  } catch (error) {
    throw error;
  }
};

export const receivedKeyDriver = async (params: ReceivedKeyDriverParams) => {
  try {
    const response = await axiosInstance.get(
      "received-key-driver/search-requests",
      { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const receivedKeyDriverRequest = async (trn_request_uid: string) => {
  try {
    const response = await axiosInstance.get(
      "received-key-driver/request/" + trn_request_uid
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const requestReceivedKeyDriver = async (
  data: RequestReceivedKeyDriver
) => {
  try {
    const response = await axiosInstance.put(
      "received-key-driver/update-recieived-key-confirmed",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDriverTravelDetails = async (
  id: string,
  params: { search?: string }
) => {
  if(id){
    try {
      const response = await axiosInstance.get(
        `vehicle-in-use-driver/travel-details/` + id,
        { params }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

};

export const driverCreateTravelDetail = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      "vehicle-in-use-driver/create-travel-detail",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverUpdateTravelDetail = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-in-use-driver/update-travel-detail/" + id,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverDeleteTravelDetail = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      "vehicle-in-use-driver/delete-travel-detail/" + id
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDriverAddFuelDetails = async (
  id: string,
  params: { search?: string }
) => {
  try {
    const response = await axiosInstance.get(
      `vehicle-in-use-driver/add-fuel-details/` + id,
      { params }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverCreateAddFuelDetail = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      "vehicle-in-use-driver/create-add-fuel",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverUpdateAddFuelDetail = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-in-use-driver/update-add-fuel/" + id,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverDeleteAddFuelDetail = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      "vehicle-in-use-driver/delete-add-fuel/" + id
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverReceivedVehicle = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "received-vehicle-driver/received-vehicle",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverUpdateReceivedVehicle = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-in-use-driver/update-received-vehicle",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDriverTravelCard = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `received-vehicle-driver/travel-card/` + id
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const DriverReturnedVehicle = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-in-use-driver/returned-vehicle",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateReceiveVehicleImages = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "vehicle-in-use-driver/update-received-vehicle-images",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};
