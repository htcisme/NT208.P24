import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Hoạt động",
  description: "Tạo bởi XangFuTing",
};

export default function Activities({ children }) {
  return (
    <html lang="en">
      <body>
        <Header></Header>
        {children}
      </body>
    </html>
  );
}
