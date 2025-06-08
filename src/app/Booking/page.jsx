"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./style.css";

// Custom hook cho scroll reveal
const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve sau khi đã visible để tránh re-trigger
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '50px 0px -50px 0px' // Trigger sớm hơn một chút
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

  // Scroll reveal refs
  const [formContainerRef, formContainerVisible] = useScrollReveal(0.1);
  const [instructionsRef, instructionsVisible] = useScrollReveal(0.2);
  const [progressRef, progressVisible] = useScrollReveal(0.2);
  const [step1Ref, step1Visible] = useScrollReveal(0.2);
  const [step2Ref, step2Visible] = useScrollReveal(0.2);

  // Thêm vào phần khai báo state ở đầu component
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  // State for tracking validation errors
  const [errors, setErrors] = useState({});

  const nextStep = () => {
    // Validate all fields in step 1 before proceeding
    if (validateStep1()) {
      setCurrentStep(2);
      // Clear any previous step 2 errors when moving to step 2
      const {
        room,
        date,
        startTime,
        endTime,
        content,
        equipment,
        agreement,
        ...rest
      } = errors;
      setErrors(rest);
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
    // Clear any previous step 1 errors when moving back to step 1
    const { fullname, mssv, email, phone, donvi, ...rest } = errors;
    setErrors(rest);
  };

  // Thay thế đoạn code gửi dữ liệu trong hàm submitForm với đoạn code sau
  const submitForm = async () => {
    if (validateStep2()) {
      try {
        setSubmitting(true);

        // Lấy giá trị text của đơn vị
        const donviElement = document.getElementById("donvi");
        const donviText = donviElement.options[donviElement.selectedIndex].text;

        // Định dạng ngày
        let formattedDate = formData.date;
        if (formData.date && formData.date.includes("-")) {
          const dateParts = formData.date.split("-");
          formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
        }

        // Thông tin khả năng gặp lỗi
        console.log("Đang gửi dữ liệu...");
        console.log("Hoạt động: ", formData.content.substring(0, 30) + "...");
        console.log("MSSV: ", formData.mssv);
        console.log("Đơn vị: ", donviText);

        // Xây dựng URL với tất cả tham số
        const scriptURL =
          "https://script.google.com/macros/s/AKfycbztUVQSnFp6BYTUsmJGeuqPU9znyRiC8FvN9TWEu5yOWM01plcllrf9zSu2pVs7Mrd62A/exec";

        // Tạo iframe ẩn để gửi form
        const iframeId = "hidden_iframe_" + Date.now();
        const iframe = document.createElement("iframe");
        iframe.id = iframeId;
        iframe.name = iframeId;
        iframe.style.display = "none";
        document.body.appendChild(iframe);

        // Tạo form để gửi dữ liệu
        const form = document.createElement("form");
        form.action = scriptURL;
        form.method = "GET";
        form.target = iframeId;
        form.style.display = "none";

        // Thêm các field vào form
        const addField = (name, value) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          input.value = value;
          form.appendChild(input);
        };

        // Thêm tất cả các trường dữ liệu
        addField("mssv", formData.mssv);
        addField("ho_ten", formData.fullname);
        addField("don_vi", donviText);
        addField("sdt", formData.phone);
        addField("phong", formData.room);
        addField("ngay", formattedDate);
        addField("gio", `${formData.startTime} - ${formData.endTime}`);
        addField("noi_dung", formData.content);

        // Thêm form vào document và submit
        document.body.appendChild(form);
        form.submit();

        // Xử lý sau khi gửi
        setTimeout(() => {
          setSubmissionSuccess(true);
          alert("Đăng ký sử dụng phòng của bạn đã được gửi thành công!");

          // Reset form
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

          // Reset các state khác
          setErrors({});
          setCurrentStep(1);

          // Dọn dẹp iframe và form
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

  // Thêm hàm validateStep1 nếu chưa có
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

  // Thêm hàm validateStep2 nếu chưa có
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

    // Kiểm tra thời gian bắt đầu và kết thúc
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

  // Thêm hàm xử lý next và back
  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  // Thêm hàm xử lý input change nếu chưa có hoặc chưa đầy đủ
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <Header />
      <div>
        <Head>
          <title>Form Đăng Ký Đặt Phòng</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <div 
          ref={formContainerRef}
          className={`form-container ${formContainerVisible ? 'animate-form-container' : ''}`}
        >
          <div className="form-header">
            <h2>FORM ĐĂNG KÝ ĐẶT PHÒNG</h2>
          </div>

          <div className="form-content">
            <div 
              ref={instructionsRef}
              className={`instructions ${instructionsVisible ? 'animate-fade-in' : ''}`}
            >
              <h3>HƯỚNG DẪN ĐẶT PHÒNG:</h3>
              <ul>
                <li>
                  Vui lòng thực hiện kiểm tra thông tin phòng
                  <Link
                    href="#"
                    style={{ color: "var(--primary-color)", fontWeight: 500 }}
                  >
                    tại đây
                  </Link>
                  trước khi thực hiện đặt phòng.
                </li>
                <li>
                  Thông tin đặt phòng sẽ được gửi về Văn phòng Đoàn trường
                  <span className="highlighted">
                    {" "}
                    vào 15:00 thứ Sáu hàng tuần
                  </span>
                  .
                </li>
                <li>
                  Các đơn vị khi đặt phòng cho tuần kế tiếp vui lòng điền đầy đủ
                  thông tin như hướng dẫn bên dưới và gửi trước 15:00 thứ Sáu.
                </li>
                <li>
                  Sử dụng mail sinh viên (
                  <span className="email-highlight">MSSV@gm.uit.edu.vn</span>) để
                  đăng ký đặt phòng.
                </li>
              </ul>

              <div className="important-note">
                <strong>Lưu ý:</strong> Mọi yêu cầu đặt phòng cho phòng cho tuần
                tiếp theo sẽ không được giải quyết nếu gửi về sau thời gian đã quy
                định hoặc không đúng yêu cầu.
              </div>

              <div className="contact-info">
                Nếu có thắc mắc hoặc lỗi khi đặt phòng vui lòng gửi mail về
                <span className="email-highlight"> doankhoa@suctremmt.com</span>.
              </div>

              <div className="privacy-notice">
                Mọi thông tin cá nhân chỉ được sử dụng cho công tác đặt phòng.
                Đoàn khoa cam kết sẽ không cung cấp thông tin cá nhân người đặt
                phòng cho các bên không liên quan!
              </div>
            </div>

            <div 
              ref={progressRef}
              className={`progress-bar ${progressVisible ? 'animate-progress' : ''}`}
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

            <div 
              ref={step1Ref}
              className={`form-step ${currentStep === 1 ? "active" : ""} ${step1Visible ? 'animate-step' : ''}`}
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
                        className={`form-control ${errors.mssv ? "error" : ""}`}
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
                        className={`form-control ${errors.email ? "error" : ""}`}
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
                        className={`form-control ${errors.phone ? "error" : ""}`}
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
                      className={`form-control ${errors.donvi ? "error" : ""}`}
                      name="donvi"
                      required
                      value={formData.donvi}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Chọn đơn vị của bạn
                      </option>
                      <option value="unit1">Chi đoàn ATTT2021</option>
                      <option value="unit2">Chi đoàn ATCL2021</option>
                      <option value="unit3">Chi đoàn MMTT2021</option>
                      <option value="unit4">Chi đoàn MMCL2021</option>
                      <option value="unit5">Chi đoàn ATTN2021</option>
                      <option value="unit6">Chi đoàn ATTT2022.1</option>
                      <option value="unit7">Chi đoàn ATTT2022.2</option>
                      <option value="unit8">Chi đoàn MMTT2022.1</option>
                      <option value="unit9">Chi đoàn MMTT2022.2</option>
                      <option value="unit10">Chi đoàn MMTT2022.3</option>
                      <option value="unit11">Chi đoàn ATTN2022</option>
                      <option value="unit12">Chi đoàn ATTT2023.1</option>
                      <option value="unit13">Chi đoàn ATTT2023.2</option>
                      <option value="unit14">Chi đoàn MMTT2023.1</option>
                      <option value="unit15">Chi đoàn MMTT2023.2</option>
                      <option value="unit16">Chi đoàn MMTT2023.3</option>
                      <option value="unit17">Chi đoàn ATTN2023</option>
                      <option value="unit18">Chi đoàn ATTT2024.1</option>
                      <option value="unit19">Chi đoàn ATTT2024.2</option>
                      <option value="unit20">Chi đoàn ATTT2024.3</option>
                      <option value="unit21">Chi đoàn MMTT2024.1</option>
                      <option value="unit22">Chi đoàn MMTT2024.2</option>
                      <option value="unit23">Chi đoàn MMTT2024.3</option>
                      <option value="unit24">Chi đoàn ATTN2024</option>
                      <option value="unit25">Đoàn khoa MMT&TT</option>
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

            <div 
              ref={step2Ref}
              className={`form-step ${currentStep === 2 ? "active" : ""} ${step2Visible ? 'animate-step' : ''}`}
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
                        className={`form-control ${errors.room ? "error" : ""}`}
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
                          href="https://student.uit.edu.vn/lichphong"
                          target="_blank"
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
                        className={`form-control ${errors.date ? "error" : ""}`}
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
                    className={`form-control ${errors.content ? "error" : ""}`}
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
                  Tôi cam kết sử dụng phòng đúng mục đích và tuân thủ các quy định
                  của nhà trường. Tôi sẽ chịu trách nhiệm nếu có bất kỳ hư hỏng
                  hoặc vấn đề nào xảy ra trong thời gian sử dụng.
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
          </div>
        </div>
      </div>
    </>
  );
}