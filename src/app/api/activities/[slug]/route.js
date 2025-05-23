import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { writeFile } from "fs/promises";
import path from "path";
import { ObjectId } from "mongodb";
import Notification from "@/models/Notification";
import jwt from "jsonwebtoken";

function generateUniqueToken(userId, title = "") {
  try {
    if (!userId) {
      console.error("UserId is required for token generation");
      return Date.now().toString();
    }

    const payload = {
      uid: userId.toString(),
      title,
      ts: Date.now(),
    };

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return Date.now().toString();
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.error("Error generating token:", error);
    return Date.now().toString();
  }
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
    const slug = await context.params.slug;

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
    const slug = await context.params.slug;

    // Xử lý FormData thay vì JSON
    const formData = await request.formData();
    const updateData = {};

    // Lấy các trường dữ liệu từ formData
    formData.forEach((value, key) => {
      if (key !== "image") {
        updateData[key] = value;
      }
    });

    // Xử lý hình ảnh nếu được gửi lên
    const imageFile = formData.get("image");
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Tạo tên file duy nhất
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, "_")}`;

      // Đảm bảo thư mục uploads tồn tại
      const uploadsDir = path.join(process.cwd(), "public/uploads");

      // Lưu file vào thư mục public/uploads
      const imagePath = path.join(uploadsDir, filename);
      await writeFile(imagePath, buffer);

      // Cập nhật đường dẫn hình ảnh
      updateData.image = `/uploads/${filename}`;
    }

    // Cập nhật thời gian
    updateData.updatedAt = new Date();

    // Kiểm tra và cập nhật type
    if (!updateData.type) {
      updateData.type = "news";
    }

    // Tìm và cập nhật hoạt động
    const activity = await findActivityByIdOrSlug(slug);
    if (!activity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    // Cập nhật các trường
    Object.assign(activity, updateData);
    await activity.save();

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
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật hoạt động" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa hoạt động
export async function DELETE(request, context) {
  try {
    await dbConnect();
    const slug = await context.params.slug;

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
