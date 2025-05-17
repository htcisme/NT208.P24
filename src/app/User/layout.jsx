import Headeruser from "@/components/Headeruser";

export const metadata = {
  title: "Đăng nhập/Đăng ký - SUCTREMMT",
  description: "Trang đăng nhập và đăng ký thành viên Đoàn khoa MMT&TT",
};

export default function UserLayout({ children }) {
  return (
    <>
      <Headeruser />
      {children}
    </>
  );
}
