"use client";

import { useState, useEffect } from "react";
import "@/styles-comp/style.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra dark mode
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark");
    }

    // Kiểm tra thông tin đăng nhập
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  };

  const handleLogout = () => {
    // Xóa từ localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // THÊM MỚI: Xóa cookie token
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setUser(null);
    setShowUserMenu(false);
    router.push("/");
  };

  return (
    <div className="Header">
      <div className="Header-Topbar">
        <div className="Header-Topbar-Logogroup">
          <Image
            src={
              isDarkMode
                ? "/Img/Homepage/Fulllogolight.png"
                : "/Img/Homepage/Fulllogolight.png"
            }
            alt="Cum-logo-Doan-khoa"
            width={250}
            height={250}
            onError={() => setLogoError(true)}
            fallbackSrc="/Img/Homepage/Fulllogolight.png"
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
                className="Header-Topbar-Authsearch-Searchbox-Searchicon-Icon"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
            </span>
          </div>

          {/* Hiển thị thông tin người dùng hoặc nút đăng nhập/đăng ký */}
          {user ? (
            <div className="Header-Topbar-Authsearch-UserInfo">
              <div
                className="Header-Topbar-Authsearch-UserInfo-Button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="Header-Topbar-Authsearch-UserInfo-Name">
                  Chào, {user.name}
                </span>
                <span className="Header-Topbar-Authsearch-UserInfo-Arrow">
                  ▼
                </span>
              </div>

              {showUserMenu && (
                <div className="Header-Topbar-Authsearch-UserInfo-Menu">
                  <Link
                    href="/profile"
                    className="Header-Topbar-Authsearch-UserInfo-MenuItem"
                  >
                    Trang cá nhân
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin/UsersDashboard"
                      className="Header-Topbar-Authsearch-UserInfo-MenuItem"
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    className="Header-Topbar-Authsearch-UserInfo-MenuItem"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="Header-Topbar-Authsearch-Authlinks">
              <a href="/User?tab=register">
                <span className="Header-Topbar-Authsearch-Authlinks-Item">
                  Đăng ký
                </span>
              </a>
              <span>|</span>
              <a href="/User?tab=login">
                <span className="Header-Topbar-Authsearch-Authlinks-Item">
                  Đăng nhập
                </span>
              </a>
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          className="Header-Topbar-Dark-mode-toggle"
        >
          {isDarkMode ? (
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M13 3a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0V3ZM6.343 4.929A1 1 0 0 0 4.93 6.343l1.414 1.414a1 1 0 0 0 1.414-1.414L6.343 4.929Zm12.728 1.414a1 1 0 0 0-1.414-1.414l-1.414 1.414a1 1 0 0 0 1.414 1.414l1.414-1.414ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm-9 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H3Zm16 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2h-2ZM7.757 17.657a1 1 0 1 0-1.414-1.414l-1.414 1.414a1 1 0 1 0 1.414 1.414l1.414-1.414Zm9.9-1.414a1 1 0 0 0-1.414 1.414l1.414 1.414a1 1 0 0 0 1.414-1.414l-1.414-1.414ZM13 19a1 1 0 1 0-2 0v2a1 1 0 1 0 2 0v-2Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M11.675 2.015a.998.998 0 0 0-.403.011C6.09 2.4 2 6.722 2 12c0 5.523 4.477 10 10 10 4.356 0 8.058-2.784 9.43-6.667a1 1 0 0 0-1.02-1.33c-.08.006-.105.005-.127.005h-.001l-.028-.002A5.227 5.227 0 0 0 20 14a8 8 0 0 1-8-8c0-.952.121-1.752.404-2.558a.996.996 0 0 0 .096-.428V3a1 1 0 0 0-.825-.985Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="Header-Navbar">
        <Link className="Header-Navbar-Navitem" href="/">
          TRANG CHỦ
        </Link>
        <Link className="Header-Navbar-Navitem" href="/Introduction">
          GIỚI THIỆU
        </Link>
        <Link className="Header-Navbar-Navitem" href="/Activities">
          HOẠT ĐỘNG
        </Link>
        <Link className="Header-Navbar-Navitem" href="/Awards">
          THÀNH TÍCH
        </Link>
        <Link className="Header-Navbar-Navitem" href="/Booking">
          ĐẶT PHÒNG
        </Link>
        <Link className="Header-Navbar-Navitem" href="/Contact">
          LIÊN HỆ
        </Link>
      </div>
    </div>
  );
}
