import mongoose from "mongoose";
import { type } from "os";
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
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  });

  const activitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String },
    type: {
      type: String,
      enum: [
        "academic",
        "competition",
        "seminar",
        "research",
        "course",
        "volunteer",
        "event",
        "conference",
        "vnutour",
        "netsec",
        "internship",
        "scholarship",
        "startup",
        "jobfair",
        "career",
        "other",
      ],
      required: true,
    },
    status: { type: String, enum: ["published", "draft"], default: "draft" },
    commentOption: { type: String, enum: ["open", "closed"], default: "open" },
    scheduledPublish: { type: Date },
    slug: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    comments: [commentSchema],
  });

  // Middleware để tự động tạo slug từ title
  activitySchema.pre("save", async function (next) {
    if (this.isModified("title") || !this.slug) {
      this.slug = slugify(this.title, {
        lower: true,
        strict: true,
        locale: "vi",
        remove: /[*+~.()'"!:@]/g,
        replacement: "-",
        custom: {
          "𝐍𝐄𝐓": "Net",
          "𝐂𝐇𝐀𝐋𝐋𝐄𝐍𝐆𝐄": "Challenge",
          "𝟐𝟎𝟐𝟒": "2024",
          "𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘": "Community",
          "𝐓𝐎𝐔𝐑": "Tour",
          "𝐍𝐄𝐓𝐒𝐄𝐂": "Netsec",
          or: "|",
          and: "&",
        },
      });
    }
    next();
  });

  Activity = mongoose.model("Activity", activitySchema);
}

// Helper function để lấy danh sách các type có sẵn
export const getActivityTypes = () => {
  return [
    // Academic
    { value: "academic", label: "Học tập", icon: "📚" },
    { value: "competition", label: "Cuộc thi", icon: "🏆" },
    { value: "seminar", label: "Seminar", icon: "🎤" },
    { value: "research", label: "Nghiên cứu", icon: "🔬" },
    { value: "course", label: "Khóa học", icon: "🎓" },

    // Event
    { value: "volunteer", label: "Tình nguyện", icon: "🤝" },
    { value: "event", label: "Sự kiện", icon: "🎉" },
    { value: "conference", label: "Hội nghị", icon: "🏛️" },
    { value: "vnutour", label: "VNUTour", icon: "🗺️" },
    { value: "netsec", label: "Netsec", icon: "🔐" },

    // Work
    { value: "internship", label: "Thực tập", icon: "💼" },
    { value: "scholarship", label: "Học bổng", icon: "🎓" },
    { value: "startup", label: "Khởi nghiệp", icon: "🚀" },
    { value: "jobfair", label: "Ngày hội việc làm", icon: "🏢" },
    { value: "career", label: "Hướng nghiệp", icon: "👔" },

    // Other
    { value: "other", label: "Khác", icon: "📋" },
  ];
};

// Helper function để lấy thông tin type theo value
export const getActivityTypeInfo = (typeValue) => {
  const types = getActivityTypes();
  return (
    types.find((type) => type.value === typeValue) || types[types.length - 1]
  );
};

export default Activity;
