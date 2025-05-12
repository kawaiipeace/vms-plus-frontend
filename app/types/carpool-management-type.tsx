export type CarpoolsParams = Partial<{
  search: string;
  is_active: string;
  order_by: string;
  order_dir: string;
  page: number;
  limit: number;
}>;

export interface Carpools {
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
}

export interface CarpoolVehicleParams {
  search: string;
  page: number;
  limit: number;
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
}
