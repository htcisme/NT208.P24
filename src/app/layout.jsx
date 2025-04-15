import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Đoàn khoa Mạng máy tính và Truyền thông",
  description: "NC-UIT",

};

export default function Home({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
