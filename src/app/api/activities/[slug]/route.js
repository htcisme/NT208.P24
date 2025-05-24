import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { writeFile } from "fs/promises";
import path from "path";
import { ObjectId } from "mongodb";
import Notification from "@/models/Notification";

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
    const slug = context.params.slug;

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
    const slug = context.params.slug;
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
    formData.forEach((value, key) => {
      if (key !== "image") {
        updateData[key] = value;
      }
    });

    // Xử lý hình ảnh nếu được gửi lên
    const imageFile = formData.get("image");
    if (imageFile && imageFile.size > 0) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Tạo tên file duy nhất, giảm độ dài
        const fileExt = path.extname(imageFile.name);
        const baseName = path
          .basename(imageFile.name, fileExt)
          .replace(/\s/g, "_")
          .substring(0, 30);
        const filename = `${Date.now()}-${baseName}${fileExt}`;

        // Đảm bảo thư mục uploads tồn tại
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
    }

    // Cập nhật thời gian
    updateData.updatedAt = new Date();

    // Cập nhật các trường
    console.log("Updating fields:", Object.keys(updateData));
    Object.assign(activity, updateData);

    // Lưu vào database
    await activity.save();
    console.log("Activity saved successfully");

    // Tạo thông báo riêng biệt, không ảnh hưởng đến kết quả trả về
    try {
      const token = generateUniqueToken(activity.author, activity.title);

      await Notification.create({
        userId: activity.author,
        title: `Hoạt động đã được cập nhật: ${activity.title}`,
        message: `Hoạt động do bạn tạo đã được cập nhật thành công.`,
        read: false,
        link: `/Activities/${activity.slug}`,
        activityId: activity._id,
        type: "notification",
        token,
      });
      console.log("Notification created successfully");
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Không throw lỗi ở đây, vẫn trả về thành công
    }

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
    const slug = context.params.slug;

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
