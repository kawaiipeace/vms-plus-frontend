export interface RequestListType{
  trn_request_uid: string;
  request_no: string;
  vehicle_user_emp_name: string;
  vehicle_user_dept_sap?: string;
  vehicle_license_plate: string;
  work_place: string;
  start_datetime: string;
  end_datetime: string;
  ref_request_status_name: string;
}

export interface summaryType{
  ref_request_status_code : string;
  ref_request_status_name : string;
  count: number;
}
