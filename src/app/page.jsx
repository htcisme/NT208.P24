"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Footer from "@/components/Footer/index.jsx";
import Header from "@/components/Header/index.jsx";
import React, { useEffect, useState } from "react";

const images = [
  "/Img/Homepage/BCH1.png",
  "/Img/Homepage/BCH2.png",
  "/Img/Homepage/BCH3.png",
];

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Bắt đầu ẩn ảnh cũ

      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true); // Hiện ảnh mới
      }, 500); // Đợi một chút trước khi chuyển ảnh
    }, 5000); // 5s đổi ảnh

    return () => clearInterval(interval);
  }, []);
  return (
    <div className={styles.Container}>
      {/* HEADER */}
      <header className={styles.Header}>
        <div className={styles.Header_Logo}>XANGFUTING</div>
        <div className={styles.Header_Nav}>
          <button className={styles.Header_Nav_NavButton}>Đăng nhập</button>
          <button className={styles.Header_Nav_NavButton}>Đăng ký</button>
          <div className={styles.Header_Nav_MenuWrapper}>
            <button
              className={styles.Header_Nav_MenuWrapper_MenuButton}
              onClick={() => {
                const menu = document.getElementById("dropdownMenu");
                if (menu) {
                  menu.classList.toggle(
                    styles.Header_Nav_MenuWrapper_MenuButton_ShowMenu
                  );
                }
              }}
            >
              ☰
            </button>
            <div
              className={styles.Header_Nav_MenuWrapper_DropdownMenu}
              id="dropdownMenu"
            >
              <a href="Introduction">Giới thiệu</a>
              <a href="Activities">Hoạt động</a>
              <a href="Awards">Thành tích</a>
              <a href="Booking">Đặt phòng</a>
              <a href="Contact">Liên hệ</a>
            </div>
          </div>
          <div className={styles.Header_Topbar_Authsearch}>
            <div className={styles.Header_Topbar_Authsearch_Searchbox}>
              <input type="text" placeholder="Tìm kiếm..." />
              <span
                className={styles.Header_Topbar_Authsearch_Searchbox_Searchicon}
              >
                <svg
                  class={
                    styles.Header_Topbar_Authsearch_Searchbox_Searchicon_Icon
                  }
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </header>
      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}></div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroLogos}>
            <Image
              src="/Img/Homepage/Fulllogo.png"
              alt="Logo Đoàn Khoa"
              width={800}
              height={800}
              className={styles.logo}
            />
          </div>
          <h1 className={styles.heroTitle}>
            TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN - ĐHQG-HCM
          </h1>
          <h2 className={styles.heroSubtitle}>
            ĐOÀN KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG
          </h2>
        </div>
      </section>
      {/* MAIN CONTENT */}

      <section className={styles.Body}>
        <div className={styles.Body_Container}>
          {/* INTRODUCTION */}
          <section className={styles.Body_Container_Introduction}>
            <div className={styles.Body_Shape01}></div>
            <h2 className={styles.Body_Title}>GIỚI THIỆU</h2>
            <div className={styles.Body_ContentWrapper}>
              {/* Left: Image + dots */}

              <div className={styles.Body_ImageContainer}>
                <Image
                  src={images[currentIndex]}
                  alt={`Giới thiệu ${currentIndex + 1}`}
                  width={900}
                  height={600}
                  className={`${styles.Body_Image} ${styles.Body_ImageFade} ${
                    fade ? styles.Body_ImageFadeShow : ""
                  }`}
                />
                <div className={styles.Body_Dots}>
                  {images.map((_, index) => (
                    <span
                      key={index}
                      className={`${styles.Body_Dot} ${
                        currentIndex === index ? styles.Active : ""
                      }`}
                    ></span>
                  ))}
                </div>
              </div>

              {/* Right: Text */}
              <div className={styles.Body_TextContainer}>
                <h3 className={styles.Body_Heading}>
                  ĐOÀN KHOA <br />
                  MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG
                </h3>
                <p className={styles.Body_Description}>
                  Khoa Mạng máy tính & Truyền thông, Trường ĐH CNTT có trên 1400
                  đoàn viên, sinh viên chính quy đang học tập và sinh hoạt. Cùng
                  với sự phát triển của khoa, tổ chức Đoàn cũng đạt được những
                  bước tiến về quy mô và chất lượng hoạt động.
                </p>
                <p className={styles.Body_Description}>
                  Đứng ở vị trí là một đơn vị Đoàn cơ sở được nâng cấp chính
                  thức từ ngày 11/11/2014 từ tổ chức Liên chi Đoàn khoa, trực
                  thuộc Đoàn trường Đại học Công nghệ thông tin – ĐHQG-HCM, Đoàn
                  Khoa Mạng máy tính và truyền thông luôn thực hiện và hoàn
                  thành xuất sắc các nhiệm vụ của công tác Đoàn và Phong trào
                  Thanh niên theo phương châm: Thiết thực – hiệu quả và hội
                  nhập.
                </p>
                <p className={styles.Body_Description}>
                  Với truyền thống, lịch sử hình thành và phát triển của mình,
                  cho đến nay Đoàn TNCS Hồ Chí Minh khoa MMT&TT đang quản lí 12
                  chi Đoàn trực thuộc, các ban chuyên môn và các đội nhóm chuyên
                  trách.
                </p>
                <p className={styles.Body_Description}>
                  Liên chi Đoàn khoa MMT&TT nay là Đoàn khoa MMT&TT không ngừng
                  lớn mạnh về số lượng, nâng cao về chất lượng cán bộ Đoàn cơ sở
                  để xứng đáng với vai trò là người bạn đồng hành cùng Đoàn viên
                  – thanh niên khoa MMT&TT.
                </p>
                <p className={styles.Body_Description}>
                  Trong những năm qua, Đoàn TNCS Hồ Chí Minh khoa MMT&TT (Liên
                  chi Đoàn) luôn là đơn vị đi đầu trong công tác Đoàn và Phong
                  trào Thanh niên tại trường ĐH CNTT.
                </p>

                <p className={styles.Body_ReadMore}>Xem thêm ...</p>
              </div>
            </div>
          </section>
        </div>
        {/* FOOTER */}
        <Footer></Footer>
      </section>
    </div>
  );
}
