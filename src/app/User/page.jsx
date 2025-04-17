"use client";
import Image from "next/image";
import styles from "./style.css";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";

export default function User() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabParam === "login" ? "login" : "register"
  );

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
            {/* Forms */}
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

                <form>
                  <div className="form-group">
                    <label htmlFor="login-name">Họ và Tên</label>
                    <input
                      type="text"
                      className="form-control"
                      id="login-name"
                      placeholder="Nhập tên"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="login-password">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      id="login-password"
                      placeholder="Nhập mật khẩu"
                    />
                  </div>

                  <button type="submit" className="btn-submit">
                    Đăng nhập
                  </button>

                  <div className="form-note">
                    <a href="#">Quên mật khẩu?</a>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className="form-content">
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

                <form>
                  <div className="form-group">
                    <label htmlFor="register-name">Họ và Tên</label>
                    <input
                      type="text"
                      className="form-control"
                      id="register-name"
                      placeholder="Nhập tên"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="register-email"
                      placeholder="Nhập Email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-password">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      id="register-password"
                      placeholder="Nhập mật khẩu"
                    />
                  </div>

                  <button type="submit" className="btn-submit">
                    Đăng ký
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
