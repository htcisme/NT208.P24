"use client";
import Image from "next/image";
import styles from "./style.css";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import Link from "next/link";

function UserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabParam === "login" ? "login" : "register"
  );

  // State for header
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    setShowUserMenu(false);
    window.location.reload();
  };

  // Toggle menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  // Check dark mode and user on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark");
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  }, []);

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
    <div className="page-container">
      <header className="header">
        <div className="header-logo">
          <Link href="/">SUCTREMMT</Link>
        </div>
        <div className="header-nav">
          <div className="header-nav-search-wrapper">
            <div className="header-topbar-authsearch-searchbox">
              <input type="text" placeholder="Tìm kiếm..." />
              <span className="header-topbar-authsearch-searchbox-searchicon">
                <svg
                  className="header-topbar-authsearch-searchbox-searchicon-icon"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div className="header-nav-menu-wrapper">
            <button
              className="header-nav-menu-wrapper-menu-button"
              onClick={toggleMenu}
              aria-expanded={showMenu}
            >
              ☰
            </button>
            <div
              className={`header-nav-menu-wrapper-dropdown-menu ${
                showMenu ? "header-nav-menu-wrapper-menu-button-show-menu" : ""
              }`}
            >
              <Link
                href="/Introduction"
                className="header-nav-menu-wrapper-dropdown-menu-item"
              >
                Giới thiệu
              </Link>
              <Link
                href="/Activities"
                className="header-nav-menu-wrapper-dropdown-menu-item"
              >
                Hoạt động
              </Link>
              <Link
                href="/Awards"
                className="header-nav-menu-wrapper-dropdown-menu-item"
              >
                Thành tích
              </Link>
              <Link
                href="/Booking"
                className="header-nav-menu-wrapper-dropdown-menu-item"
              >
                Đặt phòng
              </Link>
              <Link
                href="/Contact"
                className="header-nav-menu-wrapper-dropdown-menu-item"
              >
                Liên hệ
              </Link>
            </div>
          </div>

          <button
            className="header-nav-dark-mode-toggle"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#042354"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

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
                        điều kiện về quy định và chính sách của Đoàn khoa Mạng
                        máy tính và Truyền thông
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
    </div>
  );
}

export default function User() {
  return (
    <Suspense
      fallback={<div className="form-container loading">Đang tải...</div>}
    >
      <UserContent />
    </Suspense>
  );
}
