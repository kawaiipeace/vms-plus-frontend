export interface VehicleTimelineListTableData {
    vehicleBrandModel: string;
    vehicleBrandName: string;
    vehicleLicensePlate: string;
    vehicleLicensePlateProvinceShort: string;
    vehicleType: string;
    vehicleDepartment: string;
    vehicleCarpoolName: string;
    distance: string;
    timeline: VehicleTimelineDetails;
    vehicleStatus: string;
};

export interface CarUserDetail {
    userName:string;
    userContactNumber: string;
    userContactInternalNumber: string;
}

export interface DriverDetail {
    driverName: string;
}

export interface VehicleTimelineDetails {
    [key: string]: {
        destinationPlace: string;
        startTime: string;
        duration: string;
        status: string;
        carUserDetail: CarUserDetail;
        driverDetail: DriverDetail;
    }[]
};

export interface VehicleTimelineTransformData {
    vehicleLicensePlate: string;
    vehicleLicensePlateProvinceShort: string;
    vehicleBrandModel: string;
    vehicleBrandName: string;
    vehicleType: string;
    vehicleDepartment: string;
    vehicleCarpoolName: string;
    distance: string;
    vehicleStatus: string;
    timeline: VehicleTimelineDetails;
};

export interface VehicleTimelineSearchParams {
    search?: string;
    start_date?: string;
    end_date?: string;
    vehicle_owner_dept_sap: string;
    vehicle_car_type_detail?: string;
    ref_timeline_status_id?: string;
    page?: number;
    limit?: number;
}