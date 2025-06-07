"use client";

import { useState, useEffect, useRef } from "react";
import "@/styles-comp/style.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  const isActiveNav = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.body.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark");
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    setUser(null);
    setShowUserMenu(false);
    router.push("/");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/activities/search?q=${encodeURIComponent(
          searchTerm.trim()
        )}&limit=8`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInput = async (value) => {
    setSearchTerm(value);

    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    if (value.trim().length >= 2) {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/activities/search?q=${encodeURIComponent(value.trim())}&limit=8`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch search results");
        }
        const data = await response.json();

        if (data.success) {
          setSearchResults(data.data);
          setShowSearchResults(true);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleResultClick = (id) => {
    setShowSearchResults(false);
    setSearchTerm("");
    router.push(`/Activities/${id}`);
  };

  return (
    <div className="Header">
      {/* Hàng trên: Logo, User Menu, Search, Notifications, Dark Mode */}
      <div className="Header-Topbar">
        <div className="Header-Topbar-Titlegroup">
          <div className="Header-Topbar-Titlegroup-Deptname">
            SUCTREMMT
          </div>
        </div>

        {/* Hàng dưới: Navigation */}
        <div className="Header-Navbar">
          <Link
            className={`Header-Navbar-Navitem ${isActiveNav('/') ? 'active' : ''}`}
            href="/"
          >
            TRANG CHỦ
          </Link>
          <Link
            className={`Header-Navbar-Navitem ${isActiveNav('/Introduction') ? 'active' : ''}`}
            href="/Introduction"
          >
            GIỚI THIỆU
          </Link>
          <Link
            className={`Header-Navbar-Navitem ${isActiveNav('/Activities') ? 'active' : ''}`}
            href="/Activities"
          >
            HOẠT ĐỘNG
          </Link>
          <Link
            className={`Header-Navbar-Navitem ${isActiveNav('/Awards') ? 'active' : ''}`}
            href="/Awards"
          >
            THÀNH TÍCH
          </Link>
          <Link
            className={`Header-Navbar-Navitem ${isActiveNav('/Booking') ? 'active' : ''}`}
            href="/Booking"
          >
            ĐẶT PHÒNG
          </Link>
          <Link
            className={`Header-Navbar-Navitem ${isActiveNav('/Contact') ? 'active' : ''}`}
            href="/Contact"
          >
            LIÊN HỆ
          </Link>
        </div>

        <div className="Header-Topbar-RightSection">
          {/* 1. User menu hoặc auth links - ĐẦU TIÊN */}
          {user ? (
            <div
              className="Header-Topbar-Authsearch-UserInfo"
              ref={userMenuRef}
            >
              <div
                className="Header-Topbar-Authsearch-UserInfo-Button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") setShowUserMenu(!showUserMenu);
                }}
              >
                <Image
                  src="/hi-gesture-hand-svgrepo-com.svg"
                  alt="Chào mừng"
                  width={24}
                  height={24}
                  className="Header-Topbar-Authsearch-UserInfo-Icon"
                />
              </div>

              {showUserMenu && (
                <div className="Header-Topbar-Authsearch-UserInfo-Menu">
                  <Link
                    href="/Profile"
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
            <div
              className="Header-Topbar-Authsearch-UserInfo"
              ref={userMenuRef}
            >
              <div
                className="Header-Topbar-Authsearch-UserInfo-Button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === "Enter") setShowUserMenu(!showUserMenu);
                }}
              >
                <Image
                  src="/user-people-account-svgrepo-com.svg"
                  alt="Đăng nhập/Đăng ký"
                  width={24}
                  height={24}
                  className="Header-Topbar-Authsearch-UserInfo-Icon"
                />
              </div>

              {showUserMenu && (
                <div className="Header-Topbar-Authsearch-UserInfo-Menu">
                  <Link
                    href="/User?tab=login"
                    className="Header-Topbar-Authsearch-UserInfo-MenuItem"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/User?tab=register"
                    className="Header-Topbar-Authsearch-UserInfo-MenuItem"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 2. Search box - THỨ HAI */}
          <div className="Header-Topbar-Authsearch-Searchbox" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Tìm kiếm hoạt động..."
                value={searchTerm}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() =>
                  searchTerm.trim().length >= 2 && setShowSearchResults(true)
                }
              />
              <button
                type="submit"
                className="Header-Topbar-Authsearch-Searchbox-Searchicon"
              >
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
              </button>
            </form>

            {showSearchResults && (
              <div className="search-results-dropdown">
                {isSearching ? (
                  <div className="search-loading">Đang tìm kiếm...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="search-results-header">
                      <span>Tìm thấy {searchResults.length} kết quả</span>
                    </div>
                    <div className="search-results-list">
                      {searchResults.map((result) => (
                        <div
                          key={result._id}
                          className="search-result-item"
                          onClick={() => handleResultClick(result._id)}
                        >
                          <h4>{result.title}</h4>
                          <p>{result.description?.substring(0, 100)}...</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="search-no-results">
                    Không tìm thấy kết quả nào
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. Notification - THỨ BA */}
          {user && <NotificationBell user={user} />}

          {/* 4. Dark Mode Toggle - CUỐI CÙNG */}
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
      </div>
    </div>
  );
}