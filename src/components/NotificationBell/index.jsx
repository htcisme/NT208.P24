"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotificationBell({ user }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const notificationRef = useRef(null);
  const router = useRouter();

  // Xử lý click bên ngoài để đóng dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Lấy thông báo khi user thay đổi
  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Thêm interval để tự động cập nhật thông báo mỗi 30 giây
      const interval = setInterval(fetchNotifications, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/notifications?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n) => !n.read).length);
      } else {
        throw new Error(data.message || 'Lỗi khi lấy thông báo');
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError('Không thể tải thông báo. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Đánh dấu thông báo đã đọc
      const response = await fetch(`/api/notifications/${notification._id}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật trạng thái thông báo');
      }

      // Cập nhật state
      setNotifications(notifications.map(n => 
        n._id === notification._id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Chuyển hướng đến trang tương ứng
      if (notification.link) {
        router.push(notification.link);
        setShowNotifications(false);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      setError('Không thể xử lý thông báo. Vui lòng thử lại sau.');
    }
  };

  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation();

    try {
      const response = await fetch(`/api/notifications/${notificationId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Không thể xóa thông báo');
      }

      // Cập nhật UI
      const updatedNotifications = notifications.filter(n => n._id !== notificationId);
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error("Error deleting notification:", error);
      setError('Không thể xóa thông báo. Vui lòng thử lại sau.');
    }
  };

  const handleToggleReadStatus = async (e, notification) => {
    e.stopPropagation();

    try {
      const endpoint = notification.read
        ? `/api/notifications/${notification._id}/unread`
        : `/api/notifications/${notification._id}/read`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật trạng thái thông báo');
      }

      // Cập nhật UI
      const updatedNotifications = notifications.map(n =>
        n._id === notification._id ? { ...n, read: !n.read } : n
      );
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error("Error toggling read status:", error);
      setError('Không thể cập nhật trạng thái thông báo. Vui lòng thử lại sau.');
    }
  };

  const handleClearNotifications = async () => {
    try {
      const response = await fetch("/api/notifications/clear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Không thể xóa thông báo đã đọc');
      }

      // Chỉ giữ lại thông báo chưa đọc
      const unreadNotifications = notifications.filter(n => !n.read);
      setNotifications(unreadNotifications);
      setUnreadCount(unreadNotifications.length);
    } catch (error) {
      console.error("Error clearing notifications:", error);
      setError('Không thể xóa thông báo đã đọc. Vui lòng thử lại sau.');
    }
  };

  // Nếu không có user thì không hiển thị gì
  if (!user) return null;

  return (
    <div
      className="Header-Topbar-Authsearch-Notification"
      ref={notificationRef}
    >
      <button
        className="Header-Topbar-Authsearch-Notification-Button"
        onClick={() => setShowNotifications(!showNotifications)}
        aria-label="Thông báo"
      >
        <svg
          className="Header-Topbar-Authsearch-Notification-Icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="Header-Topbar-Authsearch-Notification-Badge">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="Header-Topbar-Authsearch-Notification-Dropdown">
          <div className="Header-Topbar-Authsearch-Notification-Header">
            <span className="Header-Topbar-Authsearch-Notification-Title">
              Thông báo
            </span>
            {notifications.some((n) => n.read) && (
              <button
                className="Header-Topbar-Authsearch-Notification-Clear"
                onClick={handleClearNotifications}
              >
                Xóa đã đọc
              </button>
            )}
          </div>

          {error && (
            <div className="Header-Topbar-Authsearch-Notification-Error">
              {error}
            </div>
          )}

          <div className="Header-Topbar-Authsearch-Notification-List">
            {isLoading ? (
              <div className="Header-Topbar-Authsearch-Notification-Loading">
                <div className="spinner"></div>
                <span>Đang tải thông báo...</span>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`Header-Topbar-Authsearch-Notification-Item ${
                    notification.read ? "read" : "unread"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="Header-Topbar-Authsearch-Notification-Item-Content">
                    <div className="Header-Topbar-Authsearch-Notification-Item-Text">
                      <div className="Header-Topbar-Authsearch-Notification-Item-Title">
                        {notification.title}
                      </div>
                      <div className="Header-Topbar-Authsearch-Notification-Item-Description">
                        {notification.message}
                      </div>
                      <div className="Header-Topbar-Authsearch-Notification-Item-Time">
                        {new Date(notification.createdAt).toLocaleString(
                          "vi-VN"
                        )}
                      </div>
                    </div>
                    <div className="Header-Topbar-Authsearch-Notification-Item-Actions">
                      {/* Nút đánh dấu đã đọc / chưa đọc */}
                      <button
                        className="Header-Topbar-Authsearch-Notification-Item-ReadToggle"
                        onClick={(e) => handleToggleReadStatus(e, notification)}
                        aria-label={
                          notification.read
                            ? "Đánh dấu chưa đọc"
                            : "Đánh dấu đã đọc"
                        }
                        title={
                          notification.read
                            ? "Đánh dấu chưa đọc"
                            : "Đánh dấu đã đọc"
                        }
                      >
                        {notification.read ? (
                          // Icon đánh dấu chưa đọc (hình phong bì đóng)
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                          </svg>
                        ) : (
                          // Icon đánh dấu đã đọc (hình kiểm)
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
                          </svg>
                        )}
                      </button>

                      {/* Nút xóa thông báo */}
                      <button
                        className="Header-Topbar-Authsearch-Notification-Item-Delete"
                        onClick={(e) =>
                          handleDeleteNotification(e, notification._id)
                        }
                        aria-label="Xóa thông báo"
                        title="Xóa thông báo"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                          <path
                            fillRule="evenodd"
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="Header-Topbar-Authsearch-Notification-Empty">
                Không có thông báo nào
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
