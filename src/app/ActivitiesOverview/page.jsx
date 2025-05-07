"use client"; // Đánh dấu đây là Client Component

import React, { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import "@/styles-comp/style.css";
import "@/app/ActivitiesOverview/style.css";

export default function ActivitiesOverview() {
  // State để quản lý trang hiện tại cho mỗi phần
  const [currentPostPage, setCurrentPostPage] = useState(1);
  const [currentOtherPage, setCurrentOtherPage] = useState(1);

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

  // Cấu hình phân trang
  const totalPostPages = 5; // Ví dụ có 5 trang cho phần danh sách bài đăng
  const totalOtherPages = 3; // Ví dụ có 3 trang cho phần các bài viết khác

  // Tạo mảng số trang cho phần phân trang
  const generatePageNumbers = (currentPage, totalPages) => {
    let pages = [];
    
    // Luôn hiển thị trang đầu tiên
    pages.push(1);
    
    // Thêm trang hiện tại và các trang xung quanh
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    // Luôn hiển thị trang cuối cùng nếu có nhiều hơn 1 trang
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }
    
    return pages;
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

          {/* Phân trang cho danh sách bài đăng */}
          <div className="pagination-container">
            <div className="pagination">
              {currentPostPage > 1 && (
                <button 
                  className="pagination-btn" 
                  onClick={() => setCurrentPostPage(currentPostPage - 1)}
                >
                  &lt;
                </button>
              )}
              
              {generatePageNumbers(currentPostPage, totalPostPages).map((pageNum) => (
                <button
                  key={pageNum}
                  className={`pagination-btn ${pageNum === currentPostPage ? 'active' : ''}`}
                  onClick={() => setCurrentPostPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
              
              {currentPostPage < totalPostPages && (
                <button 
                  className="pagination-btn" 
                  onClick={() => setCurrentPostPage(currentPostPage + 1)}
                >
                  &gt;
                </button>
              )}
            </div>
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
            
            {/* Phân trang cho các bài viết khác */}
            <div className="pagination-container other-pagination">
              <div className="pagination">
                {currentOtherPage > 1 && (
                  <button 
                    className="pagination-btn" 
                    onClick={() => setCurrentOtherPage(currentOtherPage - 1)}
                  >
                    &lt;
                  </button>
                )}
                
                {generatePageNumbers(currentOtherPage, totalOtherPages).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${pageNum === currentOtherPage ? 'active' : ''}`}
                    onClick={() => setCurrentOtherPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}
                
                {currentOtherPage < totalOtherPages && (
                  <button 
                    className="pagination-btn" 
                    onClick={() => setCurrentOtherPage(currentOtherPage + 1)}
                  >
                    &gt;
                  </button>
                )}
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