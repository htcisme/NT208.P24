import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Trang chủ",
  description: "Tạo bởi XangFuTing",
};

export default function Home({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
