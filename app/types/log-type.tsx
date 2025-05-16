export interface LogType {
  log_request_action_uid: string;
  trn_request_uid: string;
  ref_request_status_code: string;
  log_request_action_datetime: string; // ISO date string
  action_by_personal_id: string;
  action_by_fullname: string;
  action_by_role: string;
  action_by_position: string;
  action_by_department: string;
  action_detail: string;
  remark: string;
  role_of_creater: string;
  created_at: string;
  created_by_emp: { dept_sap: string; emp_name: string };
  status: {
    ref_request_status_desc: string;
  };
  log_remark: string;
}
