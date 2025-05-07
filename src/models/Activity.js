import mongoose from "mongoose";

// Tránh định nghĩa lại model nếu đã tồn tại
let Activity;

try {
  Activity = mongoose.model("Activity");
} catch {
  const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  });

  const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String }, // URL hình ảnh
    status: { type: String, enum: ['published', 'draft'], default: 'draft' },
    commentOption: { type: String, enum: ['open', 'closed'], default: 'open' },
    scheduledPublish: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [commentSchema],
  });

  Activity = mongoose.model("Activity", activitySchema);
}

export default Activity;