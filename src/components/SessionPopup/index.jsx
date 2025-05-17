"use client";

import { useSession } from "@/context/SessionContext";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import "@/styles-comp/style.css";

export default function SessionPopup() {
  const { sessionExpiring, timeLeft, resetSessionTimeout, handleLogout, user } =
    useSession();
  const pathname = usePathname();
  const popupRef = useRef(null);

  // Tự động đóng popup sau 30 giây
  useEffect(() => {
    let autoCloseTimer;

    // Khi sessionExpiring trở thành true, set timer để tự động đóng
    if (sessionExpiring) {
      autoCloseTimer = setTimeout(() => {
        handleLogout(); // Sử dụng handleLogout thay vì resetSessionTimeout khi hết thời gian
      }, 30000); // 30 giây
    }

    // Cleanup timer khi component unmount hoặc sessionExpiring thay đổi
    return () => {
      if (autoCloseTimer) clearTimeout(autoCloseTimer);
    };
  }, [sessionExpiring, handleLogout]);

  // Không hiển thị popup nếu không có user hoặc đang ở trang User
  if (!user || !sessionExpiring || pathname.includes("/User")) return null;

  return (
    <div className="session-timeout-warning" ref={popupRef}>
      <div className="session-timeout-content">
        <h3>Phiên làm việc sắp hết hạn</h3>
        <p>Phiên làm việc của bạn sẽ hết hạn trong {timeLeft} giây.</p>
        <p>Bạn có muốn tiếp tục?</p>
        <div className="session-timeout-actions">
          <button className="session-extend-btn" onClick={resetSessionTimeout}>
            Tiếp tục phiên làm việc
          </button>
          <button
            className="session-logout-btn"
            onClick={() => {
              // Ẩn popup trước khi đăng xuất
              if (popupRef.current) {
                popupRef.current.style.display = "none";
              }
              setTimeout(() => handleLogout(), 100);
            }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
