import mongoose from "mongoose";

const NotificationSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    topics: {
      type: [String],
      default: ["newPosts"],
    },
    platform: {
      type: String,
      enum: ["web", "gmail"],
      default: "web",
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
  }
);

const NotificationSubscription =
  mongoose.models.NotificationSubscription ||
  mongoose.model("NotificationSubscription", NotificationSubscriptionSchema);

export default NotificationSubscription;
