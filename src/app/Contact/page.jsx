import Image from "next/image";
import styles from "./style.css";

export default function Contact() {
  return (
    <div className="contact">
      <div className="contact-header-title">Thông tin liên hệ</div>
      <div className="contact-body-infomation">
        Đoàn khoa Mạng máy tính và truyền thông
        <span />
        Sảnh tầng
        <span />
        Facebook
        <span />
      </div>
      <div className="contact-body-img">
        <Image
          src="/Img/Contact/Logo.png"
          alt="logo"
          width={200}
          height={200}
        />
      </div>
      <div className="contact-footer-infomation"></div>
      <div className="contact-footer-form">
        <div className="contact-footer-header-form"></div>
        <div className="contact-footer-header-form-input"></div>
      </div>
    </div>
  );
}
