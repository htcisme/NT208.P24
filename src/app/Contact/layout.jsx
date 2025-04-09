import Footer from "@/components/Footer";
import Header from "@/components/Header";
import styles from "./style.css";

export const metadata = {
  title: "Liên hệ",
  description: "Tạo bởi XangFuTing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header className="header-component"></Header>
        <div className="body-component">
          {children}
          <Footer></Footer>
        </div>
      </body>
    </html>
  );
}
