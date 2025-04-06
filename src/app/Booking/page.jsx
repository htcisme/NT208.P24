import Image from "next/image";
import styles from "./style.css";

export default function Home() {
  return (
    <div className="booking">
      {/* Chữ "Đặt lịch" */}
      <div className="booking-header-title">ĐĂNG KÝ ĐẶT PHÒNG</div>

      {/* Hình ảnh đoàn khoa */}

      <Image
        className="booking-body-img"
        src="/Img/Booking/tapthedoankhoa.png"
        alt="the-the-doan-khoa"
        width={700}
        height={50}
      />
      {/* Khung đặt lịch */}
      <iframe
        className="booking-body-frame"
        src="https://docs.google.com/forms/d/e/1FAIpQLSe9000S4USowSCYt3VytTDPzDCCr9wrz6EYhTADJ3jEdkWhIg/viewform?embedded=true"
        width="700"
        height="1369"
        frameborder="0"
        marginheight="0"
        marginwidth="0"
      >
        Loading…
      </iframe>
    </div>
  );
}
