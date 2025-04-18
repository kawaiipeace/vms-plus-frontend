export interface CanceledRequestType {
  canceled_request_reason: string;
  trn_request_uid: string;
}

export interface SendbackRequestType {
  sended_back_request_reason: string;
  trn_request_uid: string;
}
export interface ApproveRequestType {
  trn_request_uid: string;
}

export interface VerifyRequestType {
  approved_request_emp_id: string;
  received_key_place: string;
  received_key_start_datetime: string;
  trn_request_uid: string;
}

export interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}


