import mongoose from "mongoose";

// Tránh định nghĩa lại model nếu đã tồn tại
let Award;

try {
  Award = mongoose.model("Award");
} catch {
  const awardSchema = new mongoose.Schema({
    organization: { type: String, required: true },
    content: { type: String, required: true },
    year: { type: String, required: true },
    slug: { type: String },
    date: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  // Middleware để tự động tạo slug
  awardSchema.pre('save', function(next) {
    if (this.isModified('content') || !this.slug) {
      this.slug = this.content
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
        .toLowerCase()
        .trim()
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-');
    }
    next();
  });

  Award = mongoose.model("Award", awardSchema);
}

export default Award;