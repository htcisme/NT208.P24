import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Bài viết hoạt động",
  description: "Tạo bởi XangFuTing",
};

export default function RootLayout({ children }) {
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
