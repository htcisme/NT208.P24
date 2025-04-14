"use client"; // Đánh dấu đây là Client Component

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import "@/styles-comp/style.css";
import "@/app/Awards/style.css";

// Danh sách hình ảnh cho slideshow
const images = [
  "/Img/Homepage/BCH1.png", // Thay bằng đường dẫn hình ảnh của bạn
  "/Img/Homepage/BCH2.png",
  "/Img/Homepage/BCH3.png",
  "/Img/Homepage/BCH1.png",
];

export default function Awards() {
  // State để quản lý hình ảnh hiện tại
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Tự động chuyển ảnh sau 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // 3 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  // Hàm xử lý khi nhấp vào chấm
  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <main>
        {/* Tiêu đề */}
        <section className="title-section">
          <h1 className="main-title">
            ĐOÀN KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG LÀ ĐƠN VỊ XUẤT SẮC DẪN ĐẦU <br />
            TRONG CÔNG TÁC ĐOÀN VÀ PHONG TRÀO THANH NIÊN
          </h1>
          <p className="subtitle">NĂM HỌC 2023 - 2024</p>
        </section>

        {/* Hình ảnh tràn viền */}
        <section className="full-width-image">
          <Image
            src="/Img/Awards/BanChapHanhDoanKhoa.png" // Thay bằng đường dẫn hình ảnh của bạn
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
                    height: "300px", // Đảm bảo chiều cao cố định
                    objectFit: "cover",
                  }}
                />
              </div>
              {/* Chấm điều hướng */}
              <div className="dots">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${currentImageIndex === index ? "active" : ""}`}
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
            <div className="timeline-item">
              <h3>Trung ương Đoàn TNCS Hồ Chí Minh trao tặng</h3>
              <p>
                Bằng khen “Hoàn thành xuất sắc năm học 2014-2015” và Bằng khen “Hoàn thành xuất sắc năm học 2018-2019”
              </p>
            </div>
            <div className="timeline-item">
              <h3>Thành Đoàn Thành phố Hồ Chí Minh trao tặng</h3>
              <p>
                Bằng khen “Hoàn thành xuất sắc năm học 2017-2018” và Bằng khen “Hoàn thành xuất sắc nhiệm kỳ 2017-2019” Giấy khen “Khuyến khích Thành tích niên nhiệm học 2009-2010”
              </p>
            </div>
            <div className="timeline-item">
              <h3>Đại học Quốc gia Hồ Chí Minh trao tặng</h3>
              <p>
                Bằng khen “Hoàn thành xuất sắc nhiệm vụ năm học 2012-2013 và 2013-2014”
              </p>
            </div>
            <div className="timeline-item">
              <h3>Ban Cán sự Đoàn Đại học Quốc gia trao tặng</h3>
              <p>
                Giấy khen “Hoàn thành xuất sắc năm học 2016-2017”
              </p>
            </div>
            <div className="timeline-item">
              <h3>Ban Giám hiệu Trường Đại học Công nghệ Thông tin - Đại học Quốc gia Hồ Chí Minh trao tặng</h3>
              <p>
                Giấy khen “Đóng góp tích cực năm học 2019-2020”
              </p>
            </div>
          </div>
        </section>

        <div className="timeline-description">
          <p>
          Hơn thế, Đoàn khoa còn là đơn vị xuất sắc dẫn đầu trong công tác Đoàn và phong trào sinh viên, nhận Cờ thi đua
          của Đoàn trường năm học 2014-2015, 2017-2018, 2018-2019, đề nghị Tặng Cờ thi đua đơn vị xuất sắc của Ban Chấp 
          hành Thành Đoàn thành phố Hồ Chí Minh.
          </p>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}