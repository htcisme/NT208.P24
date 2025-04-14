import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Thông tin hoạt động",
  description: "Tạo bởi XangFuTing",
};

export default function ActivitiesOverview({ children }) {
  return (
    <html lang="en">
      <body>
        <Header></Header>
        {children}
      </body>
    </html>
  );
}
