"use client";
import { useState, useEffect } from "react";
import styles from "@/styles-comp/style.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const images = [
  "/Img/Homepage/BCH1.png",
  "/Img/Homepage/BCH2.png",
  "/Img/Homepage/BCH3.png",
];

export default function Headeruser() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  // Kiểm tra thông tin đăng nhập khi component được tải
  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }
    };

    checkUser();
  }, []);

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Xóa cookie token
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setUser(null);
    setShowUserMenu(false);
    router.push("/");
  };

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
      <div className={styles.Header_Logo}>
        <Link href="/">XANGFUTING</Link>
      </div>
      <div className={styles.Header_Nav}>
        {/* Điều hướng chính */}
        <div className={styles.Header_Nav_Items}>
          <Link href="/Introduction" className={styles.Header_Nav_Item}>
            Giới thiệu
          </Link>
          <Link href="/Activities" className={styles.Header_Nav_Item}>
            Hoạt động
          </Link>
          <Link href="/Awards" className={styles.Header_Nav_Item}>
            Thành tích
          </Link>
          <Link href="/Booking" className={styles.Header_Nav_Item}>
            Đặt phòng
          </Link>
          <Link href="/Contact" className={styles.Header_Nav_Item}>
            Liên hệ
          </Link>
        </div>

        {/* Phần tài khoản */}
        <div className={styles.Header_Nav_AuthContainer}>
          <button
            className={styles.Header_Nav_AuthButton}
            onClick={toggleUserMenu}
          >
            {user ? `Xin chào, ${user.name}` : "Tài khoản"}
            <span className={styles.Header_Nav_AuthButton_Arrow}>▼</span>
          </button>
          {showUserMenu && (
            <div className={styles.Header_Nav_AuthMenu}>
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className={styles.Header_Nav_AuthMenu_Item}
                  >
                    Trang cá nhân
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin/UsersDashboard"
                      className={styles.Header_Nav_AuthMenu_Item}
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className={styles.Header_Nav_AuthMenu_Item}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/User?tab=login"
                    className={styles.Header_Nav_AuthMenu_Item}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/User?tab=register"
                    className={styles.Header_Nav_AuthMenu_Item}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Ô tìm kiếm */}
        <div className={styles.Header_Topbar_Authsearch}>
          <div className={styles.Header_Topbar_Authsearch_Searchbox}>
            <input type="text" placeholder="Tìm kiếm..." />
            <span
              className={styles.Header_Topbar_Authsearch_Searchbox_Searchicon}
            >
              <svg
                className={
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
                  strokeLinecap="round"
                  strokeWidth="2"
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
