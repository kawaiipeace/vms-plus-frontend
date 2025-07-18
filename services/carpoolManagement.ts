import {
  CarpoolAdminCreate,
  CarpoolApproverCreate,
  CarpoolDriverCreate,
  CarpoolDriverParams,
  CarpoolForm,
  CarpoolFormToApi,
  CarpoolParams,
  CarpoolVehicleCreate,
  CarpoolVehicleParams,
} from "@/app/types/carpool-management-type";
import axiosInstance from "@/utils/axiosInstance";

export const carpoolManagementSearch = async (params: CarpoolParams) => {
  try {
    const response = await axiosInstance.get("carpool-management/search", {
      params,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const chooseCarChoice = async () => {
  try {
    const response = await axiosInstance.get("ref/carpool-choose-car");

    return response;
  } catch (error) {
    throw error;
  }
};

export const chooseDriverChoice = async () => {
  try {
    const response = await axiosInstance.get("ref/carpool-choose-driver");

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolAdmin = async (
  search?: string,
  mas_carpool_uid?: string
) => {
  try {
    const url = search
      ? "carpool-management/admin-mas-search?search=" +
        search +
        (mas_carpool_uid ? "&mas_carpool_uid=" + mas_carpool_uid : "")
      : "carpool-management/admin-mas-search" +
        (mas_carpool_uid ? "&mas_carpool_uid=" + mas_carpool_uid : "");
    const response = await axiosInstance.get(url);

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolApprover = async (
  search?: string,
  mas_carpool_uid?: string
) => {
  try {
    const url = search
      ? "carpool-management/approver-mas-search?search=" +
        search +
        (mas_carpool_uid ? "&mas_carpool_uid=" + mas_carpool_uid : "")
      : "carpool-management/approver-mas-search" +
        (mas_carpool_uid ? "&mas_carpool_uid=" + mas_carpool_uid : "");
    const response = await axiosInstance.get(url);

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolVehicle = async (
  params: CarpoolVehicleParams,
  mas_carpool_uid?: string
) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/vehicle-mas-search" +
        (mas_carpool_uid ? "?mas_carpool_uid=" + mas_carpool_uid : ""),
      { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolDriver = async (
  params: CarpoolDriverParams,
  mas_carpool_uid?: string
) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/driver-mas-search" +
        (mas_carpool_uid ? "?mas_carpool_uid=" + mas_carpool_uid : ""),
      { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolDepartment = async (search?: string) => {
  try {
    const url = search
      ? "carpool-management/mas-department?search=" + search
      : "carpool-management/mas-department";
    const response = await axiosInstance.get(url);

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolDepartmentByType = async (
  type: string,
  search?: string
) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/mas-department/" + type + "?search=" + search
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolManagementId = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/carpool/" + id
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const postCarpoolCreate = async (data: CarpoolFormToApi) => {
  try {
    const response = await axiosInstance.post(
      "carpool-management/create",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const postCarpoolAdminCreate = async (data: CarpoolAdminCreate) => {
  try {
    const response = await axiosInstance.post(
      "carpool-management/admin-create",
      [data]
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolAdminSearch = async (id: string, params: any) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/admin-search/" + id,
      { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const postCarpoolApproverCreate = async (
  data: CarpoolApproverCreate
) => {
  try {
    const response = await axiosInstance.post(
      "carpool-management/approver-create",
      [data]
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolApproverSearch = async (id: string, params: any) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/approver-search/" + id,
      { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const postCarpoolVehicleCreate = async (
  data: CarpoolVehicleCreate[]
) => {
  try {
    const response = await axiosInstance.post(
      "carpool-management/vehicle-create",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolVehicleSearch = async (id: string, params: any) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/vehicle-search/" + id,
      { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const postCarpoolDriverCreate = async (data: CarpoolDriverCreate[]) => {
  try {
    const response = await axiosInstance.post(
      "carpool-management/driver-create",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const postCarpoolDriverUpdate = async (data: CarpoolDriverCreate[]) => {
  try {
    const response = await axiosInstance.post(
      "carpool-management/driver-update/" + data[0].mas_carpool_uid,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolDriverSearch = async (id: string, params: any) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/driver-search/" + id,
      { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const putCarpoolAdminUpdate = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(
      "carpool-management/admin-update/" + id,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const putCarpoolMainAdminUpdate = async (id: string) => {
  try {
    const response = await axiosInstance.put(
      "carpool-management/admin-update-main-admin/" + id
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteCarpoolAdmin = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      "carpool-management/admin-delete/" + id
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolAdminDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/admin-detail/" + id
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const putCarpoolApproverUpdate = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(
      "carpool-management/approver-update/" + id,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const putCarpoolMainApproverUpdate = async (id: string) => {
  try {
    const response = await axiosInstance.put(
      "carpool-management/approver-update-main-approver/" + id
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteCarpoolApprover = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      "carpool-management/approver-delete/" + id
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolApproverDetails = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/approver-detail/" + id
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteCarpoolVehicle = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      "carpool-management/vehicle-delete/" + id
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolVehicleDetails = async (id: string) => {
  const data = [
    {
      mas_vehicle_uid: id,
    },
  ];
  try {
    const response = await axiosInstance.post(
      "carpool-management/vehicle-mas-details",
      data
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteCarpool = async (data: any) => {
  try {
    const response = await axiosInstance.delete("carpool-management/delete", {
      data,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const putCarpoolSetActive = async (id: string, is_active: string) => {
  try {
    const response = await axiosInstance.put("carpool-management/set-active", {
      mas_carpool_uid: id,
      is_active,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const putCarpoolUpdate = async (id: string, data: CarpoolForm) => {
  try {
    const response = await axiosInstance.put(
      "carpool-management/update/" + id,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const putCarpoolSetVehicleActive = async (
  id: string,
  is_active: string
) => {
  try {
    const response = await axiosInstance.put(
      "carpool-management/vehicle-set-active",
      {
        mas_carpool_vehicle_uid: id,
        is_active,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const putCarpoolSetDriverActive = async (
  id: string,
  is_active: string
) => {
  try {
    const response = await axiosInstance.put(
      "carpool-management/driver-set-active",
      {
        mas_carpool_driver_uid: id,
        is_active,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteCarpoolDriver = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      "carpool-management/driver-delete/" + id
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolDriverDetails = async (id: string) => {
  const data = [
    {
      mas_driver_uid: id,
    },
  ];
  try {
    const response = await axiosInstance.post(
      "carpool-management/driver-mas-details",
      data
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolVehicleTimeline = async (id: string, params: any) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/vehicle-timeline/" + id,
      { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolDriverTimeline = async (id: string, params: any) => {
  try {
    const response = await axiosInstance.get(
      "carpool-management/driver-timeline/" + id,
      { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getCarpoolExport = async (params: any) => {
  try {
    const response = await axiosInstance.get("carpool-management/export", {
      params,
      responseType: "blob",
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const getVehicleStatus = async () => {
  try {
    const { data } = await axiosInstance.get("ref/vehicle-status");
    return data;
  } catch (error: any) {
    console.error("Error fetching vehicle type:", error.message || error);
    throw new Error("Failed to fetch vehicle type");
  }
};

export const getDriverStatus = async () => {
  try {
    const { data } = await axiosInstance.get("ref/driver-status");
    return data;
  } catch (error: any) {
    console.error("Error fetching vehicle type:", error.message || error);
    throw new Error("Failed to fetch vehicle type");
  }
};
