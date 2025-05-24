export interface FormDataType {
  approvedRequestDeptSap?: string;
  approvedRequestDeptSapFull?: string;
  approvedRequestDeptSapShort?: string;
  approvedRequestEmpId?: string;
  approvedRequestEmpName?: string;
  telInternal?: string;
  telMobile?: string;
  workPlace?: string;
  purpose?: string;
  attachmentFile?: string;
  costNo?: string;
  costCenter?: string;
  wbsNo?: string;
  networkNo?: string;
  activityNo?: string;
  pmOrderNo?: string;
  endDatetime?: string;
  isAdminChooseDriver?: boolean;
  isSystemChooseVehicle?: string;
  isAdminChooseVehicle?: string;
  isDriverNeed?: string;
  isHaveSubRequest?: string;
  isPeaEmployeeDriver?: string;
  masCarpoolDriverUid?: string;
  masVehicleUid?: string;
  numberOfPassenger?: number;
  pickupDatetime?: string;
  pickupPlace?: string;
  refCostTypeCode?: string;
  refRequestTypeCode?: number;
  referenceNumber?: string;
  remark?: string;
  requestedVehicleTypeId?: number;
  requestedVehicleTypeName?: string;
  reservedTimeType?: string;
  startDate?: string;
  endDate?: string;
  timeStart?: string;
  timeEnd?: string;
  tripType?: number;
  vehicleUserDeptSap?: string;
  vehicleUserEmpId?: string;
  vehicleUserEmpName?: string;
  deptSapShort?: string;
  userImageUrl: string;
  vehicleSelect: string;
  driverInternalContact: string;
  driverMobileContact: string;
  driverEmpID: string;
  driverEmpName: string;
  driverDeptSap: string;
}

export interface UpdateDriverType {
  mas_carpool_driver_uid : string;
  trn_request_uid : string;
}
