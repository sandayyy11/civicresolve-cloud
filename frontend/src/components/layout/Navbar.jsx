import { Bell, Menu, Search, UserCircle2 } from "lucide-react";
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

function Navbar({ onOpenMobileSidebar }) {
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

  const roleLabel = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "";

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Left: mobile menu + search */}
        <div className="flex flex-1 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search complaints, users, workers..."
                className="input pl-10"
              />
            </div>
          </div>

          <div className="md:hidden">
            <h2 className="truncate text-base font-semibold text-slate-900">
              {greeting}, {user?.name}
            </h2>
          </div>
        </div>

        {/* Right: notifications + user */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Greeting (desktop) */}
          <div className="hidden text-right lg:block">
            <p className="text-sm font-semibold text-slate-900">
              {greeting}, {user?.name}
            </p>
            <p className="text-xs text-slate-500">
              CivicResolve · Municipal Portal
            </p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationsOpen((isOpen) => !isOpen)}
              className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Notifications"
              aria-expanded={isNotificationsOpen}
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-border bg-white shadow-xl z-50">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-slate-500">{unreadCount} unread</p>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      disabled={isMarkingAllRead}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isMarkingAllRead ? "Marking..." : "Mark all as read"}
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {isLoadingNotifications ? (
                    <p className="px-5 py-8 text-center text-sm text-slate-500">
                      Loading notifications...
                    </p>
                  ) : notificationError && notifications.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-red-500">
                      {notificationError}
                    </p>
                  ) : notifications.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-slate-500">
                      You have no notifications.
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <button
                        key={notification._id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full border-b border-slate-100 px-5 py-3.5 text-left transition last:border-b-0 ${
                          notification.isRead
                            ? "bg-white hover:bg-slate-50"
                            : "bg-primary-50/60 hover:bg-primary-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                notification.isRead ? "bg-transparent" : "bg-primary-600"
                              }`}
                            />
                            <div>
                              <p className={`text-sm ${notification.isRead ? "font-medium text-slate-600" : "font-semibold text-slate-900"}`}>
                                {notification.title}
                              </p>
                              <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                            </div>
                          </div>
                          <span className="shrink-0 text-xs text-slate-400">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                      </button>
                    ))
                  )}

                  {notificationError && notifications.length > 0 && (
                    <p className="px-5 py-2 text-center text-xs text-red-500">
                      {notificationError}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 pl-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary-600 ring-1 ring-primary-100">
              <UserCircle2 size={22} />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-tight text-slate-900">
                {user?.name}
              </p>
              <p className="text-xs capitalize leading-tight text-slate-500">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;