"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
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

  if (loading) {
    return (
      <div className="activity-detail-page">
        <div className="activity-detail-container">
          <div className="loading-message">Đang tải bài viết...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity-detail-page">
        <div className="activity-detail-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="activity-detail-page">
        <div className="activity-detail-container">
          <div className="error-message">Không tìm thấy bài viết</div>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-detail-page">
      <div className="activity-detail-container">
        <div className="activity-content">
          <div className="activity-header">
            <h1>{post.title}</h1>
            <div className="activity-meta">
              <span className="author">Tác giả: {post.author}</span>
              <span className="date">{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {post.image && (
            <div className="activity-image">
              <Image
                src={post.image}
                alt={post.title}
                width={800}
                height={400}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            </div>
          )}

          <div
            className="activity-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Nút trở về */}
          <div className="post-actions">
            <Link href="/Activities" className="back-button">
              Trở về
            </Link>
          </div>
        </div>

        {/* Sidebar tin tức mới nhất - ĐỒNG BỘ VỚI ACTIVITIES PAGE */}
        <div className="activity-sidebar">
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
        </div>
      </div>
      <Footer />
    </div>
  );
}