"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import "@/styles-comp/style.css";
import "@/app/Awards/style.css";

// Danh sách hình ảnh cho slideshow
const images = [
  "/Img/Homepage/BCH1.png",
  "/Img/Homepage/BCH2.png",
  "/Img/Homepage/BCH3.png",
  "/Img/Homepage/BCH1.png",
];

export default function Awards() {
  // State để quản lý hình ảnh hiện tại
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // State để quản lý dữ liệu awards
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tự động chuyển ảnh sau 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Fetch dữ liệu giải thưởng từ API
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/awards");

        if (!response.ok) {
          throw new Error("Không thể tải danh sách giải thưởng");
        }

        const data = await response.json();

        if (data.success) {
          setAwards(data.data);
        } else {
          throw new Error(data.message || "Lỗi khi tải dữ liệu");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching awards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  // Hàm xử lý khi nhấp vào chấm
  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Nhóm giải thưởng theo tổ chức
  const groupedAwards = awards.reduce((acc, award) => {
    if (!acc[award.organization]) {
      acc[award.organization] = [];
    }
    acc[award.organization].push(award);
    return acc;
  }, {});

  return (
    <>
      <main>
        {/* Tiêu đề */}
        <section className="title-section">
          <h1 className="main-title">
            ĐOÀN KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG LÀ ĐƠN VỊ XUẤT SẮC DẪN ĐẦU{" "}
            <br />
            TRONG CÔNG TÁC ĐOÀN VÀ PHONG TRÀO THANH NIÊN
          </h1>
          <p className="subtitle">NĂM HỌC 2023 - 2024</p>
        </section>

        {/* Hình ảnh tràn viền */}
        <section className="full-width-image">
          <Image
            src="/Img/Awards/BanChapHanhDoanKhoa.png"
            alt="Award Banner"
            width={1920}
            height={600}
            style={{ width: "100%", height: "auto", objectFit: "cover" }}
          />
        </section>

        {/* Phần hai cột */}
        <section className="two-columns-section">
          <div className="content-column">
            <p>
              Trong 10 năm qua, những thành quả mà Đoàn khoa đã đạt được là nhờ
              vào sự cố gắng, nỗ lực không ngừng nghỉ của tập thể cán bộ, đoàn
              viên, thanh niên khoa Mạng máy tính và Truyền thông. Đoàn khoa
              MMT&T là đơn vị luôn đi đầu trong các phong trào xung kích, tình
              nguyện vì cộng đồng.
            </p>
            <p>
              Tính đến thời điểm hiện tại, Đoàn khoa vẫn đang duy trì được nhịp
              độ hoạt động sôi nổi, tích cực.
            </p>
          </div>
          <div className="image-column">
            <div className="slideshow">
              {/* Hiển thị hình ảnh hiện tại */}
              <div className="slide">
                <Image
                  src={images[currentImageIndex]}
                  alt={`Slide ${currentImageIndex + 1}`}
                  width={400}
                  height={300}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* Chấm điều hướng */}
              <div className="dots">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${
                      currentImageIndex === index ? "active" : ""
                    }`}
                    onClick={() => handleDotClick(index)}
                  ></span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Phần timeline thành tựu */}
        <section className="timeline-section">
          <div className="timeline">
            {loading ? (
              <div className="loading-container">
                <p>Đang tải danh sách thành tích...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>
                  Thử lại
                </button>
              </div>
            ) : (
              Object.entries(groupedAwards).map(([organization, orgAwards]) => (
                <div key={organization} className="timeline-item">
                  <h3>{organization} trao tặng</h3>
                  {orgAwards.map((award) => (
                    <p key={award._id}>
                      {award.content} ({award.year})
                    </p>
                  ))}
                </div>
              ))
            )}

            {/* Hiển thị tin nhắn nếu không có dữ liệu */}
            {!loading && !error && awards.length === 0 && (
              <div className="timeline-item">
                <p>Chưa có thành tích nào được cập nhật</p>
              </div>
            )}
          </div>
        </section>

        <div className="timeline-description">
          <p>
            Hơn thế, Đoàn khoa còn là đơn vị xuất sắc dẫn đầu trong công tác
            Đoàn và phong trào sinh viên, nhận Cờ thi đua của Đoàn trường năm
            học 2014-2015, 2017-2018, 2018-2019, đề nghị Tặng Cờ thi đua đơn vị
            xuất sắc của Ban Chấp hành Thành Đoàn thành phố Hồ Chí Minh.
          </p>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
