import { DriverType } from "@/app/types/driver-user-type";
import { VehicleDetailType } from "@/app/types/vehicle-detail-type";

export interface RequestDetailType {
    trn_request_uid: string;
    request_no: string;
    vehicle_user_emp_name: string;
    vehicle_user_dept_sap: string;
    vehicle_user_emp_id: string;
    vehicle_user_dept_sap_short: string;
    vehicle_user_dept_sap_full: string;
    car_user_mobile_contact_number: string;
    vehicle_license_plate: string;
    approved_request_emp_id: string;
    approved_request_emp_name: string;
    approved_request_dept_sap: string;
    approved_request_dept_sap_short: string;
    approved_request_dept_sap_full: string;
    start_datetime: string;
    end_datetime: string;
    date_range: string;
    trip_type: number;
    work_place: string;
    objective: string;
    remark: string;
    number_of_passengers: number;
    pickup_place: string;
    pickup_datetime: string;
    reference_number: string;
    attached_document: string;
    is_pea_employee_driver: string;
    is_admin_choose_driver: string;
    ref_cost_type_code: string;
    cost_no: string;
    mas_carpool_driver_uid: string;
    driver: DriverType;
    mas_vehicle_uid: string;
    vehicle_department_dept_sap: string;
    mas_vehicle_department_dept_sap_short: string;
    mas_vehicle_department_dept_sap_full: string;
    vehicle: VehicleDetailType;
    received_key_place: string;
    received_key_start_datetime: string;
    received_key_end_datetime: string;
  }
  