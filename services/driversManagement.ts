import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import {
  DriversManagementParams,
  DriverCreateDetails,
  DriverUpdateDetails,
  DriverUpdateContractDetails,
  DriverUpdateLicenseDetails,
  DriverLeaveStatus,
  DriverUpdateDocumentPayload,
} from "@/app/types/drivers-management-type";

interface DeleteDriverParams {
  driver_name: string;
  mas_driver_uid: string;
}

export const driversMamagement = async (params: DriversManagementParams) => {
  try {
    const response = await axiosInstance.get("driver-management/search", { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateDriverStatus = async (driverUid: string, isActive: string) => {
  try {
    const response = await axiosInstance.put(`driver-management/update-driver-is-active`, {
      is_active: isActive,
      mas_driver_uid: driverUid,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const listUseByOtherRadio = async () => {
  try {
    const response = await axiosInstance.get("ref/driver-other-use");
    return response;
  } catch (error) {
    throw error;
  }
};

export const listDriverLicense = async () => {
  try {
    const response = await axiosInstance.get("ref/driver-license-type");
    return response;
  } catch (error) {
    throw error;
  }
};

export const DriverInfo = async (driverUid: string) => {
  try {
    const response = await axiosInstance.get(`driver-management/driver/${driverUid}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const DriverLeaveTimeList = async () => {
  try {
    const response = await axiosInstance.get("ref/leave-time-type");
    return response;
  } catch (error) {
    throw error;
  }
};

export const DriverCreate = async (params: DriverCreateDetails) => {
  try {
    const response = await axiosInstance.post("driver-management/create-driver", params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const listDriverDepartment = async () => {
  try {
    const response = await axiosInstance.get("mas/driver-departments");
    return response;
  } catch (error) {
    throw error;
  }
};

export const listDriverVendors = async () => {
  try {
    const response = await axiosInstance.get("mas/driver-vendors");
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverDelete = async (params: DeleteDriverParams) => {
  // console.log("driver_name", driver_name);
  // console.log("mas_driver_uid", mas_driver_uid)
  // console.log("params", params);
  // console.log(localStorage.getItem("accessToken"));
  try {
    // const response = await axiosInstance.delete("driver-management/delete-driver", { params });
    const response = await axios.delete("http://pntdev.ddns.net:18080/api/driver-management/delete-driver", {
      data: params,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-ApiKey": "2c5SF8BDhWKzdTY5MIFXEh9PummQMhK8w2TIUobJnYbAxaUmYo1sYTc2Hwo3xNWj",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverUpdateDetail = async ({ params }: { params: DriverUpdateDetails }) => {
  // console.log(localStorage.getItem("accessToken"));
  try {
    const response = await axiosInstance.put("driver-management/update-driver-detail", params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverUpdateContractDetails = async ({ params }: { params: DriverUpdateContractDetails }) => {
  try {
    const response = await axiosInstance.put("driver-management/update-driver-contract", params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverUpdateLicenseDetails = async ({ params }: { params: DriverUpdateLicenseDetails }) => {
  try {
    const response = await axiosInstance.put("driver-management/update-driver-license", params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverReplacementLists = async (params: string) => {
  try {
    const response = await axiosInstance.get(`driver-management/replacement-drivers`, { params });
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverLayoff = async (params: {
  mas_driver_uid: string;
  replace_mas_driver_uid: string;
  replaced_mas_driver_uid: string;
}) => {
  try {
    const response = await axiosInstance.put(`driver-management/update-driver-layoff-status`, params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverResign = async (params: { mas_driver_uid: string; replaced_mas_driver_uid: string }) => {
  try {
    const response = await axiosInstance.put(`driver-management/update-driver-resign-status`, params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverUpdateLeaveStatus = (params: DriverLeaveStatus) => {
  try {
    const response = axiosInstance.put(`driver-management/update-driver-leave-status`, params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverUpdateDocument = async (params: DriverUpdateDocumentPayload) => {
  try {
    const response = await axiosInstance.put(`driver-management/update-driver-documents`, params);
    return response;
  } catch (error) {
    throw error;
  }
};

export const importDriverCSV = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axiosInstance.post("driver-management/import-driver", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const downloadReport = async (params: {
  starDate: string;
  endDate: string;
  showAll?: string;
  mas_driver_uid: string[];
}) => {
  try {
    const response = await axiosInstance.post(
      "driver-management/work-report?start_date=" +
        params.starDate +
        "&end_date=" +
        params.endDate +
        "&show_all=" +
        params.showAll,
      params.mas_driver_uid,
      { responseType: "arraybuffer" }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const driverStatusRef = async () => {
  try {
    const response = await axiosInstance.get("ref/driver-status");
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDriverTimeline = async (params: {
  search: string;
  start_date: string;
  end_date: string;
  work_type: string;
  ref_driver_status_code: string;
  is_active: string;
  page: number;
  limit: number;
}) => {
  try {
    const response = await axiosInstance.get("driver-management/timeline", { params });
    return response;
  } catch (error) {
    throw error;
  }
};
