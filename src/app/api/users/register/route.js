import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendVerificationEmail } from "@/lib/emailService"; // Add this import

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    await dbConnect();

    const { name, email, password, role, adminCode } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Tên, email và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Email không hợp lệ" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email đã được sử dụng" },
        { status: 409 }
      );
    }

    // Validate admin role with admin code
    let userRole = "user";
    if (role === "admin") {
      // Verify admin code (store this securely in your .env)
      const validAdminCode = process.env.ADMIN_SECRET_CODE;

      if (adminCode !== validAdminCode) {
        return NextResponse.json(
          { success: false, message: "Mã xác thực Admin không hợp lệ" },
          { status: 403 }
        );
      }

      userRole = "admin";
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date();
    verificationCodeExpires.setMinutes(
      verificationCodeExpires.getMinutes() + 10
    ); // Code expires in 10 minutes

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
      isVerified: false,
      verificationCode,
      verificationCodeExpires,
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationCode);
    return NextResponse.json(
      {
        success: true,
        message:
          "Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.",
        userId: newUser._id,
        email: newUser.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi đăng ký người dùng" },
      { status: 500 }
    );
  }
}
