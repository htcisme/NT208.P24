"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./style.css";
import RegisterForm from "@/components/RegisterForm";

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
        rootMargin: '50px 0px -50px 0px' // Trigger sớm hơn một chút
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

export default function Contact() {
  // Scroll reveal refs cho tất cả sections
  const [titleRef, titleVisible] = useScrollReveal(0.1);
  const [headerInfoRef, headerInfoVisible] = useScrollReveal(0.2);
  const [addressRef, addressVisible] = useScrollReveal(0.2);
  const [socialRef, socialVisible] = useScrollReveal(0.2);
  const [imageRef, imageVisible] = useScrollReveal(0.2);
  const [formRef, formVisible] = useScrollReveal(0.2);

  return (
    <>
      <Header />
      <div className="contact">
        {/* Tiêu đề với scroll reveal */}
        <div 
          ref={titleRef}
          className={`contact-header-title ${titleVisible ? 'animate-title' : ''}`}
        >
          Thông tin liên hệ
        </div>

        <div className="contact-body-information">
          {/* Header information với scroll reveal */}
          <div 
            ref={headerInfoRef}
            className={`contact-body-header-information ${headerInfoVisible ? 'animate-fade-in' : ''}`}
          >
            <p>Đoàn khoa Mạng Máy tính và Truyền thông</p>
          </div>

          {/* Address information với scroll reveal */}
          <div 
            ref={addressRef}
            className={`contact-body-address-information ${addressVisible ? 'animate-slide-in-left' : ''}`}
          >
            <p>
              Sảnh Tầng 8, Tòa nhà E, Trường Đại học Công nghệ Thông tin - ĐHQG -
              HCM
              <br /> Khu phố 6, phường Linh Trung, quận Thủ Đức, TP. Hồ Chí Minh
            </p>
          </div>

          {/* Social media information với scroll reveal */}
          <div 
            ref={socialRef}
            className={`contact-body-facemail-information ${socialVisible ? 'animate-slide-in-right' : ''}`}
          >
            <p className="font-bold">
              Facebook:{" "}
              <a className="font-light" href="https://www.facebook.com/uit.nc">
                facebook.com/uit.nc
              </a>
            </p>

            <p className="font-bold">
              Email: <a className="font-light">doanthanhnien@suctremmt.com</a>
            </p>
          </div>
        </div>

        {/* Image với scroll reveal */}
        <div 
          ref={imageRef}
          className={`contact-body-img ${imageVisible ? 'animate-scale-up' : ''}`}
        >
          <Image
            src="/Img/Contact/anhdaihoi.png"
            alt="dai-hoi-doan-khoa"
            width={1126}
            height={659}
          />
        </div>

        {/* Register form với scroll reveal */}
        <section 
          ref={formRef}
          className={`Body_Container_RegisterForm ${formVisible ? 'animate-fade-in' : ''}`}
        >
          <RegisterForm className="Body_Container_RegisterForm_Form" />
        </section>
      </div>
    </>
  );
}