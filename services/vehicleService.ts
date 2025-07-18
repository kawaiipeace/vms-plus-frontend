import { VehicleManagementReportApiParamsInput } from "@/app/types/vehicle-management/vehicle-list-type";
import axiosInstance from "@/utils/axiosInstance";
import { saveAs } from "file-saver";

interface RequestParams {
    [key: string]: any;
}

interface UpdateVehicleBody {
    [key: string]: any;
}

export const fetchVehicles = async (params: RequestParams) => {
    try {
        const { data } = await axiosInstance.get("vehicle-management/search", { params });
        return data;
    } catch (error: any) {
        console.error("Failed to fetch vehicle data:", error);
        throw new Error("Failed to fetch vehicle data");
    }
};

export const updateVehicleStatus = async (body: UpdateVehicleBody) => {
    try {
        const { data } = await axiosInstance.put("vehicle-management/update-vehicle-is-active", body);
        return data;
    } catch (error: any) {
        console.error("Error updating vehicle status:", error.message || error);
        throw new Error("Failed to update vehicle status");
    }
};

export const getFuelType = async () => {
    try {
        const { data } = await axiosInstance.get("ref/fuel-type");
        const customDate = {
            data,
            options: data.map((item: any) => ({
                label: item.ref_fuel_type_name_th,
                value: item.ref_fuel_type_id,
                desc: item.ref_fuel_type_name_th || '-'
            }))
        };

        return customDate;
    } catch (error: any) {
        console.error("Error fetching fuel type:", error.message || error);
        throw new Error("Failed to fetch fuel type");
    }
}

export const getVehicleDepartment = async () => {
    try {
        const { data } = await axiosInstance.get("mas/vehicle-departments");
        const customData = {
            data,
            options: data.map((item: any) => ({
                label: item.dept_sap_short,
                value: item.vehicle_owner_dept_sap,
                desc: item.dept_sap_full
            }))
        };

        return customData;
    } catch (error: any) {
        console.error("Error fetching fuel type:", error.message || error);
        throw new Error("Failed to fetch fuel type");
    }
}

export const getVehicleType = async () => {
    try {
        const { data } = await axiosInstance.get("vehicle/car-types-by-detail");
        const customData = {
            data,
            options: data.map((item: any) => ({
                label: item.car_type_detail,
                value: item.car_type_detail,
                desc: '-'
            }))
        };

        return customData;
    } catch (error: any) {
        console.error("Error fetching vehicle type:", error.message || error);
        throw new Error("Failed to fetch vehicle type");
    }
}

export const loadReportTripDetail = async ({ params, body }: VehicleManagementReportApiParamsInput) => {
    try {
        const { data } = await axiosInstance.post(
            "vehicle-management/report-trip-detail",
            body,
            {
                params,
                responseType: "blob"
            }
        );

        const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "trip-report.xlsx");
    } catch (error: any) {
        console.error("Error fetching report trip detail:", error.message || error);
        throw new Error("Failed to fetch report trip detail");
    }
}

export const loadReportAddFuel = async ({ params, body }: VehicleManagementReportApiParamsInput) => {
    try {
        const { data } = await axiosInstance.post(
            "vehicle-management/report-add-fuel",
            body,
            {
                params,
                responseType: "blob"
            }
        );
        const blob = new Blob([data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "fuel-report.xlsx");
    } catch (error: any) {
        console.error("Error fetching report trip detail:", error.message || error);
        throw new Error("Failed to fetch report trip detail");
    }
}

export const getVehicleTimeline = async (params: any) => {
    try {
        const { data } = await axiosInstance.get("vehicle-management/timeline", { params });

        return data;
    } catch (error: any) {
        console.error("Error fetching report trip detail:", error.message || error);
        throw new Error("Failed to fetch report trip detail");
    }
}

export const getHoliday = async (params: any) => {
    try {
        const { data } = await axiosInstance.get("mas/holidays", { params });

        return data;
    } catch (error: any) {
        console.error("Error fetching report trip detail:", error.message || error);
        throw new Error("Failed to fetch report trip detail");
    }
}