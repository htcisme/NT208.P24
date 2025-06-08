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
    avatar: "/Img/default-avatar.png",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarBase64, setAvatarBase64] = useState(null);
  const notificationTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  // Hàm hiển thị thông báo
  const showNotification = (message, type = "error") => {
    console.log(`Notification (${type}):`, message);

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

  // Hàm convert file thành base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Hàm compress image để giảm dung lượng
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      console.log("Compressing image...", {
        originalSize: file.size,
        maxWidth,
        quality,
        fileType: file.type,
      });

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("Cannot get canvas context");
          reject(new Error("Canvas not supported"));
          return;
        }

        const img = new Image();

        img.onload = () => {
          try {
            console.log("Image loaded successfully:", {
              width: img.width,
              height: img.height,
              naturalWidth: img.naturalWidth,
              naturalHeight: img.naturalHeight,
            });

            // Kiểm tra kích thước ảnh hợp lệ
            if (img.width === 0 || img.height === 0) {
              console.error("Invalid image dimensions");
              reject(new Error("Invalid image dimensions"));
              return;
            }

            // Tính toán kích thước mới
            let newWidth = img.width;
            let newHeight = img.height;

            // Chỉ resize nếu ảnh lớn hơn maxWidth
            if (img.width > maxWidth || img.height > maxWidth) {
              const ratio = Math.min(
                maxWidth / img.width,
                maxWidth / img.height
              );
              newWidth = Math.floor(img.width * ratio);
              newHeight = Math.floor(img.height * ratio);
            }

            console.log("Image dimensions:", {
              original: { width: img.width, height: img.height },
              new: { width: newWidth, height: newHeight },
            });

            canvas.width = newWidth;
            canvas.height = newHeight;

            // Clear canvas
            ctx.clearRect(0, 0, newWidth, newHeight);

            // Vẽ image với kích thước mới
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            // Convert thành base64
            const compressedBase64 = canvas.toDataURL("image/jpeg", quality);

            if (!compressedBase64 || compressedBase64 === "data:,") {
              console.error("Failed to convert canvas to base64");
              reject(new Error("Failed to convert image"));
              return;
            }

            console.log("Compression result:", {
              originalSize: file.size,
              compressedSize: Math.round((compressedBase64.length * 3) / 4),
              compressionRatio:
                (
                  ((file.size - (compressedBase64.length * 3) / 4) /
                    file.size) *
                  100
                ).toFixed(2) + "%",
            });

            resolve(compressedBase64);
          } catch (error) {
            console.error("Error during compression:", error);
            reject(error);
          }
        };

        img.onerror = (error) => {
          console.error("Error loading image for compression:", error);
          reject(new Error("Failed to load image"));
        };

        // Create object URL và gán src
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;

        // Cleanup object URL sau khi load
        img.onload = ((originalOnload) =>
          function () {
            URL.revokeObjectURL(objectUrl);
            return originalOnload.call(this);
          })(img.onload);
      } catch (error) {
        console.error("Error setting up image compression:", error);
        reject(error);
      }
    });
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
          showNotification("Vui lòng đăng nhập để xem thông tin cá nhân!");
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
            avatar: data.user.avatar || "/Img/default-avatar.png",
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

  const handleAvatarChange = async (e) => {
    console.log("=== Avatar change started ===");
    const file = e.target.files[0];

    if (file) {
      console.log("File selected:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

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

      try {
        // Thử compress image
        const compressedBase64 = await compressImage(file);

        // Kiểm tra kích thước sau khi compress
        const base64Size = Math.round((compressedBase64.length * 3) / 4);
        console.log("Final base64 size:", base64Size, "bytes");

        if (base64Size > 5 * 1024 * 1024) {
          showNotification("Ảnh quá lớn sau khi nén, vui lòng chọn ảnh khác");
          return;
        }

        console.log("Avatar processing successful");
        setAvatarPreview(compressedBase64);
        setAvatarBase64(compressedBase64);
      } catch (error) {
        console.error("Lỗi khi xử lý ảnh:", error);

        // Fallback: Thử convert trực tiếp mà không compress
        console.log("Trying fallback method without compression...");
        try {
          const directBase64 = await convertFileToBase64(file);
          const directSize = Math.round((directBase64.length * 3) / 4);

          console.log("Direct conversion size:", directSize, "bytes");

          if (directSize > 5 * 1024 * 1024) {
            showNotification("Ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn");
            return;
          }

          console.log("Fallback method successful");
          setAvatarPreview(directBase64);
          setAvatarBase64(directBase64);
        } catch (fallbackError) {
          console.error("Fallback method also failed:", fallbackError);
          showNotification("Không thể xử lý ảnh này, vui lòng thử ảnh khác");
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("=== Form submission started ===");
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

      // Chuẩn bị data để gửi (JSON thay vì FormData)
      const requestData = {
        name: user.name,
        email: user.email,
      };

      // Chỉ thêm thông tin mật khẩu nếu người dùng muốn thay đổi
      if (changePassword) {
        requestData.currentPassword = user.currentPassword;
        requestData.newPassword = user.newPassword;
      }

      // Thêm avatar base64 nếu có thay đổi
      if (avatarBase64) {
        requestData.avatar = avatarBase64;
        console.log(
          "Sending avatar with request (first 100 chars):",
          avatarBase64.substring(0, 100)
        );
      }

      console.log("Request data keys:", Object.keys(requestData));
      console.log("Making API request...");

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        showNotification("Cập nhật thông tin thành công", "success");

        // Cập nhật user state với dữ liệu mới
        setUser((prev) => ({
          ...prev,
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar,
        }));

        // Reset form mật khẩu sau khi cập nhật thành công
        if (changePassword) {
          setUser((prev) => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }));
          setChangePassword(false);
        }

        // Reset avatar preview và file input sau khi cập nhật thành công
        setAvatarPreview(null);
        setAvatarBase64(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        console.error("API returned error:", data);
        showNotification(data.message || "Cập nhật thông tin thất bại");

        // Hiển thị debug info nếu có
        if (data.debug) {
          console.error("Debug info:", data.debug);
        }
      }
    } catch (error) {
      console.error("Request failed:", error);
      showNotification("Đã xảy ra lỗi khi cập nhật thông tin");
    } finally {
      setUpdating(false);
      console.log("=== Form submission completed ===");
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
              {avatarPreview && <p className="avatar-note"></p>}
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
                      minLength="6"
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
                      minLength="6"
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
