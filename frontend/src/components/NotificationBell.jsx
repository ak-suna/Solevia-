// frontend/src/components/NotificationBell.jsx
import { useState, useEffect } from "react";
import { useNotificationContext } from "../contexts/NotificationContext"; // ← USE CONTEXT
import { Bell, Trash2, X } from "lucide-react";

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    connected,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotificationContext(); // ← GET FROM CONTEXT

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only fetch if we have notifications data and it's the first load
    if (notifications.length === 0) {
      fetchNotifications();
    }
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification._id);
    }

    if (notification.data?.actionUrl) {
      window.location.href = notification.data.actionUrl;
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition"
      >
        <Bell className="w-7 h-7 text-gray-600 dark:text-gray-300" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}

        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            connected ? "bg-green-500" : "bg-gray-400"
          }`}
          title={connected ? "Connected" : "Disconnected"}
        />
      </button>

      {isOpen && (
        <>
          <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-[500px] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Notifications</h3>
              <div className="flex gap-2 items-center">
                {unreadCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="divide-y dark:divide-gray-700">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell size={48} className="mx-auto mb-2 opacity-30" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    notification={notification}
                    onClick={() => handleNotificationClick(notification)}
                    onDelete={() => {
                      deleteNotification(notification._id);
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
}

function NotificationItem({ notification, onClick, onDelete }) {
  const priorityDots = {
    HIGH: "bg-red-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-blue-500"
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition ${
        !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
            priorityDots[notification.priority] || "bg-gray-400"
          }`}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-sm text-gray-800 dark:text-white">{notification.title}</h4>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1 transition"
            >
              <Trash2 size={14} />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
          
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            {formatTimestamp(notification.createdAt)}
          </p>
        </div>

        {!notification.read && (
          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
        )}
      </div>
    </div>
  );
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}