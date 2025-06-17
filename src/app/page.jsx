"use client";
import { useState, useEffect, useRef, useCallback, useMemo, use } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { set } from "mongoose";

// Lazy load RegisterForm vì không cần ngay khi trang load
const RegisterForm = dynamic(() => import("@/components/RegisterForm"), {
  ssr: false,
  loading: () => <div>Đang tải...</div>,
});

// Constants được đưa ra ngoài component để tránh re-create
const IMAGES = [
  "/Img/Homepage/BCH1.png",
  "/Img/Homepage/BCH2.png",
  "/Img/Homepage/BCH3.png",
];

const EVENTS = [
  { title: "VNU TOUR 2024", image: "/Img/Homepage/Slider1.png" },
  { title: "NGỌN ĐUỐC XANH 2025", image: "/Img/Homepage/Slider3.png" },
  { title: "NETSEC DAY 2024", image: "/Img/Homepage/Slider2.png" },
  { title: "TẬN TỴ ĐÓN TẾT", image: "/Img/Homepage/Slider4.png" },
  { title: "CHÀO ĐÓN TÂN SINH VIÊN", image: "/Img/Homepage/Slider5.png" },
];

const MEMBER_ITEMS = [
  {
    img: "/Img/Homepage/TTSK_Img.png",
    alt: "Ban Truyền thông & Sự kiện",
    label: "Ban Truyền thông & Sự kiện",
  },
  {
    img: "/Img/Homepage/BTK_Img.png",
    alt: "Ban Thiết kế",
    label: "Ban Thiết kế",
  },
  {
    img: "/Img/Homepage/BHT_Img.png",
    alt: "Ban Học tập",
    label: "Ban Học tập",
  },
];

// Custom hook cho scroll reveal
const useScrollReveal = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve sau khi đã visible để tránh re-trigger
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: "50px 0px -50px 0px", // Trigger sớm hơn một chút
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// Custom hooks
const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setUser(null);
    window.location.reload();
  }, []);

  return { user, setUser, logout };
};

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
    document.body.classList.toggle("dark", savedMode);
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.body.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", String(newMode));
  }, [isDarkMode]);

  return { isDarkMode, toggleDarkMode };
};

const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
};

const useImageCarousel = (images, interval = 3000) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setFade(true);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return { currentIndex, fade };
};

// Debounce hook cho search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const menuRef = useRef(null);

  const categoriesRef = useRef(null);
  const [showCategories, setShowCategories] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const categoriesMenuRef = useRef(null);

  // Custom hooks
  const { user, logout } = useUser();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { currentIndex, fade } = useImageCarousel(IMAGES);

  // Scroll reveal refs cho tất cả sections
  const [heroRef, heroVisible] = useScrollReveal(0.1);
  const [introTitleRef, introTitleVisible] = useScrollReveal(0.2);
  const [introImageRef, introImageVisible] = useScrollReveal(0.2);
  const [introTextRef, introTextVisible] = useScrollReveal(0.2);
  const [memberItemsRef, memberItemsVisible] = useScrollReveal(0.2);
  const [activitiesTitleRef, activitiesTitleVisible] = useScrollReveal(0.2);
  const [activitiesCardsRef, activitiesCardsVisible] = useScrollReveal(0.2);
  const [focusRef, focusVisible] = useScrollReveal(0.2);
  const [highlightTitleRef, highlightTitleVisible] = useScrollReveal(0.2);
  const [highlightSliderRef, highlightSliderVisible] = useScrollReveal(0.2);
  const [awardsTitleRef, awardsTitleVisible] = useScrollReveal(0.2);
  const [awardsContentRef, awardsContentVisible] = useScrollReveal(0.2);
  const [lowerBandrollRef, lowerBandrollVisible] = useScrollReveal(0.2);
  const [imageGridRef, imageGridVisible] = useScrollReveal(0.2);
  const [registerFormRef, registerFormVisible] = useScrollReveal(0.2);

  // State
  const [startIndex, setStartIndex] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Click outside handlers
  useClickOutside(searchRef, () => setShowSearchResults(false));
  useClickOutside(userMenuRef, () => setShowUserMenu(false));

  // Memoized values
  const visibleEvents = useMemo(
    () =>
      Array.from(
        { length: 3 },
        (_, i) => EVENTS[(startIndex + i) % EVENTS.length]
      ),
    [startIndex]
  );

  // Handlers
  const handlePrev = useCallback(() => {
    setStartIndex((prev) => (prev - 1 + EVENTS.length) % EVENTS.length);
  }, []);

  const handleNext = useCallback(() => {
    setStartIndex((prev) => (prev + 1) % EVENTS.length);
  }, []);

  const toggleUserMenu = useCallback(
    () => setShowUserMenu((prev) => !prev),
    []
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoriesMenuRef.current &&
        !categoriesMenuRef.current.contains(event.target)
      ) {
        setShowCategoriesMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside menu and menu button
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        // Also close categories submenu if it's open
        setShowCategoriesMenu(false);
      }
    };

    // Add event listener if menu is open
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target)
      ) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleMouseEnter = () => {
    setShowCategoriesDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowCategoriesDropdown(false);
  };

  // Fetch dữ liệu giải thưởng từ API
  useEffect(() => {
    const fetchAwards = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/awards");

        if (!response.ok) {
          throw new Error("Không thể tải danh sách giải thưởng");
        }

        const data = await response.json();

        if (data.success) {
          setAwards(data.data.slice(0, 5)); // Chỉ lấy 5 giải thưởng đầu tiên
        } else {
          throw new Error(data.message || "Lỗi khi tải dữ liệu");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching awards:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAwards();
  }, []);

  // Nhóm giải thưởng theo tổ chức
  const groupedAwards = useMemo(() => {
    return awards.reduce((acc, award) => {
      if (!acc[award.organization]) {
        acc[award.organization] = [];
      }
      acc[award.organization].push(award);
      return acc;
    }, {});
  }, [awards]);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, []);

  const handleResultClick = useCallback((slug) => {
    setShowSearchResults(false);
    setSearchTerm("");
    window.location.href = `/Activities/${slug}`;
  }, []);

  // Search effect
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) return;

    const searchActivities = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/activities/search?q=${encodeURIComponent(
            debouncedSearchTerm.trim()
          )}`
        );
        const data = await response.json();
        setSearchResults(data.success ? data.data : []);
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchActivities();
  }, [debouncedSearchTerm]);

  // Fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      setLoadingRecent(true);
      try {
        // Thay đổi limit từ 4 thành 3
        const res = await fetch("/api/activities?limit=3&status=published");
        const data = await res.json();

        if (data.success) {
          const processedActivities = data.data.map((activity) => ({
            ...activity,
            image: activity.images?.[0] || "/Img/Homepage/card1.png",
          }));
          setRecentActivities(processedActivities);
        } else {
          setRecentActivities([]);
        }
      } catch (err) {
        console.error("Error fetching activities:", err);
        setRecentActivities([]);
      } finally {
        setLoadingRecent(false);
      }
    };

    fetchRecentActivities();
  }, []);

  // Prevent form submission on search
  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <div className={styles.Container}>
      <header className={styles.Header}>
        <div className={styles.Header_Logo}>
          <Link href="/">SUCTREMMT</Link>
        </div>

        <nav className={styles.Header_Nav}>
          {/* User Menu */}
          <div className={styles.Header_Nav_MenuWrapper}>
            <button
              className={styles.Header_Nav_AuthButton}
              onClick={toggleUserMenu}
              aria-label={user ? `Menu của ${user.name}` : "Menu tài khoản"}
              aria-expanded={showUserMenu}
            >
              {user ? `Xin chào, ${user.name}` : "Tài khoản"}
              <span className={styles.Header_Nav_AuthButton_Arrow}>▼</span>
            </button>

            {showUserMenu && (
              <div className={styles.Header_Nav_AuthMenu} ref={userMenuRef}>
                {user ? (
                  <>
                    <Link
                      href="/Profile"
                      className={styles.Header_Nav_AuthMenu_Item}
                    >
                      Trang cá nhân
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin/ActivitiesDashboard"
                        className={styles.Header_Nav_AuthMenu_Item}
                      >
                        Quản trị
                      </Link>
                    )}
                    <button
                      onClick={logout}
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

          {/* Search */}
          <div className={styles.Header_Nav_SearchWrapper} ref={searchRef}>
            <form
              onSubmit={handleSearchSubmit}
              className={styles.Header_Topbar_Authsearch_Searchbox}
            >
              <input
                type="text"
                placeholder="Tìm kiếm hoạt động"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm.trim() && setShowSearchResults(true)}
                aria-label="Tìm kiếm hoạt động"
              />
              <button
                type="submit"
                className={styles.Header_Topbar_Authsearch_Searchbox_Searchicon}
                aria-label="Tìm kiếm"
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
              </button>
            </form>

            {showSearchResults && (
              <div className={styles.searchResultsDropdown}>
                {isSearching ? (
                  <div className={styles.searchLoading}>Đang tìm kiếm...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className={styles.searchResultsHeader}>
                      <span>Tìm thấy {searchResults.length} kết quả</span>
                    </div>
                    <div className={styles.searchResultsList}>
                      {searchResults.map((result) => (
                        <div
                          key={result._id}
                          className={styles.searchResultItem}
                          onClick={() => handleResultClick(result.slug)}
                          role="button"
                          tabIndex={0}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleResultClick(result.slug)
                          }
                        >
                          <h4>{result.title}</h4>
                          <p>{result.description?.substring(0, 100)}...</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className={styles.searchNoResults}>
                    Không tìm thấy kết quả nào
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Menu */}
          <div className={styles.Header_Nav_MenuWrapper}>
            <button
              className={styles.Header_Nav_MenuWrapper_MenuButton}
              aria-expanded={showMenu}
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Menu điều hướng"
            >
              ☰
            </button>
            <nav
              className={`${styles.Header_Nav_MenuWrapper_DropdownMenu} ${
                showMenu
                  ? styles.Header_Nav_MenuWrapper_MenuButton_ShowMenu
                  : ""
              }`}
            >
              <Link
                href="/Introduction"
                className={styles.Header_Nav_MenuWrapper_DropdownMenu_Item}
                onClick={() => setShowMenu(false)}
              >
                Giới thiệu
              </Link>

              {/* Categories Menu Item */}
              <div
                className={styles.Header_Nav_MenuWrapper_DropdownMenu_Item}
                ref={categoriesMenuRef}
                onMouseEnter={() => setShowCategoriesMenu(true)}
                onMouseLeave={() => setShowCategoriesMenu(false)}
              >
                <span className={styles.category_trigger}>
                  Chuyên mục
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`${styles.dropdown_arrow} ${
                      showCategoriesMenu ? styles.open : ""
                    }`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>

                {showCategoriesMenu && (
                  <div className={styles.categories_submenu}>
                    <Link
                      href="/Activities"
                      onClick={() => {
                        setShowMenu(false);
                        setShowCategoriesMenu(false);
                      }}
                      className={styles.submenu_item}
                    >
                      Hoạt động nổi bật
                    </Link>
                    <Link
                      href="/ActivitiesOverview"
                      onClick={() => {
                        setShowMenu(false);
                        setShowCategoriesMenu(false);
                      }}
                      className={styles.submenu_item}
                    >
                      Tất cả hoạt động
                    </Link>
                    <div className={styles.submenu_divider}></div>
                    {categories.map((category) => (
                      <Link
                        key={category.value}
                        href={`/ActivitiesOverview?type=${category.value}`}
                        onClick={() => {
                          setShowMenu(false);
                          setShowCategoriesMenu(false);
                        }}
                        className={styles.submenu_item}
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/Awards"
                className={styles.Header_Nav_MenuWrapper_DropdownMenu_Item}
                onClick={() => setShowMenu(false)}
              >
                Thành tích
              </Link>
              <Link
                href="/Booking"
                className={styles.Header_Nav_MenuWrapper_DropdownMenu_Item}
                onClick={() => setShowMenu(false)}
              >
                Đặt phòng
              </Link>
              <Link
                href="/Contact"
                className={styles.Header_Nav_MenuWrapper_DropdownMenu_Item}
                onClick={() => setShowMenu(false)}
              >
                Liên hệ
              </Link>
            </nav>
          </div>

          {/* Dark Mode Toggle */}
          <button
            className={styles.Header_Nav_DarkModeToggle}
            onClick={toggleDarkMode}
            aria-label={
              isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
            }
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
                fill="#042354"
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
        </nav>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`${styles.hero} ${heroVisible ? "animate-hero" : ""}`}
      >
        <div className={styles.heroBackground}></div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroLogos}>
            <Image
              src="/Img/Homepage/Fulllogo.png"
              alt="Logo Đoàn Khoa"
              width={400}
              height={400}
              className={styles.logo}
              priority
            />
          </div>
          <h1 className={styles.heroTitle}>
            TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN - ĐHQG-HCM
          </h1>
          <h2 className={styles.heroSubtitle}>
            ĐOÀN KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG
          </h2>
        </div>
      </section>

      {/* Main Content */}
      <main className={styles.Body}>
        <div className={styles.Body_Container}>
          {/* Introduction Section */}
          <section className={styles.Body_Container_Introduction}>
            <div
              className={styles.Body_Container_Introduction_BodyShape01}
            ></div>
            <div
              className={styles.Body_Container_Introduction_BodyShape02}
            ></div>
            <div
              className={styles.Body_Container_Introduction_BodyShape03}
            ></div>
            <div
              className={styles.Body_Container_Introduction_BodyShape04}
            ></div>

            <Link href="/Introduction">
              <h2
                ref={introTitleRef}
                className={`${styles.Body_Container_Introduction_Title} ${
                  introTitleVisible ? "animate-title" : ""
                }`}
              >
                GIỚI THIỆU
              </h2>
            </Link>

            <div className={styles.Body_Container_Introduction_ContentWrapper}>
              <div
                ref={introImageRef}
                className={`${
                  styles.Body_Container_Introduction_ContentWrapper_ImageContainer
                } ${introImageVisible ? "animate-image" : ""}`}
              >
                <Image
                  src={IMAGES[currentIndex]}
                  alt={`Giới thiệu ${currentIndex + 1}`}
                  width={800}
                  height={400}
                  className={`${
                    styles.Body_Container_Introduction_ContentWrapper_ImageContainer_Image
                  } ${
                    styles.Body_Container_Introduction_ContentWrapper_ImageContainer_ImageFade
                  } ${
                    fade
                      ? styles.Body_Container_Introduction_ContentWrapper_ImageContainer_ImageFadeShow
                      : ""
                  }`}
                />
                <div
                  className={
                    styles.Body_Container_Introduction_ContentWrapper_ImageContainer_Dots
                  }
                >
                  {IMAGES.map((_, index) => (
                    <span
                      key={index}
                      className={`${
                        styles.Body_Container_Introduction_ContentWrapper_ImageContainer_Dot
                      } ${
                        currentIndex === index
                          ? styles.Body_Container_Introduction_ContentWrapper_ImageContainer_Active
                          : ""
                      }`}
                    ></span>
                  ))}
                </div>
              </div>

              <div
                ref={introTextRef}
                className={`${
                  styles.Body_Container_Introduction_ContentWrapper_TextContainer
                } ${introTextVisible ? "animate-text" : ""}`}
              >
                <h3
                  className={
                    styles.Body_Container_Introduction_ContentWrapper_TextContainer_Heading
                  }
                >
                  ĐOÀN KHOA <br />
                  MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG
                </h3>
                <p
                  className={
                    styles.Body_Container_Introduction_ContentWrapper_TextContainer_Description
                  }
                >
                  Khoa Mạng máy tính & Truyền thông, Trường ĐH CNTT có trên 1400
                  đoàn viên, sinh viên chính quy đang học tập và sinh hoạt. Cùng
                  với sự phát triển của khoa, tổ chức Đoàn cũng đạt được những
                  bước tiến về quy mô và chất lượng hoạt động.
                </p>
                <p
                  className={
                    styles.Body_Container_Introduction_ContentWrapper_TextContainer_Description
                  }
                >
                  Đứng ở vị trí là một đơn vị Đoàn cơ sở được nâng cấp chính
                  thức từ ngày 11/11/2014 từ tổ chức Liên chi Đoàn khoa, trực
                  thuộc Đoàn trường Đại học Công nghệ thông tin – ĐHQG-HCM, Đoàn
                  Khoa Mạng máy tính và truyền thông luôn thực hiện và hoàn
                  thành xuất sắc các nhiệm vụ của công tác Đoàn và Phong trào
                  Thanh niên theo phương châm: Thiết thực – hiệu quả và hội
                  nhập.
                </p>
                <p
                  className={
                    styles.Body_Container_Introduction_ContentWrapper_TextContainer_Description
                  }
                >
                  Với truyền thống, lịch sử hình thành và phát triển của mình,
                  cho đến nay Đoàn TNCS Hồ Chí Minh khoa MMT&TT đang quản lí 12
                  chi Đoàn trực thuộc, các ban chuyên môn và các đội nhóm chuyên
                  trách.
                </p>
                <Link
                  href="/Introduction"
                  className={
                    styles.Body_Container_Introduction_ContentWrapper_TextContainer_ReadMore
                  }
                >
                  Xem thêm ...
                </Link>
              </div>
            </div>

            {/* Member Items */}
            <div
              ref={memberItemsRef}
              className={`${styles.Body_Container_MemberWrap} ${
                memberItemsVisible ? "animate-members" : ""
              }`}
            >
              {MEMBER_ITEMS.map((member, index) => (
                <div key={index} className={styles.Body_Container_MemberItem}>
                  <img
                    src={member.img}
                    alt={member.alt}
                    className={styles.Body_Container_MemberImage}
                    loading="lazy"
                  />
                  <p className={styles.Body_Container_MemberLabel}>
                    {member.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Activities Section */}
          <section className={styles.Body_Container_Activities}>
            <Link href="/Activities">
              <h2
                ref={activitiesTitleRef}
                className={`${styles.Activities_RecentLabel} ${
                  activitiesTitleVisible ? "animate-title" : ""
                }`}
              >
                HOẠT ĐỘNG GẦN ĐÂY
              </h2>
            </Link>

            <div
              ref={activitiesCardsRef}
              className={`${styles.Activities_RecentCards} ${
                activitiesCardsVisible ? "animate-cards" : ""
              }`}
            >
              {loadingRecent ? (
                <div className={styles.loading}>Đang tải hoạt động...</div>
              ) : recentActivities.length === 0 ? (
                <div className={styles.no_activities}>
                  Không có hoạt động gần đây.
                </div>
              ) : (
                recentActivities.map((activity, index) => (
                  <Link
                    key={activity._id}
                    href={`/Activities/${activity.slug}`}
                    className={`${styles.Activities_RecentCard} animate-card-${index}`}
                  >
                    <div className={styles.Activities_RecentCard_Container}>
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className={styles.Activities_RecentCard_Image}
                        onError={(e) => {
                          e.target.src = "/Img/Homepage/card1.png";
                          console.error("Lỗi tải ảnh:", activity.image);
                        }}
                      />
                    </div>
                    <div className={styles.Activities_RecentCard_Content}>
                      <h3 className={styles.Activities_RecentCard_Title}>
                        {activity.title}
                      </h3>
                      <p className={styles.Activities_RecentCard_Desc}>
                        {activity.description ||
                          activity.content?.slice(0, 80) + "..."}
                      </p>
                      <p className={styles.Activities_RecentCard_Date}>
                        {activity.createdAt
                          ? new Date(activity.createdAt).toLocaleDateString(
                              "vi-VN",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )
                          : ""}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <Link
              href="/ActivitiesOverview"
              className={styles.Activities_ViewMore}
            >
              Xem thêm ...
            </Link>

            {/* Focus Section */}
            <div
              ref={focusRef}
              className={`${styles.Activities_Focus} ${
                focusVisible ? "animate-focus" : ""
              }`}
            >
              <div className={styles.Activities_Focus_Shape01}></div>
              <div className={styles.Activities_Focus_ContentWrapper}>
                <div className={styles.Activities_Focus_ImageContainer}>
                  <img
                    src="/Img/Homepage/Hotimage.png"
                    alt="Tiêu điểm hoạt động"
                    className={styles.Activities_Focus_Image}
                    loading="lazy"
                  />
                  <div className={styles.Activities_Focus_Shape02}></div>
                </div>
                <div className={styles.Activities_Focus_Content}>
                  <div className={styles.Activities_Focus_Content_Title}>
                    TIÊU ĐIỂM KHEN THƯỞNG
                  </div>
                  <div className={styles.Activities_Focus_Content_Timeline}>
                    {loading ? (
                      <div className="loading-container">
                        <p>Đang tải danh sách thành tích...</p>
                      </div>
                    ) : error ? (
                      <div className="error-container">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>
                          Thử lại
                        </button>
                      </div>
                    ) : (
                      Object.entries(groupedAwards).map(
                        ([organization, orgAwards]) => (
                          <div key={organization} className="timeline-item">
                            <h3>{organization} trao tặng</h3>
                            {orgAwards.map((award) => (
                              <p key={award._id}>
                                {award.content} ({award.year})
                              </p>
                            ))}
                          </div>
                        )
                      )
                    )}

                    {!loading && !error && awards.length === 0 && (
                      <div className="timeline-item">
                        <p>Chưa có thành tích nào được cập nhật</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Highlight Section */}
          <section className={styles.Body_Container_Hightlight}>
            <div
              ref={highlightTitleRef}
              className={`${styles.Body_Container_Hightlight_Title} ${
                highlightTitleVisible ? "animate-title" : ""
              }`}
            >
              HOẠT ĐỘNG NỔI BẬT
            </div>
            <div className={styles.Body_Container_Hightlight_Shape}></div>

            <section
              ref={highlightSliderRef}
              className={`${styles.light_slider_container} ${
                highlightSliderVisible ? "animate-slider" : ""
              }`}
            >
              <button
                className={styles.light_slider_arrow}
                onClick={handlePrev}
                aria-label="Sự kiện trước"
              >
                ←
              </button>
              {visibleEvents.map((event, index) => (
                <div
                  className={`${styles.light_slider_item} animate-slide-${index}`}
                  key={`${startIndex}-${index}`}
                >
                  <div
                    className={`${styles.slider_image_placeholder} ${
                      index === 1 ? styles.slider_image_placeholder_active : ""
                    }`}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className={styles.slider_image}
                      loading="lazy"
                    />
                  </div>
                  <h4>{event.title}</h4>
                </div>
              ))}
              <button
                className={styles.light_slider_arrow}
                onClick={handleNext}
                aria-label="Sự kiện tiếp theo"
              >
                →
              </button>
            </section>

            <div className={styles.light_slider_dots}>
              {EVENTS.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.light_slider_dot} ${
                    startIndex === index ? styles.light_slider_dot_active : ""
                  }`}
                  onClick={() => setStartIndex(index)}
                  aria-label={`Chuyển đến sự kiện ${index + 1}`}
                ></button>
              ))}
            </div>
          </section>

          {/* Awards Section */}
          <section className={styles.Body_Container_Awards}>
            <div
              ref={awardsTitleRef}
              className={`${styles.Body_Container_Awards_Title} ${
                awardsTitleVisible ? "animate-title" : ""
              }`}
            >
              THÀNH TÍCH NỔI BẬT
            </div>
            <div className={styles.Body_Container_Awards_Shape01}></div>
            <div className={styles.Body_Container_Awards_Shape02}></div>

            <div
              ref={awardsContentRef}
              className={`${styles.Body_Container_Awards_ContentWrapper} ${
                awardsContentVisible ? "animate-awards" : ""
              }`}
            >
              <div className={styles.Body_Container_Awards_Content}>
                <div className={styles.Body_Container_Awards_Content_Title}>
                  ĐOÀN KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG LÀ ĐƠN VỊ XUẤT SẮC DẪN
                  ĐẦU TRONG CÔNG TÁC ĐOÀN VÀ PHONG TRÀO THANH NIÊN NĂM HỌC 2023
                  - 2024
                </div>
                <div className={styles.Body_Container_Awards_Content_Desc}>
                  Chương trình nhằm mục đích tổng kết và đánh giá các hoạt động,
                  phong trào tại các đơn vị, đồng thời vinh danh các cá nhân, tổ
                  chức đã có sự đóng góp tiêu biểu. Trong năm học vừa qua, Đoàn
                  khoa Mạng máy tính và Truyền thông đã vinh hạnh là ĐƠN VỊ XUẤT
                  SẮC DẪN ĐẦU TRONG CÔNG TÁC ĐOÀN VÀ PHONG TRÀO THANH NIÊN NĂM
                  HỌC 2023 - 2024!
                </div>
                <div className={styles.Body_Container_Awards_Content_Desc}>
                  Tại chương trình Gala Tự hào Tuổi trẻ UIT 2024 - Tuyên dương
                  các danh hiệu cấp Trường "Cán bộ, viên chức, giảng viên trẻ
                  tiêu biểu", "Thanh niên tiên tiến làm theo lời Bác", "Sinh
                  viên 5 Tốt". Đoàn khoa MMT&TT xin được tự hào chúc mừng 𝟑𝟐
                  sinh viên đã xuất sắc đạt danh hiệu "Thanh niên tiên tiến làm
                  theo lời Bác" cấp Trường trong 𝟕 lĩnh vực. Đặc biệt, hai sinh
                  viên Phạm Thái Bảo và Nguyễn Thanh Bình đã xuất sắc đạt "Thanh
                  niên tiên tiến làm theo lời Bác tiêu biểu" cấp Trường trong
                  hai lĩnh vực "Học tập - Nghiên cứu Khoa học" và "Hoạt động
                  Tình nguyện".
                </div>
              </div>
              <div className={styles.Body_Container_Awards_Image}>
                <img
                  src="/Img/Homepage/Hotimage.png"
                  alt="Thành tích nổi bật"
                  className={styles.Body_Container_Awards_Image_Img}
                />
              </div>
            </div>
          </section>

          {/* Lower Section với Marquee Effect */}
          <section className={styles.Body_Container_Lower}>
            <div
              ref={lowerBandrollRef}
              className={`${styles.Body_Container_Lower_Bandroll} ${
                lowerBandrollVisible ? "animate-bandroll" : ""
              }`}
            >
              <div
                className={`${styles.Body_Container_Lower_Bandroll_Content} Body_Container_Lower_Bandroll_Content`}
              >
                <div
                  className={`${styles.Body_Container_Lower_Bandroll_Content_Marquee} Body_Container_Lower_Bandroll_Content_Marquee`}
                >
                  <span>ĐOÀN KẾT - TIÊN PHONG - TRÁCH NHIỆM - ĐỔI MỚI</span>
                  <span>ĐOÀN KẾT - TIÊN PHONG - TRÁCH NHIỆM - ĐỔI MỚI</span>
                </div>
              </div>
            </div>

            <div
              ref={imageGridRef}
              className={`${styles.Image_Grid_Container} ${
                imageGridVisible ? "animate-grid" : ""
              }`}
            >
              <img
                src="/Img/Homepage/banner1.png"
                alt="Top Banner"
                className={`${styles.Image_Top} animate-banner-1`}
              />
              <div className={styles.Image_Bottom_Row}>
                <img
                  src="/Img/Homepage/banner2.png"
                  alt="Bottom Left"
                  className={`${styles.Image_Bottom} animate-banner-2`}
                />
                <img
                  src="/Img/Homepage/banner3.png"
                  alt="Bottom Right"
                  className={`${styles.Image_Bottom} animate-banner-3`}
                />
              </div>
            </div>
          </section>

          <section
            ref={registerFormRef}
            className={`${styles.Body_Container_RegisterForm} ${
              registerFormVisible ? "animate-form" : ""
            }`}
          >
            <RegisterForm className={styles.Body_Container_RegisterForm_Form} />
          </section>
        </div>
        <Footer />
      </main>
    </div>
  );
}
