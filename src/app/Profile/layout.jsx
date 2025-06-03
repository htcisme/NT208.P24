import Footer from "@/components/Footer";
import Header from "@/components/Header";
import styles from "./style.css";

export const metadata = {
  title: "Trang cá nhân",
  description: "Tạo bởi XangFuTing",
};
// Test
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header className="header-component"></Header>
        <div className="body-component">{children}</div>
        <Footer></Footer>
      </body>
    </html>
  );
}
