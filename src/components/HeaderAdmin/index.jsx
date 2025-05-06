"use client";

import React, { useState, useEffect } from "react";
import "@/styles-comp/style.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HeaderAdmin = () => {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path
      ? "admin-header-navitem admin-header-navitem-active"
      : "admin-header-navitem";
  };

  return (
    <div className="admin-header-container">
      <div className="admin-header-topbar">
        <div className="admin-header-title">TRANG QUẢN TRỊ</div>
        <div className="admin-header-user">
          <span className="admin-header-username">Nguyễn Đình Khang</span>
          <div className="admin-header-user-icon">
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
        </div>
      </div>

      <div className="admin-header-navbar">
        <Link href="/" className={isActive("/")}>
          TRANG CHỦ
        </Link>
        <Link href="/introduction" className={isActive("/introduction")}>
          GIỚI THIỆU
        </Link>
        <Link
          href="/admin/ActivitiesDashboard"
          className={isActive("/activities")}
        >
          HOẠT ĐỘNG
        </Link>
        <Link
          href="/admin/AwardsDashboard"
          className={isActive("/achievements")}
        >
          THÀNH TÍCH
        </Link>
        <Link href="/booking" className={isActive("/booking")}>
          ĐẶT PHÒNG
        </Link>
        <Link href="/admin/UsersDashboard" className={isActive("/contact")}>
          NGƯỜI DÙNG
        </Link>
      </div>
    </div>
  );
};

export default HeaderAdmin;
