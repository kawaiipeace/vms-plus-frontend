export interface DriversManagementParams {
  search?: string;
  driver_dept_sap_work?: string;
  work_type?: string;
  ref_driver_status_code?: string;
  is_active?: string;
  driver_license_end_date?: string;
  approved_job_driver_end_date?: string;
  order_by?: string;
  order_dir?: string;
  page?: number;
  limit?: number;
}

export interface DriverLicenseType {
  mas_driver_license_uid?: string;
  ref_driver_license_type_code?: string;
  driver_license_no?: string;
  driver_license_end_date?: string;
  driver_license_image?: string;
  driver_license_start_date?: string;
  driver_license_type?: {
    ref_driver_license_type_code?: string;
    ref_driver_license_type_name?: string;
    ref_driver_license_type_desc?: string;
  };
}

export interface DriverCertificateType {
  mas_driver_certificate_uid?: string;
  driver_certificate_image?: string;
  ref_driver_certificate_type_code?: string;
  driver_certificate_issue_date?: string;
  driver_certificate_expire_date?: string;
}

export interface DriverStatusType {
  ref_driver_status_code?: number;
  ref_driver_status_desc?: string;
}

export interface DriverInfoType {
  mas_driver_uid?: string;
  driver_image?: string;
  driver_name?: string;
  driver_nickname?: string;
  driver_contact_number?: string;
  driver_identification_no?: string;
  driver_birthdate?: string;
  work_type?: number;
  contract_no?: string;
  driver_dept_sap_short_name_hire?: string;
  mas_vendor_code?: string;
  driver_dept_sap_short_name_work?: string;
  approved_job_driver_start_date?: string;
  approved_job_driver_end_date?: string;
  driver_license?: DriverLicenseType;
  driver_certificate?: DriverCertificateType;
  is_replacement?: string;
  ref_other_use_code?: string;
  driver_status?: DriverStatusType;
  alert_driver_status?: string;
  alert_driver_status_desc?: string;
}
