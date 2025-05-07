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
