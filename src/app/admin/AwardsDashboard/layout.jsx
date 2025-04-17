import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Quản trị Thành tích",
  description: "Tạo bởi XangFuTing",
};

export default function AwardsAdminDashboard({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
