export interface VehicleTimelineListTableData {
    vehicleBrandModel: string;
    vehicleBrandName: string;
    vehicleLicensePlate: string;
    vehicleLicensePlateProvinceShort: string;
    vehicleType: string;
    vehicleDepartment: string;
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
    distance: string;
    vehicleStatus: string;
    timeline: VehicleTimelineDetails;
};