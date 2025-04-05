import "@/styles-comp/style.css";
import Image from "next/image";

export default function Header() {
  return (
    <div className="Header">
      <div className="Header-Topbar">
        <div className="Header-Topbar-Logogroup">
          <Image
            src="/Img/Homepage/Fulllogolight.png"
            alt="Cum-logo-Doan-khoa"
            width={250}
            height={250}
          />
        </div>

        <div className="Header-Topbar-Titlegroup">
          <div className="Header-Topbar-Titlegroup-Uniname">
            TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN - ĐHQG-HCM
          </div>
          <div className="Header-Topbar-Titlegroup-Deptname">
            ĐOÀN KHOA MẠNG MÁY TÍNH VÀ TRUYỀN THÔNG
          </div>
        </div>

        <div className="Header-Topbar-Authsearch">
          <div className="Header-Topbar-Authsearch-Searchbox">
            <input type="text" placeholder="Tìm kiếm..." />
            <span className="Header-Topbar-Authsearch-Searchbox-Searchicon">
              <svg
                class="Header-Topbar-Authsearch-Searchbox-Searchicon-Icon"
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
          <div className="Header-Topbar-Authsearch-Authlinks">
            <span className="Header-Topbar-Authsearch-Authlinks-Item">
              Đăng ký
            </span>
            <span>|</span>
            <span className="Header-Topbar-Authsearch-Authlinks-Item">
              Đăng nhập
            </span>
          </div>
        </div>
      </div>

      <div className="Header-Navbar">
        <div className="Header-Navbar-Navitem">TRANG CHỦ</div>
        <div className="Header-Navbar-Navitem">GIỚI THIỆU</div>
        <div className="Header-Navbar-Navitem">HOẠT ĐỘNG</div>
        <div className="Header-Navbar-Navitem">THÀNH TÍCH</div>
        <div className="Header-Navbar-Navitem">ĐẶT PHÒNG</div>
        <div className="Header-Navbar-Navitem">LIÊN HỆ</div>
      </div>
    </div>
  );
}
