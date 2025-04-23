    "use client";
import { useState, useEffect } from "react";
import styles from "@/styles-comp/style.module.css";
import Image from "next/image";
import React from "react";

const images = [
  "/Img/Homepage/BCH1.png",
  "/Img/Homepage/BCH2.png",
  "/Img/Homepage/BCH3.png",
];

export default function Headeruser() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
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
  );
}
