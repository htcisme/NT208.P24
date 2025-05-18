import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";

function removeVietnameseTones(str) {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit")) || 8;

    // Nếu không có từ khóa tìm kiếm, trả về mảng rỗng
    if (!q.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Chuẩn bị từ khóa tìm kiếm
    const searchTerm = q.trim();
    const searchTermNoSign = removeVietnameseTones(searchTerm);

    // Tạo RegExp pattern phù hợp hơn
    // Escape special regex characters to prevent regex injection
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    };

    const regexPattern = escapeRegExp(searchTermNoSign);

    // Tạo regex cho cả có dấu và không dấu - sử dụng word boundary để tìm từ hoàn chỉnh
    const regex = new RegExp(regexPattern, "i");

    // Tìm kiếm với điều kiện cải thiện
    const activities = await Activity.find({
      status: "published",
      $or: [
        { title: { $regex: new RegExp(escapeRegExp(searchTerm), "i") } },
        { content: { $regex: new RegExp(escapeRegExp(searchTerm), "i") } },
        { description: { $regex: new RegExp(escapeRegExp(searchTerm), "i") } },
        // Thêm tìm kiếm không dấu
        {
          $expr: {
            $regexMatch: {
              input: { $toLower: "$title" },
              regex: regex,
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toLower: "$content" },
              regex: regex,
            },
          },
        },
        {
          $expr: {
            $regexMatch: {
              input: { $toLower: "$description" },
              regex: regex,
            },
          },
        },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("title description content slug createdAt image") // Thêm slug vào select
      .lean();

    // Cải thiện logic lọc kết quả với độ chính xác cao hơn
    // Chuyển đổi tất cả nội dung về dạng không dấu để so sánh
    const filteredActivities = activities.filter((activity) => {
      const titleNoSign = removeVietnameseTones(activity.title || "");
      const contentNoSign = removeVietnameseTones(activity.content || "");
      const descriptionNoSign = removeVietnameseTones(activity.description || "");

      // Tìm chính xác hơn với từng từ trong cụm từ tìm kiếm
      const searchWords = searchTermNoSign
        .split(/\s+/)
        .filter((word) => word.length > 1);

      // Nếu không có từ hợp lệ nào trong tìm kiếm, trả về false
      if (searchWords.length === 0) {
        return false;
      }

      // Kiểm tra xem có ít nhất một từ khớp hay không
      return searchWords.some((word) => {
        return (
          titleNoSign.includes(word) ||
          contentNoSign.includes(word) ||
          descriptionNoSign.includes(word)
        );
      });
    });

    return NextResponse.json({
      success: true,
      data: filteredActivities,
    });
  } catch (error) {
    console.error("Error searching activities:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi tìm kiếm hoạt động" },
      { status: 500 }
    );
  }
}
