import "@/styles-comp/style.css";
import Image from "next/image";

export default function RegisterForm() {
  return (
    <div className="registerform">
      <div className="registerform-header">
        <h1>HÃY TRỞ THÀNH NGƯỜI ĐẦU TIÊN!</h1>
        <p className="registerform-header-subtext">
          Đăng ký để nhận được những thông tin, cập nhật mới nhất <br />
          từ Đoàn khoa Mạng máy tính và Truyền thông nhé!
        </p>
      </div>
      <div className="registerform-footer-form">
        <label for="name">Họ và Tên</label>
        <input type="text" id="name" placeholder="Nhập tên" required />

        <label for="email">Email</label>
        <input type="email" id="email" placeholder="Nhập Email" required />

        <button type="submit">Submit</button>
      </div>
    </div>
  );
}
