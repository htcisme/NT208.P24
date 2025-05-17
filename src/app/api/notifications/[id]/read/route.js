import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";

// POST - Đánh dấu thông báo là đã đọc
export async function POST(request, { params }) {
  try {
    await dbConnect();

    // Cách đúng để truy cập params trong Next.js App Router
    // Đảm bảo params là một giá trị đã được phân giải (resolved)
    const { id } = params;

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Thiếu userId trong body" },
        { status: 400 }
      );
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true, updatedAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy thông báo" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã đánh dấu thông báo là đã đọc",
      notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật thông báo" },
      { status: 500 }
    );
  }
}
