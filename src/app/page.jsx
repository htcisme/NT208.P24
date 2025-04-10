"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

const images = [
  "/Img/Homepage/BCH1.png",
  "/Img/Homepage/BCH2.png",
  "/Img/Homepage/BCH3.png",
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

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
    <div className={styles.Container}>
      <header className={styles.Header}>
        <div className={styles.Header_Logo}>XANGFUTING</div>
        <div className={styles.Header_Nav}>
          <button className={styles.Header_Nav_NavButton}>Đăng nhập</button>
          <button className={styles.Header_Nav_NavButton}>Đăng ký</button>
          <div className={styles.Header_Nav_MenuWrapper}>
            <button
              className={styles.Header_Nav_MenuWrapper_MenuButton}
              onClick={() => {
                const menu = document.getElementById("dropdownMenu");
                if (menu) {
                  menu.classList.toggle(
                    styles.Header_Nav_MenuWrapper_MenuButton_ShowMenu
                  );
                }
              }}
            >
              ☰
            </button>
            <div
              className={styles.Header_Nav_MenuWrapper_DropdownMenu}
              id="dropdownMenu"
            >
              <a href="Introduction">Giới thiệu</a>
              <a href="Activities">Hoạt động</a>
              <a href="Awards">Thành tích</a>
              <a href="Booking">Đặt phòng</a>
              <a href="Contact">Liên hệ</a>
            </div>
          </div>
          <div className={styles.Header_Topbar_Authsearch}>
            <div className={styles.Header_Topbar_Authsearch_Searchbox}>
              <input type="text" placeholder="Tìm kiếm..." />
              <span
                className={styles.Header_Topbar_Authsearch_Searchbox_Searchicon}
              >
                <svg
                  class={
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
                    stroke-linecap="round"
                    stroke-width="2"
                    d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </span>
            </div>
          </div>
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
              width={800}
              height={800}
              className={styles.logo}
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
            <h2 className={styles.Body_Container_Introduction_Title}>
              GIỚI THIỆU
            </h2>
            <div className={styles.Body_Container_Introduction_ContentWrapper}>
              <div
                className={
                  styles.Body_Container_Introduction_ContentWrapper_ImageContainer
                }
              >
                <Image
                  src={images[currentIndex]}
                  alt={`Giới thiệu ${currentIndex + 1}`}
                  width={900}
                  height={600}
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
                <p
                  className={
                    styles.Body_Container_Introduction_ContentWrapper_TextContainer_Description
                  }
                >
                  Liên chi Đoàn khoa MMT&TT nay là Đoàn khoa MMT&TT không ngừng
                  lớn mạnh về số lượng, nâng cao về chất lượng cán bộ Đoàn cơ sở
                  để xứng đáng với vai trò là người bạn đồng hành cùng Đoàn viên
                  – thanh niên khoa MMT&TT.
                </p>
                <p
                  className={
                    styles.Body_Container_Introduction_ContentWrapper_TextContainer_Description
                  }
                >
                  Trong những năm qua, Đoàn TNCS Hồ Chí Minh khoa MMT&TT (Liên
                  chi Đoàn) luôn là đơn vị đi đầu trong công tác Đoàn và Phong
                  trào Thanh niên tại trường ĐH CNTT.
                </p>
                <p
                  className={
                    styles.Body_Container_Introduction_ContentWrapper_TextContainer_ReadMore
                  }
                >
                  Xem thêm ...
                </p>
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
                  Ban Truyền thông <br /> & Sự kiện
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
          <div className={styles.Body_Container_Activities}>
            <h2 className={styles.Activities_RecentLabel}>HOẠT ĐỘNG GẦN ĐÂY</h2>
            <div className={styles.Activities_RecentCards}>
              <div className={styles.Activities_RecentCard}>
                <img
                  src="/Img/Homepage/card1.png"
                  alt="AWS Cloud Training"
                  className={styles.Activities_RecentCard_Image}
                />
                <div className={styles.Activities_RecentCard_Content}>
                  <h3 className={styles.Activities_RecentCard_Title}>
                    Hoạt động học thuật
                  </h3>
                  <p className={styles.Activities_RecentCard_Desc}>
                    Khoa Mạng máy tính và Truyền thông | AWS CLOUD TRAINING
                  </p>
                  <p className={styles.Activities_RecentCard_Date}>
                    Ngày 13 tháng 01 năm 2025
                  </p>
                </div>
              </div>
              <div className={styles.Activities_RecentCard}>
                <img
                  src="/Img/Homepage/card1.png"
                  alt="AI Workshop"
                  className={styles.Activities_RecentCard_Image}
                />
                <div className={styles.Activities_RecentCard_Content}>
                  <h3 className={styles.Activities_RecentCard_Title}>
                    Workshop AI
                  </h3>
                  <p className={styles.Activities_RecentCard_Desc}>
                    CLB Kỹ thuật số tổ chức | AI ỨNG DỤNG
                  </p>
                  <p className={styles.Activities_RecentCard_Date}>
                    Ngày 25 tháng 02 năm 2025
                  </p>
                </div>
              </div>
              <div className={styles.Activities_RecentCard}>
                <img
                  src="/Img/Homepage/card1.png"
                  alt="Cuộc thi lập trình"
                  className={styles.Activities_RecentCard_Image}
                />
                <div className={styles.Activities_RecentCard_Content}>
                  <h3 className={styles.Activities_RecentCard_Title}>
                    Cuộc thi lập trình
                  </h3>
                  <p className={styles.Activities_RecentCard_Desc}>
                    Khoa CNTT tổ chức | CTF CHALLENGE
                  </p>
                  <p className={styles.Activities_RecentCard_Date}>
                    Ngày 10 tháng 03 năm 2025
                  </p>
                </div>
              </div>
              <div className={styles.Activities_RecentCard}>
                <img
                  src="/Img/Homepage/card1.png"
                  alt="Seminar Blockchain"
                  className={styles.Activities_RecentCard_Image}
                />
                <div className={styles.Activities_RecentCard_Content}>
                  <h3 className={styles.Activities_RecentCard_Title}>
                    Seminar Blockchain
                  </h3>
                  <p className={styles.Activities_RecentCard_Desc}>
                    Khoa Mạng máy tính | CẬP NHẬT XU HƯỚNG BLOCKCHAIN
                  </p>
                  <p className={styles.Activities_RecentCard_Date}>
                    Ngày 18 tháng 03 năm 2025
                  </p>
                </div>
              </div>
            </div>
            <p className={styles.Activities_ViewMore}>Xem thêm ...</p>
          </div>
        </div>
        <Footer />
      </section>
    </div>
  );
}
