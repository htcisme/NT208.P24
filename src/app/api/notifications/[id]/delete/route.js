import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";

// DELETE - Xóa một thông báo cụ thể của người dùng
export async function DELETE(request, { params }) {
  try {
    await dbConnect();

    // Cách đúng để truy cập params trong Next.js App Router
    const { id } = params;

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Thiếu userId trong body" },
        { status: 400 }
      );
    }

    // Tìm và xóa thông báo
    const result = await Notification.findOneAndDelete({
      _id: id,
      userId: userId,
    });

    // Nếu không tìm thấy thông báo
    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy thông báo hoặc không có quyền xóa",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã xóa thông báo thành công",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa thông báo" },
      { status: 500 }
    );
  }
}
