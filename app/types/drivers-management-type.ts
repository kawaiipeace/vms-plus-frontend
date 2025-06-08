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

export interface DriverDocument {
  driver_document_no: number;
  driver_document_name: string;
  driver_document_file: string;
}

export interface DriverLicenseType {
  mas_driver_license_uid: string;
  ref_driver_license_type_code: string;
  driver_license_no: string;
  driver_license_end_date: string;
  driver_license_image: string;
  driver_license_start_date: string;
  driver_license_type: {
    ref_driver_license_type_code: string;
    ref_driver_license_type_name: string;
    ref_driver_license_type_desc: string;
  };
}

export interface DriverStatusType {
  ref_driver_status_code: number;
  ref_driver_status_desc: string;
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
  vendor_name?: string;
  driver_dept_sap_short_name_work?: string;
  approved_job_driver_start_date?: string;
  approved_job_driver_end_date?: string;
  driver_license?: DriverLicenseType;
  driver_documents?: DriverDocument[];
  is_replacement?: string;
  ref_other_use_code?: string;
  driver_status?: DriverStatusType;
  alert_driver_status?: string;
  alert_driver_status_desc?: string;
}

export interface DriverLeaveTimeType {
  leave_time_type_code?: number;
  leave_time_type_name?: string;
}

export interface DriverDocument {
  driver_document_file: string;
  driver_document_name: string;
  driver_document_no: number;
}

export interface DriverCreateDetails {
  approved_job_driver_end_date: string;
  approved_job_driver_start_date: string;
  contract_no: string;
  driver_birthdate: string;
  driver_contact_number: string;
  driver_dept_sap_hire: string;
  driver_dept_sap_work: string;
  driver_documents: DriverDocument[];
  driver_identification_no: string;
  driver_image: string;
  driver_license: {
    driver_license_end_date: string;
    driver_license_image: string;
    driver_license_no: string;
    driver_license_start_date: string;
    ref_driver_license_type_code: string;
  };
  driver_name: string;
  driver_nickname: string;
  is_replacement: string;
  vendor_name: string;
  ref_other_use_code: string;
  work_type: number;
}

export interface DriverUpdateDetails {
  driver_birthdate: string;
  driver_contact_number: string;
  driver_identification_no: string;
  driver_image: string;
  driver_name: string;
  driver_nickname: string;
  mas_driver_uid: string;
  work_type: number;
}

export interface DriverUpdateContractDetails {
  approved_job_driver_end_date: string;
  approved_job_driver_start_date: string;
  contract_no: string;
  driver_dept_sap_hire: string;
  driver_dept_sap_work: string;
  mas_driver_uid: string;
  vendor_name: string;
  ref_other_use_code: number;
  is_replacement: string;
  replacement_driver_uid?: string | null;
}

export interface DriverUpdateLicenseDetails {
  driver_license_end_date: string;
  driver_license_no: string;
  driver_license_start_date: string;
  mas_driver_uid: string;
  ref_driver_license_type_code: string;
}

export interface DriverReplacementDetails {
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
  driver_birthdate: string; // ISO date string
  work_type: number;
  work_type_name: string;
  contract_no: string;
  contract_end_date: string; // ISO date string
  age: string;
  status: string;
  driver_status: {
    ref_driver_status_code: number;
    ref_driver_status_desc: string;
  };
  work_days: number;
  work_count: number;
  trip_Details: string | null; // Replace `any` with a specific type if available
  driver_license: {
    mas_driver_license_uid: string;
    mas_driver_uid: string;
    ref_driver_license_type_code: string;
    driver_license_no: string;
    driver_license_start_date: string; // ISO date string
    driver_license_end_date: string; // ISO date string
    driver_license_type: {
      ref_driver_license_type_code: string;
      ref_driver_license_type_name: string;
      ref_driver_license_type_desc: string;
    };
  };
}

export interface DriverLeaveStatus {
  leave_end_date: string;
  leave_reason: string;
  leave_start_date: string;
  leave_time_type_code: number;
  mas_driver_uid: string;
  replacement_driver_uid: string;
}

export interface DriverDocument {
  driver_document_file: string;
  driver_document_name: string;
  driver_document_no: number;
}

export interface DriverLicense {
  driver_document_file: string;
  driver_document_name: string;
  driver_document_no: number;
}

export interface DriverUpdateDocumentPayload {
  driver_documents?: DriverDocument[];
  driver_license?: DriverLicense;
  mas_driver_uid?: string;
}

export interface UploadCSVFileType {
  fileName: string;
  fileUrl: string;
  size: number;
  type: string;
}
