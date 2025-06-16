import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";

// GET - Lấy tất cả categories
export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách chuyên mục" },
      { status: 500 }
    );
  }
}

// POST - Thêm category mới
export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Force value to lowercase
    if (data.value) {
      data.value = data.value.toLowerCase();
    }

    // Validate format
    if (data.value && !/^[a-z0-9-]+$/.test(data.value)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Mã chuyên mục chỉ được chứa chữ thường, số và dấu gạch ngang",
        },
        { status: 400 }
      );
    }

    const category = await Category.create(data);

    return NextResponse.json({
      success: true,
      message: "Tạo chuyên mục thành công",
      data: category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Mã chuyên mục đã tồn tại",
        },
        { status: 400 }
      );
    }

    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: Object.values(error.errors)[0].message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi tạo chuyên mục",
      },
      { status: 500 }
    );
  }
}
