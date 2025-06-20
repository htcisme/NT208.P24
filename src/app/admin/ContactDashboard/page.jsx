"use client";

import React, { useState, useEffect } from "react";
import HeaderAdmin from "@/components/HeaderAdmin";
import "./style.css";

function ContactDashboard() {
  const [formData, setFormData] = useState({
    address: "",
    email: "",
    phone: "",
    facebookUrl: "",
    mapUrl: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      setIsLoading(true);
      try {
        // Giả sử bạn có API endpoint /api/contact để lấy và cập nhật
        const response = await fetch("/api/contact");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Không thể tải thông tin liên hệ.");
        }
        if (data.contact) {
          setFormData({
            address: data.contact.address || "",
            email: data.contact.email || "",
            phone: data.contact.phone || "",
            facebookUrl: data.contact.facebookUrl || "",
            mapUrl: data.contact.mapUrl || "",
          });
        }
      } catch (err) {
        setError(
          `Lỗi tải dữ liệu: ${err.message}. Vui lòng tạo API endpoint hoặc kiểm tra lại.`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Cập nhật thông tin thất bại.");
      }

      showNotification("Cập nhật thông tin liên hệ thành công!", "success");
    } catch (err) {
      setError(err.message);
      showNotification(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <HeaderAdmin />
      <main className="admin-content">
        <div className="content-header">
          <h1>Quản lý Thông tin Liên hệ</h1>
        </div>

        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error && !isSubmitting ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="contact-form-container">
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="facebookUrl">Link Facebook</label>
                <input
                  type="url"
                  id="facebookUrl"
                  name="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={handleChange}
                  placeholder="https://www.facebook.com/yourpage"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="mapUrl">Link Google Maps</label>
                <input
                  type="url"
                  id="mapUrl"
                  name="mapUrl"
                  value={formData.mapUrl}
                  onChange={handleChange}
                  placeholder="Dán link Google Maps của địa chỉ vào đây"
                  className="form-control"
                />
                <small>
                  Lấy từ Google Maps → Chia sẻ → Sao chép đường liên kết.
                </small>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default ContactDashboard;
