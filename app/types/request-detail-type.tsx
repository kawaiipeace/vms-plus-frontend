import { DriverType } from "@/app/types/driver-user-type";
import { VehicleDetailType } from "@/app/types/vehicle-detail-type";
import { SatisfactionSurveyQuestions } from "@/components/modal/reviewCarDriveModal";
import { ProgressRequestStatusEmp } from "./driver-lic-list-type";
import { ProgressRequestType } from "./progress-request-status";

export type RequestDetailType = Partial<{
  trn_request_uid: string;
  request_no: string;
  vehicle_user_emp_name: string;
  vehicle_user_dept_sap: string;
  vehicle_user_emp_id: string;
  vehicle_user_dept_sap_short: string;
  vehicle_user_dept_sap_full: string;
  car_user_mobile_contact_number: string;
  car_user_internal_contact_number: string;
  vehicle_license_plate: string;
  approved_request_emp_id: string;
  approved_request_emp_name: string;
  approved_request_dept_sap: string;
  approved_request_dept_sap_short: string;
  approved_request_dept_sap_full: string;
  request_vehicle_type: RequestVehicleType;
  start_datetime: string;
  end_datetime: string;
  date_range: string;
  trip_type: number;
  work_place: string;
  objective: string;
  remark: string;
  number_of_passengers: number;
  number_of_available_drivers: number;
  pickup_place: string;
  pickup_datetime: string;
  reference_number: string;
  attached_document: string;
  is_pea_employee_driver: string;
  is_admin_choose_driver: string;
  is_admin_choose_vehicle: string;
  is_system_choose_vehicle: string;
  ref_cost_type_code: string;
  cost_no?: string;
  cost_center: string;
  mas_carpool_driver_uid: string;
  driver: DriverType;
  driver_emp_id: string;
  driver_emp_name: string;
  driver_emp_dept_sap: string;
  driver_internal_contact_number: string;
  driver_mobile_contact_number: string;
  driver_image_url: string;
  mas_vehicle_uid: string;
  vehicle_department_dept_sap: string;
  mas_vehicle_department_dept_sap_short: string;
  mas_vehicle_department_dept_sap_full: string;
  vehicle: VehicleDetailType;
  received_key_place: string;
  received_key_start_datetime: string;
  received_key_end_datetime: string;
  can_cancel_request: boolean;
  ref_request_status_code: string;
  ref_request_status: {
    ref_request_status_code: string;
    ref_request_status_desc: string;
  };
  progress_request_status: ProgressRequestType[];
  progress_request_status_emp: ProgressRequestStatusEmp;
  ref_request_status_name: string;
  rejected_request_reason: string;
  canceled_request_reason: string;
  received_key_datetime: string; // ISO date-time string
  received_key_dept_sap: string;
  received_key_dept_sap_full: string;
  confirmed_request_desk_phone: string;
  confirmed_request_dept_name_full: string;
  confirmed_request_dept_name_short: string;
  confirmed_request_dept_sap: string;
  confirmed_request_emp_id: string;
  confirmed_request_emp_name: string;
  confirmed_request_mobile_phone: string;
  confirmed_request_position: string;
  received_key_dept_sap_short: string;
  received_key_image_url: string;
  received_key_emp_id: string;
  received_key_emp_name: string; // ISO date-time string
  received_key_internal_contact_number: string;
  received_key_mobile_contact_number: string;
  received_key_remark: string; // ISO date-time string
  received_vehicle_dept_sap: string;
  received_vehicle_dept_sap_full: string;
  received_vehicle_dept_sap_short: string;
  received_vehicle_emp_id: string;
  received_vehicle_emp_name: string;
  receiver_key_type: number;
  vehicle_license_plate_province_short: string;
  vehicle_license_plate_province_full: string;
  requested_vehicle_type_id: number;
  vehicle_images_received: VehicleImage[];
  returned_vehicle_datetime: string;
  mile_end: number;
  fuel_end: number;
  returned_cleanliness_level: number;
  returned_vehicle_remark: string;
  vehicle_images_returned: VehicleImage[];
  returned_vehicle_emp_id: string;
  returned_vehicle_emp_name: string;
  returned_vehicle_dept_sap: string;
  returned_vehicle_dept_sap_short: string;
  returned_vehicle_dept_sap_full: string;
  accepted_vehicle_datetime: string;
  accepted_vehicle_emp_id: string;
  accepted_vehicle_emp_name: string;
  accepted_vehicle_dept_sap: string;
  accepted_vehicle_dept_sap_short: string;
  accepted_vehicle_dept_sap_full: string;
  is_use_driver: boolean;
  canceled_request_datetime: string;
  parking_place: string;
  ref_vehicle_key_type_code: number;
  fleet_card_no: string;
  is_return_overdue: boolean;
  mile_start: number;
  fuel_start: number;
  received_vehicle_remark: string;
  receiver_key_type_detail: {
    ref_vehicle_key_type_code: string;
    ref_vehicle_key_type_name: string;
  };
  vehicle_image_inspect: VehicleImage[];
  next_request: NextRequest;
  mile_used: number;
  add_fuels_count: number;
  trip_details_count: number;
  satisfaction_survey_answers: satisfactionSurveyAnswers[];
  wbs_number?: string;
  activity_no?: string;
  network_no?: string;
  pm_order_no?: string;
  work_description?: string;
  doc_no?: string;
  doc_file?: string;
  vehicle_user_position?: string;
  vehicle_user_dept_name_short?: string;
  vehicle_user_image_url?: string;
}>;

export interface satisfactionSurveyAnswers {
  mas_satisfaction_survey_questions_uid: string;
  survey_answer: number;
  satisfaction_survey_questions: SatisfactionSurveyQuestions;
}

export type RequestVehicleType = Partial<{
  available_units: number;
  ref_vehicle_type_code: number;
  ref_vehicle_type_name: string;
  vehicle_type_image: string;
}>;

export type VehicleImage = Partial<{
  ref_vehicle_img_side_code: number;
  vehicle_img_file: string;
}>;

export interface TripTypeName {
  ref_trip_type_code: number;
  ref_trip_type_name: string;
}

export interface NextRequest {
  car_user_internal_contact_number: string;
  car_user_mobile_contact_number: string;
  end_datetime: string;
  ref_request_status_code: string;
  ref_request_status_name: string;
  request_no: string;
  start_datetime: string;
  trip_type: number;
  trip_type_name: TripTypeName;
  trn_request_uid: string;
  vehicle_license_plate: string;
  vehicle_license_plate_province_full: string;
  vehicle_license_plate_province_short: string;
  vehicle_user_dept_name_full: string;
  vehicle_user_dept_name_short: string;
  vehicle_user_dept_sap: string;
  vehicle_user_emp_id: string;
  vehicle_user_emp_name: string;
  vehicle_user_position: string;
  work_place: string;
}
