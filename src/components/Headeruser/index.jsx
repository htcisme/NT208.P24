"use client";
import { useState, useEffect, useRef } from "react";
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
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null); // Create a ref for the menu

  // Check user login status
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    setShowUserMenu(false);
    router.push("/");
  };

  // Toggle menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Image slideshow
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
        {/* Navigation */}
        <div className={styles.Header_Nav_MenuWrapper} ref={menuRef}>
          <button
            className={styles.Header_Nav_MenuWrapper_MenuButton}
            onClick={toggleMenu}
            aria-expanded={showMenu}
          >
            ☰
          </button>
          <div
            className={`${styles.Header_Nav_MenuWrapper_DropdownMenu} ${
              showMenu ? styles.Header_Nav_MenuWrapper_MenuButton_ShowMenu : ""
            }`}
          >
            <Link
              href="/"
              className={styles.Header_Nav_MenuWrapper_DropdownMenu_Item}
            >
              Trang chủ
            </Link>
            <Link
              href="/Introduction"
              className={styles.Header_Nav_MenuWrapper_DropdownMenu_Item}
            >
              Giới thiệu
            </Link>
            <Link
              href="/Activities"
              className={styles.Header_Nav_MenuWrapper_DropdownMenu_Item}
            >
              Hoạt động
            </Link>
            <Link
              href="/Awards"
              className={styles.Header_Nav_MenuWrapper_DropdownMenu_Item}
            >
              Thành tích
            </Link>
            <Link
              href="/Booking"
              className={styles.Header_Nav_MenuWrapper_DropdownMenu_Item}
            >
              Đặt phòng
            </Link>
            <Link
              href="/Contact"
              className={styles.Header_Nav_MenuWrapper_DropdownMenu_Item}
            >
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
