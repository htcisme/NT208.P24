import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";
import SessionPopup from "@/components/SessionPopup";
import { SessionProvider } from "@/context/SessionContext"; // Thêm import này

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
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
