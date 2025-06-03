/* filepath: d:\PROJECT\NT208.P24\src\app\ActivitiesOverview\page.jsx */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { getActivityTypes } from "@/models/Activity";
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

  // State cho filter
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Định nghĩa các category chính và subcategories
  const mainCategories = {
    academic: {
      label: "Học thuật",
      types: ["academic", "competition", "seminar", "research", "course"],
    },
    activity: {
      label: "Hoạt động",
      types: ["volunteer", "sport", "event", "conference", "vnutour", "netsec"],
    },
    work: {
      label: "Công việc",
      types: ["internship", "scholarship", "startup", "jobfair", "career"],
    },
    other: {
      label: "Khác",
      types: ["other"],
    },
  };

  // Build query string cho filter
  const buildFilterQuery = () => {
    let query = "";
    if (selectedTypes.length > 0) {
      query += `&types=${selectedTypes.join(",")}`;
    }
    return query;
  };

  // Function để tính toán ngày 1 tháng trước
  const getOneMonthAgoDate = () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return oneMonthAgo;
  };

  // Function để kiểm tra bài viết có trong vòng 1 tháng hay không
  const isWithinOneMonth = (dateString) => {
    const postDate = new Date(dateString);
    const oneMonthAgo = getOneMonthAgoDate();
    return postDate >= oneMonthAgo;
  };

  // Check if có filter đang active
  const hasActiveFilter = selectedTypes.length > 0;

  // Handle click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".filter-bar")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch dữ liệu cho danh sách bài đăng
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        const filterQuery = buildFilterQuery();
        // Lấy nhiều bài để filter theo thời gian
        const response = await fetch(
          `/api/activities?page=1&limit=200&status=published${filterQuery}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();

        if (data.success) {
          let filteredPosts;

          if (hasActiveFilter) {
            // KHI CÓ FILTER: Hiển thị tất cả bài viết liên quan (không phân chia theo thời gian)
            filteredPosts = data.data;
          } else {
            // KHI KHÔNG CÓ FILTER: Chỉ lấy bài viết trong vòng 1 tháng
            filteredPosts = data.data.filter(post =>
              isWithinOneMonth(post.createdAt)
            );
          }

          // Sắp xếp theo thời gian mới nhất
          filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          // Phân trang cho bài viết
          const postsPerPage = 8;
          const startIndex = (currentPostPage - 1) * postsPerPage;
          const endIndex = startIndex + postsPerPage;
          const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

          setPostList(paginatedPosts);
          setTotalPostPages(Math.ceil(filteredPosts.length / postsPerPage));
        } else {
          throw new Error(data.message || "Error fetching data");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Không thể lấy danh sách bài đăng");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, [currentPostPage, selectedTypes]);

  // Fetch dữ liệu cho các bài viết khác
  useEffect(() => {
    const fetchOlderPosts = async () => {
      try {
        // Chỉ fetch khi KHÔNG có filter active
        if (hasActiveFilter) {
          setOtherPosts([]);
          setTotalOtherPages(1);
          return;
        }

        const filterQuery = buildFilterQuery();
        // Lấy nhiều bài để filter theo thời gian
        const response = await fetch(
          `/api/activities?page=1&limit=200&status=published${filterQuery}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch other posts");
        }

        const data = await response.json();

        if (data.success) {
          // TỰ ĐỘNG LỌC: Chỉ lấy bài viết từ 1 tháng trở lên
          const olderPosts = data.data.filter(post =>
            !isWithinOneMonth(post.createdAt)
          );

          // Sắp xếp theo thời gian mới nhất
          olderPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          // Phân trang cho bài viết cũ hơn
          const postsPerPage = 8;
          const startIndex = (currentOtherPage - 1) * postsPerPage;
          const endIndex = startIndex + postsPerPage;
          const paginatedOlderPosts = olderPosts.slice(startIndex, endIndex);

          setOtherPosts(paginatedOlderPosts);
          setTotalOtherPages(Math.ceil(olderPosts.length / postsPerPage));
        } else {
          throw new Error(data.message || "Error fetching other posts data");
        }
      } catch (err) {
        console.error("Error:", err);
        // Không set error cho phần này để không ảnh hưởng đến UI chính
      }
    };

    fetchOlderPosts();
  }, [currentOtherPage, selectedTypes]);

  // Reset trang khi thay đổi filter
  useEffect(() => {
    setCurrentPostPage(1);
    setCurrentOtherPage(1);
  }, [selectedTypes]);

  // Toggle dropdown
  const toggleDropdown = (category) => {
    setActiveDropdown(activeDropdown === category ? null : category);
  };

  // Handle type selection
  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      } else {
        return [...prev, type];
      }
    });
  };

  // Select all types in a category
  const handleSelectAllInCategory = (category) => {
    const categoryTypes = mainCategories[category].types;
    const allSelected = categoryTypes.every((type) =>
      selectedTypes.includes(type)
    );

    if (allSelected) {
      setSelectedTypes((prev) =>
        prev.filter((type) => !categoryTypes.includes(type))
      );
    } else {
      setSelectedTypes((prev) => {
        const newTypes = [...prev];
        categoryTypes.forEach((type) => {
          if (!newTypes.includes(type)) {
            newTypes.push(type);
          }
        });
        return newTypes;
      });
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedTypes([]);
    setActiveDropdown(null);
  };

  // Check if any type in category is selected
  const isCategoryActive = (category) => {
    return mainCategories[category].types.some((type) =>
      selectedTypes.includes(type)
    );
  };

  // Get selected count for category
  const getSelectedCount = (category) => {
    return mainCategories[category].types.filter((type) =>
      selectedTypes.includes(type)
    ).length;
  };

  // Hàm định dạng thời gian
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const daysOfWeek = [
      "Chủ Nhật",
      "Thứ Hai",
      "Thứ Ba",
      "Thứ Tư",
      "Thứ Năm",
      "Thứ Sáu",
      "Thứ Bảy",
    ];
    const dayName = daysOfWeek[date.getDay()];

    return `${hours}:${minutes} - ${dayName}, Ngày ${day}/${month}/${year}`;
  };

  // Function để hiển thị thời gian tương đối
  const getTimeAgo = (dateString) => {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffTime = now - postDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
    return `${Math.floor(diffDays / 365)} năm trước`;
  };

  // Tạo mảng số trang
  const generatePageNumbers = (currentPage, totalPages) => {
    let pages = [];

    for (let i = 1; i <= Math.min(4, totalPages); i++) {
      pages.push(i);
    }

    if (totalPages > 4) {
      if (pages[pages.length - 1] < totalPages - 1) {
        pages.push("...");
      }

      if (pages[pages.length - 1] !== totalPages) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Component Filter Bar
  const FilterBar = () => {
    const allActivityTypes = getActivityTypes();

    return (
      <div className="filter-bar">
        <div className="filter-bar-container">
          <div className="filter-dropdowns">
            {Object.entries(mainCategories).map(([key, category]) => {
              const selectedCount = getSelectedCount(key);
              const isActive = isCategoryActive(key);

              return (
                <div key={key} className="filter-dropdown">
                  <button
                    className={`filter-dropdown-btn ${isActive ? "active" : ""
                      } ${activeDropdown === key ? "open" : ""}`}
                    onClick={() => toggleDropdown(key)}
                  >
                    <span className="dropdown-icon">{category.icon}</span>
                    <span className="dropdown-label">{category.label}</span>
                    {selectedCount > 0 && (
                      <span className="selected-count">{selectedCount}</span>
                    )}
                    <span className="dropdown-arrow">▼</span>
                  </button>

                  {activeDropdown === key && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <label className="select-all-option">
                          <input
                            type="checkbox"
                            checked={category.types.every((type) =>
                              selectedTypes.includes(type)
                            )}
                            onChange={() => handleSelectAllInCategory(key)}
                          />
                          <span>Chọn tất cả</span>
                        </label>
                      </div>

                      <div className="dropdown-items">
                        {category.types.map((type) => {
                          const typeInfo = allActivityTypes.find(
                            (t) => t.value === type
                          );
                          return typeInfo ? (
                            <label key={type} className="dropdown-item">
                              <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() => handleTypeToggle(type)}
                              />
                              <span className="item-icon">{typeInfo.icon}</span>
                              <span className="item-label">
                                {typeInfo.label}
                              </span>
                            </label>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedTypes.length > 0 && (
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              ✕ Xóa bộ lọc
            </button>
          )}
        </div>
      </div>
    );
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
      <div className="light-container-bg">
        <main className="light-container-main with-fixed-filter">
          <section className="post-list-container">
            <div className="post-list-title">
              <h3>
                BÀI ĐĂNG GẦN ĐÂY
              </h3>
              <FilterBar />
              {selectedTypes.length > 0 && (
                <span className="filter-info">
                  ({selectedTypes.length} loại được chọn)
                </span>
              )}
            </div>

            {postList.length === 0 ? (
              <div className="no-posts-message" style={{ display: 'none' }}>
                {hasActiveFilter ? (
                  <p>🔍 Không tìm thấy bài viết nào phù hợp với bộ lọc.</p>
                ) : (
                  <p>🕒 Chưa có bài viết nào được đăng trong tháng qua.</p>
                )}
              </div>
            ) : (
              <>
                <div className="post-list-grid">
                  {postList.map((post, index) => (
                    <div className="post-item" key={post._id || index}>
                      <div className="post-box">
                        <div className="post-image-placeholder">
                          <div className="time-badge">{getTimeAgo(post.createdAt)}</div>
                          {hasActiveFilter && isWithinOneMonth(post.createdAt) && (
                            <div className="new-badge">Mới</div>
                          )}
                          {post.image ? (
                            <img
                              src={post.image}
                              alt={post.title}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="no-image-placeholder">
                              <span>📷</span>
                            </div>
                          )}
                        </div>
                        <div className="post-content">
                          <h4 className="post-title">
                            <Link href={`/Activities/${post.slug || post._id}`}>
                              {post.title}
                            </Link>
                          </h4>
                          <p className="post-date">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPostPages > 1 && (
                  <div className="pagination-container">
                    <div className="pagination">
                      {currentPostPage > 1 && (
                        <button
                          className="pagination-btn"
                          onClick={() =>
                            setCurrentPostPage(currentPostPage - 1)
                          }
                        >
                          &lt;
                        </button>
                      )}

                      {generatePageNumbers(currentPostPage, totalPostPages).map(
                        (pageNum, index) =>
                          pageNum === "..." ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="pagination-ellipsis"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={pageNum}
                              className={`pagination-btn ${pageNum === currentPostPage ? "active" : ""
                                }`}
                              onClick={() => setCurrentPostPage(pageNum)}
                            >
                              {pageNum}
                            </button>
                          )
                      )}

                      {currentPostPage < totalPostPages && (
                        <button
                          className="pagination-btn"
                          onClick={() =>
                            setCurrentPostPage(currentPostPage + 1)
                          }
                        >
                          &gt;
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {!hasActiveFilter && (
              <div className="other-posts-container">
                <h3 className="other-posts-title">
                  CÁC BÀI VIẾT KHÁC
                </h3>

                {otherPosts.length === 0 ? (
                  <div className="no-posts-message" style={{ display: 'block' }}>
                    <p>Chưa có bài viết nào được đăng cách đây hơn 1 tháng.</p>
                  </div>
                ) : (
                  <>
                    <div className="other-posts-grid">
                      <div className="other-posts-column">
                        {otherPosts.slice(0, 4).map((post, index) => (
                          <div className="other-post-item" key={post._id || index}>
                            <h4 className="other-post-title">
                              <Link href={`/Activities/${post.slug || post._id}`}>
                                {post.title}
                              </Link>
                            </h4>
                            <p className="other-post-date">
                              {formatDate(post.createdAt)}
                              <span className="time-ago"> • {getTimeAgo(post.createdAt)}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="other-posts-column">
                        {otherPosts.slice(4, 8).map((post, index) => (
                          <div className="other-post-item" key={post._id || index}>
                            <h4 className="other-post-title">
                              <Link href={`/Activities/${post.slug || post._id}`}>
                                {post.title}
                              </Link>
                            </h4>
                            <p className="other-post-date">
                              {formatDate(post.createdAt)}
                              <span className="time-ago"> • {getTimeAgo(post.createdAt)}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {totalOtherPages > 1 && (
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

                          {generatePageNumbers(currentOtherPage, totalOtherPages).map(
                            (pageNum, index) =>
                              pageNum === "..." ? (
                                <span
                                  key={`ellipsis-other-${index}`}
                                  className="pagination-ellipsis"
                                >
                                  ...
                                </span>
                              ) : (
                                <button
                                  key={pageNum}
                                  className={`pagination-btn ${pageNum === currentOtherPage ? "active" : ""
                                    }`}
                                  onClick={() => setCurrentOtherPage(pageNum)}
                                >
                                  {pageNum}
                                </button>
                              )
                          )}

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
                    )}
                  </>
                )}
              </div>
            )}

            <div className="light-news-actions">
              <div className="light-news-back">
                <Link href="/Activities">Trở về</Link>
              </div>
            </div>
            <Footer />
          </section>
        </main>
      </div>
    </>
  );
}