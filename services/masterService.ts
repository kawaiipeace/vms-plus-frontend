import axiosInstance from '@/utils/axiosInstance';

export const fetchVehicleUsers = async (search?: string) => {
  try {
    const response = await axiosInstance.get('mas/user-vehicle-users?search=' + search);

    return response;

  } catch (error) {
    throw error;
  }
};

export const fetchUserDrivers = async (search?: string) => {
  try {
    const response = await axiosInstance.get('mas/user-driver-users?search=' + search);

    return response;

  } catch (error) {
    throw error;
  }
};

export const fetchCostTypes = async () => {
  try {
    const response = await axiosInstance.get('ref/cost-type');
    return response;

  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post("upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
  console.error("Upload failed:", error);
    throw error;
  }
};

export const fetchVehicleCarTypes = async () => {
  try {
    const response = await axiosInstance.get('vehicle/types');
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehicleDepartments = async () => {
  try {
    const response = await axiosInstance.get('mas/vehicle-departments');
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDrivers = async (params: {
  name?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await axiosInstance.get('driver/search', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchOtherDeptDrivers = async (params: {
  name?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await axiosInstance.get('driver/search-other-dept', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDriverDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get('driver/' + id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchCodeTypeFromCode = async (code: string) => {
  try {
    const response = await axiosInstance.get('ref/cost-type/' + code);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserApproverUsers = async (search?: string) => {

  try {
    const response = await axiosInstance.get('mas/user-approval-users?search=' + search);

    return response;

  } catch (error) {
    throw error;
  }
};

export const fetchVehicleInfo = async (code: string) => {
  try {
    const response = await axiosInstance.get('vehicle-info/' + code);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchLogs = async (id: string, params: any) => {
  try {
    const response = await axiosInstance.get('log/request/' + id + "?page="+params.page+"&limit="+params.limit);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehicles = async (params: {
  search?: string;
  vehicle_owner_dept?: string;
  car_type?: string;
  category_code?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await axiosInstance.get('vehicle/search', { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehicleDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get('vehicle/' + id);
    return response;
  } catch (error) {
    throw error;
  }
};

