import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/emailService";

// Function to generate a 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    await dbConnect();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email là bắt buộc" },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy tài khoản với email này" },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json({
        success: true,
        message: "Tài khoản đã được xác minh",
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 10
    );

    // Update user with new verification code
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json({
      success: true,
      message: "Mã xác thực mới đã được gửi",
    });
  } catch (error) {
    console.error("Error resending verification code:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi gửi lại mã xác thực" },
      { status: 500 }
    );
  }
}
