"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./style.css";
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
          observer.unobserve(entry.target);
        }
      },
      {
        threshold,
        rootMargin: "50px 0px -50px 0px",
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
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await fetch("/api/contact");
        if (!response.ok) {
          throw new Error("Không thể tải thông tin liên hệ");
        }
        const data = await response.json();
        setContactInfo(data.contact);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const [titleRef, titleVisible] = useScrollReveal(0.1);
  const [headerInfoRef, headerInfoVisible] = useScrollReveal(0.2);
  const [addressRef, addressVisible] = useScrollReveal(0.2);
  const [socialRef, socialVisible] = useScrollReveal(0.2);
  const [mapRef, mapVisible] = useScrollReveal(0.2);
  const [imageRef, imageVisible] = useScrollReveal(0.2);
  const [formRef, formVisible] = useScrollReveal(0.2);

  // Hàm định dạng địa chỉ có nhiều dòng
  const formatAddress = (address) => {
    if (!address) return null;
    return address.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="contact-loading">
          <div className="spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="contact-error">
          <p>{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="contact">
        <div
          ref={titleRef}
          className={`contact-header-title ${
            titleVisible ? "animate-title" : ""
          }`}
        >
          Thông tin liên hệ
        </div>

        <div className="contact-body-information">
          <div
            ref={headerInfoRef}
            className={`contact-body-header-information ${
              headerInfoVisible ? "animate-fade-in" : ""
            }`}
          >
            <p>Đoàn khoa Mạng Máy tính và Truyền thông</p>
          </div>

          <div
            ref={addressRef}
            className={`contact-body-address-information ${
              addressVisible ? "animate-slide-in-left" : ""
            }`}
          >
            <a
              href={contactInfo.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Xem trên Google Maps"
              className="address-link"
            >
              <p>{formatAddress(contactInfo.address)}</p>
            </a>
          </div>

          <div
            ref={socialRef}
            className={`contact-body-facemail-information ${
              socialVisible ? "animate-slide-in-right" : ""
            }`}
          >
            <p className="font-bold">
              Facebook:{" "}
              <a
                className="font-light"
                href={contactInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {contactInfo.facebookUrl?.replace("https://www.", "")}
              </a>
            </p>
            <p className="font-bold">
              Email:{" "}
              <a className="font-light" href={`mailto:${contactInfo.email}`}>
                {contactInfo.email}
              </a>
            </p>
            {contactInfo.phone && (
              <p className="font-bold">
                Điện thoại:{" "}
                <a className="font-light" href={`tel:${contactInfo.phone}`}>
                  {contactInfo.phone}
                </a>
              </p>
            )}
          </div>
        </div>

        <div
          ref={imageRef}
          className={`contact-body-img ${
            imageVisible ? "animate-scale-up" : ""
          }`}
        >
          <Image
            src="/Img/Contact/anhdaihoi.png"
            alt="dai-hoi-doan-khoa"
            width={1126}
            height={659}
          />
        </div>

        <section
          ref={formRef}
          className={`Body_Container_RegisterForm ${
            formVisible ? "animate-fade-in" : ""
          }`}
        >
          <RegisterForm className="Body_Container_RegisterForm_Form" />
        </section>
      </div>
      <Footer />
    </>
  );
}
