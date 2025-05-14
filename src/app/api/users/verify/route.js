import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();

    const { email, code } = await request.json();

    // Validate input
    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email và mã xác thực là bắt buộc" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy tài khoản" },
        { status: 404 }
      );
    }

    // Check if user is already verified
    if (user.isVerified) {
      return NextResponse.json({
        success: true,
        message: "Tài khoản đã được xác minh trước đó",
      });
    }

    // Check verification code
    if (
      user.verificationCode !== code ||
      new Date() > user.verificationCodeExpires
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Mã xác thực không hợp lệ hoặc đã hết hạn",
          expired: new Date() > user.verificationCodeExpires,
        },
        { status: 400 }
      );
    }

    // Verify the user
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Xác minh tài khoản thành công",
    });
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xác minh tài khoản" },
      { status: 500 }
    );
  }
}
