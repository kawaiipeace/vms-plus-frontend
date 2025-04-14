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

export interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}


