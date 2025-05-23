"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import "@/styles-comp/style.css";

export default function ChatPopup() {
  const { user } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState("auto"); // "auto", "bot", "admin"
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const router = useRouter();

  // Kiểm tra xem người dùng có phải admin không
  const isAdmin = user?.role === "admin";

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch chat history when opened
  useEffect(() => {
    if (isOpen && user && !isAdmin) {
      fetchMessages();
    }
  }, [isOpen, user, isAdmin]);

  // Poll for new messages every 5 seconds if not admin
  useEffect(() => {
    let interval;
    if (isOpen && user && !isAdmin) {
      interval = setInterval(fetchMessages, 5000);
    }
    return () => clearInterval(interval);
  }, [isOpen, user, isAdmin]);

  // Xác định chat mode dựa trên lịch sử tin nhắn
  useEffect(() => {
    if (messages.length > 0) {
      // Kiểm tra xem có tin nhắn nào từ admin không
      const hasAdminMessages = messages.some(
        (msg) =>
          !msg.isBot &&
          !msg.isUser &&
          msg.sender !== user.id &&
          msg.sender !== "bot"
      );

      // Nếu có tin nhắn từ admin và mode đang là auto, chuyển sang admin
      if (hasAdminMessages && chatMode === "auto") {
        setChatMode("admin");
      }
    }
  }, [messages, user, chatMode]);
  const logMessages = (msgs) => {
    console.log("Fetched messages:", msgs);
    return msgs;
  };
  const fetchMessages = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/chat?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        // Log tin nhắn để debug
        const msgs = logMessages(data.messages || []);
        setMessages(msgs);

        // Phát hiện chế độ chat dựa trên tin nhắn
        if (msgs.length > 0) {
          // Tìm xem có tin nhắn từ admin không
          const hasAdminMessages = msgs.some(
            (msg) =>
              !msg.isBot && msg.sender !== user.id && msg.sender !== "bot"
          );

          if (hasAdminMessages && chatMode === "auto") {
            setChatMode("admin");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    // Tạo ID tạm thời cho tin nhắn
    const tempId = Date.now().toString();

    // Xác định người nhận dựa trên chế độ chat
    const receiver = chatMode === "bot" ? "bot" : "admin";

    // Hiển thị tin nhắn người dùng ngay lập tức trên UI
    const userMessage = {
      _id: tempId,
      sender: user.id,
      senderName: user.name,
      content: newMessage,
      receiver: receiver,
      isUser: true,
      createdAt: new Date().toISOString(),
    };

    // Cập nhật UI trước khi gửi lên server
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);

    try {
      // Gửi tin nhắn lên server
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          content: newMessage,
          userName: user.name,
          chatMode: chatMode,
        }),
      });

      console.log("Send message response:", await response.clone().json());

      if (response.ok) {
        // Nếu chat với bot và đã gửi thành công, gọi API bot
        if (chatMode === "bot" || chatMode === "auto") {
          setIsTyping(true);

          setTimeout(async () => {
            setIsTyping(false);

            try {
              const botResponse = await fetch("/api/chat/bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: user.id,
                  message: newMessage,
                }),
              });

              console.log("Bot response:", await botResponse.clone().json());

              if (botResponse.ok) {
                fetchMessages(); // Refresh messages to include bot response
              }
            } catch (botError) {
              console.error("Error getting bot response:", botError);
            }
          }, 1500);
        } else {
          // Đợi một chút để đảm bảo tin nhắn đã được lưu trong DB
          setTimeout(() => {
            fetchMessages();
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Nếu có lỗi, loại bỏ tin nhắn tạm thời khỏi UI
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle chat button click based on user role
  const handleChatButtonClick = () => {
    if (isAdmin) {
      // Nếu là admin, chuyển đến trang quản lý chat
      router.push("/admin/Chat");
    } else {
      // Nếu là user thường, mở popup chat
      setIsOpen(true);
    }
  };

  // Chuyển đổi chế độ chat
  const switchChatMode = (mode) => {
    setChatMode(mode);
  };

  // Render login button if not logged in
  if (!user) {
    return (
      <div className="chat-widget">
        <button
          className="chat-toggle-button"
          onClick={() => router.push("/User?tab=login")}
          aria-label="Đăng nhập để chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="chat-widget">
      {!isOpen ? (
        <button
          className="chat-toggle-button"
          onClick={handleChatButtonClick}
          aria-label={isAdmin ? "Quản lý chat" : "Mở chat"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
              fill="currentColor"
            />
          </svg>
          {isAdmin && <span className="admin-badge-icon">A</span>}
        </button>
      ) : (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>Hỗ trợ trực tuyến</h3>
            {/* Thêm nút chuyển đổi chế độ chat */}
            <div className="chat-mode-toggle">
              <button
                className={`mode-button ${chatMode === "bot" ? "active" : ""}`}
                onClick={() => switchChatMode("bot")}
              >
                Bot
              </button>
              <button
                className={`mode-button ${
                  chatMode === "admin" ? "active" : ""
                }`}
                onClick={() => switchChatMode("admin")}
              >
                Admin
              </button>
              <button
                className={`mode-button ${chatMode === "auto" ? "active" : ""}`}
                onClick={() => switchChatMode("auto")}
              >
                Auto
              </button>
            </div>
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng chat"
            >
              ×
            </button>
          </div>

          <div className="chat-messages" ref={chatContainerRef}>
            {messages.length === 0 ? (
              <div className="welcome-message">
                <p>Xin chào! Bạn cần hỗ trợ gì?</p>
                <p className="bot-hint">
                  {chatMode === "bot" || chatMode === "auto"
                    ? "Bot hỗ trợ sẽ tự động trả lời các câu hỏi về:"
                    : "Bạn đang chat với Admin, vui lòng chờ phản hồi."}
                </p>
                {(chatMode === "bot" || chatMode === "auto") && (
                  <ul className="bot-hint-list">
                    <li>Thông tin hoạt động</li>
                    <li>Đăng ký tham gia</li>
                    <li>Tài khoản</li>
                    <li>Liên hệ</li>
                  </ul>
                )}
                {chatMode === "admin" && (
                  <p className="admin-hint">
                    Nếu muốn chat với bot, hãy nhấn nút "Bot" phía trên.
                  </p>
                )}
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${
                    msg.isUser || msg.sender === user.id
                      ? "user-message"
                      : "admin-message"
                  }`}
                >
                  <div className="message-bubble">
                    {msg.isBot && <div className="bot-badge">BOT</div>}
                    {!msg.isUser && !msg.isBot && msg.sender !== user.id && (
                      <div className="admin-badge">ADMIN</div>
                    )}
                    <p>{msg.content}</p>
                    <span className="message-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="message admin-message">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder={`Nhập tin nhắn ${
                chatMode === "bot"
                  ? "cho Bot"
                  : chatMode === "admin"
                  ? "cho Admin"
                  : "của bạn"
              }...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !newMessage.trim()}>
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
        </div>
      )}
    </div>
  );
}
