"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "@/context/SessionContext";
import withAdminAuth from "@/components/WithAdminAuth";
import HeaderAdmin from "@/components/HeaderAdmin";
import "./style.css";

function AdminChatDashboard() {
  const { user } = useSession();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch users with chat history
  const fetchUsers = async () => {
    if (!user || user.role !== "admin") return;

    try {
      const response = await fetch(`/api/chat/admin?adminId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching chat users:", error);
    }
  };

  // Fetch messages for selected user
  const fetchMessages = async () => {
    if (!user || !selectedUser) return;

    try {
      // Đánh dấu tin nhắn là đã đọc
      await fetch(`/api/chat/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: user.id,
          userId: selectedUser.userId,
        }),
      });

      // Lấy tin nhắn (thêm tham số excludeBot=true)
      const response = await fetch(
        `/api/chat?userId=${selectedUser.userId}&excludeBot=true`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);

        // Cập nhật lại trạng thái tin nhắn chưa đọc
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.userId === selectedUser.userId ? { ...u, unreadCount: 0 } : u
          )
        );
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Send message as admin
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedUser) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: user.id,
          userId: selectedUser.userId,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Initial fetch of users
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchUsers();

      // Set up interval to refresh users list
      const interval = setInterval(fetchUsers, 10000);
      setRefreshInterval(interval);

      return () => clearInterval(interval);
    }
  }, [user]);

  // Fetch messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchMessages();

      // Set up interval to refresh messages
      const interval = setInterval(fetchMessages, 3000);
      setRefreshInterval(interval);

      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [refreshInterval]);

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-dashboard">
        <HeaderAdmin />
        <div className="admin-content">
          <div className="access-denied">
            <h2>Bạn không có quyền truy cập trang này</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <HeaderAdmin />
      <div className="admin-content">
        <div className="chat-dashboard">
          <div className="users-list">
            <div className="users-header">
              <h3>Danh sách người dùng</h3>
              <button onClick={fetchUsers} className="refresh-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>

            {users.length === 0 ? (
              <p className="no-users">Không có tin nhắn nào</p>
            ) : (
              <ul>
                {users.map((user) => (
                  <li
                    key={user.userId}
                    className={`user-item ${
                      selectedUser?.userId === user.userId ? "active" : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="user-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                      <div className="last-active">
                        {new Date(user.lastActive).toLocaleString()}
                      </div>
                    </div>
                    {user.unreadCount > 0 && (
                      <div className="unread-badge">{user.unreadCount}</div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="chat-area">
            {!selectedUser ? (
              <div className="no-selection">
                <p>Chọn một người dùng để bắt đầu trò chuyện</p>
              </div>
            ) : (
              <>
                <div className="chat-header-admin">
                  <div className="user-avatar">
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-name">{selectedUser.name}</div>
                </div>

                <div className="messages-container">
                  {messages.length === 0 ? (
                    <div className="no-messages">
                      <p>Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`message-item ${
                            msg.sender === user.id
                              ? "admin-message"
                              : "user-message"
                          }`}
                        >
                          {msg.isBot && <div className="bot-tag">BOT</div>}
                          <div className="message-content">
                            <p>{msg.content}</p>
                            <span className="message-time">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <form className="message-input" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !newMessage.trim()}
                    className="send-button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(AdminChatDashboard);
