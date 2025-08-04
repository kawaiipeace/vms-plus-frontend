export interface CarpoolForm {
  form: {
    carpool_authorized_depts: {
      value: any;
      dept_sap: string;
    }[];
    carpool_contact_number: string;
    carpool_contact_place: string;
    carpool_name: string;
    ref_carpool_choose_car_id: number;
    ref_carpool_choose_driver_id: number;
    remark?: string;
    is_must_pass_status_30: string;
    is_must_pass_status_40: string;
    is_must_pass_status_50: string;
    mas_carpool_uid: string;
    carpool_type: string;
  };
  carpool_admins: {
    admin_emp_no: string;
    admin_emp_name: string;
    admin_dept_sap_short: string;
    is_main_admin: string;
    image_url: string;
    internal_contact_number?: string;
    mobile_contact_number?: string;
    admin_position?: string;
  }[];
  carpool_approvers?: {
    approver_emp_no: string;
    approver_emp_name: string;
    approver_dept_sap_short: string;
    is_main_approver: string;
    image_url: string;
    internal_contact_number?: string;
    mobile_contact_number?: string;
    approver_position?: string;
  }[];
  carpool_vehicles?: { mas_vehicle_uid: string }[];
  carpool_drivers?: { mas_driver_uid: string }[];
}

export interface CarpoolFormToApi {
  carpool_authorized_depts: {
    dept_sap: string;
  }[];
  carpool_contact_number: string;
  carpool_contact_place: string;
  carpool_name: string;
  ref_carpool_choose_car_id: number;
  ref_carpool_choose_driver_id: number;
  remark?: string;
  is_must_pass_status_30: string;
  is_must_pass_status_40: string;
  is_must_pass_status_50: string;
  mas_carpool_uid: string;
  carpool_type: string;
  carpool_admins: {
    admin_emp_no: string;
    admin_emp_name: string;
    admin_dept_sap_short: string;
    is_main_admin: string;
    image_url: string;
    internal_contact_number?: string;
    mobile_contact_number?: string;
  }[];
  carpool_approvers?: {
    approver_emp_no: string;
    approver_emp_name: string;
    approver_dept_sap_short: string;
    is_main_approver: string;
    image_url: string;
    internal_contact_number?: string;
    mobile_contact_number?: string;
  }[];
  carpool_vehicles?: { mas_vehicle_uid: string }[];
  carpool_drivers?: { mas_driver_uid: string }[];
}

export type CarpoolParams = Partial<{
  search: string;
  dept_sap: string;
  is_active: string;
  order_by: string;
  order_dir: string;
  page: number;
  limit: number;
}>;

export interface Carpool {
  mas_carpool_uid: string;
  carpool_name: string;
  carpool_dept_sap: string;
  carpool_contact_place: string;
  carpool_contact_number: string;
  number_of_drivers: number;
  number_of_vehicles: number;
  numberOfApprovers: number;
  is_active: string;
  carpool_status: string;
  ref_carpool_choose_car_id: number;
  ref_carpool_choose_driver_id: number;
  remark: string;
  carpool_main_business_area: string;
  is_must_pass_status_30: string;
  is_must_pass_status_40: string;
  is_must_pass_status_50: string;
  carpool_authorized_depts: {
    dept_sap: string;
    mas_department: {
      dept_short: string;
      dept_full: string;
    };
  }[];
  carpool_admin_emp_name: string;
  carpool_admin_dept_sap: string;
  carpool_type: string;
  admin_position: string;
  carpool_admin_dept_sap_short: string;
}

export interface CarChoice {
  ref_carpool_choose_car_id: number;
  type_of_choose_car: string;
}

export interface DriverChoice {
  ref_carpool_choose_driver_id: number;
  type_of_choose_driver: string;
}

export interface CarpoolAdmin {
  emp_id: string;
  full_name: string;
  dept_sap: string;
  dept_sap_short: string;
  dept_sap_full: string;
  tel_mobile: string;
  tel_internal: string;
  image_url: string;
  posi_text: string;
}

export interface CarpoolApprover {
  emp_id: string;
  full_name: string;
  dept_sap: string;
  dept_sap_short: string;
  dept_sap_full: string;
  tel_mobile: string;
  tel_internal: string;
  image_url: string;
  posi_text: string;
}

export interface CarpoolVehicleParams {
  search: string;
}

export interface CarpoolVehicle {
  mas_vehicle_uid: string;
  vehicle_license_plate: string;
  vehicle_brand_name: string;
  vehicle_model_name: string;
  car_type: string;
  vehicle_owner_dept_sap: string;
  vehicle_img: string;
  seat: number;
  is_admin_choose_driver: boolean;
  fuel_type_name: string;
  vehicle_owner_dept_short: string;
  fleet_card_no: string;
  is_tax_credit: string;
  vehicle_mileage: string;
  age: string;
  ref_vehicle_status_name: string;
  vehicle_license_plate_province_short: string;
}

export interface CarpoolDriverParams {
  name: string;
}

export interface CarpoolDriver {
  mas_carpool_driver_uid: string;
  mas_carpool_uid: string;
  mas_driver_uid: string;
  driver_image: string;
  driver_name: string;
  driver_nickname: string;
  driver_dept_sap_short_name_hire: string;
  driver_contact_number: string;
  driver_license_end_date: string;
  approved_job_driver_end_date: string;
  driver_average_satisfaction_score: number;
  ref_driver_status_code: string;
  driver_status_name: string;
  driver_birthdate: string;
  driver_dept_sap: string;
  is_active: string;
  work_type: number;
  driver_license: {
    driver_license_end_date: string;
  };
  contract_end_date: string;
  driver_status: { ref_driver_status_desc: string };
  driver_dept_sap_short: string;
}

export interface CarpoolDepartment {
  dept_sap: string;
  dept_short: string;
  dept_full: string;
  cost_center_code: string;
}

export interface CarpoolAdminCreate {
  admin_emp_no: string;
  internal_contact_number: string;
  mas_carpool_uid: string;
  mobile_contact_number: string;
}

export interface CarpoolApproverCreate {
  approver_emp_no: string;
  internal_contact_number: string;
  mas_carpool_uid: string;
  mobile_contact_number: string;
}

export interface CarpoolVehicleCreate {
  mas_carpool_uid: string;
  mas_vehicle_uid: string;
}

export interface CarpoolDriverCreate {
  mas_carpool_uid: string;
  mas_driver_uid: string;
}

export interface DriverTimelineListTableData {
  driverContactNumber: string;
  driverDeptSapShortNameWork: string;
  driverName: string;
  driverNickname: string;
  masDriverUid: string;
  workLastMonth: string;
  workThisMonth: string;
  timeline: DriverTimelineDetails;
  status: string;
}

export interface DriverTimelineDetails {
  [key: string]: {
    destinationPlace: string;
    startTime: string;
    duration: string;
    status: string;
    carUserDetail: CarUserDetail;
    driverDetail: DriverDetail;
  }[];
}

export interface CarUserDetail {
  userName: string;
  userContactNumber: string;
  userContactInternalNumber: string;
}

export interface DriverDetail {
  driverName: string;
}

export interface DriverTimelineTransformData {
  driverContactNumber: string;
  driverDeptSapShortNameWork: string;
  driverName: string;
  driverNickname: string;
  masDriverUid: string;
  workLastMonth: string;
  workThisMonth: string;
  timeline: DriverTimelineDetails;
  status: string;
}

export interface VehicleTimelineListTableDataParams {
  search: string;
  start_date: string;
  end_date: string;
  page: number;
  limit: number;
  is_active: string;
  ref_vehicle_status_code: string;
  vehicel_car_type_detail: string;
}

export interface DriverTimelineListTableDataParams {
  search: string;
  start_date: string;
  end_date: string;
  page: number;
  limit: number;
  is_active: string;
  work_type: string;
  ref_driver_status_code: string;
}
