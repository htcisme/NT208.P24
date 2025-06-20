"use client";

import React, { useState, useEffect, useRef } from "react";
import "@/styles-comp/style.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const HeaderAdmin = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Kiểm tra user trong localStorage khi component mount
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);

          // Nếu người dùng không phải admin, chuyển hướng về trang chủ
          if (userData.role !== "admin") {
            router.push("/");
          }
        } else {
          // Nếu không có thông tin user, chuyển hướng về trang đăng nhập
          router.push("/User?tab=login");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        router.push("/User?tab=login");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/User?tab=login");
  };

  const isActive = (path) => {
    return pathname === path
      ? "admin-header-navitem admin-header-navitem-active"
      : "admin-header-navitem";
  };

  if (isLoading) {
    return <div className="admin-loading">Đang tải...</div>;
  }

  return (
    <div className="admin-header-container">
      <div className="admin-header-topbar">
        <a href="/admin/">
          <div className="admin-header-title">TRANG QUẢN TRỊ</div>
        </a>
        <div className="admin-header-user">
          <span className="admin-header-username">{user?.name || "Khách"}</span>
          <div className="admin-header-user-dropdown">
            <div
              className="admin-header-user-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            {dropdownOpen && (
              <div className="admin-header-dropdown-content">
                <button onClick={handleLogout} className="admin-logout-btn">
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="admin-header-navbar">
        <Link href="/" className={isActive("/")}>
          TRANG CHỦ
        </Link>
        <Link
          href="/admin/IntroductionDashboard"
          className={isActive("/admin/IntroductionDashboard")}
        >
          GIỚI THIỆU
        </Link>
        <Link
          href="/admin/ActivitiesDashboard"
          className={isActive("/admin/ActivitiesDashboard")}
        >
          CHUYÊN MỤC
        </Link>
        <Link
          href="/admin/AwardsDashboard"
          className={isActive("/admin/AwardsDashboard")}
        >
          THÀNH TÍCH
        </Link>
        <Link
          href="/admin/BookingDashboard"
          className={isActive("/admin/BookingDashboard")}
        >
          ĐẶT PHÒNG
        </Link>
        <Link
          href="/admin/ContactDashboard"
          className={isActive("/admin/ContactDashboard")}
        >
          LIÊN HỆ
        </Link>
        <Link
          href="/admin/UsersDashboard"
          className={isActive("/admin/UsersDashboard")}
        >
          NGƯỜI DÙNG
        </Link>
        <Link href="/admin/Chat" className={isActive("/admin/Chat")}>
          TIN NHẮN
        </Link>
      </div>
    </div>
  );
};

export default HeaderAdmin;
