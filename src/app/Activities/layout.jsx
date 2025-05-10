import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "Hoạt động",
  description: "Tạo bởi XangFuTing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header></Header>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
