"use client";
import Image from "next/image";
import styles from "./style.css";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";

export default function User() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabParam === "login" ? "login" : "register"
  );

  // State for login form
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // State for register form
  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // Thêm role mặc định là user
    adminCode: "", // Mã xác thực cho admin
  });
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Handle login form input changes
  const handleLoginChange = (e) => {
    setLoginFormData({
      ...loginFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle register form input changes
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;

    if (name === "role" && value === "admin") {
      setShowAdminCode(true);
    } else if (name === "role" && value === "user") {
      setShowAdminCode(false);
      // Reset admin code when switching to user
      setRegisterFormData({
        ...registerFormData,
        [name]: value,
        adminCode: "",
      });
      return;
    }

    setRegisterFormData({
      ...registerFormData,
      [name]: value,
    });
  };

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError("");

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
      }

      // Sau khi nhận được response thành công
      // Lưu token vào localStorage
      localStorage.setItem("token", data.token);

      // THÊM MỚI: Lưu token vào cookie
      document.cookie = `token=${data.token}; path=/; max-age=86400`; // hết hạn sau 1 ngày

      // Lưu thông tin người dùng
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to homepage or dashboard
      router.push("/");
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setIsLoginLoading(false);
    }
  };

  // Handle register form submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsRegisterLoading(true);
    setRegisterError("");
    setRegisterSuccess("");

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      // Show success message
      setRegisterSuccess(data.message || "Đăng ký thành công");

      // Clear form
      setRegisterFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        adminCode: "",
      });
      setShowAdminCode(false);

      // Switch to login tab after successful registration
      setTimeout(() => {
        setActiveTab("login");
      }, 2000);
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  return (
    <div className="form-container">
      {/* Tabs */}
      <div className="tab-container">
        <div
          className={`tab ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          Đăng nhập
        </div>
        <div
          className={`tab ${activeTab === "register" ? "active" : ""}`}
          onClick={() => setActiveTab("register")}
        >
          Đăng ký
        </div>
      </div>
      <div className="form-slider">
        <div
          className="form-wrapper"
          style={{
            transform:
              activeTab === "login" ? "translateX(0%)" : "translateX(-100%)",
          }}
        >
          <div className="form-content">
            {/* Login Form */}
            {activeTab === "login" && (
              <div id="login-form" className="active">
                <h3 className="form-title">Đăng nhập với tài khoản</h3>

                <div className="social-login">
                  <div className="social-buttons">
                    <div className="social-btn btn-facebook">
                      <span className="social-icon">f</span>
                      Facebook
                    </div>
                    <div className="social-btn btn-google">
                      <span className="social-icon">G</span>
                      Google
                    </div>
                  </div>
                </div>

                <div className="or-divider">
                  <span>hoặc</span>
                </div>

                {loginError && (
                  <div className="error-message">{loginError}</div>
                )}

                <form onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Nhập email"
                      value={loginFormData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      placeholder="Nhập mật khẩu"
                      value={loginFormData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isLoginLoading}
                  >
                    {isLoginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>

                  <div className="form-note">
                    <a href="#">Quên mật khẩu?</a>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="form-content">
            {/* Register Form */}
            {activeTab === "register" && (
              <div id="register-form" className="active">
                <h3 className="form-title">Đăng ký với tài khoản</h3>

                <div className="social-login">
                  <div className="social-buttons">
                    <div className="social-btn btn-facebook">
                      <span className="social-icon">f</span>
                      Facebook
                    </div>
                    <div className="social-btn btn-google">
                      <span className="social-icon">G</span>
                      Google
                    </div>
                  </div>
                </div>

                <div className="or-divider">
                  <span>hoặc</span>
                </div>

                {registerError && (
                  <div className="error-message">{registerError}</div>
                )}

                {registerSuccess && (
                  <div className="success-message">{registerSuccess}</div>
                )}

                <form onSubmit={handleRegisterSubmit}>
                  <div className="form-group">
                    <label htmlFor="register-name">Họ và Tên</label>
                    <input
                      type="text"
                      className="form-control"
                      id="register-name"
                      name="name"
                      placeholder="Nhập tên"
                      value={registerFormData.name}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="register-email"
                      name="email"
                      placeholder="Nhập Email"
                      value={registerFormData.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-password">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      id="register-password"
                      name="password"
                      placeholder="Nhập mật khẩu"
                      value={registerFormData.password}
                      onChange={handleRegisterChange}
                      required
                      minLength="6"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-role">Vai trò</label>
                    <select
                      className="form-control"
                      id="register-role"
                      name="role"
                      value={registerFormData.role}
                      onChange={handleRegisterChange}
                      required
                    >
                      <option value="user">Đoàn viên</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {showAdminCode && (
                    <div className="form-group">
                      <label htmlFor="admin-code">Mã xác thực Admin</label>
                      <input
                        type="text"
                        className="form-control"
                        id="admin-code"
                        name="adminCode"
                        placeholder="Nhập mã xác thực Admin"
                        value={registerFormData.adminCode}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={isRegisterLoading}
                  >
                    {isRegisterLoading ? "Đang đăng ký..." : "Đăng ký"}
                  </button>

                  <div className="disclaimer">
                    Bằng cách đăng ký tài khoản, bạn cũng đồng thời chấp nhận
                    mọi{" "}
                    <em>
                      điều kiện về quy định và chính sách của Đoàn khoa Mạng máy
                      tính và Truyền thông
                    </em>
                    .
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
