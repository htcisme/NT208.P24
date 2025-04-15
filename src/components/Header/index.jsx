"use client";

import { useState, useEffect } from "react";
import "@/styles-comp/style.css";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage hoặc session
    const userSession = localStorage.getItem("user");
    if (userSession) {
      const userData = JSON.parse(userSession);
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Chỉ lưu trạng thái, chưa cần thay đổi giao diện
    localStorage.setItem("darkMode", !isDarkMode ? "true" : "false");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setShowUserMenu(false);
  };

  return (
    <div className="Header">
      <div className="Header-Topbar">
        <div className="Header-Topbar-Logogroup">
          <Link href="/">
            <Image
              src="/Img/Homepage/Fulllogolight.png"
              alt="Cum-logo-Doan-khoa"
              width={250}
              height={250}
              priority
            />
          </Link>
        </div>

        <div className="Header-Topbar-Titlegroup">
          <div className="Header-Topbar-Titlegroup-Uniname">
            TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN - ĐHQG-HCM
          </div>
          <div className="Header-Topbar-Titlegroup-Deptname">
            ĐOÀN KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG
          </div>
        </div>

        <div className="Header-Topbar-RightSection">
          <div className="Header-Topbar-Authsearch">
            <div className="Header-Topbar-SearchRow">
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

              {/* Nút chuyển đổi Dark/Light mode đặt ngang hàng với search */}
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

              {/* Nút menu mobile */}
              <button
                className="Header-Mobile-Menu-Button"
                onClick={toggleMobileMenu}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>

            {isLoggedIn ? (
              <div className="Header-Topbar-Authsearch-UserSection">
                <div
                  className="Header-Topbar-Authsearch-UserSection-Profile"
                  onClick={toggleUserMenu}
                >
                  <Image
                    src={user?.avatar || "/Img/default-avatar.png"}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="Header-Topbar-Authsearch-UserSection-Avatar"
                  />
                  <span className="Header-Topbar-Authsearch-UserSection-Name">
                    {user?.name || "Người dùng"}
                  </span>
                </div>

                {showUserMenu && (
                  <div className="Header-Topbar-Authsearch-UserSection-Menu">
                    <Link
                      href="/profile"
                      className="Header-Topbar-Authsearch-UserSection-MenuItem"
                    >
                      Hồ sơ
                    </Link>
                    <Link
                      href="/settings"
                      className="Header-Topbar-Authsearch-UserSection-MenuItem"
                    >
                      Cài đặt
                    </Link>
                    <button
                      className="Header-Topbar-Authsearch-UserSection-MenuItem"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="Header-Topbar-Authsearch-Authlinks">
                <Link
                  href="/User?tab=register"
                  className="Header-Topbar-Authsearch-Authlinks-Item"
                >
                  Đăng ký
                </Link>
                <span>|</span>
                <Link
                  href="/User?tab=login"
                  className="Header-Topbar-Authsearch-Authlinks-Item"
                >
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div
        className={`Header-Navbar ${
          isMobileMenuOpen ? "Header-Navbar--open" : ""
        }`}
      >
        <Link href="/" className="Header-Navbar-Navitem">
          TRANG CHỦ
        </Link>
        <Link href="/Introduction" className="Header-Navbar-Navitem">
          GIỚI THIỆU
        </Link>
        <Link href="/Activities" className="Header-Navbar-Navitem">
          HOẠT ĐỘNG
        </Link>
        <Link href="/Awards" className="Header-Navbar-Navitem">
          THÀNH TÍCH
        </Link>
        <Link href="/Booking" className="Header-Navbar-Navitem">
          ĐẶT PHÒNG
        </Link>
        <Link href="/Contact" className="Header-Navbar-Navitem">
          LIÊN HỆ
        </Link>
      </div>
    </div>
  );
}
