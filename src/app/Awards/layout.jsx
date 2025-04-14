import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Thành tích",
  description: "Tạo bởi XangFuTing",
};

export default function Awards({ children }) {
  return (
    <html lang="en">
      <body>
        <Header></Header>
        {children}
      </body>
    </html>
  );
}
