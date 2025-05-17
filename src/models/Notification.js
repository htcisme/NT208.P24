import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true, // Bắt buộc có giá trị để tránh null
    },
    type: {
      type: String,
      enum: ["notification", "subscription"],
      default: "notification",
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: "",
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "notifications", // Chỉ định rõ tên collection là "notifications"
  }
);

// Thêm chỉ mục kép để đảm bảo mỗi người dùng chỉ nhận một thông báo với token duy nhất
NotificationSchema.index({ userId: 1, token: 1 }, { unique: true });

// Thêm chỉ mục cho activityId để tìm kiếm thông báo theo hoạt động nhanh hơn
NotificationSchema.index({ activityId: 1 });

// Thêm chỉ mục cho read để tìm kiếm thông báo chưa đọc nhanh hơn
NotificationSchema.index({ read: 1 });

// Thêm chỉ mục cho type để tìm kiếm theo loại thông báo
NotificationSchema.index({ type: 1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", NotificationSchema);

export default Notification;
