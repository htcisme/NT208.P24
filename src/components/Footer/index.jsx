"use client";
import React from "react";
import "@/styles-comp/style.css";
import Image from "next/image";
import logodoankhoa from "@/imgs-comp/logo-doan-khoa.png";
import logodoankhoadark from "@/imgs-comp/logo-doan-khoa-dark.png";

export default function Footer() {
  // Kiểm tra dark mode từ DOM thay vì context để tránh lỗi
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains('dark'));
    };

    // Kiểm tra ban đầu
    checkDarkMode();

    // Theo dõi thay đổi
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-columns">
          <div className="footer-section">
            <div className="footer-title">
              <div className="footer-title-img-container">
                <Image
                  key={isDarkMode ? "dark" : "light"}
                  src={isDarkMode ? logodoankhoadark : logodoankhoa}
                  alt="Logo Đoàn Khoa"
                  width={150}
                  height={50}
                  priority
                />
              </div>
              <div className="footer-title-text">
                ĐOÀN KHOA MẠNG MÁY TÍNH <br />
                VÀ TRUYỀN THÔNG
              </div>
            </div>
          </div>

          <div className="footer-section">
            <p>
              <strong>Thông tin liên hệ:</strong>
            </p>
            
            <div className="footer-contact-row">
              <div className="footer-contact-item">
                <strong>Email: </strong>
                <a
                  href="mailto:doanthanhnien@suctremmt.com"
                  className="footer-link"
                >
                  doanthanhnien@suctremmt.com
                </a>
              </div>
              
              <div className="footer-contact-item">
                <strong>Facebook: </strong>
                <a
                  href="https://www.facebook.com/uit.nc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  Mạng máy tính và Truyền thông
                </a>
              </div>
            </div>

            <p className="footer-address">
              Khu phố 6, Phường Linh Trung, Tp. Thủ Đức, Tp. Hồ Chí Minh
            </p>
          </div>
        </div>
        <hr className="footer-divider" />
        <p className="footer-rights">© NC.UIT ALL RIGHTS RESERVED</p>
      </div>
    </footer>
  );
}