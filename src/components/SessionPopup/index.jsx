"use client";

import { useSession } from "@/context/SessionContext";
import "@/styles-comp/style.css";

export default function SessionPopup() {
  const { sessionExpiring, timeLeft, resetSessionTimeout, handleLogout } =
    useSession();

  if (!sessionExpiring) return null;

  return (
    <div className="session-timeout-warning">
      <div className="session-timeout-content">
        <h3>Phiên làm việc sắp hết hạn</h3>
        <p>Phiên làm việc của bạn sẽ hết hạn trong {timeLeft} giây.</p>
        <p>Bạn có muốn tiếp tục?</p>
        <div className="session-timeout-actions">
          <button className="session-extend-btn" onClick={resetSessionTimeout}>
            Tiếp tục phiên làm việc
          </button>
          <button className="session-logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
