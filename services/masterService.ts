import axiosInstance from "@/utils/axiosInstance";
import qs from 'qs';

export const fetchVehicleUsers = async (search?: string) => {
  try {
    const response = await axiosInstance.get(
      "mas/user-vehicle-users?search=" + search
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchFinalApprovalUsers = async (trn_request_uid: string) => {
  try {
    const response = await axiosInstance.get(
      "mas/user-final-approval-users?trn_request_uid=" + trn_request_uid
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchReceivedKeyUsers = async (id: string, search?: string) => {
  try {
    const response = await axiosInstance.get(
      "mas/user-received-key-users?search=" + search + "&trn_request_uid=" + id
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserDrivers = async (search?: string) => {
  try {
    const response = await axiosInstance.get(
      "mas/user-driver-users?search=" + search
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDriverLicenseType = async () => {
  try {
    const response = await axiosInstance.get("ref/driver-license-type");
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDriverCertificateType = async () => {
  try {
    const response = await axiosInstance.get("ref/driver-certificate-type");
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchCostTypes = async (emp_id?: string) => {
  try {
    const response = await axiosInstance.get("ref/cost-type?emp_id=" + emp_id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchCostCenter = async (search?: string) => {
  try {
    const response = await axiosInstance.get(
      "ref/cost-center?search=" + search
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDriverWorkType = async () => {
  try {
    const response = await axiosInstance.get("driver/work-type");
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
    throw error;
  }
};

export const fetchVehicleCarTypes = async (params: {
  emp_id?: string;
  start_date?: string;
  end_date?: string;
  mas_carpool_uid?: string;
}) => {
  try {
    const response = await axiosInstance.get("vehicle/types", {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { encode: true, arrayFormat: 'brackets' });
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehicleDepartmentTypes = async (params: any) => {
  try {
    const response = await axiosInstance.get("vehicle/departments", {
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params, { encode: true, arrayFormat: 'brackets' });
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehicleDepartments = async () => {
  try {
    const response = await axiosInstance.get("mas/vehicle-departments");
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
    const response = await axiosInstance.get("driver/search", { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchSearchDrivers = async (params: {
  name?: string;
  page?: number;
  limit?: number;
  emp_id?: string;
  start_date?: string;
  end_date?: string;
  mas_carpool_uid?: string;
  mas_vehicle_uid?: string;
}) => {
  try {
    const response = await axiosInstance.get("driver/search-booking", { params });
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
    const response = await axiosInstance.get("driver/search-other-dept", {
      params,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchDriverDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get("driver/" + id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchCodeTypeFromCode = async (code: string) => {
  try {
    const response = await axiosInstance.get("ref/cost-type/" + code);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehicleKeyType = async () => {
  try {
    const response = await axiosInstance.get("ref/vehicle-key-type");
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserApproverUsers = async (params?: {
  emp_id?: string
}) => {
  try {
    const response = await axiosInstance.get(
      "mas/user-confirmer-users", { params }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehicleInfo = async (params: {
  mas_carpool_uid?: string;
  mas_vehicle_uid?: string;
  work_type?: string;
  emp_id?: string;
  start_date?: string;
  end_date?: string;
}) => {
  try {
    const response = await axiosInstance.get("vehicle-info", { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchLogs = async (id: string, params: any) => {
  try {
    const response = await axiosInstance.get(
      "log/request/" + id + "?page=" + params.page + "&limit=" + params.limit
    );
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
    const response = await axiosInstance.get("vehicle/search", { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchSearchVehicleCarpools = async (params: {
  search?: string;
  emp_id?: string;
  start_date?: string;
  end_date?: string;
  mas_carpool_uid?: string;
  car_type?: string;
}) => {
  try {
    const response = await axiosInstance.get("vehicle/search-booking-carpool", { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchSearchVehicles = async (params: {
  search?: string;
  emp_id?: string;
  start_date?: string;
  end_date?: string;
  vehicle_owner_dept?: string;
  car_type?: string;
  category_code?: string;
  page?: number;
  limit?: number;
}) => {
  try {
    const response = await axiosInstance.get("vehicle/search-booking", {
      params,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchVehicleDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get("vehicle/" + id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchRequestKeyDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get("received-key-user/request/" + id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchRequestAdminKeyDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get("received-key-admin/request/" + id);
    return response;
  } catch (error) {
    throw error;
  }
};

export const cancelKeyPickup = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "received-key-user/update-canceled",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateKeyPickupDriver = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "received-key-user/update-key-pickup-driver",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateKeyPickupPea = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "received-key-user/update-key-pickup-pea",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateKeyPickupOutsider = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "received-key-user/update-key-pickup-outsider",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateReceivedKeyConfirmed = async (data: any) => {
  try {
    const response = await axiosInstance.put(
      "received-key-user/update-recieived-key-confirmed",
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchOilStationBrandType = async () => {
  try {
    const response = await axiosInstance.get("ref/oil-station-brand");
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchFuelType = async () => {
  try {
    const response = await axiosInstance.get("ref/fuel-type");
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchPaymentTypeCode = async () => {
  try {
    const response = await axiosInstance.get("ref/payment-type-code");
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchSatisfactionSurveyQuestions = async () => {
  try {
    const response = await axiosInstance.get(
      "mas/satisfaction_survey_questions"
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserConfirmerLic = async (search?: string) => {
  try {
    const response = await axiosInstance.get(
      "mas/user-confirmer-license-users?emp_id=" + search
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserApprovalLic = async (search?: string) => {
  try {
    const response = await axiosInstance.get(
      "mas/user-approval-license-users?emp_id=" + search
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchNotify = async () => {
  try {
    const response = await axiosInstance.get("notification");

    return response;
  } catch (error) {
    throw error;
  }
};
