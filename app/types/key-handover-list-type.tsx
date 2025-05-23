export interface KeyHandOverListType{
  trn_request_uid: string;
  request_no: string;
  vehicle_user_emp_id: string;
  vehicle_user_emp_name: string;
  vehicle_user_dept_sap_short: string;
  vehicle_license_plate: string;
  vehicle_license_plate_province_short: string;
  vehicle_license_plate_province_full: string;
  vehicle_department_dept_sap_short: string;
  work_place: string;
  start_datetime: string; // ISO datetime string
  end_datetime: string;   // ISO datetime string
  ref_request_status_code: string;
  ref_request_status_name: string;
  is_have_sub_request: string; // "0" or "1" as string
  received_key_place: string;
  received_key_start_datetime: string;
  received_key_end_datetime: string;
  ref_vehicle_type_name: string;
  driver_emp_id: string;
  mas_vehicle_uid: string;
  mas_carpool_driver_uid: string;
  driver_name: string;
  driver_dept_name: string;
  vehicle_dept_name: string;
  vehicle_carpool_name: string;
  is_admin_choose_driver: number; // 0 or 1
  is_admin_choose_vehicle: number; // 0 or 1
  is_pea_employee_driver: number; // 0 or 1
  trip_type: number;
  trip_type_name: string;
  can_choose_vehicle: boolean;
  can_choose_driver: boolean;
}

export interface summaryType{
  ref_request_status_code : string;
  ref_request_status_name : string;
  count: number;
}
