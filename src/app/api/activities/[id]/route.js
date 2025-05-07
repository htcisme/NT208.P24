import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { writeFile } from "fs/promises";
import path from "path";

// GET - Lấy chi tiết một hoạt động
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const id = params.id;

    const activity = await Activity.findById(id).lean();

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
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const id = params.id;
    
    // Xử lý FormData thay vì JSON
    const formData = await request.formData();
    const updateData = {};
    
    // Lấy các trường dữ liệu từ formData
    formData.forEach((value, key) => {
      if (key !== 'image') {
        updateData[key] = value;
      }
    });
    
    // Xử lý hình ảnh nếu được gửi lên
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Tạo tên file duy nhất
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`;
      
      // Đảm bảo thư mục uploads tồn tại
      const uploadsDir = path.join(process.cwd(), 'public/uploads');
      
      // Lưu file vào thư mục public/uploads
      const imagePath = path.join(uploadsDir, filename);
      await writeFile(imagePath, buffer);
      
      // Cập nhật đường dẫn hình ảnh
      updateData.image = `/uploads/${filename}`;
    }
    
    // Cập nhật thời gian
    updateData.updatedAt = new Date();

    // Cập nhật hoạt động
    const updatedActivity = await Activity.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Trả về document đã cập nhật
    );

    if (!updatedActivity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật hoạt động thành công",
      data: updatedActivity,
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
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const id = params.id;

    // Kiểm tra quyền admin (có thể thêm middleware riêng)
    // ...

    const deletedActivity = await Activity.findByIdAndDelete(id);

    if (!deletedActivity) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy hoạt động" },
        { status: 404 }
      );
    }

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