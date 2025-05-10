"use client";
import React from "react";
import "@/styles-comp/style.css";
import Image from "next/image";
import logodoankhoa from "@/imgs-comp/logo-doan-khoa.png";
import logoDoanKhoaDark from "@/imgs-comp/logo-doan-khoa-dark.png";
import { useTheme } from "@/context/ThemeContext";

export default function Footer() {
  const { isDarkMode } = useTheme();
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-columns">
          <div className="footer-section">
            <div className="footer-title">
              <div className="footer-title-img-container">
                <Image
                  src={isDarkMode ? logoDoanKhoaDark : logodoankhoa}
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
            <p>
              <strong>Email: </strong>
              <a
                href="mailto:doanthanhnien@suctremmt.com"
                className="footer-link"
              >
                doanthanhnien@suctremmt.com
              </a>
            </p>
            <p>
              <strong>Facebook: </strong>
              <a
                href="https://www.facebook.com/uit.nc"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                Mạng máy tính và Truyền thông
              </a>
            </p>
            <p>Khu phố 6, Phường Linh Trung, Tp. Thủ Đức, Tp. Hồ Chí Minh</p>
          </div>
        </div>
        <hr className="footer-divider" />
        <p className="footer-rights">© NC.UIT ALL RIGHTS RESERVED</p>
      </div>
    </footer>
  );
}
