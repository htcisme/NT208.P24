import Image from "next/image";
import styles from "./style.css";
import RegisterForm from "@/components/RegisterForm";
export default function Contact() {
  return (
    <div className="contact">
      <div className="contact-header-title">Thông tin liên hệ</div>
      <div className="contact-body-information">
        <div className="contact-body-header-information">
          <p>Đoàn khoa Mạng Máy tính và Truyền thông</p>
        </div>
        <div className="contact-body-address-information">
          <p>
            Sảnh Tầng 8, Tòa nhà E, Trường Đại học Công nghệ Thông tin - ĐHQG -
            HCM
            <br /> Khu phố 6, phường Linh Trung, quận Thủ Đức, TP. Hồ Chí Minh
          </p>
        </div>

        <div className="contact-body-facemail-information">
          <p className="font-bold">
            Facebook:{" "}
            <a className="font-light" href="https://www.facebook.com/uit.nc">
              facebook.com/uit.nc
            </a>
          </p>

          <p className="font-bold">
            Email: <a className="font-light">doanthanhnien@suctremmt.com</a>
          </p>
        </div>
      </div>
      <div className="contact-body-img">
        <Image
          src="/Img/Contact/anhdaihoi.png"
          alt="dai-hoi-doan-khoa"
          width={1126}
          height={659}
        />
      </div>
      <RegisterForm className="registerform"></RegisterForm>
    </div>
  );
}
