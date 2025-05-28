export type DriverLicListType = Partial<{
  trn_request_annual_driver_uid: string;
  request_annual_driver_no: string;
  annual_yyyy: number;
  created_request_datetime: string;
  created_request_emp_id: string;
  created_request_emp_name: string;
  created_request_dept_sap_name_short: string;
  created_request_dept_sap_name_full: string;
  ref_request_annual_driver_status_code: string;
  ref_request_annual_driver_status_name: string;
  ref_driver_license_type_code: string;
  ref_driver_license_type_name: string;
  driver_license_expire_date: string;
}>;

export interface summaryType {
  ref_request_status_code: string;
  ref_request_status_name: string;
  count: number;
}

interface DriverLicenseType {
  ref_driver_license_type_code: string;
  ref_driver_license_type_name: string;
  ref_driver_license_type_desc: string;
}

interface DriverCertificateType {
  ref_driver_certificate_type_code: number;
  ref_driver_certificate_type_name: string;
  ref_driver_certificate_type_desc: string;
}

interface ProgressStatus {
  progress_icon: string;
  progress_name: string;
  progress_datetime?: string; // Optional for history items
}

interface EmployeeInfo {
  emp_id: string;
  emp_name: string;
  emp_position: string;
  dept_sap: string;
  dept_sap_short: string;
  dept_sap_full: string;
  phone_number: string;
  mobile_number: string;
  image_url: string;
  datetime?: string; // For action timestamps
  reason?: string; // For rejection/cancellation
}

export interface RequestAnnualDriver {
  // Basic info
  trn_request_annual_driver_uid: string;
  request_annual_driver_no: string;
  annual_yyyy: number; // Thai Buddhist year (2568 = 2025 CE)
  
  // Request creation info
  created_request_datetime: string; // ISO format
  created_request_emp_id: string;
  created_request_emp_name: string;
  created_request_emp_position: string;
  created_request_dept_sap: string;
  created_request_dept_sap_name_short: string;
  created_request_dept_sap_name_full: string;
  created_request_phone_number: string;
  created_request_mobile_number: string;
  created_request_image_url: string;

  approved_request_datetime: string; // ISO datetime string
  approved_request_dept_sap: string;
  approved_request_dept_sap_full: string;
  approved_request_dept_sap_short: string;
  approved_request_emp_id: string;
  approved_request_emp_name: string;
  approved_request_emp_position: string;
  approved_request_image_url: string;
  approved_request_mobile_number: string;
  approved_request_phone_number: string;

  confirmed_request_datetime: string;
  confirmed_request_dept_sap: string;
  confirmed_request_dept_sap_full: string;
  confirmed_request_dept_sap_short: string;
  confirmed_request_emp_id: string;
  confirmed_request_emp_name: string;
  confirmed_request_emp_position: string;
  confirmed_request_image_url: string;
  confirmed_request_mobile_number: string;
  confirmed_request_phone_number: string;

  ref_request_annual_driver_status_name: string;

  canceled_request_datetime: string; // ISO string
  canceled_request_dept_sap: string;
  canceled_request_dept_sap_full: string;
  canceled_request_dept_sap_short: string;
  canceled_request_emp_id: string;
  canceled_request_emp_name: string;
  canceled_request_emp_position: string;
  canceled_request_mobile_number: string;
  canceled_request_phone_number: string;
  canceled_request_reason: string;
  
  // Driver license info
  driver_license_no: string;
  ref_driver_license_type_code: string;
  driver_license_expire_date: string; // ISO format
  driver_license_img: string;
  driver_license_type: DriverLicenseType;
  
  // Certificate info
  driver_certificate_no: string;
  driver_certificate_name: string;
  driver_certificate_type_code: number;
  driver_certificate_issue_date: string; // ISO format
  driver_certificate_expire_date: string; // ISO format
  driver_certificate_img: string;
  driver_certificate_type: DriverCertificateType;
  
  // Request dates
  request_issue_date: string; // ISO format
  request_expire_date: string; // ISO format
  
  // Status info
  ref_request_annual_driver_status_code: string;
  
  // Approval flow
  confirmed_request: Omit<EmployeeInfo, 'datetime' | 'reason'> & {
    confirmed_request_datetime: string;
  };
  approved_request: Omit<EmployeeInfo, 'datetime' | 'reason'> & {
    approved_request_datetime: string;
  };
  rejected_request_reason: string;
  canceled_request: Omit<EmployeeInfo, 'datetime'> & {
    canceled_request_datetime: string;
    canceled_request_reason: string;
  };

  license_status_code: string;
  license_status: string;
  next_license_status: string;
  next_license_status_code: string;
  next_trn_request_annual_driver_uid: string;
  
  // Progress tracking
  progress_request_status: ProgressStatus[];
  progress_request_history: (ProgressStatus & { progress_datetime: string })[];
  progress_request_status_emp: ProgressRequestStatusEmp;

}

export type ProgressRequestStatusEmp = {
  action_role: string;
  emp_id: string;
  emp_name: string;
  emp_position?: string;  // optional
  dept_sap: string;
  dept_sap_short: string;
  dept_sap_full: string;
  phone_number?: string;  // optional
  mobile_number?: string; // optional
};


