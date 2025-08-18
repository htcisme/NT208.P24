"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./style.css";

// Custom hook cho scroll reveal
const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: "50px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullname: "",
    mssv: "",
    email: "",
    phone: "",
    donvi: "",
    room: "",
    date: "",
    startTime: "",
    endTime: "",
    content: "",
    equipment: "",
    agreement: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // State cho nội dung động từ CMS
  const [formContent, setFormContent] = useState(null);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  // Scroll reveal refs
  const [formContainerRef, formContainerVisible] = useScrollReveal(0.1);
  const [instructionsRef, instructionsVisible] = useScrollReveal(0.2);
  const [progressRef, progressVisible] = useScrollReveal(0.2);
  const [step1Ref, step1Visible] = useScrollReveal(0.2);
  const [step2Ref, step2Visible] = useScrollReveal(0.2);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/booking-form");
        const result = await res.json();
        if (result.success && result.data) {
          setFormContent(result.data);
        } else {
          throw new Error("Không thể tải nội dung biểu mẫu.");
        }
      } catch (error) {
        console.error("Lỗi khi tải nội dung form:", error);
        // Để formContent là null để hiển thị thông báo lỗi
        setFormContent(null);
      } finally {
        setIsLoadingContent(false);
      }
    };
    fetchContent();
  }, []);

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullname.trim()) newErrors.fullname = "Họ tên là bắt buộc";
    if (!formData.mssv.trim()) newErrors.mssv = "MSSV là bắt buộc";
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số";
    }
    if (!formData.donvi) newErrors.donvi = "Đơn vị là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.room) newErrors.room = "Vui lòng chọn phòng";
    if (!formData.date) newErrors.date = "Ngày sử dụng là bắt buộc";
    if (!formData.startTime)
      newErrors.startTime = "Thời gian bắt đầu là bắt buộc";
    if (!formData.endTime) newErrors.endTime = "Thời gian kết thúc là bắt buộc";
    if (!formData.content.trim())
      newErrors.content = "Nội dung sử dụng là bắt buộc";
    if (!formData.agreement)
      newErrors.agreement = "Bạn cần đồng ý với các điều khoản";
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (start >= end) {
        newErrors.endTime = "Thời gian kết thúc phải sau thời gian bắt đầu";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const submitForm = async () => {
    if (validateStep2()) {
      try {
        setSubmitting(true);
        const donviElement = document.getElementById("donvi");
        const donviText = donviElement.options[donviElement.selectedIndex].text;
        let formattedDate = formData.date;
        if (formData.date && formData.date.includes("-")) {
          const dateParts = formData.date.split("-");
          formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        }
        const scriptURL =
          "https://script.google.com/macros/s/AKfycbztUVQSnFp6BYTUsmJGeuqPU9znyRiC8FvN9TWEu5yOWM01plcllrf9zSu2pVs7Mrd62A/exec";
        const iframeId = "hidden_iframe_" + Date.now();
        const iframe = document.createElement("iframe");
        iframe.id = iframeId;
        iframe.name = iframeId;
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        const form = document.createElement("form");
        form.action = scriptURL;
        form.method = "GET";
        form.target = iframeId;
        form.style.display = "none";
        const addField = (name, value) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        };
        addField("mssv", formData.mssv);
        addField("ho_ten", formData.fullname);
        addField("don_vi", donviText);
        addField("sdt", formData.phone);
        addField("phong", formData.room);
        addField("ngay", formattedDate);
        addField("gio", `${formData.startTime} - ${formData.endTime}`);
        addField("noi_dung", formData.content);
        document.body.appendChild(form);
        form.submit();
        setTimeout(() => {
          setSubmissionSuccess(true);
          alert("Đăng ký sử dụng phòng của bạn đã được gửi thành công!");
          setFormData({
            fullname: "",
            mssv: "",
            email: "",
            phone: "",
            donvi: "",
            room: "",
            date: "",
            startTime: "",
            endTime: "",
            content: "",
            equipment: "",
            agreement: false,
          });
          setErrors({});
          setCurrentStep(1);
          document.body.removeChild(form);
          document.body.removeChild(iframe);
          setSubmitting(false);
        }, 2500);
      } catch (error) {
        console.error("Error submitting form:", error);
        alert(`Có lỗi xảy ra khi gửi form: ${error.message}`);
        setSubmitting(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (isLoadingContent) {
    return (
      <>
        <Header />
        <div
          className="contact-loading"
          style={{
            minHeight: "80vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="spinner"></div>
          <p>Đang tải biểu mẫu...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!formContent) {
    return (
      <>
        <Header />
        <div
          className="contact-error"
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Không thể tải nội dung biểu mẫu. Vui lòng thử lại sau.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div>
        <Head>
          <title>{formContent.title}</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>

        <div
          ref={formContainerRef}
          className={`form-container ${
            formContainerVisible ? "animate-form-container" : ""
          }`}
        >
          <div className="form-header">
            <h2>{formContent.title}</h2>
          </div>
          <div className="form-content">
            <div
              ref={instructionsRef}
              className={`instructions ${
                instructionsVisible ? "animate-fade-in" : ""
              }`}
            >
              <h3>HƯỚNG DẪN ĐẶT PHÒNG:</h3>
              <ul>
                {formContent.instructions.map((item, index) => (
                  <li
                    key={index}
                    dangerouslySetInnerHTML={{
                      __html: item.replace(
                        "tại đây",
                        `<a href="${formContent.availabilityLink}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-color); font-weight: 500;">tại đây</a>`
                      ),
                    }}
                  ></li>
                ))}
              </ul>
              <div className="important-note">
                <strong>Lưu ý:</strong> {formContent.importantNote}
              </div>
              <div className="contact-info">
                Nếu có thắc mắc hoặc lỗi khi đặt phòng vui lòng gửi mail về{" "}
                <span className="email-highlight">
                  {formContent.supportEmail}
                </span>
                .
              </div>
              <div className="privacy-notice">{formContent.privacyNotice}</div>
            </div>

            <div
              ref={progressRef}
              className={`progress-bar ${
                progressVisible ? "animate-progress" : ""
              }`}
            >
              <div
                className={`progress-step ${currentStep >= 1 ? "active" : ""} ${
                  currentStep > 1 ? "complete" : ""
                }`}
              >
                1
              </div>
              <div
                className={`progress-step ${currentStep === 2 ? "active" : ""}`}
              >
                2
              </div>
            </div>

            {currentStep === 1 && (
              <div
                ref={step1Ref}
                className={`form-step active ${
                  step1Visible ? "animate-step" : ""
                }`}
              >
                <h3 className="form-title">Thông Tin Người Đăng Ký</h3>
                <p className="form-subtitle">
                  Vui lòng điền đầy đủ thông tin cá nhân
                </p>
                <div className="form-card">
                  <div className="form-row">
                    <div className="form-col">
                      <div className="form-group">
                        <label htmlFor="fullname">
                          Họ và Tên <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          id="fullname"
                          className={`form-control ${
                            errors.fullname ? "error" : ""
                          }`}
                          name="fullname"
                          required
                          placeholder="Nguyễn Văn A"
                          value={formData.fullname}
                          onChange={handleInputChange}
                        />
                        {errors.fullname && (
                          <p className="error-message">{errors.fullname}</p>
                        )}
                      </div>
                    </div>
                    <div className="form-col">
                      <div className="form-group">
                        <label htmlFor="mssv">
                          MSSV <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          id="mssv"
                          className={`form-control ${
                            errors.mssv ? "error" : ""
                          }`}
                          name="mssv"
                          required
                          placeholder="2X52XXXX"
                          value={formData.mssv}
                          onChange={handleInputChange}
                        />
                        {errors.mssv && (
                          <p className="error-message">{errors.mssv}</p>
                        )}
                        <p className="form-note">Mã số sinh viên</p>
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <div className="form-group">
                        <label htmlFor="email">
                          Email <span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          className={`form-control ${
                            errors.email ? "error" : ""
                          }`}
                          name="email"
                          required
                          placeholder="MSSV@gm.uit.edu.vn"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        {errors.email && (
                          <p className="error-message">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="form-col">
                      <div className="form-group">
                        <label htmlFor="phone">
                          Số Điện Thoại <span className="required">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          className={`form-control ${
                            errors.phone ? "error" : ""
                          }`}
                          name="phone"
                          required
                          placeholder="0xxxxxxxxx"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                        {errors.phone && (
                          <p className="error-message">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="donvi">
                      Đơn Vị <span className="required">*</span>
                    </label>
                    <div className="select-wrapper">
                      <select
                        id="donvi"
                        className={`form-control ${
                          errors.donvi ? "error" : ""
                        }`}
                        name="donvi"
                        required
                        value={formData.donvi}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>
                          Chọn đơn vị của bạn
                        </option>
                        {formContent.units.map((unit, index) => (
                          <option key={index} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.donvi && (
                      <p className="error-message">{errors.donvi}</p>
                    )}
                  </div>
                </div>
                {submissionSuccess && (
                  <div className="submission-success">
                    Đăng ký đã được gửi thành công và lưu vào hệ thống!
                  </div>
                )}
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Tiếp Tục
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div
                ref={step2Ref}
                className={`form-step active ${
                  step2Visible ? "animate-step" : ""
                }`}
              >
                <h3 className="form-title">Thông Tin Đặt Phòng</h3>
                <p className="form-subtitle">
                  Vui lòng cung cấp chi tiết về lịch đặt phòng
                </p>
                <div className="form-card">
                  <div className="form-row">
                    <div className="form-col">
                      <div className="form-group">
                        <label htmlFor="room">
                          Tên Phòng <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          id="room"
                          className={`form-control ${
                            errors.room ? "error" : ""
                          }`}
                          name="room"
                          required
                          placeholder="Ví dụ: B3.10"
                          value={formData.room}
                          onChange={handleInputChange}
                        />
                        {errors.room && (
                          <p className="error-message">{errors.room}</p>
                        )}
                        <p className="form-note">
                          Link xem phòng:{" "}
                          <a
                            className="form-note-link"
                            href={formContent.availabilityLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Tại đây
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="form-col">
                      <div className="form-group">
                        <label htmlFor="date">
                          Ngày Đặt <span className="required">*</span>
                        </label>
                        <input
                          type="date"
                          id="date"
                          className={`form-control ${
                            errors.date ? "error" : ""
                          }`}
                          name="date"
                          min={today}
                          required
                          value={formData.date}
                          onChange={handleInputChange}
                        />
                        {errors.date && (
                          <p className="error-message">{errors.date}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-col">
                      <div className="form-group">
                        <label htmlFor="startTime">
                          Thời Gian Bắt Đầu <span className="required">*</span>
                        </label>
                        <input
                          type="time"
                          id="startTime"
                          className={`form-control ${
                            errors.startTime ? "error" : ""
                          }`}
                          name="startTime"
                          required
                          value={formData.startTime}
                          onChange={handleInputChange}
                        />
                        {errors.startTime && (
                          <p className="error-message">{errors.startTime}</p>
                        )}
                      </div>
                    </div>
                    <div className="form-col">
                      <div className="form-group">
                        <label htmlFor="endTime">
                          Thời Gian Kết Thúc <span className="required">*</span>
                        </label>
                        <input
                          type="time"
                          id="endTime"
                          className={`form-control ${
                            errors.endTime ? "error" : ""
                          }`}
                          name="endTime"
                          required
                          value={formData.endTime}
                          onChange={handleInputChange}
                        />
                        {errors.endTime && (
                          <p className="error-message">{errors.endTime}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="content">
                      Nội Dung Sử Dụng <span className="required">*</span>
                    </label>
                    <textarea
                      id="content"
                      className={`form-control ${
                        errors.content ? "error" : ""
                      }`}
                      name="content"
                      required
                      placeholder="Mô tả chi tiết mục đích sử dụng phòng"
                      value={formData.content}
                      onChange={handleInputChange}
                    ></textarea>
                    {errors.content && (
                      <p className="error-message">{errors.content}</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>
                      Yêu Cầu Thiết Bị <span className="required">*</span>
                    </label>
                    <div className="radio-group">
                      <div className="radio-option">
                        <input
                          type="radio"
                          id="equipment1"
                          name="equipment"
                          value="micro-maychieu"
                          required
                          checked={formData.equipment === "micro-maychieu"}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="equipment1">Micro và Máy Chiếu</label>
                      </div>
                      <div className="radio-option">
                        <input
                          type="radio"
                          id="equipment2"
                          name="equipment"
                          value="khong"
                          checked={formData.equipment === "khong"}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="equipment2">Không</label>
                      </div>
                    </div>
                    {errors.equipment && (
                      <p className="error-message">{errors.equipment}</p>
                    )}
                  </div>
                </div>
                <div className="form-card">
                  <h3>Cam Kết</h3>
                  <p style={{ marginBottom: "15px" }}>
                    {formContent.commitmentText}
                  </p>
                  <div className="form-group">
                    <div className="radio-option">
                      <input
                        type="checkbox"
                        id="agreement"
                        name="agreement"
                        required
                        style={{ width: "auto", marginRight: "10px" }}
                        checked={formData.agreement}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="agreement">
                        Tôi đồng ý với các điều khoản trên
                      </label>
                    </div>
                    {errors.agreement && (
                      <p className="error-message">{errors.agreement}</p>
                    )}
                  </div>
                </div>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={prevStep}
                  >
                    Quay Lại
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={submitForm}
                    disabled={submitting}
                  >
                    {submitting ? "Đang gửi..." : "Gửi Đăng Ký"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
