interface Employee {
  emp_id: string;
  emp_name: string;
  dept_sap: string;
};

interface Status {
  ref_request_status_code: string;
  ref_request_status_desc: string;
};

export interface LogType {
  log_request_uid: string;
  trn_request_uid: string;
  ref_status_code: string;
  log_remark: string;
  created_at: string;
  created_by: string;
  created_by_emp: Employee;
  status: Status;
};
