import mongoose from "mongoose";

const BookingFormContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "main_booking_form",
    },
    title: { type: String, default: "FORM ĐĂNG KÝ ĐẶT PHÒNG" },
    availabilityLink: {
      type: String,
      default: "https://student.uit.edu.vn/lichphong",
    },
    instructions: {
      type: [String],
      default: [
        "Vui lòng thực hiện kiểm tra thông tin phòng tại đây trước khi thực hiện đặt phòng.",
        "Thông tin đặt phòng sẽ được gửi về Văn phòng Đoàn trường vào 15:00 thứ Sáu hàng tuần.",
        "Các đơn vị khi đặt phòng cho tuần kế tiếp vui lòng điền đầy đủ thông tin như hướng dẫn bên dưới và gửi trước 15:00 thứ Sáu.",
        "Sử dụng mail sinh viên (MSSV@gm.uit.edu.vn) để đăng ký đặt phòng.",
      ],
    },
    importantNote: {
      type: String,
      default:
        "Mọi yêu cầu đặt phòng cho phòng cho tuần tiếp theo sẽ không được giải quyết nếu gửi về sau thời gian đã quy định hoặc không đúng yêu cầu.",
    },
    supportEmail: { type: String, default: "doankhoa@suctremmt.com" },
    privacyNotice: {
      type: String,
      default:
        "Mọi thông tin cá nhân chỉ được sử dụng cho công tác đặt phòng. Đoàn khoa cam kết sẽ không cung cấp thông tin cá nhân người đặt phòng cho các bên không liên quan!",
    },
    commitmentText: {
      type: String,
      default:
        "Tôi cam kết sử dụng phòng đúng mục đích và tuân thủ các quy định của nhà trường. Tôi sẽ chịu trách nhiệm nếu có bất kỳ hư hỏng hoặc vấn đề nào xảy ra trong thời gian sử dụng.",
    },
    units: {
      type: [String],
      default: [
        "Chi đoàn ATTT2021",
        "Chi đoàn ATCL2021",
        "Chi đoàn MMTT2021",
        "Chi đoàn MMCL2021",
        "Chi đoàn ATTN2021",
        "Chi đoàn ATTT2022.1",
        "Chi đoàn ATTT2022.2",
        "Chi đoàn MMTT2022.1",
        "Chi đoàn MMTT2022.2",
        "Chi đoàn MMTT2022.3",
        "Chi đoàn ATTN2022",
        "Chi đoàn ATTT2023.1",
        "Chi đoàn ATTT2023.2",
        "Chi đoàn MMTT2023.1",
        "Chi đoàn MMTT2023.2",
        "Chi đoàn MMTT2023.3",
        "Chi đoàn ATTN2023",
        "Chi đoàn ATTT2024.1",
        "Chi đoàn ATTT2024.2",
        "Chi đoàn ATTT2024.3",
        "Chi đoàn MMTT2024.1",
        "Chi đoàn MMTT2024.2",
        "Chi đoàn MMTT2024.3",
        "Chi đoàn ATTN2024",
        "Đoàn khoa MMT&TT",
      ],
    },
  },
  {
    timestamps: true,
    collection: "booking_form_contents",
  }
);

export default mongoose.models.BookingFormContent ||
  mongoose.model("BookingFormContent", BookingFormContentSchema);
