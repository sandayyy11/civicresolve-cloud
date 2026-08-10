import { FaBell, FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

function Navbar() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [notificationError, setNotificationError] = useState("");
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoadingNotifications(true);
        setNotificationError("");

        const response = await api.get("/notifications");
        setNotifications(response.data.notifications || []);
      } catch (error) {
        setNotificationError("Unable to load notifications.");
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const handleNotificationClick = async (notification) => {
    if (notification.isRead) return;

    try {
      const response = await api.patch(`/notifications/${notification._id}/read`);

      setNotifications((currentNotifications) =>
        currentNotifications.map((currentNotification) =>
          currentNotification._id === notification._id
            ? response.data.notification
            : currentNotification
        )
      );
    } catch (error) {
      setNotificationError("Unable to mark this notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingAllRead(true);
      setNotificationError("");
      await api.patch("/notifications/read-all");

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      setNotificationError("Unable to mark all notifications as read.");
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  return (
    <header className="bg-white shadow-sm px-8 py-5 flex justify-between items-center">

      <div>
        <h2 className="text-2xl font-bold">
          {greeting}, {user?.name} 👋
        </h2>

        <p className="text-gray-500">
          Welcome back to CivicResolve
        </p>
      </div>

      <div className="flex items-center gap-6">

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((isOpen) => !isOpen)}
            className="relative text-2xl text-gray-600 hover:text-blue-600 transition"
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
          >
            <FaBell />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-4 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg z-50">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-gray-500">{unreadCount} unread</p>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllAsRead}
                    disabled={isMarkingAllRead}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isMarkingAllRead ? "Marking..." : "Mark all as read"}
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {isLoadingNotifications ? (
                  <p className="px-4 py-6 text-center text-sm text-gray-500">
                    Loading notifications...
                  </p>
                ) : notificationError && notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-red-500">
                    {notificationError}
                  </p>
                ) : notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-gray-500">
                    You have no notifications.
                  </p>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification._id}
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 ${
                        notification.isRead
                          ? "bg-white hover:bg-gray-50"
                          : "bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className={`text-sm ${notification.isRead ? "font-medium" : "font-semibold"}`}>
                          {notification.title}
                        </p>
                        <span className="shrink-0 text-xs text-gray-500">
                          {formatRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                    </button>
                  ))
                )}

                {notificationError && notifications.length > 0 && (
                  <p className="px-4 py-2 text-center text-xs text-red-500">
                    {notificationError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <FaUserCircle
            size={36}
            className="text-blue-600"
          />

          <div>
            <p className="font-semibold">
              {user?.name}
            </p>

            <p className="text-sm text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Navbar;
