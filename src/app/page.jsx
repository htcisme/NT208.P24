import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Header />
      <div className={styles.overview}>
        <div className={styles.overview_background}>
          {/* Overview Header */}
          <header className={styles.overview_header}>
            <div className={styles.overview_header_logohead}>XANGFUTING</div>
            <div className={styles.overview_header_authButtons}>
              <div className={styles.overview_header_authButtons_signin}>
                <button>Đăng nhập</button>
              </div>
              <div className={styles.overview_header_authButtons_register}>
                <button>Đăng ký</button>
              </div>
            </div>
          </header>

          {/* Overview Body */}
          <div className={styles.overview_body}>
            <Image
              src="/Img/Homepage/Fulllogo.png"
              alt="Cum-logo-Doan-Khoa-MMTT"
              width={459}
              height={186}
              className={styles.overview_body_logo}
            />
            <h1 className={styles.overview_body_title}>
              TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN - ĐHQG-HCM
            </h1>
            <h2 className={styles.overview_body_subtitle}>
              ĐOÀN KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
