import mongoose from "mongoose";
import slugify from "slugify";

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
    slug: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [commentSchema],
  });

  // Middleware để tự động tạo slug từ title
  activitySchema.pre('save', async function(next) {
    if (this.isModified('title') || !this.slug) {
      this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
  });

  Activity = mongoose.model("Activity", activitySchema);
}

export default Activity;