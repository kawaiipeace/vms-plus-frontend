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
    dept_sap: string;
    tel_internal?: string;
    tel_mobile: string;
    dept_sap_short: string;
    image_url: string;
  }

