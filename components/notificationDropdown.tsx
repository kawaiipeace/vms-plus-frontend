import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchNotify } from "@/services/masterService";
import { Notification } from "@/app/types/notify-type";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetchNotify();
        console.log("res", response);
        setNotifications(response.data.notifications);
        setUnreadCount(
          response.data.notifications.filter(
            (n: { is_read: any }) => !n.is_read
          ).length
        );
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    loadNotifications();
  }, []);

  //   const handleNotificationClick = async (notification: Notification) => {
  //     if (!notification.is_read) {
  //       try {
  //         await markAsRead(notification.trn_notify_uid);
  //         setNotifications(prev =>
  //           prev.map(n =>
  //             n.trn_notify_uid === notification.trn_notify_uid
  //               ? { ...n, is_read: true }
  //               : n
  //           )
  //         );
  //         setUnreadCount(prev => prev - 1);
  //       } catch (error) {
  //         console.error("Error marking notification as read:", error);
  //       }
  //     }
  //     router.push(getNotificationLink(notification));
  //     setIsOpen(false);
  //   };

  //   const handleMarkAllAsRead = async () => {
  //     try {
  //       await markAllAsRead();
  //       setNotifications(prev =>
  //         prev.map(n => ({ ...n, is_read: true }))
  //       );
  //       setUnreadCount(0);
  //     } catch (error) {
  //       console.error("Error marking all notifications as read:", error);
  //     }
  //   };

  //   const getNotificationLink = (notification: Notification): string => {
  //     switch (notification.notify_type) {
  //       case "request-booking":
  //         return `/vehicle-request/detail/${notification.record_uid}`;
  //       // Add more cases as needed
  //       default:
  //         return "#";
  //     }
  //   };

  return (
    <div className="relative">
      <button
        className="btn btn-tertiary btn-icon border-none shadow-none btn-notifications relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="material-symbols-outlined">notifications</i>
        <span className="badge badge-indicator badge-success badge-ping"></span>
      </button>
      {/* <button
        type="button"
        className="relative p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">View notifications</span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        )}
      </button> */}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                All notifications
              </h3>
              {/* {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Mark all as read
                </button>
              )} */}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.trn_notify_uid}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    !notification.is_read ? "bg-blue-50" : ""
                  }`}
                 onClick={() => {
  if (notification.notify_url) {
    const url = notification.notify_url.startsWith("/")
      ? notification.notify_url
      : `/${notification.notify_url}`;
    router.push(url);
    setIsOpen(false);
  }
}}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                          className="h-6 w-6 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {notification.message}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                          {notification.duration}
                        </p>
                        {/* <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            notification.is_read
                              ? "bg-gray-200 text-gray-600"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {notification.is_read ? "Read" : "Unread"}
                        </span> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
