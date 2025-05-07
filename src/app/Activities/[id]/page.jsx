"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import "@/styles-comp/style.css";
import "@/app/Activities/activity-detail.css";

export default function ActivityPost() {
  const params = useParams();
  const { id } = params;

  // State cho bài viết hiện tại
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho tin tức mới nhất
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [errorNews, setErrorNews] = useState(null);

  // Fetch bài viết hiện tại
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/activities/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();

        if (data.success) {
          setPost(data.data);
        } else {
          throw new Error(data.message || 'Error fetching post');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Không thể lấy thông tin bài viết');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  // Fetch tin tức mới nhất
  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        // Thay đổi limit từ 5 thành 10
        const response = await fetch(`/api/activities?page=1&limit=10&status=published`);
        if (!response.ok) {
          throw new Error('Failed to fetch latest news');
        }
        const data = await response.json();

        if (data.success) {
          // Lọc bỏ bài viết hiện tại khỏi danh sách
          const filteredNews = data.data.filter(news => news._id !== id);
          // Giữ đủ 10 bài viết thay vì cắt thành 4
          setLatestNews(filteredNews);
        } else {
          throw new Error(data.message || 'Error fetching latest news');
        }
      } catch (err) {
        console.error('Error:', err);
        setErrorNews('Không thể lấy tin tức mới nhất');
      } finally {
        setLoadingNews(false);
      }
    };

    fetchLatestNews();
  }, [id]);

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

  // Định dạng ngày tháng ngắn gọn cho tin tức mới nhất
  const formatNewsDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    // Lấy ngày trong tuần
    const daysOfWeek = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${dayOfWeek} - ${day}/${month}/${year}`;
  };


  // Hiển thị loading state
  if (loading) {
    return (
      <div className="loading-container">
        <p>Đang tải bài viết...</p>
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

  // Hiển thị nếu không tìm thấy bài viết
  if (!post) {
    return (
      <div className="error-container">
        <p>Không tìm thấy bài viết</p>
        <Link href="/Activities" className="back-button">
          Quay lại trang hoạt động
        </Link>
      </div>
    );
  }

  // Thay đổi phần return trong component ActivityPost

  return (
    <>
      <main className="activity-post-container">
        {/* Nội dung bài viết chính */}
        <article className="post-main-content">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="post-author">Tác giả: {post.author}</span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>

          {post.image && (
            <div className="post-featured-image">
              <img src={post.image} alt={post.title} />
            </div>
          )}

          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        </article>

        {/* Sidebar với tin tức mới nhất */}
        <aside className="post-sidebar">
          <div className="latest-news-section">
            <h3 className="latest-news-title">TIN TỨC MỚI NHẤT</h3>

            {/* Phần loading, error và hiển thị tin tức giữ nguyên */}
            {loadingNews && (
              <div className="loading-news">
                <p>Đang tải tin tức...</p>
              </div>
            )}

            {errorNews && (
              <div className="error-news">
                <p>{errorNews}</p>
              </div>
            )}

            {!loadingNews && !errorNews && (
              <ul className="latest-news-list">
                {latestNews.length > 0 ? (
                  latestNews.map((news) => (
                    <li key={news._id} className="latest-news-item">
                      <Link href={`/Activities/${news._id}`} className="latest-news-link">
                        {news.title}
                      </Link>
                      <span className="latest-news-date">{formatNewsDate(news.createdAt)}</span>
                    </li>
                  ))
                ) : (
                  <li className="no-news-message">Không có tin tức khác.</li>
                )}
              </ul>
            )}

            <div className="view-more-link">
              <Link href="/ActivitiesOverview">Xem thêm</Link>
            </div>
          </div>
        </aside>

        <div className="post-actions">
          <Link href="/Activities" className="back-button">
            Trở về
          </Link>
        </div>

        <div className="footer-container">
          <Footer />
        </div>
      </main>
    </>
  );
}