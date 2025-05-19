export interface Driver {
  mas_driver_uid: string;
  driver_id: string;
  driver_name: string;
  driver_image: string;
  driver_nickname: string;
  driver_dept_sap: string;
  driver_identification_no: string;
  driver_contact_number: string;
  driver_average_satisfaction_score: number;
  driver_birthdate: string;
  age: string;
  status: string;
  trip_Details: TripDetail[];
}

export interface TripDetail {
  trn_request_uid: string;
  request_no: string;
  work_place: string;
  start_datetime: string;
  end_datetime: string;
  vehicle_user: VehicleUserType;
}

export interface VehicleUserType {
  emp_id: string;
  full_name: string;
  dept_sap?: string;
  tel_internal?: string;
  tel_mobile: string;
  dept_sap_short: string;
  posi_text?: string;
  image_url: string;
}

export interface PeaDriverType {
  emp_id: string;
  full_name: string;
  dept_sap: string;
  dept_sap_short: string;
  dept_sap_full: string;
  tel_mobile: string;
  tel_internal: string;
  image_url: string;
  annual_driver: {
    request_annual_driver_no: string;
    request_issue_date: string;
    request_expire_date: string;
    annual_yyyy: number;
    driver_license_no: string;
    driver_license_expire_date: string;
  };
}

export interface VehicleKeyType {
  ref_vehicle_key_type_code: string;
  ref_vehicle_key_type_name: string;
}

export type VehicleUserTravelCardType = Partial<{
  trn_request_uid: string;
  start_datetime: string;
  end_datetime: string;
  vehicle_license_plate: string;
  vehicle_license_plate_province_short: string;
  vehicle_license_plate_province_full: string;
  work_place: string;
  vehicle_user_emp_id: string;
  vehicle_user_emp_name: string;
  vehicle_user_dept_sap: string;
  vehicle_user_dept_sap_short: string;
  vehicle_user_dept_sap_full: string;
  vehicle_user_image_url: string;
  approved_request_emp_id: string;
  approved_request_emp_name: string;
  approved_request_dept_sap: string;
  approved_request_dept_sap_short: string;
  approved_request_dept_sap_full: string;
}>;

export interface DriverLicenseCardType {
  annual_yyyy: number;
  request_annual_driver_no: string;
  driver_dept_sap_short_name_work: string;
  driver_license: DriverLicense;
  driver_certificate: DriverCertificate;
  driver_name: string;
  is_no_expiry_date: boolean;
  license_status: string;
  mas_driver_uid: string;
  progress_request_history: ProgressDriver[];
  trn_request_annual_driver_uid: string;
  next_annual_yyyy: number;
  next_license_status_code: string;
  next_license_status: string;
}

export type DriverCertificateType = {
  ref_driver_certificate_type_code: number;
  ref_driver_certificate_type_name: string;
  ref_driver_certificate_type_desc: string;
};

export type DriverCertificate = {
  emp_id: string;
  driver_certificate_no: string;
  driver_certificate_name: string;
  driver_certificate_type_code: number;
  driver_certificate_issue_date: string; // or Date if you'll parse it
  driver_certificate_expire_date: string; // or Date if you'll parse it
  driver_certificate_img: string;
  driver_certificate_type: DriverCertificateType;
};

export interface ProgressDriver {
  progress_datetime: string;
  progress_icon: string;
  progress_name: string;
}

export interface DriverLicense {
  mas_driver_uid: string;
  driver_license_no: string;
  driver_license_type: DriverLicenseType;
  driver_license_image: string;
  ref_driver_license_type_code: string;
  driver_license_start_date: string; // ISO 8601 string
  driver_license_end_date: string; // ISO 8601 string
  [key: string]: any; // Optional, for other dynamic fields
}

export interface DriverLicenseType {
  ref_driver_license_type_code: string;
  ref_driver_license_type_name: string;
  ref_driver_license_type_desc: string;
}
