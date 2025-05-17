import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import slugify from "slugify";

export async function POST(request) {
  try {
    await dbConnect();

    // Lấy tất cả các bài viết chưa có slug
    const activities = await Activity.find({ slug: { $exists: false } });

    if (activities.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Không có bài viết nào cần cập nhật slug",
        updated: 0
      });
    }

    // Cập nhật slug cho từng bài viết
    let updatedCount = 0;
    for (const activity of activities) {
      try {
        // Tạo slug từ tiêu đề
        const baseSlug = slugify(activity.title, { lower: true, strict: true });
        
        // Kiểm tra xem slug đã tồn tại chưa
        let slug = baseSlug;
        let counter = 1;
        
        while (await Activity.findOne({ slug, _id: { $ne: activity._id } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        // Cập nhật slug cho bài viết
        activity.slug = slug;
        await activity.save();
        updatedCount++;

      } catch (err) {
        console.error(`Lỗi khi cập nhật slug cho bài viết ${activity._id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật slug cho ${updatedCount} bài viết`,
      updated: updatedCount
    });

  } catch (error) {
    console.error("Error updating slugs:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật slug" },
      { status: 500 }
    );
  }
} 