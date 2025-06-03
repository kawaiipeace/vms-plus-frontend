export interface Notification {
  trn_notify_uid: string;
  notify_type: string;
  record_uid: string;
  emp_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at: string;
  duration: string;
}

export interface NotificationResponse {
  notifications: Notification[];
}
