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
  // Danh sách 5 sự kiện với tiêu đề (có thể thêm hình ảnh sau)
  const events = [
    { title: "VNU TOUR 2024", image: "/Img/Homepage/Slider1.png" },
    { title: "NGỌN ĐUỐC XANH 2025", image: "/Img/Homepage/Slider3.png" },
    { title: "NETSEC DAY 2024", image: "/Img/Homepage/Slider2.png" },
    { title: "EVENT 4 2024", image: "/Img/Homepage/BCH1.png" },
    { title: "EVENT 5 2024", image: "/Img/Homepage/BCH2.png" },
  ];

  // Trạng thái để quản lý vị trí bắt đầu của slider
  const [startIndex, setStartIndex] = useState(0);

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

  // Lấy 3 sự kiện kế tiếp từ startIndex, lặp lại nếu vượt quá độ dài
  const visibleEvents = Array.from(
    { length: 3 },
    (_, i) => events[(startIndex + i) % events.length]
  );

  const items = [
    {
      date: "20.01.2025",
      text: "Đoàn khoa Mạng máy tính và Truyền thông đã sẵn sàng mang đến chuỗi truyền thống TẬN “TỴ” ĐÓN TẾT vô cùng hấp dẫn, đầy ý nghĩa để cùng các bạn tận hưởng một cái Tết Nguyên đán trọn vẹn nhất!!",
    },
    {
      date: "20.01.2025",
      text: "Đoàn khoa Mạng máy tính và Truyền thông đã sẵn sàng mang đến chuỗi truyền thống TẬN “TỴ” ĐÓN TẾT vô cùng hấp dẫn, đầy ý nghĩa để cùng các bạn tận hưởng một cái Tết Nguyên đán trọn vẹn nhất!!",
    },
    {
      date: "20.01.2025",
      text: "Đoàn khoa Mạng máy tính và Truyền thông đã sẵn sàng mang đến chuỗi truyền thống TẬN “TỴ” ĐÓN TẾT vô cùng hấp dẫn, đầy ý nghĩa để cùng các bạn tận hưởng một cái Tết Nguyên đán trọn vẹn nhất!!",
    },
    {
      date: "20.01.2025",
      text: "Đoàn khoa Mạng máy tính và Truyền thông đã sẵn sàng mang đến chuỗi truyền thống TẬN “TỴ” ĐÓN TẾT vô cùng hấp dẫn, đầy ý nghĩa để cùng các bạn tận hưởng một cái Tết Nguyên đán trọn vẹn nhất!!",
    },
  ];
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
              width={400}
              height={400}
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
                <a
                  href="/Introduction"
                  className={
                    styles.Body_Container_Introduction_ContentWrapper_TextContainer_ReadMore
                  }
                >
                  Xem thêm ...
                </a>
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
            <a href="/Activities" className={styles.Activities_ViewMore}>
              Xem thêm ...
            </a>
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
                  các danh hiệu cấp Trường “Cán bộ, viên chức, giảng viên trẻ
                  tiêu biểu”, “Thanh niên tiên tiến làm theo lời Bác”, “Sinh
                  viên 5 Tốt”. Đoàn khoa MMT&TT xin được tự hào chúc mừng 𝟑𝟐
                  sinh viên đã xuất sắc đạt danh hiệu “Thanh niên tiên tiến làm
                  theo lời Bác” cấp Trường trong 𝟕 lĩnh vực. Đặc biệt, hai sinh
                  viên Phạm Thái Bảo và Nguyễn Thanh Bình đã xuất sắc đạt “Thanh
                  niên tiên tiến làm theo lời Bác tiêu biểu” cấp Trường trong
                  hai lĩnh vực “Học tập - Nghiên cứu Khoa học” và “Hoạt động
                  Tình nguyện”.
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
        </div>
        <Footer />
      </section>
    </div>
  );
}
