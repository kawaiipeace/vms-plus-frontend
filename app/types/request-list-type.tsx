export interface RequestListType {
  end_datetime: string; // ISO 8601 datetime string
  is_have_sub_request: string; // as a string, could be changed to boolean if needed
  ref_request_status_code: string;
  ref_request_status_name: string;
  request_no: string;
  start_datetime: string; // ISO 8601 datetime string
  trn_request_uid: string;
  ref_vehicle_type_name: string;
  vehicle_department_dept_sap_short: string;
  vehicle_license_plate: string;
  vehicle_license_plate_province_full: string;
  vehicle_license_plate_province_short: string;
  vehicle_user_dept_sap_short: string;
  vehicle_dept_name: string;
  vehicle_carpool_name: string;
  vehicle_user_emp_id: string;
  vehicle_user_emp_name: string;
  work_place: string;
  driver_dept_name: string;
  is_admin_choose_driver: number;
  is_admin_choose_vehicle: number;
  is_pea_employee_driver: number;
  driver_emp_id: string;
  driver_name: string;
  can_choose_driver: boolean;
  can_choose_vehicle: boolean;
  trip_type_name: string;
  received_key_place: string;
  received_key_start_datetime: string;
  received_key_end_datetime: string;
  parking_place: string;
  returned_vehicle_remark: string;
}

export interface summaryType {
  ref_request_status_code: string;
  ref_request_status_name: string;
  count: number;
}
