export interface DriverType {
  mas_driver_uid: string;
  driver_id: string;
  driver_name: string;
  driver_image: string;
  driver_nickname: string;
  driver_dept_sap: string;
  contract_no: string;
  driver_identification_no: string;
  contract_end_date: string;
  driver_contact_number: string;
  driver_average_satisfaction_score: number;
  driver_birthdate: string;
  age: string;
  driver_license: {
    driver_license_no: string;
    mas_driver_license_uid: string;
    mas_driver_uid: string;
    driver_license_end_date: string;
    driver_license_start_date: string;
    ref_driver_license_type_code: string;
    ref_driver_license_type_name: string;
    ref_driver_license_type_desc: string;
    driver_license_type: {
      ref_driver_license_type_code: string;
      ref_driver_license_type_name: string;
      ref_driver_license_type_desc: string;
    };
  };
  driver_status: {
    ref_driver_status_code: number;
    ref_driver_status_desc: string;
  };
  work_type: number;
  work_type_name: string;
  work_days: number;
  work_count: number;
}

export interface DriverWorkType {
  description: string;
  type: number;
}

export interface DriverMasType extends DriverType {
  ref_driver_status_code: string;
  mas_vendor_code: string;
  mas_vendor_name: string;
  driver_license_no: string;
  driver_license_end_date: string;
  approved_job_driver_end_date: string;
}
