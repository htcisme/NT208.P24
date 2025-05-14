"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const images = [
  "/Img/Homepage/BCH1.png",
  "/Img/Homepage/BCH2.png",
  "/Img/Homepage/BCH3.png",
];

export default function Home() {
  const [user, setUser] = useState(null);
  // Danh sách 5 sự kiện với tiêu đề
  const events = [
    { title: "VNU TOUR 2024", image: "/Img/Homepage/Slider1.png" },
    { title: "NGỌN ĐUỐC XANH 2025", image: "/Img/Homepage/Slider3.png" },
    { title: "NETSEC DAY 2024", image: "/Img/Homepage/Slider2.png" },
    { title: "EVENT 4 2024", image: "/Img/Homepage/BCH1.png" },
    { title: "EVENT 5 2024", image: "/Img/Homepage/BCH2.png" },
  ];

  // State quản lý
  const [startIndex, setStartIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const handleLogout = () => {
    // Xóa từ localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Xóa cookie token
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Cập nhật state
    setUser(null);
    setShowUserMenu(false);

    // Tải lại trang để cập nhật giao diện
    window.location.reload();
  };
  // Hàm xử lý bấm mũi tên trái
  const handlePrev = () => {
    setStartIndex(
      (prevIndex) => (prevIndex - 1 + events.length) % events.length
    );
  };

  // Hàm xử lý bấm mũi tên phải
  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  // Toggle menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Lấy 3 sự kiện kế tiếp từ startIndex, lặp lại nếu vượt quá độ dài
  const visibleEvents = Array.from(
    { length: 3 },
    (_, i) => events[(startIndex + i) % events.length]
  );

  const items = [
    {
      date: "20.01.2025",
      text: 'Đoàn khoa Mạng máy tính và Truyền thông đã sẵn sàng mang đến chuỗi truyền thống TẬN"TỴ"ĐÓN TẾT vô cùng hấp dẫn, đầy ý nghĩa để cùng các bạn tận hưởng một cái Tết Nguyên đán trọn vẹn nhất!!',
    },
    {
      date: "20.01.2025",
      text: 'Đoàn khoa Mạng máy tính và Truyền thông đã sẵn sàng mang đến chuỗi truyền thống TẬN"TỴ"ĐÓN TẾT vô cùng hấp dẫn, đầy ý nghĩa để cùng các bạn tận hưởng một cái Tết Nguyên đán trọn vẹn nhất!!',
    },
    {
      date: "20.01.2025",
      text: 'Đoàn khoa Mạng máy tính và Truyền thông đã sẵn sàng mang đến chuỗi truyền thống TẬN"TỴ"ĐÓN TẾT vô cùng hấp dẫn, đầy ý nghĩa để cùng các bạn tận hưởng một cái Tết Nguyên đán trọn vẹn nhất!!',
    },
    {
      date: "20.01.2025",
      text: 'Đoàn khoa Mạng máy tính và Truyền thông đã sẵn sàng mang đến chuỗi truyền thống TẬN"TỴ"ĐÓN TẾT vô cùng hấp dẫn, đầy ý nghĩa để cùng các bạn tận hưởng một cái Tết Nguyên đán trọn vẹn nhất!!',
    },
  ];

  // Thêm vào đầu component Home.jsx
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Thêm useEffect để kiểm tra dark mode từ localStorage khi trang tải
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

    // Kiểm tra đăng nhập
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  }, []);

  // Thêm hàm toggleDarkMode
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

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  // Hàm tìm kiếm
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
        `/api/activities/search?q=${encodeURIComponent(searchTerm.trim())}`
      );
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Khi thay đổi input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (!e.target.value.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Khi click vào kết quả
  const handleResultClick = (id) => {
    setShowSearchResults(false);
    setSearchTerm("");
    window.location.href = `/Activities/${id}`;
  };

  useEffect(() => {
    async function fetchRecentActivities() {
      setLoadingRecent(true);
      try {
        const res = await fetch(
          "/api/activities?page=1&limit=4&status=published"
        );
        const data = await res.json();
        if (data.success) {
          setRecentActivities(data.data);
        } else {
          setRecentActivities([]);
        }
      } catch (err) {
        setRecentActivities([]);
      } finally {
        setLoadingRecent(false);
      }
    }
    fetchRecentActivities();
  }, []);

  return (
    <div className={styles.Container}>
      <header className={styles.Header}>
        <div className={styles.Header_Logo}>
          <Link href="/">SUCTREMMT</Link>
        </div>
        <div className={styles.Header_Nav}>
          <div className={styles.Header_Nav_MenuWrapper}>
            <button
              className={styles.Header_Nav_AuthButton}
              onClick={toggleUserMenu}
            >
              {user ? `Xin chào, ${user.name}` : "Tài khoản"}
              <span className={styles.Header_Nav_AuthButton_Arrow}>▼</span>
            </button>
            {showUserMenu && (
              <div className={styles.Header_Nav_AuthMenu} ref={userMenuRef}>
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

          <div className={styles.Header_Nav_SearchWrapper} ref={searchRef}>
            <form
              onSubmit={handleSearch}
              className={styles.Header_Topbar_Authsearch_Searchbox}
            >
              <input
                type="text"
                placeholder="Tìm kiếm hoạt động"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm.trim() && setShowSearchResults(true)}
              />
              <button
                type="submit"
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
                          onClick={() => handleResultClick(result._id)}
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

          <div className={styles.Header_Nav_MenuWrapper}>
            <button
              className={styles.Header_Nav_MenuWrapper_MenuButton}
              onClick={toggleMenu}
              aria-expanded={showMenu}
            >
              ☰
            </button>
            <div
              className={`${styles.Header_Nav_MenuWrapper_DropdownMenu} ${
                showMenu
                  ? styles.Header_Nav_MenuWrapper_MenuButton_ShowMenu
                  : ""
              }`}
            >
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

          <button
            className={styles.Header_Nav_DarkModeToggle}
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
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
        </div>
      </header>

      <section className={styles.hero}>
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

      <section className={styles.Body}>
        <div className={styles.Body_Container}>
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
            <a href="/Introduction">
              <h2 className={styles.Body_Container_Introduction_Title}>
                GIỚI THIỆU
              </h2>
            </a>
            <div className={styles.Body_Container_Introduction_ContentWrapper}>
              <div
                className={
                  styles.Body_Container_Introduction_ContentWrapper_ImageContainer
                }
              >
                <Image
                  src={images[currentIndex]}
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
                  {images.map((_, index) => (
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
                className={
                  styles.Body_Container_Introduction_ContentWrapper_TextContainer
                }
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

            <div className={styles.Body_Container_MemberWrap}>
              <div className={styles.Body_Container_MemberItem}>
                <img
                  src="/Img/Homepage/TTSK_Img.png"
                  alt="Ban Truyền thông & Sự kiện"
                  className={styles.Body_Container_MemberImage}
                />
                <p className={styles.Body_Container_MemberLabel}>
                  Ban Truyền thông & Sự kiện
                </p>
              </div>
              <div className={styles.Body_Container_MemberItem}>
                <img
                  src="/Img/Homepage/BTK_Img.png"
                  alt="Ban Thiết kế"
                  className={styles.Body_Container_MemberImage}
                />
                <p className={styles.Body_Container_MemberLabel}>
                  Ban Thiết kế
                </p>
              </div>
              <div className={styles.Body_Container_MemberItem}>
                <img
                  src="/Img/Homepage/BHT_Img.png"
                  alt="Ban Học tập"
                  className={styles.Body_Container_MemberImage}
                />
                <p className={styles.Body_Container_MemberLabel}>Ban Học tập</p>
              </div>
            </div>
          </section>

          <section className={styles.Body_Container_Activities}>
            <a href="/Activities">
              <h2 className={styles.Activities_RecentLabel}>
                HOẠT ĐỘNG GẦN ĐÂY
              </h2>
            </a>
            <div className={styles.Activities_RecentCards}>
              {loadingRecent ? (
                <div>Đang tải hoạt động...</div>
              ) : recentActivities.length === 0 ? (
                <div>Không có hoạt động gần đây.</div>
              ) : (
                recentActivities.map((activity) => (
                  <a
                    key={activity._id}
                    href={`/Activities/${activity._id}`}
                    className={styles.Activities_RecentCard}
                  >
                    <div className={styles.Activities_RecentCard_Container}>
                      <img
                        src={activity.image || "/Img/Homepage/card1.png"}
                        alt={activity.title}
                        className={styles.Activities_RecentCard_Image}
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
                          ? `Ngày ${new Date(
                              activity.createdAt
                            ).toLocaleDateString("vi-VN")}`
                          : ""}
                      </p>
                    </div>
                  </a>
                ))
              )}
            </div>
            <Link
              href="/ActivitiesOverview"
              className={styles.Activities_ViewMore}
            >
              Xem thêm ...
            </Link>

            <div className={styles.Activities_Focus}>
              <div className={styles.Activities_Focus_Shape01}></div>
              <div className={styles.Activities_Focus_ContentWrapper}>
                <div className={styles.Activities_Focus_ImageContainer}>
                  <img
                    src="/Img/Homepage/Hotimage.png"
                    alt="Tiêu điểm hoạt động"
                    className={styles.Activities_Focus_Image}
                  />
                  <div className={styles.Activities_Focus_Shape02}></div>
                </div>
                <div className={styles.Activities_Focus_Content}>
                  <div className={styles.Activities_Focus_Content_Title}>
                    TIÊU ĐIỂM
                  </div>
                  <div className={styles.Activities_Focus_Content_Timeline}>
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className={styles.Activities_Focus_Content_TimelineItem}
                      >
                        <div
                          className={
                            styles.Activities_Focus_Content_TimelineItem_Circle
                          }
                        ></div>
                        <div
                          className={
                            styles.Activities_Focus_Content_TimelineItem_Content
                          }
                        >
                          <div
                            className={
                              styles.Activities_Focus_Content_TimelineItem_Date
                            }
                          >
                            {item.date}
                          </div>
                          <div
                            className={
                              styles.Activities_Focus_Content_TimelineItem_Text
                            }
                          >
                            {item.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.Body_Container_Hightlight}>
            <div className={styles.Body_Container_Hightlight_Title}>
              HOẠT ĐỘNG NỔI BẬT
            </div>
            <div className={styles.Body_Container_Hightlight_Shape}></div>
            {/* Slider hoạt động */}
            <section className={styles.light_slider_container}>
              <button
                className={styles.light_slider_arrow}
                onClick={handlePrev}
              >
                ←
              </button>
              {visibleEvents.map((event, index) => (
                <div className={styles.light_slider_item} key={index}>
                  <div
                    className={`${styles.slider_image_placeholder} ${
                      index === 1 ? styles.slider_image_placeholder_active : ""
                    }`}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className={styles.slider_image}
                    />
                  </div>
                  <h4>{event.title}</h4>
                </div>
              ))}
              <button
                className={styles.light_slider_arrow}
                onClick={handleNext}
              >
                →
              </button>
            </section>
            {/* Dots điều hướng */}
            <div className={styles.light_slider_dots}>
              {events.map((_, index) => (
                <span
                  key={index}
                  className={`${styles.light_slider_dot} ${
                    startIndex === index ? styles.light_slider_dot_active : ""
                  }`}
                  onClick={() => setStartIndex(index)}
                ></span>
              ))}
            </div>
          </section>

          <section className={styles.Body_Container_Awards}>
            <div className={styles.Body_Container_Awards_Title}>
              THÀNH TÍCH NỔI BẬT
            </div>
            <div className={styles.Body_Container_Awards_Shape01}></div>
            <div className={styles.Body_Container_Awards_Shape02}></div>
            <div className={styles.Body_Container_Awards_ContentWrapper}>
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

          <section className={styles.Body_Container_Lower}>
            <div className={styles.Body_Container_Lower_Bandroll}>
              <div className={styles.Body_Container_Lower_Bandroll_Content}>
                ĐOÀN KẾT - TIÊN PHONG - TRÁCH NHIỆM - ĐỔI MỚI
              </div>
            </div>
            <div className={styles.Image_Grid_Container}>
              <img
                src="/images/top-image.jpg"
                alt="Top Banner"
                className={styles.Image_Top}
              />
              <div className={styles.Image_Bottom_Row}>
                <img
                  src="/images/bottom-left.jpg"
                  alt="Bottom Left"
                  className={styles.Image_Bottom}
                />
                <img
                  src="/images/bottom-right.jpg"
                  alt="Bottom Right"
                  className={styles.Image_Bottom}
                />
              </div>
            </div>
          </section>

          <section className={styles.Body_Container_RegisterForm}>
            <RegisterForm className={styles.Body_Container_RegisterForm_Form} />
          </section>
        </div>
        <Footer />
      </section>
    </div>
  );
}
