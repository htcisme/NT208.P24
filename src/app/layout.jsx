import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";
import SessionPopup from "@/components/SessionPopup";
import ChatPopup from "@/components/ChatPopup";
import { SessionProvider } from "@/context/SessionContext";

export const metadata = {
  title: "Trang chủ",
  description: "Tạo bởi XangFuTing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <SessionProvider>
            <SessionPopup />
            <ChatPopup /> {/* Thêm component ChatPopup */}
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
