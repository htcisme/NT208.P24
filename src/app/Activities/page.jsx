"use client";

import React, { useState, useEffect, Suspense, useCallback, useRef } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "@/styles-comp/style.css";
import "@/app/Activities/style.css";
import "@/app/Activities/activity-detail.css";

// Custom hook cho scroll reveal
const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve sau khi đã visible để tránh re-trigger
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: '50px 0px -50px 0px' // Trigger sớm hơn một chút
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

function ActivitiesContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");

  // Scroll reveal refs cho tất cả sections
  const [titleRef, titleVisible] = useScrollReveal(0.1);
  const [highlightRef, highlightVisible] = useScrollReveal(0.2);
  const [descriptionRef, descriptionVisible] = useScrollReveal(0.2);
  const [sidebarRef, sidebarVisible] = useScrollReveal(0.1);
  const [sliderRef, sliderVisible] = useScrollReveal(0.2);
  const [detailSection1Ref, detailSection1Visible] = useScrollReveal(0.2);
  const [detailSection2Ref, detailSection2Visible] = useScrollReveal(0.2);

  // State cho tin tức mới nhất
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredNews, setFilteredNews] = useState([]);

  // Thêm các state bị thiếu cho slider
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [startIndex, setStartIndex] = useState(0);

  // Danh sách 5 sự kiện
  const events = [
    { title: "VNU TOUR 2024", image: "/Img/Activities/Figure2-VNU-Tour.png" },
    { title: "NGỌN ĐUỐC XANH 2025", image: "/Img/Activities/Figure3-Ngon-Duoc-Xanh.png" },
    { title: "NETSEC DAY 2024", image: "/Img/Activities/Figure5-NETSEC-Day.png" },
    { title: "TRUYỀN THÔNG TẾT 2025", image: "/Img/Activities/Figure4-Truyen-thong-Tet.png" },
    { title: "CHÀO ĐÓN TSV KHÓA 2024", image: "/Img/Activities/Figure6-Tan-sinh-vien.png" },
  ];

  // Hàm xử lý bấm mũi tên phải
  const handleNext = useCallback(() => {
    if (isAnimating || events.length <= 3) return;

    setIsAnimating(true);
    setStartIndex((prevIndex) => {
      const nextIndex = prevIndex >= events.length - 3 ? 0 : prevIndex + 1;
      return nextIndex;
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  }, [isAnimating, events.length]);

  // Hàm xử lý bấm mũi tên trái
  const handlePrev = useCallback(() => {
    if (isAnimating || events.length <= 3) return;

    setIsAnimating(true);
    setStartIndex((prevIndex) => {
      const nextIndex = prevIndex <= 0 ? events.length - 3 : prevIndex - 1;
      return nextIndex;
    });

    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  }, [isAnimating, events.length]);

  // Hàm xử lý click vào dot
  const handleDotClick = useCallback((index) => {
    if (isAnimating || index === startIndex || events.length <= 3) return;

    setIsAnimating(true);
    setAutoPlayEnabled(false);
    setStartIndex(index);

    setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => setAutoPlayEnabled(true), 1000);
    }, 600);
  }, [isAnimating, startIndex, events.length]);

  // Auto-play effect
  useEffect(() => {
    if (!autoPlayEnabled || events.length <= 3) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        handleNext();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [autoPlayEnabled, isAnimating, handleNext]);

  // Fetch tin tức mới nhất từ API
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
          setLatestNews(data.data);
          setFilteredNews(data.data);
        } else {
          throw new Error(data.message || "Error fetching latest news");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Không thể lấy tin tức mới nhất");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  // Xử lý tìm kiếm khi có query parameter
  useEffect(() => {
    if (searchQuery) {
      const filtered = latestNews.filter(
        (news) =>
          news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          news.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNews(filtered);
    } else {
      setFilteredNews(latestNews);
    }
  }, [searchQuery, latestNews]);

  // Hàm định dạng thời gian cho tin tức mới nhất
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

  // Lấy 3 sự kiện để hiển thị dựa trên startIndex
  const visibleEvents = events.slice(startIndex, startIndex + 3);

  return (
    <main className="light-container-main">
      {/* Split section: 70-30 */}
      <div className="light-split-section">
        {/* Bên trái: 70% - Tiêu đề, hình ảnh, mô tả với scroll reveal */}
        <div className="light-split-left">
          {/* Tiêu đề với scroll reveal */}
          <div
            ref={titleRef}
            className={`light-section-title ${titleVisible ? 'animate' : ''}`}
          >
            <strong>CÁC HOẠT ĐỘNG NỔI BẬT</strong>
            <br />
            <strong>CỦA TUỔI TRẺ MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG</strong>
          </div>

          {/* Hình ảnh với scroll reveal và hiệu ứng 3D */}
          <div
            ref={highlightRef}
            className={`light-section-highlight ${highlightVisible ? 'animate' : ''}`}
          >
            <Image
              src="/Img/Activities/Figure1-Overall-Activities.png"
              alt="Highlight"
              width={800}
              height={400}
              onLoad={(e) => {
                e.target.classList.remove('loading');
              }}
              onLoadStart={(e) => {
                e.target.classList.add('loading');
              }}
              onError={(e) => {
                console.error('Image load error:', e);
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Mô tả với scroll reveal */}
          <p
            ref={descriptionRef}
            className={`light-section-description ${descriptionVisible ? 'animate' : ''}`}
          >
            Hướng đến xây dựng một thế hệ sinh viên Khoa Mạng máy tính và
            Truyền thông nói riêng và sinh viên trường Đại học Công nghệ Thông
            tin nói chung vừa hồng, vừa chuyên, hiểu kiến thức, vững kỹ năng,
            Đoàn khoa thường xuyên tổ chức các hoạt động thuộc nhiều lĩnh vực
            khác nhau: hoạt động Đoàn - Hội, công tác xã hội, tình nguyện, học
            tập, nghiên cứu khoa học, âm nhạc,... và các hoạt động khác phù
            hợp với nhu cầu của sinh viên.
            <br />
            <br />
            Dấu ấn nổi bật trong suốt 10 năm thành lập của Đoàn khoa chính là
            các hoạt động Đoàn - Hội, các hoạt động phục vụ cho lợi ích của xã
            hội, thiện nguyện và phát triển kỹ năng mềm cho sinh viên. Trải
            dài qua các năm học, Đoàn khoa có các hoạt động nổi bật như:{" "}
            <strong>
              Chào đón Tân sinh viên Khoa kết hợp sinh hoạt công dân đầu khóa,
              VNU Tour - Hành trình khám phá khu đô thị Đại học Quốc gia HCM,
              NETSEC Day - Ngày hội truyền thống Khoa Mạng máy tính và Truyền
              thông, NC Fes - Ngày hội trò chơi dân gian và Chiến dịch tình
              nguyện Ngọn Đuốc Xanh.
            </strong>
          </p>
        </div>

        {/* Bên phải: 30% - Tin tức mới nhất với scroll reveal */}
        <div
          ref={sidebarRef}
          className={`activity-sidebar ${sidebarVisible ? 'animate' : ''}`}
        >
          <h3>TIN TỨC MỚI NHẤT</h3>

          {loading && (
            <div className="loading-news">
              <p>Đang tải tin tức...</p>
            </div>
          )}

          {error && (
            <div className="error-news">
              <p>{error}</p>
            </div>
          )}

          {searchQuery && (
            <div className="search-results-info">
              <p>Kết quả tìm kiếm cho: "{searchQuery}"</p>
              <p>Tìm thấy {filteredNews.length} kết quả</p>
            </div>
          )}

          {!loading && !error && (
            <ul className="light-news-list">
              {filteredNews.length > 0 ? (
                filteredNews.map((news) => (
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
          )}

          <div className="light-news-more">
            <Link href="/ActivitiesOverview">Xem thêm</Link>
          </div>
        </div>
      </div>

      {/* Slider Section với scroll reveal */}
      <section
        ref={sliderRef}
        className={`light-slider-container ${sliderVisible ? 'animate' : ''}`}
      >
        <button
          className="light-slider-arrow"
          onClick={handlePrev}
          disabled={isAnimating}
        >
          ←
        </button>

        <div className="light-slider-wrapper">
          {visibleEvents.map((event, index) => (
            <div className="light-slider-item" key={`${startIndex}-${index}`}>
              <div
                className={`slider-image-placeholder ${index === 1 ? "active" : ""
                  } ${isAnimating ? "animating" : ""}`}
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  width={index === 1 ? 360 : 280}
                  height={index === 1 ? 320 : 240}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "15px"
                  }}
                  priority={index === 1}
                  onError={(e) => {
                    console.error(`Image load error for ${event.image}:`, e);
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = '#f5f5f5';
                    e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 14px;">Không thể tải hình ảnh</div>';
                  }}
                />
              </div>
              <h4>{event.title}</h4>
            </div>
          ))}
        </div>

        <button
          className="light-slider-arrow"
          onClick={handleNext}
          disabled={isAnimating}
        >
          →
        </button>
      </section>

      {/* Dots điều hướng */}
      <div className="light-slider-dots">
        {Array.from({ length: events.length - 2 }).map((_, index) => (
          <span
            key={index}
            className={`dot ${startIndex === index ? "active" : ""} ${isAnimating ? "transitioning" : ""
              }`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>

      <div className="light-detail-container">
        {/* Section 1: Ngọn Đuốc Xanh với scroll reveal */}
        <div
          ref={detailSection1Ref}
          className={`light-detail-item split-40-60 ${detailSection1Visible ? 'reveal' : ''}`}
        >
          <div className="light-detail-image">
            <div className="detail-image-placeholder">
              <Image
                src="/Img/Activities/Figure7-NDX.png"
                alt="Ngọn Đuốc Xanh"
                width={400}
                height={300}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
          <div className="light-detail-content">
            <h3>
              <strong>CHƯƠNG TRÌNH TÌNH NGUYỆN NGỌN ĐUỐC XANH</strong>
            </h3>
            <br />
            <p>
              Trong hai năm trở lại đây, bên cạnh NC FES, Đoàn khoa dần khẳng
              định vị trí của mình hơn nữa trong việc giúp sinh viên có một
              môi trường trải nghiệm thực tế tại địa phương nơi các tỉnh. Cụ
              thể, Đoàn khoa đã tổ chức thành công 2 chiến dịch tình nguyện:
              Ngọn Đuốc Xanh 2023 và Ngọn Đuốc Xanh 2024. Đội hình Ngọn Đuốc
              Xanh là đội hình tình nguyện của các bạn sinh viên trẻ, năng
              động, nhiệt huyết, luôn mong muốn được cống hiến sức trẻ của
              mình cho cộng đồng. Với tinh thần "Sẻ chia - Kết nối - Trao yêu
              thương", các chiến sĩ Ngọn Đuốc Xanh đã tham gia nhiều hoạt động
              tình nguyện ý nghĩa tại địa phương phường Tân Phú, phường Long
              Trường (Thành phố Thủ Đức) và xã Tân Phú (Thị xã Cai Lậy, tỉnh
              Tiền Giang) như: Công trình thanh niên "Tuyến đường hoa nông
              thôn mới", Công trình "Thùng phân loại rác tái chế", Ngày hội
              "Công nghệ cho em", Ngày tri ân, Bữa cơm nghĩa tình, Lớp học kỹ
              năng mềm, Đêm văn nghệ cho em,... Các chiến sĩ của 2 chiến dịch
              tuy đến từ các khoa khác nhau, các ngành học khác nhau nhưng
              cùng chung tinh thần thiện nguyện, tương thân tương ái.
            </p>
          </div>
        </div>

        {/* Section 2: VNU Tour với scroll reveal */}
        <div
          ref={detailSection2Ref}
          className={`light-detail-item split-60-40 ${detailSection2Visible ? 'reveal' : ''}`}
        >
          <div className="light-detail-content">
            <h3>
              <strong>
                VNU TOUR – HÀNH TRÌNH KHÁM PHÁ KHU ĐÔ THỊ ĐHQG-HCM
              </strong>
            </h3>
            <br />
            <p>
              Để giúp các bạn Tân sinh viên hiểu hơn về Khu đô thị Đại học
              Quốc gia HCM - nơi trường Đại học Công nghệ Thông tin đang tọa
              lạc, chuỗi hoạt động chào đón Tân sinh viên còn một hoạt động
              đặc trưng, ghi dấu ấn về hoạt động "Thể lực tốt" của Đoàn khoa
              Mạng trong nhiều năm liền, đó là VNU Tour - Hành trình khám phá
              Khu đô thị Đại học Quốc gia. Trải qua 11 mùa tính đến năm 2023,
              VNU Tour đã để lại trong lòng các bạn Tân sinh viên nhiều ký ức
              khó quên trong hành trình khám phá và tìm ra sự thật được che
              giấu đằng sau các chủ đề mà VNU Tour muốn truyền tải. Qua việc
              đi đến các trạm được đặt tại các địa điểm nổi bật trong Khu đô
              thị ĐHQG-HCM, vượt các chướng ngại vật, giải mật thư và tìm ra
              câu trả lời cuối cùng được ẩn giấu, các bạn Tân sinh viên sẽ có
              được cho mình những kỹ năng, kinh nghiệm bổ ích, sát với đời
              sống sinh viên tại đây. Hơn nữa, đây không chỉ là hoạt động giúp
              các bạn được trải nghiệm mà còn là một trong những hoạt động
              được cấp giấy chứng nhận "Thể lực tốt" trong danh hiệu "Sinh
              viên 5 tốt" cấp Khoa. Năm 2023, với chủ đề "Mật ngữ loài hoa",
              đây là năm bùng nổ với hơn 450 thí sinh đến từ 15 trường đại học
              khác nhau trên địa bàn thành phố. VNU Tour hứa hẹn sẽ ngày càng
              phát huy hơn nữa vai trò của mình, nhất là giai đoạn những ngày
              đầu năm học.
            </p>
          </div>
          <div className="light-detail-image">
            <div className="detail-image-placeholder">
              <Image
                src="/Img/Activities/Figure8-VNT.JPG"
                alt="VNU Tour"
                width={400}
                height={300}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function Activities() {
  return (
    <Suspense>
      <ActivitiesContent />
    </Suspense>
  );
}