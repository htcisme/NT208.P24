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
    const formData = await request.formData();

    // Log để debug
    console.log("=== DEBUG PUT Request ===");
    console.log("Slug:", slug);
    console.log("FormData:", Object.fromEntries(formData));

    // Lấy dữ liệu từ formData
    const title = formData.get("title");
    const content = formData.get("content");
    const status = formData.get("status");
    const commentOption = formData.get("commentOption");
    const type = formData.get("type");

    // Validate dữ liệu bắt buộc
    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin bắt buộc" },
        { status: 400 }
      );
    }

    // Xử lý images
    const imagesJson = formData.get("images");
    let processedImages = [];

    if (imagesJson) {
      try {
        const parsedImages = JSON.parse(imagesJson);
        processedImages = parsedImages.map((img) => ({
          data: img.data,
          contentType: img.contentType,
          filename: img.filename || "image",
          size: img.size || 0,
        }));
      } catch (error) {
        console.error("Error processing images:", error);
      }
    }

    // Tạo object chứa dữ liệu cập nhật
    const updateData = {
      title,
      content,
      status,
      commentOption,
      type,
      images: processedImages,
      updatedAt: new Date(),
    };

    // Tìm và cập nhật activity
    const activity = await Activity.findOneAndUpdate(
      { slug },
      { $set: updateData },
      { new: true }
    );

    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật hoạt động thành công",
      data: activity,
    });
  } catch (error) {
    console.error("Error updating activity:", error);
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
