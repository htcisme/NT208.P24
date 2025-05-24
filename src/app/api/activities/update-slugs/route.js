import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import slugify from "slugify";

export async function POST(request) {
  try {
    await dbConnect();

    // Lấy tất cả hoạt động
    const activities = await Activity.find({});
    const results = [];
    console.log(`Tổng số hoạt động: ${activities.length}`);

    for (const activity of activities) {
      try {
        console.log("Raw title:", activity.title);

        // Tạo slug từ tiêu đề
        const baseSlug = slugify(activity.title, {
          lower: true,
          strict: true,
          locale: "vi",
          remove: /[*+~.()'"!:@]/g,
          replacement: "-",
          custom: {
            "𝐍𝐄𝐓": "net",
            "𝐂𝐇𝐀𝐋𝐋𝐄𝐍𝐆𝐄": "challenge",
            "𝟐𝟎𝟐𝟒": "2024",
            "𝐂𝐎𝐌𝐌𝐔𝐍𝐈𝐓𝐘": "community",
            "𝐓𝐎𝐔𝐑": "tour",
            "𝐍𝐄𝐓𝐒𝐄𝐂": "netsec",
            "|": "-",
            "&": "va",
            "💐": "",
            "[": "",
            "]": "",
            "/": "-",
            "\\": "-",
          },
        });

        // Kiểm tra xem slug đã tồn tại chưa
        let slug = baseSlug;
        let counter = 1;
        let isUnique = false;

        // Nếu slug hiện tại của activity đã đúng, bỏ qua
        if (activity.slug === baseSlug || activity.slug?.startsWith(baseSlug)) {
          const existingActivity = await Activity.findOne({
            slug: activity.slug,
            _id: { $ne: activity._id },
          });

          if (!existingActivity) {
            results.push({
              id: activity._id,
              title: activity.title,
              slug: activity.slug,
              skipped: true,
            });
            console.log(
              `Đã bỏ qua "${activity.title}" - slug đã hợp lệ: ${activity.slug}`
            );

            continue; // Bỏ qua nếu slug đang dùng là hợp lệ và không trùng
          }
        }

        while (!isUnique) {
          const existingActivity = await Activity.findOne({
            slug: slug,
            _id: { $ne: activity._id }, // Loại trừ activity hiện tại
          });

          if (!existingActivity) {
            isUnique = true;
          } else {
            slug = `${baseSlug}-${counter}`;
            counter++;
          }
        }

        console.log("Generated slug:", slug);

        // Cập nhật slug cho activity
        activity.slug = slug;
        await activity.save();

        results.push({
          id: activity._id,
          title: activity.title,
          slug: slug,
          success: true,
        });
      } catch (error) {
        console.error(
          `Lỗi khi cập nhật slug cho bài viết ${activity._id}:`,
          error
        );
        results.push({
          id: activity._id,
          title: activity.title,
          error: error.message,
          success: false,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Đã cập nhật slug cho tất cả hoạt động",
      results,
    });
  } catch (error) {
    console.error("Error updating slugs:", error);

    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật slug" },
      { status: 500 }
    );
  }
}
