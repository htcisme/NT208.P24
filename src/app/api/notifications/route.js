import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";

// GET - Lấy danh sách thông báo của người dùng
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Thiếu userId trong query parameters" },
        { status: 400 }
      );
    }

    // Log để debug
    console.log("Đang lấy thông báo cho userId:", userId);

    // Lấy thông báo của người dùng, mới nhất trước
    const notifications = await Notification.find({
      userId,
      type: "notification", // Chỉ lấy loại thông báo thông thường
    })
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo, mới nhất lên đầu
      .limit(20) // Giới hạn số lượng
      .lean();

    console.log(
      `Đã tìm thấy ${notifications.length} thông báo cho userId: ${userId}`
    );

    // Log các thông báo đầu tiên để debug
    if (notifications.length > 0) {
      console.log("Thông báo đầu tiên:", {
        id: notifications[0]._id,
        title: notifications[0].title,
        userId: notifications[0].userId,
      });
    }

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách thông báo" },
      { status: 500 }
    );
  }
}

// POST - Tạo thông báo mới
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Kiểm tra các trường bắt buộc
    const { userId, title, message } = body;

    if (!userId || !title || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "Thiếu thông tin bắt buộc (userId, title, message)",
        },
        { status: 400 }
      );
    }

    // Tạo thông báo mới
    const newNotification = new Notification({
      userId,
      title,
      message,
      type: body.type || "notification",
      read: false,
      link: body.link || "",
      activityId: body.activityId || null,
      token:
        body.token ||
        `manual_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newNotification.save();

    return NextResponse.json({
      success: true,
      message: "Tạo thông báo thành công",
      notification: newNotification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi tạo thông báo" },
      { status: 500 }
    );
  }
}
