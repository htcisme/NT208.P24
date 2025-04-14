import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Trang chủ",
  description: "Tạo bởi XangFuTing",
};

export default function Home({ children }) {
  return (
    <html lang="en">
      <body>
        <Header></Header>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
