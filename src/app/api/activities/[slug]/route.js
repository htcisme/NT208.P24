/* filepath: d:\PROJECT\NT208.P24\src\app\api\activities\[slug]\route.js */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { writeFile } from "fs/promises";
import path from "path";
import { ObjectId } from "mongodb";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";
import Category from "@/models/Category"; // Add this import

function generateUniqueToken(userId, title = "") {
  const payload = {
    userId,
    title,
    timestamp: Date.now(),
    random: Math.random().toString(36).substring(2, 15),
  };
  return jwt.sign(payload, process.env.JWT_SECRET || "default-secret", {
    expiresIn: "7d",
  });
}

// Helper function to find activity by ID or slug
async function findActivityByIdOrSlug(slug) {
  if (ObjectId.isValid(slug)) {
    return await Activity.findById(slug);
  }
  return await Activity.findOne({ slug });
}

// GET - Lấy chi tiết một hoạt động
export async function GET(request, context) {
  try {
    await dbConnect();
    // AWAIT params trước khi sử dụng
    const params = await context.params;
    const slug = params.slug;

    const activity = await findActivityByIdOrSlug(slug);

    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }
    // Get category label
    const category = await Category.findOne({ value: activity.type });
    const activityData = activity.toObject();

    activityData.typeLabel = category ? category.label : "Khác";

    return NextResponse.json({ success: true, data: activityData });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy thông tin hoạt động" },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật hoạt động
export async function PUT(request, context) {
  try {
    await dbConnect();
    const params = await context.params;
    const slug = params.slug;
    console.log("Updating activity with slug:", slug);

    // Tìm hoạt động
    const activity = await findActivityByIdOrSlug(slug);
    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    // Xử lý FormData
    const formData = await request.formData();
    const updateData = {};

    // Lấy các trường dữ liệu từ formData
    const title = formData.get("title");
    const content = formData.get("content");
    const author = formData.get("author");
    const status = formData.get("status");
    const commentOption = formData.get("commentOption");
    const type = formData.get("type");

    // Xử lý images từ JSON string
    const imagesJson = formData.get("images");
    let images = [];

    if (imagesJson) {
      try {
        const parsedImages = JSON.parse(imagesJson);
        if (Array.isArray(parsedImages)) {
          images = parsedImages.filter((url) => {
            try {
              const urlObj = new URL(url);
              return (
                urlObj.protocol === "http:" || urlObj.protocol === "https:"
              );
            } catch (e) {
              console.error("Invalid URL:", url);
              return false;
            }
          });
          console.log("Valid image URLs:", images);
        }
      } catch (e) {
        console.error("Error parsing images JSON:", e);
      }
    }

    // Cập nhật các trường cơ bản
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (author) updateData.author = author;
    if (status) updateData.status = status;
    if (commentOption) updateData.commentOption = commentOption;
    if (type) updateData.type = type;
    if (images.length > 0) updateData.images = images;

    // Cập nhật thời gian
    updateData.updatedAt = new Date();

    // Log các trường được cập nhật
    console.log("Updating fields:", Object.keys(updateData));
    console.log("Update data:", updateData);

    // Cập nhật activity
    Object.assign(activity, updateData);
    await activity.save();

    // Tạo thông báo
    await Notification.create({
      userId: activity.author,
      title: `Hoạt động đã được cập nhật: ${activity.title}`,
      message: `Hoạt động do bạn tạo đã được cập nhật thành công.`,
      read: false,
      link: `/Activities/${activity.slug}`,
      activityId: activity._id,
      type: "notification",
      token: Date.now().toString(),
    });

    return NextResponse.json({
      success: true,
      message: "Cập nhật hoạt động thành công",
      data: {
        ...activity.toObject(),
        images: activity.images || [], // Đảm bảo trả về mảng images
      },
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json(
      {
        success: false,
        message: `Lỗi khi cập nhật hoạt động: ${error.message}`,
      },
      { status: 500 }
    );
  }
}

// DELETE - Xóa hoạt động
export async function DELETE(request, context) {
  try {
    await dbConnect();
    // AWAIT params trước khi sử dụng
    const params = await context.params;
    const slug = params.slug;

    // Kiểm tra quyền admin (có thể thêm middleware riêng)
    // ...

    const activity = await findActivityByIdOrSlug(slug);
    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    await activity.deleteOne();
    await Notification.deleteMany({ activityId: activity._id });

    return NextResponse.json({
      success: true,
      message: "Xóa hoạt động thành công",
    });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa hoạt động" },
      { status: 500 }
    );
  }
}
