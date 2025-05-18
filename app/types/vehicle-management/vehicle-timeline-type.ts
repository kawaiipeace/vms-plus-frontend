export interface VehicleTimelineListTableData {
    vehicleBrandModel: string;
    vehicleLicensePlate: string;
    vehicleType: string;
    vehicleDepartment: string;
    distance: string;
    timeLine: VehicleTimeline;
};

export interface VehicleTimeline {
    [key: string]: any;
}