import Image from "next/image";
import styles from "./page.module.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <h1>Trang chính</h1>
      <Footer />
    </div>
  );
}
