import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Activity from "@/models/Activity";

// GET - Lấy thông tin một category
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const category = await Category.findOne({ value: params.value });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy chuyên mục" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy thông tin chuyên mục" },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật category
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { value } = params;
    const updateData = await request.json();

    // Validate dữ liệu đầu vào
    if (!updateData.label) {
      return NextResponse.json(
        { success: false, message: "Tên hiển thị là bắt buộc" },
        { status: 400 }
      );
    }

    // Tìm và cập nhật category
    const updatedCategory = await Category.findOneAndUpdate(
      { value: value },
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy chuyên mục" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật thành công",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error.code === 11000
            ? "Mã chuyên mục đã tồn tại"
            : "Lỗi khi cập nhật chuyên mục",
      },
      { status: 500 }
    );
  }
}

// DELETE - Xóa category
export async function DELETE(request, { params }) {
  console.log("DELETE request received");
  try {
    await dbConnect();
    const { value } = params;

    console.log("Attempting to delete category with value:", value);

    // Check if value is provided
    if (!value) {
      return NextResponse.json(
        { success: false, message: "Missing category value" },
        { status: 400 }
      );
    }

    // Check category exists
    const category = await Category.findOne({ value });
    console.log("Found category:", category ? "yes" : "no");

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy chuyên mục" },
        { status: 404 }
      );
    }

    // Check for activities using this category
    const hasActivities = await Activity.exists({ type: value });

    if (hasActivities) {
      return NextResponse.json(
        {
          success: false,
          message: "Không thể xóa chuyên mục đang được sử dụng",
        },
        { status: 400 }
      );
    }

    // Delete the category
    const deleteResult = await Category.deleteOne({ value });

    return NextResponse.json({
      success: true,
      message: "Xóa chuyên mục thành công",
    });
  } catch (error) {
    console.error("Delete error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa chuyên mục" },
      { status: 500 }
    );
  }
}
