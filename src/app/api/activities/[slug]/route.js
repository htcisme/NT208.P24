/* filepath: d:\PROJECT\NT208.P24\src\app\api\activities\[slug]\route.js */
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { writeFile } from "fs/promises";
import path from "path";
import { ObjectId } from "mongodb";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";

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

    return NextResponse.json({ success: true, data: activity });
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
    // AWAIT params trước khi sử dụng
    const params = await context.params;
    const slug = params.slug;
    console.log("Updating activity with slug:", slug);

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug không được cung cấp" },
        { status: 400 }
      );
    }

    // Tìm hoạt động trước tiên để đảm bảo tồn tại
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
    const imageFile = formData.get("image");
    const imageUrl = formData.get("imageUrl");

    // Cập nhật các trường cơ bản
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (author) updateData.author = author;
    if (status) updateData.status = status;
    if (commentOption) updateData.commentOption = commentOption;
    if (type) updateData.type = type;

    // Xử lý hình ảnh
    if (imageFile && imageFile.size > 0) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Tạo tên file unique
        const timestamp = Date.now();
        const originalName = imageFile.name;
        const extension = originalName.split(".").pop();
        const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;

        // Tạo đường dẫn lưu file
        const uploadsDir = path.join(process.cwd(), "public/uploads");

        // Kiểm tra và tạo thư mục nếu không tồn tại
        if (!fs.existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true });
        }

        // Lưu file
        const imagePath = path.join(uploadsDir, filename);
        await writeFile(imagePath, buffer);

        // Cập nhật đường dẫn hình ảnh
        updateData.image = `/uploads/${filename}`;
        console.log("Image saved successfully at:", updateData.image);
      } catch (imageError) {
        console.error("Error processing image:", imageError);
        // Không throw lỗi ở đây, tiếp tục cập nhật các thông tin khác
      }
    } else if (imageUrl) {
      updateData.image = imageUrl;
    }

    // Cập nhật thời gian
    updateData.updatedAt = new Date();

    // Kiểm tra và cập nhật type
    if (!updateData.type) {
      updateData.type = "news";
    }

    // Tìm và cập nhật hoạt động
    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    // Cập nhật các trường
    console.log("Updating fields:", Object.keys(updateData));
    Object.assign(activity, updateData);

    await activity.save();

    // Tạo thông báo cho tác giả
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
      data: activity,
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