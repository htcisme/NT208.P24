import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.Mixed, // Thay đổi từ ObjectId thành Mixed để hỗ trợ cả chuỗi "bot" và ObjectId
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    default: "admin",
  },
  content: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isBot: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
