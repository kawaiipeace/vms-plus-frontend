export enum TripStatus {
    Pending = 'รออนุมัติ',
    RoundTrip = 'ไป-กลับ',
    Overnight = 'ค้างแรม',
    Completed = 'เสร็จสิ้น',
}

export const vehicleBookingStatus: { id: string; name: string }[] = [
    { id: "1", name: TripStatus.Pending },
    { id: "2", name: TripStatus.RoundTrip },
    { id: "3", name: TripStatus.Overnight },
    { id: "4", name: TripStatus.Completed },
];

export const vehicleImgPath = {
    [TripStatus.Pending]: "/assets/img/vehicle/pending_approval.svg",
    [TripStatus.RoundTrip]: "/assets/img/vehicle/round_trip.svg",
    [TripStatus.Overnight]: "/assets/img/vehicle/with_overnight_stay.svg",
    [TripStatus.Completed]: "/assets/img/vehicle/completed.svg",
}

export enum VehicleStatus { };