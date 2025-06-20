"use client";

import React, { useState, useEffect } from "react";
import HeaderAdmin from "@/components/HeaderAdmin";
import "./style.css"; // Sử dụng lại style của các trang admin khác

function BookingFormDashboard() {
  const [formData, setFormData] = useState({
    title: "",
    availabilityLink: "",
    instructions: [],
    importantNote: "",
    supportEmail: "",
    privacyNotice: "",
    commitmentText: "",
    units: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/booking-form");
        const result = await res.json();
        if (result.success) {
          setFormData(result.data);
        }
      } catch (error) {
        showNotification("Lỗi tải dữ liệu: " + error.message, "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      3000
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.split("\n") }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/booking-form", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (result.success) {
        showNotification("Cập nhật thành công!", "success");
      } else {
        throw new Error(result.message || "Cập nhật thất bại.");
      }
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );

  return (
    <div className="admin-dashboard">
      <HeaderAdmin />
      <main className="admin-content">
        <div className="content-header">
          <h1>Quản lý Nội dung Form Đặt phòng</h1>
        </div>
        {notification.show && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Tiêu đề Form</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Link kiểm tra phòng trống</label>
            <input
              name="availabilityLink"
              value={formData.availabilityLink}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Các mục hướng dẫn (Mỗi mục một dòng)</label>
            <textarea
              name="instructions"
              value={formData.instructions.join("\n")}
              onChange={handleTextAreaChange}
              className="form-control"
              rows="5"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Lưu ý quan trọng</label>
            <textarea
              name="importantNote"
              value={formData.importantNote}
              onChange={handleInputChange}
              className="form-control"
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Email hỗ trợ</label>
            <input
              name="supportEmail"
              value={formData.supportEmail}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Thông báo về quyền riêng tư</label>
            <textarea
              name="privacyNotice"
              value={formData.privacyNotice}
              onChange={handleInputChange}
              className="form-control"
              rows="3"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Nội dung cam kết</label>
            <textarea
              name="commitmentText"
              value={formData.commitmentText}
              onChange={handleInputChange}
              className="form-control"
              rows="4"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Danh sách Đơn vị (Mỗi đơn vị một dòng)</label>
            <textarea
              name="units"
              value={formData.units.join("\n")}
              onChange={handleTextAreaChange}
              className="form-control"
              rows="10"
            ></textarea>
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
      </main>
    </div>
  );
}

export default BookingFormDashboard;
