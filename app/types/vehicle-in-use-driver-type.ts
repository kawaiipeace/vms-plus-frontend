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

export interface ReceivedKeyDriverRequest {
  trn_request_uid: string;
  request_no: string;
  vehicle_user_emp_name: string;
  vehicle_user_dept_sap: string;
  vehicle_user_emp_id: string;
  vehicle_user_dept_sap_short: string;
  vehicle_user_dept_sap_full: string;
  car_user_mobile_contact_number: string;
  car_user_internal_contact_number: string;
  vehicle_license_plate: string;
  vehicle_license_plate_province_short: string;
  vehicle_license_plate_province_full: string;
  approved_request_emp_id: string;
  approved_request_emp_name: string;
  approved_request_dept_sap: string;
  approved_request_dept_sap_short: string;
  approved_request_dept_sap_full: string;
  start_datetime: string;
  end_datetime: string;
  date_range: string;
  trip_type: number;
  work_place: string;
  objective: string;
  remark: string;
  number_of_passengers: number;
  pickup_place: string;
  pickup_datetime: string;
  reference_number: string;
  attached_document: string;
  is_pea_employee_driver: string;
  is_admin_choose_driver: string;
  number_of_available_drivers: 2;
  ref_cost_type_code: string;
  cost_no: string;
  mas_carpool_driver_uid: string;
  driver: {
    mas_driver_uid: string;
    driver_id: string;
    driver_name: string;
    driver_image: string;
    driver_nickname: string;
    driver_dept_sap: string;
    driver_identification_no: string;
    driver_contact_number: string;
    driver_average_satisfaction_score: number;
    driver_total_satisfaction_review: number;
    driver_birthdate: string;
    work_type: number;
    work_type_name: string;
    contract_no: string;
    contract_end_date: string;
    age: string;
    status: string;
    driver_status: {
      ref_driver_status_code: number;
      ref_driver_status_desc: string;
    };
    work_days: number;
    work_count: number;
    trip_Details: string;
    driver_license: {
      mas_driver_license_uid: string;
      mas_driver_uid: string;
      ref_driver_license_type_code: string;
      driver_license_no: string;
      driver_license_start_date: string;
      driver_license_end_date: string;
      driver_license_type: {
        ref_driver_license_type_code: string;
        ref_driver_license_type_name: string;
        ref_driver_license_type_desc: string;
      };
    };
  };
  is_admin_choose_vehicle: string;
  requested_vehicle_type_id: number;
  request_vehicle_type: {
    ref_vehicle_type_code: number;
    ref_vehicle_type_name: string;
    available_units: number;
    vehicle_type_image: string;
  };
  driver_emp_id: string;
  driver_emp_name: string;
  driver_emp_dept_sap: string;
  driver_internal_contact_number: string;
  driver_mobile_contact_number: string;
  driver_image_url: string;
  mas_vehicle_uid: string;
  vehicle_department_dept_sap: string;
  mas_vehicle_department_dept_sap_short: string;
  mas_vehicle_department_dept_sap_full: string;
  vehicle: {
    mas_vehicle_uid: string;
    vehicle_brand_name: string;
    vehicle_model_name: string;
    vehicle_license_plate: string;
    vehicle_license_plate_province_short: string;
    vehicle_license_plate_province_full: string;
    vehicle_imgs: string;
    CarType: string;
    vehicle_owner_dept_sap: string;
    is_has_fleet_card: number;
    vehicle_gear: string;
    ref_vehicle_subtype_code: number;
    vehicle_user_emp_id: string;
    ref_fuel_type_id: number;
    seat: number;
    ref_fuel_type: {
      ref_fuel_type_id: number;
      ref_fuel_type_name_th: string;
      ref_fuel_type_name_en: string;
    };
    vehicle_get_date: string;
    age: number;
    vehicle_department: {
      county: string;
      vehicle_get_date: string;
      vehicle_pea_id: string;
      vehicle_license_plate: string;
      vehicle_license_plate_province_short: string;
      vehicle_license_plate_province_full: string;
      vehicle_asset_no: string;
      asset_class: string;
      asset_subcategory: string;
      ref_pea_official_vehicle_type_code: number;
      vehicle_condition: number;
      vehicle_mileage: number;
      vehicle_owner_dept_sap: string;
      vehicle_cost_center: string;
      owner_dept_name: string;
      vehicle_img: string;
      vehicle_user_emp_id: string;
      vehicle_user_emp_name: string;
      vehicle_admin_emp_id: string;
      vehicle_admin_emp_name: string;
      parking_place: string;
      fleet_card_no: string;
      is_in_carpool: string;
      remark: string;
      ref_vehicle_status_code: number;
      ref_other_use_code: string;
      vehicle_user: {
        emp_id: string;
        full_name: string;
        dept_sap: string;
        dept_sap_short: string;
        dept_sap_full: string;
        tel_mobile: string;
        tel_internal: string;
        image_url: string;
      };
    };
    is_admin_choose_driver: boolean;
  };
  received_key_place: string;
  received_key_start_datetime: string;
  received_key_end_datetime: string;
  ref_vehicle_key_type_code: number;
  received_key_datetime: string;
  receiver_key_type: number;
  received_key_emp_id: string;
  received_key_emp_name: string;
  received_key_dept_sap: string;
  received_key_dept_sap_short: string;
  received_key_dept_sap_full: string;
  received_key_internal_contact_number: string;
  received_key_mobile_contact_number: string;
  received_key_remark: string;
  received_key_image_url: string;
  vehicle_images_received: string[];
  received_vehicle_emp_id: string;
  received_vehicle_emp_name: string;
  received_vehicle_dept_sap: string;
  received_vehicle_dept_sap_short: string;
  received_vehicle_dept_sap_full: string;
  returned_vehicle_datetime: string;
  mile_end: number;
  fuel_end: number;
  returned_cleanliness_level: number;
  comment_on_returned_vehicle: string;
  vehicle_images_returned: string[];
  returned_vehicle_emp_id: string;
  returned_vehicle_emp_name: string;
  returned_vehicle_dept_sap: string;
  returned_vehicle_dept_sap_short: string;
  returned_vehicle_dept_sap_full: string;
  accepted_vehicle_datetime: string;
  accepted_vehicle_emp_id: string;
  accepted_vehicle_emp_name: string;
  accepted_vehicle_dept_sap: string;
  accepted_vehicle_dept_sap_short: string;
  accepted_vehicle_dept_sap_full: string;
  is_use_driver: boolean;
  can_cancel_request: boolean;
  ref_request_status_code: VehicleInUseDriverStatusCode;
  ref_request_status: {
    ref_request_status_code: VehicleInUseDriverStatusCode;
    ref_request_status_desc: string;
  };
  ref_request_status_name: string;
  sended_back_request_reason: string;
  canceled_request_reason: string;
  progress_request_status: string;
}
