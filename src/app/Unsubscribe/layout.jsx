import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Trang hủy đăng ký nhận thông báo",
  description: "Tạo bởi XangFuTing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="body-component">{children}</div>
      </body>
    </html>
  );
}
