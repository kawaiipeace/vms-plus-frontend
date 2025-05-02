export const VehicleInUseDriverStatus: {
  [K in VehicleInUseDriverStatusCode]: string;
} = {
  50: "กำลังจะมาถึง",
  51: "กำลังดำเนินการ",
  60: "กำลังดำเนินการ",
  70: "กำลังดำเนินการ",
  71: "กำลังดำเนินการ",
  80: "เสร็จสิ้น",
  90: "ยกเลิกคำขอ",
};

export enum VehicleInUseStatusEnum {
  SOON = "กำลังจะมาถึง",
  PROCESSING = "กำลังดำเนินการ",
  SUCCESS = "เสร็จสิ้น",
  CANCEL = "ยกเลิกคำขอ",
}

export type VehicleInUseDriverStatusCode =
  | "50"
  | "51"
  | "60"
  | "70"
  | "71"
  | "80"
  | "90";

export interface VehicleInUseDriverMenu {
  ref_request_status_code: VehicleInUseDriverStatusCode;
  ref_request_status_name: string;
  count: number;
}

export interface ReceivedKeyDriverParams {
  search?: string;
  ref_request_status_code?: string;
  startdate?: string;
  enddate?: string;
  received_key_start_datetime?: string;
  received_key_end_datetime?: string;
  order_by?: string;
  order_dir?: string;
  page?: number;
  page_size?: number;
}

export interface ReceivedKeyDriver {
  trn_request_uid: string;
  request_no: string;
  parking_place: string;
  returned_vehicle_remark: string;
  vehicle_user_emp_id: string;
  vehicle_user_emp_name: string;
  vehicle_user_dept_sap_short: string;
  vehicle_license_plate: string;
  vehicle_license_plate_province_short: string;
  vehicle_license_plate_province_full: string;
  vehicle_department_dept_sap_short: string;
  work_place: string;
  start_datetime: string;
  end_datetime: string;
  ref_request_status_code: VehicleInUseDriverStatusCode;
  ref_request_status_name: string;
  is_have_sub_request: string;
  received_key_place: string;
  received_key_start_datetime: string;
  received_key_end_datetime: string;
  canceled_request_datetime: string;
  ref_vehicle_key_type_code: number;
  ref_vehicle_key_type: {
    ref_vehicle_key_type_code: string;
    ref_vehicle_key_type_name: string;
  };
  comment_on_returned_vehicle: string;
}

export interface RequestReceivedKeyDriver {
  received_key_datetime: string;
  ref_vehicle_key_type_code: number;
  trn_request_uid: string;
}
