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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Đóng mobile menu khi resize về desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Đóng mobile menu khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && 
          !event.target.closest('.Header-Navbar--mobile') && 
          !event.target.closest('.Header-Mobile-Menu-Button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

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

  // Đóng mobile menu khi click vào nav item
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="Header">
      {/* Single Header Row - chứa tất cả trên desktop */}
      <div className="Header-Container">
        {/* Left: Title */}
        <div className="Header-Titlegroup">
          <div className="Header-Titlegroup-Deptname">
            SUCTREMMT
          </div>
        </div>

        {/* Center: Navigation - chỉ hiển thị trên desktop */}
        <nav className="Header-Navbar Header-Navbar--desktop">
          <Link
            className={`Header-Navbar-Navitem ${isActiveNav('/') ? 'active' : ''}`}
            href="/"
            onClick={handleNavClick}
          >
            TRANG CHỦ
          </Link>
          <Link
            className={`Header-Navbar-Navitem ${isActiveNav('/Introduction') ? 'active' : ''}`}
            href="/Introduction"
            onClick={handleNavClick}
          >
            GIỚI THIỆU
          </Link>
          <Link
            className={`Header-Navbar-Navitem ${isActiveNav('/Activities') ? 'active' : ''}`}
            href="/Activities"
            onClick={handleNavClick}
          >
            HOẠT ĐỘNG
          </Link>
          <Link
            className={`Header-Navbar-Navitem ${isActiveNav('/Awards') ? 'active' : ''}`}
            href="/Awards"
            onClick={handleNavClick}
          >
            THÀNH TÍCH
          </Link>
          <Link
            className={`Header-Navbar-Navitem ${isActiveNav('/Booking') ? 'active' : ''}`}
            href="/Booking"
            onClick={handleNavClick}
          >
            ĐẶT PHÒNG
          </Link>
          <Link
            className={`Header-Navbar-Navitem ${isActiveNav('/Contact') ? 'active' : ''}`}
            href="/Contact"
            onClick={handleNavClick}
          >
            LIÊN HỆ
          </Link>
        </nav>

        {/* Right: Controls */}
        <div className="Header-RightSection">
          {/* 1. User menu */}
          {user ? (
            <div
              className="Header-Authsearch-UserInfo"
              ref={userMenuRef}
            >
              <div
                className="Header-Authsearch-UserInfo-Button"
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
                  className="Header-Authsearch-UserInfo-Icon"
                />
              </div>

              {showUserMenu && (
                <div className="Header-Authsearch-UserInfo-Menu">
                  <Link
                    href="/Profile"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Trang cá nhân
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin/ActivitiesDashboard"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div
              className="Header-Authsearch-UserInfo"
              ref={userMenuRef}
            >
              <div
                className="Header-Authsearch-UserInfo-Button"
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
                  className="Header-Authsearch-UserInfo-Icon"
                />
              </div>

              {showUserMenu && (
                <div className="Header-Authsearch-UserInfo-Menu">
                  <Link
                    href="/User?tab=login"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/User?tab=register"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 2. Search box */}
          <div className="Header-Authsearch-Searchbox" ref={searchRef}>
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
                className="Header-Authsearch-Searchbox-Searchicon"
              >
                <svg
                  className="Header-Authsearch-Searchbox-Searchicon-Icon"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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

          {/* 3. Notification */}
          {user && <NotificationBell user={user} />}

          {/* 4. Mobile Menu Button */}
          <button
            className="Header-Mobile-Menu-Button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="Header-Mobile-Menu-Icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* 5. Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="Header-Dark-mode-toggle"
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

      {/* Mobile Navigation Dropdown */}
      <nav className={`Header-Navbar Header-Navbar--mobile ${isMobileMenuOpen ? 'Header-Navbar--open' : ''}`}>
        <Link
          className={`Header-Navbar-Navitem ${isActiveNav('/') ? 'active' : ''}`}
          href="/"
          onClick={handleNavClick}
        >
          TRANG CHỦ
        </Link>
        <Link
          className={`Header-Navbar-Navitem ${isActiveNav('/Introduction') ? 'active' : ''}`}
          href="/Introduction"
          onClick={handleNavClick}
        >
          GIỚI THIỆU
        </Link>
        <Link
          className={`Header-Navbar-Navitem ${isActiveNav('/Activities') ? 'active' : ''}`}
          href="/Activities"
          onClick={handleNavClick}
        >
          HOẠT ĐỘNG
        </Link>
        <Link
          className={`Header-Navbar-Navitem ${isActiveNav('/Awards') ? 'active' : ''}`}
          href="/Awards"
          onClick={handleNavClick}
        >
          THÀNH TÍCH
        </Link>
        <Link
          className={`Header-Navbar-Navitem ${isActiveNav('/Booking') ? 'active' : ''}`}
          href="/Booking"
          onClick={handleNavClick}
        >
          ĐẶT PHÒNG
        </Link>
        <Link
          className={`Header-Navbar-Navitem ${isActiveNav('/Contact') ? 'active' : ''}`}
          href="/Contact"
          onClick={handleNavClick}
        >
          LIÊN HỆ
        </Link>
      </nav>
    </div>
  );
}