"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    avatar: "/images/default-avatar.png",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const notificationTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Hàm hiển thị thông báo
  const showNotification = (message, type = "error") => {
    // Xóa timeout cũ nếu có
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    // Hiển thị thông báo mới
    setNotification({ message, type });

    // Tự động ẩn sau 3 giây
    notificationTimeoutRef.current = setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000);
  };

  useEffect(() => {
    // Cleanup notification timeout when component unmounts
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          showNotification("Vui lòng đăng nhập để xem thông tin cá nhân");
          router.push("/login");
          return;
        }

        const response = await fetch("/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (data.success) {
          setUser({
            ...user,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role || "user",
            avatar: data.user.avatar || "/images/default-avatar.png",
          });
        } else {
          showNotification(
            data.message || "Không thể tải thông tin người dùng"
          );
          router.push("/login");
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
        showNotification("Đã xảy ra lỗi khi tải thông tin người dùng");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      // Kiểm tra định dạng file
      if (!file.type.startsWith("image/")) {
        showNotification("Vui lòng chọn file ảnh hợp lệ");
        return;
      }

      // Tạo preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (changePassword && user.newPassword !== user.confirmPassword) {
      showNotification("Mật khẩu mới và xác nhận mật khẩu không khớp");
      setUpdating(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("Vui lòng đăng nhập để cập nhật thông tin");
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);

      // Chỉ thêm thông tin mật khẩu nếu người dùng muốn thay đổi
      if (changePassword) {
        formData.append("currentPassword", user.currentPassword);
        formData.append("newPassword", user.newPassword);
      }

      // Thêm avatar nếu có thay đổi
      if (fileInputRef.current?.files[0]) {
        formData.append("avatar", fileInputRef.current.files[0]);
      }

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showNotification("Cập nhật thông tin thành công", "success");

        // Reset form mật khẩu sau khi cập nhật thành công
        if (changePassword) {
          setUser({
            ...user,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setChangePassword(false);
        }

        // Reset avatar preview và file input sau khi cập nhật thành công
        setAvatarPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        showNotification(data.message || "Cập nhật thông tin thất bại");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      showNotification("Đã xảy ra lỗi khi cập nhật thông tin");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container loading">
        <span className="loading-spinner"></span>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div className="profile-header">
        <h1>Thông tin cá nhân</h1>
        <p>Xem và cập nhật thông tin cá nhân của bạn</p>
      </div>

      <div className="profile-card">
        <form onSubmit={handleSubmit}>
          <div className="profile-info">
            <div className="avatar-section">
              <div className="avatar-container">
                <Image
                  src={avatarPreview || user.avatar}
                  alt="Avatar"
                  width={150}
                  height={150}
                  className="avatar-image"
                />
                <div className="avatar-overlay">
                  <button
                    type="button"
                    className="change-avatar-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Thay đổi ảnh
                  </button>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </div>

            <div className="info-group">
              <label htmlFor="name">Họ và tên</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div className="info-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
              />
            </div>

            <div className="info-group">
              <label>Vai trò</label>
              <div className="role-badge">
                {user.role === "admin" ? (
                  <span className="admin-role">Quản trị viên</span>
                ) : (
                  <span className="user-role">Người dùng</span>
                )}
              </div>
            </div>

            <div className="password-section">
              <div className="password-header">
                <h3>Thay đổi mật khẩu</h3>
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setChangePassword(!changePassword)}
                >
                  {changePassword ? "Hủy" : "Thay đổi"}
                </button>
              </div>

              {changePassword && (
                <div className="password-fields">
                  <div className="info-group">
                    <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={user.currentPassword}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu hiện tại"
                      required={changePassword}
                    />
                  </div>

                  <div className="info-group">
                    <label htmlFor="newPassword">Mật khẩu mới</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={user.newPassword}
                      onChange={handleChange}
                      placeholder="Nhập mật khẩu mới"
                      minLength="8"
                      required={changePassword}
                    />
                  </div>

                  <div className="info-group">
                    <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={user.confirmPassword}
                      onChange={handleChange}
                      placeholder="Nhập lại mật khẩu mới"
                      minLength="8"
                      required={changePassword}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="profile-actions">
            <button type="submit" className="update-btn" disabled={updating}>
              {updating ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
