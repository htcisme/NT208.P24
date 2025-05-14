import nodemailer from "nodemailer";

// Configure transporter (update these settings with your actual email provider)
const transporter = nodemailer.createTransport({
  service: "gmail", // Or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email, verificationCode) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác minh tài khoản - SUCTREMMT",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #042354;">Xác minh tài khoản</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại SUCTREMMT.</p>
          <p>Mã xác minh của bạn là: <strong style="font-size: 20px; color: #042354;">${verificationCode}</strong></p>
          <p>Mã này sẽ hết hạn sau 10 phút.</p>
          <p>Vui lòng nhập mã này vào trang xác minh để hoàn tất quá trình đăng ký.</p>
          <p>Trân trọng,<br>Ban quản trị SUCTREMMT</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
}
