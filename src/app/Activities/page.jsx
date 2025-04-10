import React from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles-comp/style.css"; 
import "@/app/Activities/style.css";

export default function LightActivities() {
  return (
    <>
      <Header />

      <main className="light-container-main">
        {/* Thanh tiêu đề bên trong trang */}
        <header className="light-header-bar">
          <div className="light-header-left">
            <h1 className="light-header-title">Light - Activities</h1>
          </div>
          <div className="light-header-right">
         
          </div>
        </header>

        {/* Tiêu đề và mô tả hoạt động */}
        <section className="light-section-main">
          <div className="light-section-title">
            <h2>CÁC HOẠT ĐỘNG NỔI BẬT</h2>
            <p>của Tuổi trẻ Khoa Mạng máy tính và Truyền thông</p>
          </div>
          <div className="light-section-highlight">
          </div>
          <p className="light-section-description">
            Tuổi trẻ Khoa Mạng máy tính và Truyền thông luôn là lực lượng xung kích, tiên phong trong các hoạt động học tập,
            phong trào, tình nguyện, nghiên cứu khoa học và hội nhập quốc tế. Trong những năm qua, Đoàn Khoa đã tổ chức nhiều
            hoạt động tiêu biểu như các chiến dịch tình nguyện Mùa hè xanh, Xuân tình nguyện, các hoạt động học thuật như Chuỗi
            ôn tập, Seminar, Hội nghị Sinh viên, cũng như các chương trình truyền thông sáng tạo. Mỗi hoạt động đều thu hút sự
            tham gia nhiệt tình của sinh viên và để lại nhiều dấu ấn tốt đẹp.
          </p>
        </section>

        {/* Slider hoạt động */}
        <section className="light-slider-container">
          <div className="light-slider-item">VNU TOUR 2024</div>
          <div className="light-slider-item">NGỌN ĐUỐC XANH 2025</div>
          <div className="light-slider-item">NETSEC DAY 2024</div>
        </section>

        {/* Chi tiết hoạt động */}
        <section className="light-detail-container">
          <div className="light-detail-item">
            <h3>CHƯƠNG TRÌNH TRUYỀN THÔNG NGỌN ĐUỐC XANH</h3>
            <p>
              Với mục tiêu truyền cảm hứng cho thế hệ trẻ, Đoàn Khoa đã xây dựng chiến dịch "Ngọn đuốc xanh"
              nhằm nâng cao nhận thức cộng đồng về trách nhiệm xã hội, bảo vệ môi trường và phát triển bền vững.
              Chuỗi hoạt động truyền thông bao gồm: video ngắn, phỏng vấn chiến sĩ, minigame tương tác và các bài
              viết cảm hứng.
            </p>
          </div>
          <div className="light-detail-item">
            <h3>VNU TOUR – HÀNH TRÌNH KHÁM PHÁ KHU ĐÔ THỊ ĐHQG-HCM</h3>
            <p>
              Đây là một chương trình tham quan thực tế hấp dẫn dành cho các bạn học sinh THPT, giúp các em khám phá
              cơ sở vật chất, môi trường học tập và sinh hoạt tại Khu đô thị ĐHQG-HCM. Chương trình giúp định hướng
              nghề nghiệp và tạo động lực phấn đấu cho học sinh trong giai đoạn quan trọng.
            </p>
          </div>
        </section>

        {/* Phần cuối trang (extra gợi ý nếu cần) */}
        <div className="light-footer-extra">
          <div className="light-footer-col">Nội dung 1</div>
          <div className="light-footer-col">Nội dung 2</div>
          <div className="light-footer-col">Nội dung 3</div>
        </div>
      </main>

      <Footer />
    </>
  );
}
