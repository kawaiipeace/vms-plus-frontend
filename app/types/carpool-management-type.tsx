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
