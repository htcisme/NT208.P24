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

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractHashtags(str) {
  if (!str) return [];
  const hashtagRegex = /#[a-zA-Z0-9_\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]+/g;
  return str.match(hashtagRegex) || [];
}

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit")) || 8;

    if (!q.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const searchTerm = q.trim();
    const searchTermNoSign = removeVietnameseTones(searchTerm);

    // Kiểm tra nếu là hashtag search
    const isHashtagSearch = searchTerm.startsWith("#");

    let query = {
      status: "published",
    };

    if (isHashtagSearch) {
      // Tìm kiếm hashtag trong content
      query.$or = [
        { content: { $regex: new RegExp(escapeRegExp(searchTerm), "i") } },
      ];
    } else {
      // Tìm kiếm thông thường
      const regexPattern = escapeRegExp(searchTermNoSign);
      const regex = new RegExp(regexPattern, "i");

      query.$or = [
        { title: { $regex: new RegExp(escapeRegExp(searchTerm), "i") } },
        { content: { $regex: new RegExp(escapeRegExp(searchTerm), "i") } },
        { description: { $regex: new RegExp(escapeRegExp(searchTerm), "i") } },
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
      ];
    }

    const activities = await Activity.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("title description content slug createdAt images")
      .lean();

    // Xử lý kết quả
    const processedActivities = activities.map((activity) => {
      // Trích xuất hashtags từ content
      const hashtags = extractHashtags(activity.content);

      return {
        ...activity,
        hashtags,
        // Highlight đoạn text chứa từ khóa tìm kiếm
        highlightedContent:
          isHashtagSearch && activity.content
            ? activity.content.replace(
                new RegExp(`(${escapeRegExp(searchTerm)})`, "gi"),
                "<mark>$1</mark>"
              )
            : activity.content,
      };
    });

    // Lọc và sắp xếp kết quả
    const filteredActivities = processedActivities
      .filter((activity) => {
        if (isHashtagSearch) {
          return activity.hashtags.some(
            (tag) =>
              removeVietnameseTones(tag.toLowerCase()) ===
              removeVietnameseTones(searchTerm.toLowerCase())
          );
        }

        const titleNoSign = removeVietnameseTones(activity.title || "");
        const contentNoSign = removeVietnameseTones(activity.content || "");
        const descriptionNoSign = removeVietnameseTones(
          activity.description || ""
        );
        const searchWords = searchTermNoSign
          .split(/\s+/)
          .filter((word) => word.length > 1);

        return (
          searchWords.length > 0 &&
          searchWords.some(
            (word) =>
              titleNoSign.includes(word) ||
              contentNoSign.includes(word) ||
              descriptionNoSign.includes(word)
          )
        );
      })
      .sort((a, b) => {
        // Ưu tiên kết quả có hashtag khớp chính xác
        if (isHashtagSearch) {
          const aExactMatch = a.hashtags.includes(searchTerm);
          const bExactMatch = b.hashtags.includes(searchTerm);
          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;
        }
        return 0;
      });

    return NextResponse.json({
      success: true,
      data: filteredActivities,
      isHashtagSearch,
    });
  } catch (error) {
    console.error("Error searching activities:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi tìm kiếm hoạt động" },
      { status: 500 }
    );
  }
}
