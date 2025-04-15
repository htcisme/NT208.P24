"use client"; // Đánh dấu đây là Client Component

import React from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import "@/styles-comp/style.css";
import "@/app/ActivitiesOverview/style.css";

export default function ActivitiesOverview() {
  // Dữ liệu mẫu cho danh sách bài đăng (8 bài, 2 hàng x 4 bài)
  const postList = [
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-1",
      date: new Date("2025-04-14T15:00:00"), // Thời gian thực tế
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-2",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-3",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-4",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-5",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-6",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-7",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-8",
      date: new Date("2025-04-14T15:00:00"),
    },
  ];

  // Dữ liệu mẫu cho các bài viết khác (8 bài, 2 cột x 4 bài)
  const otherPosts = [
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-9",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-10",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-11",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-12",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-13",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-14",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-15",
      date: new Date("2025-04-14T15:00:00"),
    },
    {
      title: "Chiến dịch Ngọn Đuốc Xanh 2025 công bố danh sách chiến sĩ",
      link: "/activities/ngon-duoc-xanh-2025-danh-sach-chien-si-16",
      date: new Date("2025-04-14T15:00:00"),
    },
  ];

  // Hàm định dạng thời gian
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} - Thứ Hai, Ngày ${day}/${month}/${year}`;
  };

  return (
    <>
      <main className="light-container-main">
        {/* Mục Danh sách bài đăng */}
        <section className="post-list-container">
          <h3 className="post-list-title">DANH SÁCH BÀI ĐĂNG</h3>
          <div className="post-list-grid">
            {postList.map((post, index) => (
              <div className="post-item" key={index}>
                <div className="post-box">
                  <div className="post-image-placeholder"></div>
                  <h4 className="post-title">
                    <Link href={post.link}>{post.title}</Link>
                  </h4>
                  <p className="post-date">{formatDate(post.date)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mục Các bài viết khác */}
          <div className="other-posts-container">
            <h3 className="other-posts-title">CÁC BÀI VIẾT KHÁC</h3>
            <div className="other-posts-grid">
              <div className="other-posts-column">
                {otherPosts.slice(0, 4).map((post, index) => (
                  <div className="other-post-item" key={index}>
                    <h4 className="other-post-title">
                      <Link href={post.link}>{post.title}</Link>
                    </h4>
                    <p className="other-post-date">{formatDate(post.date)}</p>
                  </div>
                ))}
              </div>
              <div className="other-posts-column">
                {otherPosts.slice(4, 8).map((post, index) => (
                  <div className="other-post-item" key={index}>
                    <h4 className="other-post-title">
                      <Link href={post.link}>{post.title}</Link>
                    </h4>
                    <p className="other-post-date">{formatDate(post.date)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="light-news-actions">
              <div className="light-news-back">
                <Link href="/Activities">Trở về</Link>
              </div>
          </div>
          <Footer />
        </section>
      </main>
    </>
  );
}