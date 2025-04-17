export interface DriverType {
  mas_driver_uid: string;
  driver_id:string;
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
  driver_license:{
    driver_license_no: string;
    mas_driver_license_uid: string;
    mas_driver_uid: string;
    driver_license_end_date: string; 
    driver_license_start_date: string; 
    ref_driver_license_type_code: string;
    ref_driver_license_type_name: string;
    ref_driver_license_type_desc: string;
    driver_license_type:{
      ref_driver_license_type_code: string;
      ref_driver_license_type_name: string;
      ref_driver_license_type_desc: string;
    }
  }
}
