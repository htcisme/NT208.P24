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
<<<<<<< HEAD
        <Header></Header>
        {children}
        <Footer></Footer>
      </body>
=======
        {children}
      </body>

>>>>>>> 6141fd41829e5f0619e66833edbcec3a1a1e0854
    </html>
  );
}