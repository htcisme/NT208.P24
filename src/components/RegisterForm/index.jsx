"use client";
import "@/styles-comp/style.css";
import Image from "next/image";
import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch("/api/notification-subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          loading: false,
          success: true,
          error: null,
        });
        setFormData({ name: "", email: "" });
      } else {
        throw new Error(data.message || "Đăng ký thất bại");
      }
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: error.message,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="registerform">
      <div className="registerform-header">
        <h1>HÃY TRỞ THÀNH NGƯỜI ĐẦU TIÊN!</h1>
        <p className="registerform-header-subtext">
          Đăng ký để nhận được những thông tin, cập nhật mới nhất <br />
          từ Đoàn khoa Mạng máy tính và Truyền thông nhé!
        </p>
      </div>
      <div className="registerform-footer-form">
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Họ và Tên</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập tên"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập Email"
            required
          />

          {status.error && (
            <div className="registerform-error">{status.error}</div>
          )}
          {status.success && (
            <div className="registerform-success">
              Đăng ký thành công! Cảm ơn bạn đã đăng ký nhận thông báo.
            </div>
          )}

          <button type="submit" disabled={status.loading}>
            {status.loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
}
