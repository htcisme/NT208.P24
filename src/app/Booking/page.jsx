import Image from "next/image";
import styles from "./style.css";

export default function Booking() {
  return (
    <div className="booking">
      {/* Chữ "Đặt lịch" */}
      <div className="booking-header-title">ĐĂNG KÝ ĐẶT PHÒNG</div>

      {/* Hình ảnh đoàn khoa */}
      <div className="booking-body-cropbox">
        <Image
          className="booking-body-img"
          src="/Img/Booking/tapthedoankhoa.jpg"
          alt="the-the-doan-khoa"
          width={700}
          height={50}
        />
      </div>

      {/* Khung đặt lịch */}
      <iframe
        className="booking-body-frame"
        src="https://docs.google.com/forms/d/e/1FAIpQLSe9000S4USowSCYt3VytTDPzDCCr9wrz6EYhTADJ3jEdkWhIg/viewform?embedded=true"
        width="700"
        height="1369"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
      />
    </div>
  );
}
