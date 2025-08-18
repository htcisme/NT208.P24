import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";
import SessionPopup from "@/components/SessionPopup";
import ChatPopup from "@/components/ChatPopup";
import { SessionProvider } from "@/context/SessionContext";
import Header from "@/components/Header";

export const metadata = {
  title: "Trang chủ",
  description: "Tạo bởi XangFuTing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header></Header>
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
