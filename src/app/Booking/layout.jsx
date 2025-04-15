import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Đặt phòng",
  description: "Tạo bởi XangFuTing",
};

export default function BookingLayout({ children }) {
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
