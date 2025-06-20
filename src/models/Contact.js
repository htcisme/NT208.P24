import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    // Sử dụng một key cố định để luôn tìm thấy document này
    key: {
      type: String,
      required: true,
      unique: true,
      default: "main_contact",
    },
    address: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    facebookUrl: {
      type: String,
      trim: true,
    },
    mapUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    // Đặt tên collection trong DB là 'contact_info'
    collection: "contact_info",
  }
);

// Mongoose sẽ không biên dịch lại model nếu nó đã tồn tại
export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);
