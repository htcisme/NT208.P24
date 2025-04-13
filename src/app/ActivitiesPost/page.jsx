"use client"; // Thêm dòng này để đánh dấu đây là Client Component

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "@/styles-comp/style.css";
import "@/app/ActivitiesPost/style.css";

export default function PostActivities() {
  // Slider hoạt động
  const relatedPosts = [
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      image: null,
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-1"
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      image: null,
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-2"
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      image: null,
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-3"
    },
  ];

  return (
    <>
      <main className="light-container-main">
        {/* Tiêu đề chính nằm giữa */}
        <div className="light-main-title">
          <strong>CHIẾN DỊCH NGỌN ĐUỐC XANH 2025</strong>
          <br />
          <strong>THÔNG BÁO MỞ FORM ĐĂNG KÝ CHIẾN SĨ</strong>
        </div>

        {/* Split section: 70-30 */}
        <div className="light-split-section">
          <div className="light-split-left">
            <div className="light-section-date">Thứ Sáu - Ngày 14/02/2025</div>
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
            <div className="light-section-author">Tác giả: Nguyễn Đình Khang</div>
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

        {/* Mục Bài viết liên quan */}
        <section className="related-posts-container">
          <h3 className="related-posts-title">BÀI VIẾT LIÊN QUAN</h3>
          <div className="related-posts-grid">
            {relatedPosts.map((post, index) => (
              <div className="related-post-item" key={index}>
                <div className="related-post-box">
                  {post.image ? (
                    <div className="related-post-image">
                      <Image src={post.image} alt={post.title} width={200} height={200} />
                    </div>
                  ) : (
                    <div className="related-post-image-placeholder"></div>
                  )}
                  <h4 className="related-post-title">
                    <Link href={post.link}>{post.title}</Link>
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}