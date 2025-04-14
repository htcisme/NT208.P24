"use client"; // Thêm dòng này để đánh dấu đây là Client Component

import React, { useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import "@/styles-comp/style.css";
import "@/app/Activities/style.css";

export default function Activities() {
  // Danh sách 5 sự kiện với tiêu đề (có thể thêm hình ảnh sau)
  const events = [{ title: "VNU TOUR 2024", image: "/path-to-image-1.jpg" }, { title: "NGỌN ĐUỐC XANH 2025", image: "/path-to-image-2.jpg" }, { title: "NETSEC DAY 2024", image: "/path-to-image-3.jpg" }, { title: "EVENT 4 2024", image: "/path-to-image-4.jpg" }, { title: "EVENT 5 2024", image: "/path-to-image-5.jpg" },];

  // Trạng thái để quản lý vị trí bắt đầu của slider
  const [startIndex, setStartIndex] = useState(0);

  // Hàm xử lý bấm mũi tên trái
  const handlePrev = () => {
    setStartIndex((prevIndex) => (prevIndex === 0 ? events.length - 3 : prevIndex - 1));
  };

  // Hàm xử lý bấm mũi tên phải
  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex === events.length - 3 ? 0 : prevIndex + 1));
  };

  // Lấy 3 sự kiện để hiển thị dựa trên startIndex
  const visibleEvents = events.slice(startIndex, startIndex + 3);
  return (
    <>
      <main className="light-container-main">
        {/* Split section: 70-30 */}
        <div className="light-split-section">
          {/* Bên trái: 70% - Tiêu đề, hình ảnh, mô tả */}
          <div className="light-split-left">
            <div className="light-section-title">
              <strong>CÁC HOẠT ĐỘNG NỔI BẬT</strong><br />
              <strong>CỦA TUỔI TRẺ MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG</strong>
            </div>
            <div className="light-section-highlight">
              <Image src="/path-to-image.jpg" alt="Highlight" width={800} height={400} />
            </div>
            <p className="light-section-description">
              Hướng đến xây dựng một thế hệ sinh viên Khoa Mạng máy tính và Truyền thông nói riêng và sinh viên trường Đại học Công nghệ Thông tin nói chung
              vừa hồng, vừa chuyên, hiểu kiến thức, vững kỹ năng, Đoàn khoa thường xuyên tổ chức các hoạt động thuộc nhiều lĩnh vực khác nhau: hoạt động Đoàn
              - Hội, công tác xã hội, tình nguyện, học tập, nghiên cứu khoa học, âm nhạc,... và các hoạt động khác phù hợp với nhu cầu của sinh viên.
              <br />
              <br />
              Dấu ấn nổi bật trong suốt 10 năm thành lập của Đoàn khoa chính là các hoạt động Đoàn - Hội, các hoạt động phục vụ cho lợi ích của xã hội, thiện
              nguyện và phát triển kỹ năng mềm cho sinh viên. Trải dài qua các năm học, Đoàn khoa có các hoạt động nổi bật như: <strong>Chào đón Tân sinh viên
                Khoa kết hợp sinh hoạt công dân đầu khóa, VNU Tour - Hành trình khám phá khu đô thị Đại học Quốc gia HCM, NETSEC Day - Ngày hội truyền thống Khoa
                Mạng máy tính và Truyền thông, NC Fes - Ngày hội trò chơi dân gian và Chiến dịch tình nguyện Ngọn Đuốc Xanh.</strong>
            </p>
          </div>

          {/* Bên phải: 30% - Tin tức mới nhất */}
          <div className="light-split-right">
            <h3>TIN TỨC MỚI NHẤT</h3>
            <ul className="light-news-list">
              <li>
                <a href="#">Chiến dịch Ngọn Đuốc Xanh 2025 thông báo mở form đăng ký chiến sĩ</a>
                <span className="news-date">Thứ Sáu - 14/02/2025</span>
              </li>
              <li>
                <a href="#">Đoàn khoa Mạng máy tính và Truyền thông công bố chủ đề “Tần Ty Đón Tết” chào mừng Xuân Ất Tỵ 2025</a>
                <span className="news-date">Thứ Sáu - 14/02/2025</span>
              </li>
              <li>
                <a href="#">Công bố chủ đề hoạt động “NC Sharing”</a>
                <span className="news-date">Thứ Sáu - 14/02/2025</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Slider hoạt động */}
        <section className="light-slider-container">
          <button className="light-slider-arrow" onClick={handlePrev}>
            ←
          </button>
          {visibleEvents.map((event, index) => (
            <div className="light-slider-item" key={index}>
              <div className={`slider-image-placeholder ${index === 1 ? "active" : ""}`}></div>
              <h4>{event.title}</h4>
            </div>
          ))}
          <button className="light-slider-arrow" onClick={handleNext}>
            →
          </button>
        </section>
        {/* Dots điều hướng */}
        <div className="light-slider-dots">
          {Array.from({ length: events.length - 2 }).map((_, index) => (
            <span
              key={index}
              className={`dot ${startIndex === index ? "active" : ""}`}
              onClick={() => setStartIndex(index)}
            ></span>
          ))}
        </div>

        <div className="light-detail-container">
          {/* Section 1: Ngọn Đuốc Xanh - Hình ảnh bên trái, nội dung bên phải */}
          <div className="light-detail-item split-40-60">
            <div className="light-detail-image">
              <div className="detail-image-placeholder"></div> {/* Placeholder cho hình ảnh */}
            </div>
            <div className="light-detail-content">
              <h3><strong>CHƯƠNG TRÌNH TÌNH NGUYỆN NGỌN ĐUỐC XANH</strong></h3>
              <br />
              <p>
                     Trong hai năm trở lại đây, bên cạnh NC FES, Đoàn khoa dần khẳng định vị trí của mình hơn nữa trong việc giúp sinh viên có một môi trường trải nghiệm thực tế
                tại địa phương nơi các tỉnh. Cụ thể, Đoàn khoa đã tổ chức thành công 2 chiến dịch tình nguyện: Ngọn Đuốc Xanh 2023 và Ngọn Đuốc Xanh 2024. Đội hình Ngọn Đuốc 
                Xanh là đội hình tình nguyện của các bạn sinh viên trẻ, năng động, nhiệt huyết, luôn mong muốn được cống hiến sức trẻ của mình cho cộng đồng. Với tinh thần 
                "Sẻ chia - Kết nối - Trao yêu thương", các chiến sĩ Ngọn Đuốc Xanh đã tham gia nhiều hoạt động tình nguyện ý nghĩa tại địa phương phường Tân Phú, phường Long 
                Trường (Thành phố Thủ Đức) và  xã Tân Phú (Thị xã Cai Lậy, tỉnh Tiền Giang) như: Công trình thanh niên “Tuyến đường hoa nông thôn mới”, Công trình “Thùng phân 
                loại rác tái chế”, Ngày hội “Công nghệ cho em”, Ngày tri ân, Bữa cơm nghĩa tình, Lớp học kỹ năng mềm, Đêm văn nghệ cho em,... Các chiến sĩ của 2 chiến dịch tuy 
                đến từ các khoa khác nhau, các ngành học khác nhau nhưng cùng chung tinh thần thiện nguyện, tương thân tương ái.
              </p>
            </div>
          </div>

          {/* Section 2: VNU Tour - Nội dung bên trái, hình ảnh bên phải */}
          <div className="light-detail-item split-60-40">
            <div className="light-detail-content">
              <h3><strong>VNU TOUR – HÀNH TRÌNH KHÁM PHÁ KHU ĐÔ THỊ ĐHQG-HCM</strong></h3>
              <br />
              <p>
                Để giúp các bạn Tân sinh viên hiểu hơn về Khu đô thị Đại học Quốc gia HCM - nơi trường Đại học Công nghệ Thông tin
                đang tọa lạc, chuỗi hoạt động chào đón Tân sinh viên còn một hoạt động đặc trưng, ghi dấu ấn về hoạt động “Thể lực 
                tốt” của Đoàn khoa Mạng trong nhiều năm liền, đó là VNU Tour - Hành trình khám phá Khu đô thị Đại học Quốc gia. Trải
                qua 11 mùa tính đến năm 2023, VNU Tour đã để lại trong lòng các bạn Tân sinh viên nhiều ký ức khó quên trong hành 
                trình khám phá và tìm ra sự thật được che giấu đằng sau các chủ đề mà VNU Tour muốn truyền tải. Qua việc đi đến các 
                trạm được đặt tại các địa điểm nổi bật trong Khu đô thị ĐHQG-HCM, vượt các chướng ngại vật, giải mật thư và tìm ra 
                câu trả lời cuối cùng được ẩn giấu, các bạn Tân sinh viên sẽ có được cho mình những kỹ năng, kinh nghiệm bổ ích, 
                sát với đời sống sinh viên tại đây. Hơn nữa, đây không chỉ là hoạt động giúp các bạn được trải nghiệm mà còn là một
                trong những hoạt động được cấp giấy chứng nhận “Thể lực tốt” trong danh hiệu “Sinh viên 5 tốt” cấp Khoa. Năm 2023,
                với chủ đề “Mật ngữ loài hoa”, đây là năm bùng nổ với hơn 450 thí sinh đến từ 15 trường đại học khác nhau trên địa 
                bàn thành phố. VNU Tour hứa hẹn sẽ ngày càng phát huy hơn nữa vai trò của mình, nhất là giai đoạn những ngày đầu năm học.
              </p>
            </div>
            <div className="light-detail-image">
              <div className="detail-image-placeholder"></div> {/* Placeholder cho hình ảnh */}
            </div>
          </div>
        </div>
        <Footer></Footer>
      </main>
    </>
  );
}

