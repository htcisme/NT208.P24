import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  value: {
    type: String,
    required: [true, "Vui lòng nhập mã chuyên mục"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        // Only allow lowercase letters, numbers and hyphens
        return /^[a-z0-9-]+$/.test(v);
      },
      message: "Mã chuyên mục chỉ được chứa chữ thường, số và dấu gạch ngang",
    },
  },
  label: {
    type: String,
    required: [true, "Tên hiển thị là bắt buộc"],
    trim: true,
  },
  description: {
    type: String,
    default: "",
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

// Middleware để tự động cập nhật updatedAt
categorySchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);
export default Category;
