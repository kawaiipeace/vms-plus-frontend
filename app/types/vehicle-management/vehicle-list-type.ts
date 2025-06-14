export interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface CustomData {
  label: React.ReactNode | string;
  value: string;
  desc?: string;
}

export interface VehicleManagementApiResponse {
  age: string;
  fleet_card_no: string;
  is_active: string;
  is_tax_credit: boolean;
  mas_vehicle_uid: string;
  ref_fuel_type_id: number;
  ref_vehicle_status_code: number;
  ref_vehicle_type_code: string;
  ref_vehicle_type_name: string;
  vehicle_brand_name: string;
  vehicle_carpool_name: string;
  vehicle_get_date: string;
  vehicle_license_plate: string;
  vehicle_license_plate_province_short: string;
  vehicle_mileage: number;
  vehicle_model_name: string;
  vehicle_owner_dept_short: string;
  vms_ref_fuel_type: FuelTypeApiResponse;
  vms_ref_vehicle_status: VehicleStatusType;
}

export interface FuelTypeApiResponse {
  ref_fuel_type_id: string;
  ref_fuel_type_name_en: string;
  ref_fuel_type_name_th: string;
}

export interface VehicleStatusType {
  ref_vehicle_status_code: number;
  ref_vehicle_status_name: string;
  ref_vehicle_status_short_name: string;
}

export interface VehicleDepartmentApiResponse {
  vehicle_owner_dept_sap: string;
  dept_sap_short: string;
  dept_sap_full: string;
  dept_type: string;
}

export interface VehicleTypeApiResponse {
  car_type_detail: string;
}

export interface VehicleTypeApiCustomData extends CustomData {}
export interface FuelTypeApiCustomData extends CustomData {}
export interface VehicleDepartmentCustomData extends CustomData {}

export interface VehicleManagementReportApiParams {
  start_date: string;
  end_date: string;
  show_all: string;
}

export interface VehicleManagementReportApiParamsInput {
  params: VehicleManagementReportApiParams;
  body: string[];
}

// Interface No Date
export interface VehicleManagementProps {
  imgSrc: string;
  title: string;
  desc: string;
  button: string;
  icon?: string;
  link?: string;
  displayBtn?: boolean;
  btnType?: string;
  useModal?: () => void;
}

// Props for Vehicle Management
export interface VehicleInputParams {
  fuelType: string;
  vehicleType: string;
  vehicleDepartment: string;
  taxVehicle: string[];
  vehicleStatus: string[];
  vehicleBookingStatus: string[];
}

export interface VehicleStatusProps {
  defaultBookingStatus?: string[];
  vehicleDepartments: VehicleDepartmentCustomData[];
  fuelTypes: FuelTypeApiCustomData[];
  vehicleTypes: VehicleTypeApiCustomData[];
  flag: string;
  params: VehicleInputParams;
  setParams: (params: VehicleInputParams) => void;
}

export interface RepoCardProps {
  imageSrc: string;
  title: string;
  description: string;
  count: number;
  onClick?: () => void;
}

export interface VehicleListParams {
  search?: string;
  vehicle_owner_dept_sap?: string;
  ref_vehicle_category_code?: string;
  ref_vehicle_status_code?: string;
  ref_fuel_type_id?: string;
  is_tax_credit?: string;
  order_by?: string;
  order_dir?: string;
  page?: number;
  limit?: number;
}
