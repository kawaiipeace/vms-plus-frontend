export interface RequestListType{
  end_datetime: string; // ISO 8601 datetime string
  is_have_sub_request: string; // as a string, could be changed to boolean if needed
  ref_request_status_code: string;
  ref_request_status_name: string;
  request_no: string;
  start_datetime: string; // ISO 8601 datetime string
  trn_request_uid: string;
  vehicle_department_dept_sap_short: string;
  vehicle_license_plate: string;
  vehicle_license_plate_province_full: string;
  vehicle_license_plate_province_short: string;
  vehicle_user_dept_sap_short: string;
  vehicle_user_emp_id: string;
  vehicle_user_emp_name: string;
  work_place: string;
}

export interface summaryType{
  ref_request_status_code : string;
  ref_request_status_name : string;
  count: number;
}
