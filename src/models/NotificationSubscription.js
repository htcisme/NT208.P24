import mongoose from "mongoose";

const notificationSubscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Vui lòng nhập email hợp lệ",
      ],
    },
    platform: {
      type: String,
      enum: ["gmail", "outlook", "yahoo"],
      default: "gmail",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    topics: {
      type: [String],
      enum: ["newPosts", "updates", "events"],
      default: ["newPosts"],
    },
    lastNotified: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Tạo index cho email để tìm kiếm nhanh hơn
notificationSubscriptionSchema.index({ email: 1 });

const NotificationSubscription =
  mongoose.models.NotificationSubscription ||
  mongoose.model("NotificationSubscription", notificationSubscriptionSchema);

export default NotificationSubscription;
