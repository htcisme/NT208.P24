"use client"; // Đánh dấu đây là Client Component

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import "@/styles-comp/style.css";
import "@/app/ActivitiesOverview/style.css";

export default function ActivitiesOverview() {
  // State để quản lý trang hiện tại cho mỗi phần
  const [currentPostPage, setCurrentPostPage] = useState(1);
  const [currentOtherPage, setCurrentOtherPage] = useState(1);
  
  // State cho dữ liệu
  const [postList, setPostList] = useState([]);
  const [otherPosts, setOtherPosts] = useState([]);
  const [totalPostPages, setTotalPostPages] = useState(1);
  const [totalOtherPages, setTotalOtherPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dữ liệu cho danh sách bài đăng
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/activities?page=${currentPostPage}&limit=8&status=published`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        
        if (data.success) {
          setPostList(data.data);
          setTotalPostPages(data.pagination.totalPages);
        } else {
          throw new Error(data.message || 'Error fetching data');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Không thể lấy danh sách bài đăng');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPostPage]);

  // Fetch dữ liệu cho các bài viết khác
  useEffect(() => {
    const fetchOtherPosts = async () => {
      try {
        const response = await fetch(`/api/activities?page=${currentOtherPage}&limit=8&status=published`);
        if (!response.ok) {
          throw new Error('Failed to fetch other posts');
        }
        const data = await response.json();
        
        if (data.success) {
          setOtherPosts(data.data);
          setTotalOtherPages(data.pagination.totalPages);
        } else {
          throw new Error(data.message || 'Error fetching other posts data');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Không thể lấy các bài viết khác');
      }
    };

    fetchOtherPosts();
  }, [currentOtherPage]);

  // Hàm định dạng thời gian
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} - Thứ Hai, Ngày ${day}/${month}/${year}`;
  };

  // Tạo mảng số trang theo định dạng "1 2 3 4 ... n"
  const generatePageNumbers = (currentPage, totalPages) => {
    let pages = [];
    
    // Luôn hiển thị 4 trang đầu (hoặc ít hơn nếu totalPages < 4)
    for (let i = 1; i <= Math.min(4, totalPages); i++) {
      pages.push(i);
    }
    
    // Nếu tổng số trang > 4, thì thêm dấu "..."
    if (totalPages > 4) {
      // Thêm dấu "..." nếu cần
      if (pages[pages.length - 1] < totalPages - 1) {
        pages.push("...");
      }
      
      // Thêm trang cuối cùng nếu chưa có
      if (pages[pages.length - 1] !== totalPages) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  // Hiển thị loading state
  if (loading) {
    return (
      <div className="loading-container">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Hiển thị error state
  if (error) {
    return (
      <div className="error-container">
        <p>Lỗi: {error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  return (
    <>
      <main className="light-container-main">
        {/* Mục Danh sách bài đăng */}
        <section className="post-list-container">
          <h3 className="post-list-title">DANH SÁCH BÀI ĐĂNG</h3>
          <div className="post-list-grid">
            {postList.map((post, index) => (
              <div className="post-item" key={post._id || index}>
                <div className="post-box">
                  <div className="post-image-placeholder">
                    {post.image && <img src={post.image} alt={post.title} />}
                  </div>
                  <h4 className="post-title">
                    <Link href={`/activities/${post._id}`}>{post.title}</Link>
                  </h4>
                  <p className="post-date">{formatDate(post.createdAt)}</p>
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
              
              {generatePageNumbers(currentPostPage, totalPostPages).map((pageNum, index) => (
                pageNum === "..." ? (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={pageNum}
                    className={`pagination-btn ${pageNum === currentPostPage ? 'active' : ''}`}
                    onClick={() => setCurrentPostPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                )
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
                  <div className="other-post-item" key={post._id || index}>
                    <h4 className="other-post-title">
                      <Link href={`/activities/${post._id}`}>{post.title}</Link>
                    </h4>
                    <p className="other-post-date">{formatDate(post.createdAt)}</p>
                  </div>
                ))}
              </div>
              <div className="other-posts-column">
                {otherPosts.slice(4, 8).map((post, index) => (
                  <div className="other-post-item" key={post._id || index}>
                    <h4 className="other-post-title">
                      <Link href={`/activities/${post._id}`}>{post.title}</Link>
                    </h4>
                    <p className="other-post-date">{formatDate(post.createdAt)}</p>
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
                
                {generatePageNumbers(currentOtherPage, totalOtherPages).map((pageNum, index) => (
                  pageNum === "..." ? (
                    <span key={`ellipsis-other-${index}`} className="pagination-ellipsis">...</span>
                  ) : (
                    <button
                      key={pageNum}
                      className={`pagination-btn ${pageNum === currentOtherPage ? 'active' : ''}`}
                      onClick={() => setCurrentOtherPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
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