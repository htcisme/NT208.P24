import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập họ tên"],
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
      default: "/Img/default-avatar.png", // Đường dẫn mặc định đến ảnh đại diện
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
userSchema.pre("save", function (next) {
  // Nếu avatar là base64, kiểm tra format
  if (this.avatar && this.avatar.startsWith("data:image/")) {
    const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    if (!base64Regex.test(this.avatar)) {
      return next(new Error("Định dạng avatar base64 không hợp lệ"));
    }

    // Kiểm tra kích thước base64 (tối đa 5MB)
    const base64Data = this.avatar.split(",")[1];
    const padding = (base64Data.match(/=/g) || []).length;
    const bytes = (base64Data.length * 3) / 4 - padding;

    if (bytes > 5 * 1024 * 1024) {
      return next(new Error("Kích thước avatar không được vượt quá 5MB"));
    }
  }

  next();
});

export default User;
