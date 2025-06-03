"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import CommentSection from "@/components/Comments/CommentSection";
import "@/styles-comp/style.css";
import "@/app/Activities/activity-detail.css";

export default function ActivityPost() {
  const params = useParams();
  const { slug } = params;

  // State cho bài viết hiện tại
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho tin tức mới nhất - ĐỒNG BỘ VỚI ACTIVITIES PAGE
  const [latestNews, setLatestNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [errorNews, setErrorNews] = useState(null);

  // Fetch bài viết hiện tại
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/activities/${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();

        if (data.success) {
          setPost(data.data);
        } else {
          throw new Error(data.message || "Error fetching post");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Không thể lấy thông tin bài viết");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Fetch tin tức mới nhất - ĐỒNG BỘ VỚI ACTIVITIES PAGE
  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const response = await fetch(
          `/api/activities?page=1&limit=10&status=published`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch latest news");
        }
        const data = await response.json();

        if (data.success) {
          // Lọc bỏ bài viết hiện tại khỏi danh sách
          const filteredNews = data.data.filter((news) => news.slug !== slug);
          setLatestNews(filteredNews);
        } else {
          throw new Error(data.message || "Error fetching latest news");
        }
      } catch (err) {
        console.error("Error:", err);
        setErrorNews("Không thể lấy tin tức mới nhất");
      } finally {
        setLoadingNews(false);
      }
    };

    fetchLatestNews();
  }, [slug]);

  // Hàm định dạng thời gian cho tin tức mới nhất - ĐỒNG BỘ VỚI ACTIVITIES PAGE
  const formatNewsDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const daysOfWeek = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const dayOfWeek = daysOfWeek[date.getDay()];

    return `${dayOfWeek} - ${day}/${month}/${year}`;
  };

  // Hàm định dạng thời gian đầy đủ (cho meta info)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  };

  // Helper function để lấy nhãn loại hoạt động
  const getActivityTypeLabel = (type) => {
    const typeLabels = {
      news: "Tin tức",
      academic: "Học tập",
      competition: "Cuộc thi",
      seminar: "Seminar",
      research: "Nghiên cứu",
      course: "Khóa học",
      volunteer: "Tình nguyện",
      sport: "Thể thao",
      event: "Sự kiện",
      conference: "Hội nghị",
      vnutour: "VNUTour",
      netsec: "Netsec",
      internship: "Thực tập",
      scholarship: "Học bổng",
      startup: "Khởi nghiệp",
      jobfair: "Ngày hội việc làm",
      career: "Hướng nghiệp",
      other: "Khác"
    };

    return typeLabels[type] || "Khác";
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="activity-detail-page">
          <div className="activity-detail-container">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Đang tải bài viết...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="activity-detail-page">
          <div className="activity-detail-container">
            <div className="error-container">
              <h2>Lỗi</h2>
              <p>{error}</p>
              <Link href="/Activities" className="back-button">
                ← Quay lại trang hoạt động
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <div className="activity-detail-page">
          <div className="activity-detail-container">
            <div className="error-container">
              <h2>Không tìm thấy bài viết</h2>
              <Link href="/Activities" className="back-button">
                ← Quay lại trang hoạt động
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="activity-detail-page">
        <div className="activity-detail-container">
          {/* Main Content */}
          <div className="activity-content">
            {/* Article Header */}
            <header className="activity-header">
              <h1 className="activity-title">{post.title}</h1>

              <div className="activity-meta">
                <div className="meta-item">
                  <span className="meta-label">Tác giả:</span>
                  <span className="meta-value">{post.author}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Thời gian:</span>
                  <span className="meta-value">{formatDate(post.createdAt)}</span>
                </div>
                {post.type && (
                  <div className="meta-item">
                    <span className="meta-label">Loại:</span>
                    <span className={`activity-type-badge ${post.type}`}>
                      {getActivityTypeLabel(post.type)}
                    </span>
                  </div>
                )}
              </div>
            </header>

            {/* Featured Image */}
            {post.image && (
              <div className="activity-image">
                <img
                  src={post.image}
                  alt={post.title}
                  className="featured-image"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Article Content */}
            <div className="activity-body">
              <div
                className="content-text"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {post.content}
              </div>
            </div>

            {/* Article Footer */}
            <footer className="activity-footer">
              <div className="post-actions">
                <Link href="/Activities" className="back-button">
                  ← Trở về
                </Link>
              </div>
            </footer>

            {/* Comment Section - Tích hợp ở đây */}
            <CommentSection
              activitySlug={post.slug}
              commentOption={post.commentOption}
            />
          </div>

          {/* Sidebar tin tức mới nhất */}
          <aside className="activity-sidebar">
            <h3>TIN TỨC MỚI NHẤT</h3>

            {/* Loading state */}
            {loadingNews && (
              <div className="loading-news">
                <p>Đang tải tin tức...</p>
              </div>
            )}

            {/* Error state */}
            {errorNews && (
              <div className="error-news">
                <p>{errorNews}</p>
              </div>
            )}

            {/* News list */}
            {!loadingNews && !errorNews && (
              <>
                <ul className="light-news-list">
                  {latestNews.length > 0 ? (
                    latestNews.map((news) => (
                      <li key={news._id}>
                        <Link href={`/Activities/${news.slug || news._id}`}>
                          {news.title}
                        </Link>
                        <span className="news-date">
                          {formatNewsDate(news.createdAt)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li>Không có tin tức mới.</li>
                  )}
                </ul>

                {/* See more button */}
                <div className="light-news-more">
                  <Link href="/ActivitiesOverview">Xem thêm</Link>
                </div>
              </>
            )}
          </aside>
        </div>
        <Footer />
      </main>
    </div>
  );
}