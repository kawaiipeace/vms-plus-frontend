export interface VehicleDetailType {
  mas_vehicle_uid: string;
  vehicle_brand_name: string;
  vehicle_model_name: string;
  vehicle_license_plate: string;
  vehicle_license_plate_province_short: string;
  vehicle_license_plate_province_full: string;
  vehicle_imgs: string[];
  CarType: string;
  vehicle_owner_dept_sap: string;
  is_has_fleet_card: number;
  vehicle_gear: string;
  ref_vehicle_subtype_code: number;
  vehicle_user_emp_id: string;
  ref_fuel_type_id: number;
  seat: number;
  ref_fuel_type: {
    ref_fuel_type_id: number;
    ref_fuel_type_name_th: string;
    ref_fuel_type_name_en: string;
  };
  vehicle_get_date: string;
  age: number;
  vehicle_department: {
    county: string;
    vehicle_get_date: string;
    vehicle_pea_id: string;
    vehicle_license_plate: string;
    vehicle_license_plate_province_short: string;
    vehicle_license_plate_province_full: string;
    vehicle_asset_no: string;
    asset_class: string;
    asset_subcategory: string;
    ref_pea_official_vehicle_type_code: number;
    vehicle_condition: number;
    vehicle_mileage: number;
    vehicle_owner_dept_sap: string;
    vehicle_cost_center: string;
    owner_dept_name: string;
    vehicle_img: string;
    vehicle_user_emp_id: string;
    vehicle_user_emp_name: string;
    vehicle_admin_emp_id: string;
    vehicle_admin_emp_name: string;
    parking_place: string;
    fleet_card_no: string;
    is_in_carpool: any;
    remark: string;
    ref_vehicle_status_code: number;
    ref_other_use_code: any;
    vehicle_user: {
      emp_id: string;
      full_name: string;
      dept_sap: string;
      dept_sap_short: string;
      dept_sap_full: string;
      tel_mobile: string;
      tel_internal: string;
      image_url: string;
    };
  };
  is_admin_choose_driver: boolean;
}

export interface VehicleMasType extends VehicleDetailType {
  vehicle_mileage: number;
  ref_vehicle_type_name: string;
  vehicle_owner_dept_short: string;
  fleet_card_no: string;
}
