"use client";

import { useState, useEffect } from "react";
import "@/styles-comp/style.css";
import Image from "next/image";
export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    }
  };

  return (
    <div className="Header">
      <div className="Header-Topbar">
        <div className="Header-Topbar-Logogroup">
          <Image
            src="/Img/Homepage/Fulllogolight.png"
            alt="Cum-logo-Doan-khoa"
            width={250}
            height={250}
          />
        </div>

        <div className="Header-Topbar-Titlegroup">
          <div className="Header-Topbar-Titlegroup-Uniname">
            TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN - ĐHQG-HCM
          </div>
          <div className="Header-Topbar-Titlegroup-Deptname">
            ĐOÀN KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG
          </div>
        </div>

        <div className="Header-Topbar-Authsearch">
          <div className="Header-Topbar-Authsearch-Searchbox">
            <input type="text" placeholder="Tìm kiếm..." />
            <span className="Header-Topbar-Authsearch-Searchbox-Searchicon">
              <svg
                class="Header-Topbar-Authsearch-Searchbox-Searchicon-Icon"
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
          <div className="Header-Topbar-Authsearch-Authlinks">
            <span className="Header-Topbar-Authsearch-Authlinks-Item">
              Đăng ký
            </span>
            <span>|</span>
            <span className="Header-Topbar-Authsearch-Authlinks-Item">
              Đăng nhập
            </span>
          </div>
        </div>

        <button
          onClick={toggleDarkMode}
          className="Header-Topbar-Dark-mode-toggle"
        >
          {isDarkMode ? (
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
                clip-rule="evenodd"
              />
            </svg>
          ) : (
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z"
                clip-rule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="Header-Navbar">
        <div className="Header-Navbar-Navitem">
          <a href="/">TRANG CHỦ</a>
        </div>
        <div className="Header-Navbar-Navitem">
          <a href="/Introduction">GIỚI THIỆU</a>
        </div>
        <div className="Header-Navbar-Navitem">
          <a href="Activities">HOẠT ĐỘNG</a>
        </div>
        <div className="Header-Navbar-Navitem">
          <a href="/Awards">THÀNH TÍCH</a>
        </div>
        <div className="Header-Navbar-Navitem">
          <a href="/Booking">ĐẶT PHÒNG</a>
        </div>
        <div className="Header-Navbar-Navitem">
          <a href="/Contact">LIÊN HỆ</a>
        </div>
      </div>
    </div>
  );
}
