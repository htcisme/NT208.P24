"use client";
import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";
import "./style.css";

function UserContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const {
    user,
    setUser,
    sessionExpiring,
    timeLeft,
    resetSessionTimeout,
    handleLogout,
  } = useSession();

  // State cho tabs và forms
  const [activeTab, setActiveTab] = useState(
    tabParam === "login" ? "login" : "register"
  );

  // State for login form
  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loginError, setLoginError] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [verificationNeeded, setVerificationNeeded] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  // State for register form
  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    adminCode: "",
  });
  const [showAdminCode, setShowAdminCode] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Update active tab based on URL parameter
  useEffect(() => {
    setActiveTab(tabParam === "login" ? "login" : "register");
  }, [tabParam]);

  // Handle login form input changes
  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginFormData({
      ...loginFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle register form input changes
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;

    // Tạo bản sao mới của form data để cập nhật
    const updatedFormData = {
      ...registerFormData,
      [name]: value,
    };

    // Xử lý trường hợp đặc biệt cho role admin/user
    if (name === "role") {
      if (value === "admin") {
        setShowAdminCode(true);
      } else if (value === "user") {
        setShowAdminCode(false);
        updatedFormData.adminCode = ""; // Reset admin code
      }
    }

    // Cập nhật form data
    setRegisterFormData(updatedFormData);

    // Kiểm tra mật khẩu khớp nhau
    if (
      (name === "password" || name === "confirmPassword") &&
      updatedFormData.password &&
      updatedFormData.confirmPassword
    ) {
      setPasswordsMatch(
        updatedFormData.password === updatedFormData.confirmPassword
      );
    }
  };

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    setLoginError("");
    setVerificationNeeded(false);

    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsVerification) {
          setVerificationNeeded(true);
          setVerificationEmail(data.email);
          throw new Error(data.message);
        }
        throw new Error(data.message || "Đăng nhập thất bại");
      }
      localStorage.setItem("rememberMe", loginFormData.rememberMe);

      // Lưu token vào localStorage
      localStorage.setItem("token", data.token);

      // Lưu token vào cookie
      const maxAge = loginFormData.rememberMe ? 604800 : 120; // 7 days or 2 minutes
      document.cookie = `token=${data.token}; path=/; max-age=${maxAge}`;

      // Lưu thông tin người dùng
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);

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

    // Kiểm tra mật khẩu trước khi gửi form
    if (registerFormData.password !== registerFormData.confirmPassword) {
      setRegisterError("Mật khẩu nhập lại không khớp");
      setPasswordsMatch(false);
      return;
    }

    setIsRegisterLoading(true);
    setRegisterError("");
    setRegisterSuccess("");

    try {
      // Tạo một bản sao của form data, bỏ trường confirmPassword
      const submitData = { ...registerFormData };
      delete submitData.confirmPassword;

      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

      // Show success message
      setRegisterSuccess(
        data.message ||
          "Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản."
      );

      // Clear form
      setRegisterFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
        adminCode: "",
      });
      setShowAdminCode(false);

      // Redirect to verification page
      setTimeout(() => {
        router.push(`/User/verify?email=${encodeURIComponent(data.email)}`);
      }, 2000);
    } catch (error) {
      setRegisterError(error.message);
    } finally {
      setIsRegisterLoading(false);
    }
  };

  // Go to verification page
  const handleGoToVerification = () => {
    router.push(`/User/verify?email=${encodeURIComponent(verificationEmail)}`);
  };

  return (
    <div className="page-container">
      {/* Hiển thị popup session timeout từ context - session */}

      {sessionExpiring && (
        <div className="session-timeout-warning">
          <div className="session-timeout-content">
            <h3>Phiên làm việc sắp hết hạn</h3>
            <p>Phiên làm việc của bạn sẽ hết hạn trong {timeLeft} giây.</p>
            <p>Bạn có muốn tiếp tục?</p>
            <div className="session-timeout-actions">
              <button
                className="session-extend-btn"
                onClick={resetSessionTimeout}
              >
                Tiếp tục phiên làm việc
              </button>
              <button className="session-logout-btn" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

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
                    <div className="error-message">
                      {loginError}
                      {verificationNeeded && (
                        <button
                          className="verification-redirect-btn"
                          onClick={handleGoToVerification}
                        >
                          Xác minh ngay
                        </button>
                      )}
                    </div>
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

                    <div className="form-group form-checkbox">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={loginFormData.rememberMe}
                        onChange={handleLoginChange}
                      />
                      <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
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
                      <label htmlFor="confirm-password">
                        Nhập lại mật khẩu
                      </label>
                      <input
                        type="password"
                        className={`form-control ${
                          registerFormData.confirmPassword && !passwordsMatch
                            ? "password-mismatch"
                            : ""
                        }`}
                        id="confirm-password"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        value={registerFormData.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                        minLength="6"
                      />
                      {registerFormData.confirmPassword && !passwordsMatch && (
                        <div className="password-mismatch-message">
                          Mật khẩu không khớp
                        </div>
                      )}
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
